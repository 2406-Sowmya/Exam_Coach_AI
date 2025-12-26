import React, { useState } from 'react';
import { db } from '../services/db';
import { generateRevisionPlan } from '../services/geminiService';

interface PlannerProps {
  userId: string;
}

const Planner: React.FC<PlannerProps> = ({ userId }) => {
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    const topics = db.getAllUserTopics(userId);
    const attempts = db.getAttempts(userId);

    if (topics.length === 0) {
      alert('Please add topics first.');
      return;
    }

    // Build PURE progress summary (no logic, no tasks)
    const progressSummary = topics.map(t => {
      const related = attempts.filter(a => a.topicId === t.id);
      const avg =
        related.length > 0
          ? (related.reduce((s, a) => s + a.score / a.total, 0) / related.length) * 100
          : null;

      return {
        topic: t.name,
        attempts: related.length,
        averageScore: avg === null ? 'Not Attempted' : `${avg.toFixed(1)}%`
      };
    });

    setLoading(true);
    try {
      const aiPlan = await generateRevisionPlan(topics,attempts);
      setPlan(aiPlan);
    } catch {
      alert('AI service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Smart Revision Planner</h2>
          <p className="text-gray-500">
            Fully AI-generated based on your learning progress.
          </p>
        </div>
        <button
          onClick={generatePlan}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold"
        >
          {loading ? 'Generating...' : 'Generate 7-Day Plan'}
        </button>
      </div>

      {plan ? (
        <div className="bg-white p-8 rounded-xl border shadow-sm whitespace-pre-wrap text-gray-800 leading-relaxed">
          {plan}
        </div>
      ) : (
        <div className="border border-dashed rounded-xl p-16 text-center text-gray-400">
          Click “Generate 7-Day Plan” to create your personalized revision schedule.
        </div>
      )}
    </div>
  );
};

export default Planner;
