
import React, { useState } from 'react';
import { db } from '../services/db';
import { getExplanation } from '../services/geminiService';

interface TutorProps {
  userId: string;
}

const Tutor: React.FC<TutorProps> = ({ userId }) => {
  const subjects = db.getSubjects(userId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const topics = selectedSubjectId ? db.getTopics(selectedSubjectId) : [];

  const handleExplain = async () => {
    if (!selectedTopicId) return;
    const topic = topics.find(t => t.id === selectedTopicId);
    const subject = subjects.find(s => s.id === selectedSubjectId);
    if (!topic || !subject) return;

    setLoading(true);
    setExplanation('');
    try {
      const result = await getExplanation(topic.name, subject.name);
      setExplanation(result || 'No explanation found.');
      // Update status to In Progress if it was Not Started
      if (topic.status === 'Not Started') {
        db.updateTopicStatus(topic.id, 'In Progress');
      }
    } catch (err) {
      console.error(err);
      setExplanation('Error fetching explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">AI Study Assistant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedTopicId('');
                setExplanation('');
              }}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Topic</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!selectedSubjectId}
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
            >
              <option value="">-- Select Topic --</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={handleExplain}
          disabled={!selectedTopicId || loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 transition"
        >
          {loading ? 'Consulting AI Tutor...' : 'Explain this Topic'}
        </button>
      </div>

      {explanation && (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm leading-relaxed whitespace-pre-wrap">
          <div className="prose max-w-none">
            {explanation}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium italic">Gemini is gathering concepts for you...</p>
        </div>
      )}
    </div>
  );
};

export default Tutor;
