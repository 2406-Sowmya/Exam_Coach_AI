import React, { useState } from 'react';
import { db } from '../services/db';
import { Subject, Topic } from '../types';

interface SyllabusProps {
  userId: string;
}

const Syllabus: React.FC<SyllabusProps> = ({ userId }) => {
  const [subjects, setSubjects] = useState<Subject[]>(db.getSubjects(userId));
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');

  const activeTopics = selectedSubject ? db.getTopics(selectedSubject) : [];

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;

    db.addSubject({
      id: Math.random().toString(36).substr(2, 9),
      userId,
      name: newSubjectName
    });

    setSubjects(db.getSubjects(userId));
    setNewSubjectName('');
  };

  const handleAddTopic = () => {
    if (!newTopicName.trim() || !selectedSubject) return;

    db.addTopic({
      id: Math.random().toString(36).substr(2, 9),
      subjectId: selectedSubject,
      name: newTopicName,
      status: 'Not Started'
    });

    setNewTopicName('');
  };

  const toggleStatus = (topicId: string, status: Topic['status']) => {
    const states: Topic['status'][] = ['Not Started', 'In Progress', 'Completed'];
    const next = states[(states.indexOf(status) + 1) % states.length];
    db.updateTopicStatus(topicId, next);

    // ✅ FIX: reload subjects to force UI refresh
    setSubjects(db.getSubjects(userId));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Syllabus Management</h2>

      <input
        value={newSubjectName}
        onChange={e => setNewSubjectName(e.target.value)}
        placeholder="New Subject"
        className="border px-3 py-2 mr-2"
      />
      <button onClick={handleAddSubject} className="bg-blue-600 text-white px-4 py-2">
        Add Subject
      </button>

      <div className="flex mt-6 gap-6">
        <div className="w-1/4">
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.id)}
              className="block w-full text-left p-2 border mb-2"
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex-1">
          {selectedSubject && (
            <>
              <input
                value={newTopicName}
                onChange={e => setNewTopicName(e.target.value)}
                placeholder="New Topic"
                className="border px-3 py-2 mr-2"
              />
              <button onClick={handleAddTopic} className="bg-green-600 text-white px-4 py-2">
                Add Topic
              </button>

              {activeTopics.map(t => (
                <div key={t.id} className="flex justify-between p-3 border mt-2">
                  <span>{t.name}</span>
                  <button
                    onClick={() => toggleStatus(t.id, t.status)}
                    className="text-sm font-bold"
                  >
                    {t.status}
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Syllabus;
