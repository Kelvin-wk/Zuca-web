
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { getSpiritualInsight } from '../services/geminiService';

interface FaithAIPageProps {
  user: User;
}

const FaithAIPage: React.FC<FaithAIPageProps> = ({ user }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    const insight = await getSpiritualInsight(userText);
    setMessages(prev => [...prev, { role: 'ai', content: insight }]);
    setIsLoading(false);
  };

  const suggestions = [
    "What does the Bible say about anxiety?",
    "Explain the Parable of the Sower",
    "How can I grow deeper in my prayer life?",
    "Verse of encouragement for exams"
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-160px)] animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="font-serif text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <i className="fa-solid fa-sparkles text-blue-600 dark:text-blue-400"></i>
          ZUCA Faith AI
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Your spiritual companion for biblical insights and encouragement.</p>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="flex-grow p-8 overflow-y-auto space-y-8 custom-scrollbar dark:bg-slate-950/20">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center text-3xl shadow-sm">
                <i className="fa-solid fa-hands-holding-child"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">How can I help you today?</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Ask me about scripture, prayer, or Catholic teachings. I'm here to support your spiritual journey.</p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setInput(s); setTimeout(() => handleSend(), 100); }}
                    className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 text-sm font-semibold rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}`}>
                    <i className={`fa-solid ${msg.role === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
                  </div>
                  <div className={`p-6 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none transition-colors'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                   <i className="fa-solid fa-ellipsis text-slate-400"></i>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                   <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 transition-colors">
          <div className="relative flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 transition-all">
            <input 
              type="text" 
              placeholder="Ask anything about faith..."
              className="flex-grow px-4 py-2 outline-none text-slate-700 dark:text-white bg-transparent font-medium"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FaithAIPage;