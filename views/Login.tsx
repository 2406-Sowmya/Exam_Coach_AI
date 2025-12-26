import React, { useState } from 'react';
import { db } from '../services/db';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = db.getUsers();

    if (isLogin) {
      // NOTE: Plain password used for demo purposes only (no backend)
      const user = users.find(
        u => u.email === email && u.passwordHash === password
      );
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!email || !name || !password) {
        setError('All fields are required');
        return;
      }

      if (users.some(u => u.email === email)) {
        setError('Email already exists');
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        passwordHash: password // demo-only storage
      };

      db.saveUser(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          🎓 Exam Coach
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded font-bold">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-600 text-sm w-full"
        >
          {isLogin ? 'Create new account' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
