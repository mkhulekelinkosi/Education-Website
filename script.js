const toggleButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.getElementById('year');
const learningQuiz = document.getElementById('learningQuiz');
const quizResult = document.getElementById('quizResult');

let currentLearningStyle = 'visual'; // Default
let currentSubject = '';
let conversationHistory = [];

// Replace with your Google Gemini API Key
const GEMINI_API_KEY = "AQ.Ab8RN6KvNfe_2huxJKt7Ss7mM49k3U7iQX-3M0Frj4LQRQ_8ng";
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

if (year) {
  year.textContent = new Date().getFullYear();
}

if (toggleButton && navLinks) {
  toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('is-open'));
  });
}

// Learning Style Quiz
if (learningQuiz) {
  learningQuiz.addEventListener('submit', (e) => {
    e.preventDefault();

    const answers = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
    };

    for (let i = 1; i <= 5; i++) {
      const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
      if (selectedOption) {
        answers[selectedOption.value]++;
      }
    }

    let dominantStyle = Object.keys(answers).reduce((a, b) =>
      answers[a] > answers[b] ? a : b
    );

    currentLearningStyle = dominantStyle;

    const styleDescriptions = {
      visual: "You're a Visual Learner! You learn best through seeing diagrams, charts, videos, and visual representations. Focus on color-coded notes, infographics, and visual problem-solving techniques.",
      auditory: "You're an Auditory Learner! You learn best through listening and discussions. Benefit from lectures, group discussions, audiobooks, and verbal explanations. Try reading notes out loud!",
      kinesthetic: "You're a Kinesthetic Learner! You learn best through hands-on activities and movement. Engage with experiments, simulations, practice problems, and interactive learning experiences.",
    };

    document.getElementById('resultStyle').textContent = dominantStyle.charAt(0).toUpperCase() + dominantStyle.slice(1);
    document.getElementById('resultDescription').textContent = styleDescriptions[dominantStyle];
    quizResult.classList.remove('hidden');

    learningQuiz.style.display = 'none';

    setTimeout(() => {
      quizResult.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  });
}

// Subject Buttons - Open AI Modal
document.querySelectorAll('[data-subject]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const subject = btn.getAttribute('data-subject');
    openAIModal(subject);
  });
});

// Open AI Modal
function openAIModal(subject) {
  currentSubject = subject;
  conversationHistory = [];

  const modal = document.getElementById('aiModal');
  const modalTitle = document.getElementById('modalTitle');
  const chatBox = document.getElementById('chatBox');
  const recommendationsBox = document.getElementById('recommendationsBox');

  modalTitle.textContent = `Learn ${subject}`;
  chatBox.innerHTML = '';
  recommendationsBox.innerHTML = '';
  modal.classList.remove('hidden');

  // Initial greeting message
  const greeting = `Hello! 👋 I'm your AI learning guide for ${subject}. I can see you're a ${currentLearningStyle} learner. How can I help you master ${subject} today? Would you like:\n\n1. Study tips for your learning style\n2. Concept explanations\n3. Practice strategies\n4. Video recommendations`;

  addMessage(greeting, 'ai');
}

// Close Modal
document.querySelector('.modal-close').addEventListener('click', () => {
  document.getElementById('aiModal').classList.add('hidden');
});

window.addEventListener('click', (e) => {
  const modal = document.getElementById('aiModal');
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

// Send Chat Message
document.getElementById('chatSend').addEventListener('click', sendMessage);
document.getElementById('chatInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, 'user');
  input.value = '';

  // Show loading
  const chatBox = document.getElementById('chatBox');
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading';
  loadingDiv.innerHTML =
    '<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>';
  chatBox.appendChild(loadingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // Prepare conversation context
    conversationHistory.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const systemPrompt = `You are an expert AI tutor for ${currentSubject}. The student is a ${currentLearningStyle} learner.

Based on their learning style:
- Visual learners: Use diagrams, infographics, color-coding, mind maps
- Auditory learners: Use explanations, discussions, analogies, step-by-step verbal breakdowns
- Kinesthetic learners: Use hands-on examples, real-world applications, practice problems

Provide personalized recommendations that match their learning style. Be encouraging and clear. After providing helpful information, suggest practical tips and resources.`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }],
          },
          ...conversationHistory,
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
      params: {
        key: GEMINI_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiMessage = data.contents
      ? data.contents[0].parts[0].text
      : data.candidates[0].content.parts[0].text;

    conversationHistory.push({
      role: 'model',
      parts: [{ text: aiMessage }],
    });

    // Remove loading
    loadingDiv.remove();

    // Add AI response
    addMessage(aiMessage, 'ai');

    // Show recommendations section if not visible
    if (conversationHistory.length >= 4) {
      showRecommendations();
    }
  } catch (error) {
    loadingDiv.remove();
    addMessage(`Sorry, I encountered an error: ${error.message}. Please check your API key and try again.`, 'ai');
    console.error('API Error:', error);
  }
}

function addMessage(text, sender) {
  const chatBox = document.getElementById('chatBox');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;

  messageDiv.appendChild(bubble);
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showRecommendations() {
  const recommendationsSection = document.getElementById('recommendationsSection');
  const recommendationsBox = document.getElementById('recommendationsBox');

  const recommendations = [
    {
      title: '🎯 Study Strategy',
      description: `As a ${currentLearningStyle} learner, focus on ${getStrategyForStyle(currentLearningStyle)}`,
    },
    {
      title: '📚 Recommended Resources',
      description: `Check Khan Academy, YouTube lectures, and interactive practice problems for ${currentSubject}`,
    },
    {
      title: '⏱️ Daily Practice',
      description: 'Dedicate 30 minutes daily to practice problems. Review mistakes weekly.',
    },
    {
      title: '🎓 Next Steps',
      description: 'Once you master basics, move to advanced topics. Track your progress!',
    },
  ];

  recommendationsBox.innerHTML = '';
  recommendations.forEach((rec) => {
    const item = document.createElement('div');
    item.className = 'recommendation-item';
    item.innerHTML = `<h4>${rec.title}</h4><p>${rec.description}</p>`;
    recommendationsBox.appendChild(item);
  });

  recommendationsSection.classList.remove('hidden');
}

function getStrategyForStyle(style) {
  const strategies = {
    visual: 'visual aids, mind maps, color-coded notes, and infographics',
    auditory: 'listening to lectures, group discussions, and verbal explanations',
    kinesthetic: 'hands-on examples, real-world applications, and interactive practice',
  };
  return strategies[style] || strategies.visual;
}
