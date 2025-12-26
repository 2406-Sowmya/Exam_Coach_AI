
import React from 'react';
import { db } from '../services/db';
import { Topic, Subject } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const subjects = db.getSubjects(userId);
  const topics = db.getAllUserTopics(userId);
  const attempts = db.getAttempts(userId);

  const completedTopics = topics.filter(t => t.status === 'Completed').length;
  const progress = topics.length > 0 ? (completedTopics / topics.length) * 100 : 0;

  // Weak areas: Topics with scores < 60%
  const topicStats = topics.map(topic => {
    const topicAttempts = attempts.filter(a => a.topicId === topic.id);
    const avgScore = topicAttempts.length > 0 
      ? (topicAttempts.reduce((sum, a) => sum + (a.score/a.total), 0) / topicAttempts.length) * 100
      : null;
    return { ...topic, avgScore };
  });

  const weakTopics = topicStats.filter(t => t.avgScore !== null && t.avgScore < 60);

  const chartData = subjects.map(s => {
    const subTopics = topics.filter(t => t.subjectId === s.id);
    const completed = subTopics.filter(t => t.status === 'Completed').length;
    return { name: s.name, completed, total: subTopics.length };
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
        <p className="text-gray-500">Here is your current exam readiness overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Overall Progress</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">{Math.round(progress)}%</span>
            <span className="text-sm text-gray-400">of syllabus</span>
          </div>
          <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Topics Completed</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600">{completedTopics}</span>
            <span className="text-sm text-gray-400">/ {topics.length} total</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Average Score</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-500">
              {attempts.length > 0 
                ? Math.round((attempts.reduce((s, a) => s + (a.score/a.total), 0) / attempts.length) * 100)
                : 0}%
            </span>
            <span className="text-sm text-gray-400">across quizzes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Progress by Subject</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Focus Areas (Weak Topics)</h3>
          {weakTopics.length > 0 ? (
            <div className="space-y-4">
              {weakTopics.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="font-medium text-red-700">{t.name}</p>
                    <p className="text-xs text-red-500">Avg Score: {Math.round(t.avgScore || 0)}%</p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">NEEDS REVISION</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <span className="text-4xl mb-2">🎉</span>
              <p>No major weak areas detected yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
