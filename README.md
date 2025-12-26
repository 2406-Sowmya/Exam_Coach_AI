Exam Coach AI – Personalized Learning & Exam Preparation System
Overview

Exam Coach AI is a personalized learning and exam preparation web application designed as a student-focused academic project.
The system helps students study smarter by organizing syllabus content, practicing exam-style questions, tracking performance, and receiving AI-powered guidance.

The application focuses on exam-oriented learning, clarity, and adaptive revision using Google Gemini AI.

Project Objectives

The primary objectives of the Exam Coach AI – Personalized Learning & Exam Preparation System are:

To provide a structured and exam-oriented learning platform for students

To help students manage syllabus, subjects, and topics efficiently

To deliver clear and simplified AI-based explanations for better understanding

To allow students to practice exam-style questions and evaluate performance

To track progress and automatically identify weak and strong areas

To generate personalized revision plans based on student performance

To offer AI-driven academic guidance and motivation through an exam coach chatbot

To reduce dependency on human tutors using intelligent AI assistance

Features
1. Syllabus & Topic Management

Add and organize subjects and topics

Track topic-wise learning progress

Structured syllabus flow for exam preparation

2. AI Tutor (Gemini-Powered)

Simple and exam-focused explanations

Beginner-friendly responses

Optimized for quick revision and clarity

Powered by Google Gemini API

3. Practice Module

Topic-wise practice questions

AI-generated MCQs

Automatic scoring and evaluation

4. Progress Tracking

Stores quiz attempts and scores

Identifies weak and strong topics automatically

Performance-based learning insights

5. Personalized Revision Planner

AI-generated 7-day revision plan

Based on actual student progress and performance

Prioritizes weak and unattempted topics

6. AI Exam Coach Chatbot

Interactive AI chatbot for exam guidance

Answers questions such as:

What should I revise today?

How can I improve my score?

Which topics need more focus?

Combines student progress data with AI responses

Tech Stack

Frontend Framework: React (TypeScript)

Build Tool: Vite

Styling: Tailwind CSS

AI Engine: Google Gemini API (@google/genai)

State Management: Browser LocalStorage (Mock Database)

Charts & Analytics: Recharts

Icons: Lucide React



How to Run the Project Locally

Clone the repository:

git clone https://github.com/2406-Sowmya/Exam-Coach-AI.git
cd Exam-Coach-AI


Install dependencies (Node.js v18 or above):

npm install


Set up environment variables:
Create a .env.local file in the root directory and add:

VITE_API_KEY=your_google_gemini_api_key_here


Start the development server:

npm run dev


Open the application in your browser:

http://localhost:3000

Deployment

The project is deployed using Vercel.

🔗 Live Application:
https://exam-coach-ai-two.vercel.app/

Multi-User Behavior

Multiple users can access the application using the deployed link

Each user’s data is stored in their own browser

No data sharing between users

No backend or centralized database

Limitations

Data is stored locally in the browser

No cross-device data synchronization

Clearing browser data removes stored progress

Frontend-only project (no backend server)

Conclusion

Exam Coach AI is an exam-focused, AI-powered learning assistant that helps students plan, practice, and improve their academic performance.
The project demonstrates effective use of AI in education while maintaining simplicity and clarity suitable for academic evaluation.