# LearnigGuide - Personalized Learning Platform with AI

A modern website that helps students discover their learning style and master Mathematics, Physical Sciences, and English with personalized guidance powered by Google Gemini AI.

## Overview

LearnigGuide allows students to:
1. **Take a Learning Style Assessment** - Identify whether they're Visual, Auditory, or Kinesthetic learners
2. **Get AI-Powered Personalized Recommendations** - Chat with an AI tutor tailored to their learning style
3. **Explore Subject Guides** - Access tailored study approaches for Math, Sciences, and English
4. **Practice with Questions** - Test knowledge with subject-specific practice questions

## Features

### 🤖 AI Chatbot Integration
- **Google Gemini API** - Powered by advanced AI for intelligent tutoring
- **Learning Style Awareness** - AI adapts recommendations based on your learning style
- **Real-time Chat** - Ask questions and get instant personalized responses
- **Structured Recommendations** - Video suggestions, study strategies, and resources

### 🎨 Design
- **Color Scheme**: Dark blue (#0a1428) with gold (#d4af37) accents
- **Style**: Clean, modern, responsive layout
- **Interactive Elements**: Learning style quiz + AI chatbot modal

## Setup Instructions

### 1. Get Your Google Gemini API Key
1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key

### 2. Add API Key to Website
1. Open `script.js`
2. Find this line: `const GEMINI_API_KEY = 'YOUR_GOOGLE_GEMINI_API_KEY';`
3. Replace `'YOUR_GOOGLE_GEMINI_API_KEY'` with your actual API key
4. Save the file

### 3. Run Locally
```bash
python -m http.server 8000
```

Visit: `http://localhost:8000`

## Files

- `index.html` – Main landing page with quiz and subject sections
- `styles.css` – Dark theme styling with gold accents + modal styling
- `script.js` – Quiz logic + AI chatbot integration with Google Gemini
- `README.md` – Project documentation

## How It Works

1. **Take the Quiz** - Answer 5 questions to find your learning style
2. **Click Learn Subject** - Click "Learn Math", "Learn Sciences", or "Learn English"
3. **Chat with AI** - Ask the AI tutor questions about the subject
4. **Get Recommendations** - AI provides study tips, resources, and practice strategies
5. **Apply & Practice** - Use the recommendations to master the subject

## Sections

1. **Hero** - "Let's get to know your strengths" introduction
2. **About** - Why LearnigGuide matters
3. **Assessment** - Interactive learning style quiz
4. **Subjects** - Mathematics, Physical Sciences, English (with AI buttons)
5. **How It Works** - 4-step learning journey
6. **CTA** - Call to action to start learning

## API Reference

### Google Gemini API
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Model**: `gemini-1.5-flash`
- **Authentication**: API Key in request params

## Future Enhancements

- Backend integration for storing user learning styles
- Video library implementation with embedded YouTube
- Real practice question system with grading
- User accounts and progress tracking
- Multi-language support
- Integration with more AI models

## Security Notes

⚠️ **Important**: Never commit your API key to public repositories. For production:
- Use environment variables
- Implement a backend proxy
- Use secure API key management

## Deploy on GitHub Pages

1. Make repository public
2. Go to Settings → Pages
3. Select `main` branch, `/` folder
4. Your site will be live at: `https://mkhulekelinkosi.github.io/Education-Website/`

**Note**: GitHub Pages doesn't support backend APIs, so you may need to use a backend service for production deployments.
