
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  lastScore?: number;
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
}

export interface Attempt {
  id: string;
  userId: string;
  topicId: string;
  score: number;
  total: number;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface RevisionPlan {
  day: number;
  priority: string;
  topicNames: string[];
}
