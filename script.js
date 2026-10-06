const toggleButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.getElementById('year');
const learningQuiz = document.getElementById('learningQuiz');
const quizResult = document.getElementById('quizResult');

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
