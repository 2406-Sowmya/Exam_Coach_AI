import React, { useState } from 'react';
import { db } from '../services/db';
import { generateQuiz } from '../services/geminiService';
import { Attempt } from '../types';

interface PracticeProps {
  userId: string;
}

const Practice: React.FC<PracticeProps> = ({ userId }) => {
  const subjects = db.getSubjects(userId);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [quiz, setQuiz] = useState<any[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const topics = selectedSubjectId ? db.getTopics(selectedSubjectId) : [];

  const startQuiz = async () => {
    if (!selectedTopicId) return;
    setLoading(true);
    try {
      const topicName = topics.find(t => t.id === selectedTopicId)?.name || '';
      const q = await generateQuiz(topicName);
      setQuiz(q);
      setAnswers([]);
      setShowResult(false);
    } catch {
      alert('AI service is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = () => {
    if (answers.length !== quiz.length || answers.includes(undefined)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const score = quiz.reduce(
      (s, q, i) => s + (answers[i] === q.correctIndex ? 1 : 0),
      0
    );

    const attempt: Attempt = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      topicId: selectedTopicId,
      score,
      total: quiz.length,
      date: new Date().toISOString()
    };

    db.addAttempt(attempt);

    if (score / quiz.length >= 0.6) {
      db.updateTopicStatus(selectedTopicId, 'Completed');
    }

    setShowResult(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Selection Panel */}
      {!quiz.length && (
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="text-2xl font-bold">Practice Quiz</h2>

          <select
            className="w-full p-3 border rounded-lg"
            value={selectedSubjectId}
            onChange={e => {
              setSelectedSubjectId(e.target.value);
              setSelectedTopicId('');
            }}
          >
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            className="w-full p-3 border rounded-lg"
            value={selectedTopicId}
            disabled={!selectedSubjectId}
            onChange={e => setSelectedTopicId(e.target.value)}
          >
            <option value="">Select Topic</option>
            {topics.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <button
            onClick={startQuiz}
            disabled={loading || !selectedTopicId}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
          >
            {loading ? 'Generating Quiz...' : 'Start Quiz'}
          </button>
        </div>
      )}

      {/* Quiz Questions */}
      {quiz.length > 0 && !showResult && (
        <div className="space-y-6">
          {quiz.map((q, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border shadow-sm">
              <p className="font-bold text-lg mb-4">
                Q{i + 1}. {q.question}
              </p>

              <div className="space-y-3">
                {q.options.map((opt: string, j: number) => (
                  <button
                    key={j}
                    onClick={() => {
                      const updated = [...answers];
                      updated[i] = j;
                      setAnswers(updated);
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition ${
                      answers[i] === j
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={submitQuiz}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg"
          >
            Submit Quiz
          </button>
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div className="bg-white p-8 rounded-xl border shadow-sm text-center">
          <h3 className="text-3xl font-bold mb-4">Quiz Completed 🎉</h3>
          <p className="text-xl">
            Score: <span className="font-bold text-blue-600">
              {answers.reduce((c, a, i) => c + (a === quiz[i].correctIndex ? 1 : 0), 0)}
            </span> / {quiz.length}
          </p>
        </div>
      )}

    </div>
  );
};

export default Practice;
