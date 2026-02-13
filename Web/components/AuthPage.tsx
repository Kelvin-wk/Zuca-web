
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const globalUsersStr = localStorage.getItem('zuca_all_users');
    const allUsers: User[] = globalUsersStr ? JSON.parse(globalUsersStr) : [];

    if (isLogin) {
      const existingUser = allUsers.find(u => 
        u.name.toLowerCase() === formData.name.toLowerCase() || 
        u.email.toLowerCase() === formData.name.toLowerCase()
      );
      if (existingUser) onLogin(existingUser);
      else alert("Account not found. Please check your credentials.");
    } else {
      if (allUsers.some(u => u.name.toLowerCase() === formData.name.toLowerCase())) {
        alert("This name is already registered!");
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.name,
        name: formData.name,
        email: formData.email,
        role: role,
        studentId: role === UserRole.STUDENT ? formData.studentId : undefined,
        points: 0,
        joinedAt: new Date().toISOString()
      };
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-full flex flex-col md:flex-row bg-transparent">
      {/* Visual Section */}
      <div className="h-48 md:h-auto md:w-[40%] relative overflow-hidden shrink-0">
        <img 
          src="https://newspro.co.ke/wp-content/uploads/2024/02/slide1.png" 
          alt="Zetech" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center text-blue-900 text-2xl md:text-4xl mb-4 md:mb-6 shadow-2xl">
            <i className="fa-solid fa-cross"></i>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight">ZUCA Portal</h1>
          <p className="hidden md:block text-blue-50 text-sm mt-2 opacity-90 italic">"Faith in Action."</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900">
        <div className="max-w-sm mx-auto w-full">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white font-serif tracking-tight mb-2">
              {isLogin ? 'Sign In' : 'Join ZUCA'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {isLogin ? 'Welcome back to our fellowship' : 'Create an account to join us'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity</label>
              <input 
                type="text" required placeholder={isLogin ? "Name or Email" : "Full Name"}
                className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500 transition-all text-sm"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input 
                  type="email" required placeholder="you@example.com"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500 transition-all text-sm"
                  value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" required placeholder="••••••••"
                className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500 transition-all text-sm"
                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {!isLogin && (
              <div className="pt-2">
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                  {[UserRole.STUDENT, UserRole.TRAINER, UserRole.NON_STUDENT].map(r => (
                    <button
                      key={r} type="button" onClick={() => setRole(r)}
                      className={`py-2 text-[9px] font-bold rounded-lg transition-all ${role === r ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      {r.split('-')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isLogin && role === UserRole.STUDENT && (
              <input 
                type="text" required placeholder="Admission No (ZU/XXXX/20XX)"
                className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500 transition-all text-sm"
                value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })}
              />
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            >
              <span>{isLogin ? 'Sign In' : 'Join'}</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-500 dark:text-slate-400 text-xs font-bold hover:text-blue-600 transition-all"
            >
              {isLogin ? "Don't have an account? Create one" : "Already registered? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
