
import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { User } from './types';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Syllabus from './views/Syllabus';
import Tutor from './views/Tutor';
import Practice from './views/Practice';
import Planner from './views/Planner';
import Chatbot from './views/Chatbot';
import Login from './views/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(db.getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (user: User) => {
    db.setCurrentUser(user);
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    db.setCurrentUser(null);
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard userId={currentUser.id} />;
      case 'syllabus': return <Syllabus userId={currentUser.id} />;
      case 'tutor': return <Tutor userId={currentUser.id} />;
      case 'practice': return <Practice userId={currentUser.id} />;
      case 'planner': return <Planner userId={currentUser.id} />;
      case 'coach': return <Chatbot userId={currentUser.id} />;
      default: return <Dashboard userId={currentUser.id} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userName={currentUser.name}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
