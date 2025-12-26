
import { User, Subject, Topic, Attempt } from '../types';

const KEYS = {
  USERS: 'exam_coach_users',
  SUBJECTS: 'exam_coach_subjects',
  TOPICS: 'exam_coach_topics',
  ATTEMPTS: 'exam_coach_attempts',
  CURRENT_USER: 'exam_coach_current_user'
};

export const db = {
  // Auth
  getUsers: (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  saveUser: (user: User) => {
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user)),

  // Subjects
  getSubjects: (userId: string): Subject[] => {
    const all = JSON.parse(localStorage.getItem(KEYS.SUBJECTS) || '[]') as Subject[];
    return all.filter(s => s.userId === userId);
  },
  addSubject: (subject: Subject) => {
    const all = JSON.parse(localStorage.getItem(KEYS.SUBJECTS) || '[]') as Subject[];
    all.push(subject);
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(all));
  },

  // Topics
  getTopics: (subjectId: string): Topic[] => {
    const all = JSON.parse(localStorage.getItem(KEYS.TOPICS) || '[]') as Topic[];
    return all.filter(t => t.subjectId === subjectId);
  },
  getAllUserTopics: (userId: string): Topic[] => {
    const subjects = db.getSubjects(userId);
    const sIds = subjects.map(s => s.id);
    const all = JSON.parse(localStorage.getItem(KEYS.TOPICS) || '[]') as Topic[];
    return all.filter(t => sIds.includes(t.subjectId));
  },
  addTopic: (topic: Topic) => {
    const all = JSON.parse(localStorage.getItem(KEYS.TOPICS) || '[]') as Topic[];
    all.push(topic);
    localStorage.setItem(KEYS.TOPICS, JSON.stringify(all));
  },
  updateTopicStatus: (topicId: string, status: Topic['status']) => {
    const all = JSON.parse(localStorage.getItem(KEYS.TOPICS) || '[]') as Topic[];
    const index = all.findIndex(t => t.id === topicId);
    if (index !== -1) {
      all[index].status = status;
      localStorage.setItem(KEYS.TOPICS, JSON.stringify(all));
    }
  },

  // Attempts
  getAttempts: (userId: string): Attempt[] => {
    const all = JSON.parse(localStorage.getItem(KEYS.ATTEMPTS) || '[]') as Attempt[];
    return all.filter(a => a.userId === userId);
  },
  addAttempt: (attempt: Attempt) => {
    const all = JSON.parse(localStorage.getItem(KEYS.ATTEMPTS) || '[]') as Attempt[];
    all.push(attempt);
    localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(all));
  }
};
