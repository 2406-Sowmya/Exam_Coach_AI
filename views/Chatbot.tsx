
import React, { useState, useRef, useEffect } from 'react';
import { db } from '../services/db';
import { getCoachResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatbotProps {
  userId: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ userId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your AI Exam Coach. How can I help you study smarter today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const topics = db.getAllUserTopics(userId);
      const attempts = db.getAttempts(userId);
      const context = `Student has ${topics.length} topics. Completed: ${topics.filter(t => t.status === 'Completed').length}. Attempts: ${attempts.length}.`;
      
      const response = await getCoachResponse(input, context);
      setMessages(prev => [...prev, { role: 'model', text: response || 'I had trouble processing that.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I am offline for a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-bold leading-none">AI Exam Coach</h3>
            <span className="text-xs opacity-80">Ready to motivate you</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl animate-pulse text-gray-400 text-sm">Coach is thinking...</div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
        <input
          type="text"
          placeholder="Ask about your strategy, a topic, or for motivation..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
