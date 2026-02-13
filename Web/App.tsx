
import React, { useState, useEffect } from 'react';
import { User, View, Notification } from './types';
import { storageService } from './services/storageService';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import TriviaPage from './components/TriviaPage';
import ChatPage from './components/ChatPage';
import UpdatesPage from './components/UpdatesPage';
import Hero from './components/Hero';
import PetitionsPage from './components/PetitionsPage';
import FaithAIPage from './components/FaithAIPage';
import ChoirPage from './components/ChoirPage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('Home');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('zuca_theme');
    return saved === 'dark';
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('zuca_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const handleSync = () => {
      const saved = localStorage.getItem('zuca_user');
      if (saved) setUser(JSON.parse(saved));
    };

    window.addEventListener('storage_sync', handleSync);
    return () => window.removeEventListener('storage_sync', handleSync);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zuca_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zuca_theme', 'light');
    }
  }, [isDarkMode]);

  const addNotification = (message: string, type: 'info' | 'success' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleLogin = (userData: User) => {
    storageService.saveUser(userData);
    setUser(userData);
    localStorage.setItem('zuca_user', JSON.stringify(userData));
    addNotification(`Welcome, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('zuca_user');
    setCurrentView('Home');
    setIsMobileMenuOpen(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    storageService.saveUser(updatedUser);
    setUser(updatedUser);
    localStorage.setItem('zuca_user', JSON.stringify(updatedUser));
  };

  const handleSetView = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-x-hidden bg-slate-900">
        <div className="fixed inset-0 z-0">
          <img src="https://newspro.co.ke/wp-content/uploads/2024/02/slide1.png" className="w-full h-full object-cover" alt="Zetech" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-slate-900/50 to-blue-900/60 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 w-full max-w-5xl m-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
          <AuthPage onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'Home': return <Hero user={user} onPlayTrivia={() => setCurrentView('Trivia')} />;
      case 'Trivia': return <TriviaPage user={user} onPointsUpdate={handleUpdateUser} />;
      case 'Chat': return <ChatPage user={user} onNewMessage={(msg) => addNotification(`Fellowship activity: ${msg}`)} />;
      case 'Profile': return <ProfilePage user={user} onUpdate={handleUpdateUser} onLogout={handleLogout} />;
      case 'Updates': return <UpdatesPage user={user} onNewUpdate={(title) => addNotification(`Update: ${title}`, 'success')} />;
      case 'Petitions': return <PetitionsPage user={user} />;
      case 'FaithAI': return <FaithAIPage user={user} />;
      case 'Choir': return <ChoirPage user={user} />;
      default: return <Hero user={user} onPlayTrivia={() => setCurrentView('Trivia')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-300 relative overflow-x-hidden">
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[100] space-y-3 pointer-events-none w-[calc(100%-2rem)] md:w-auto">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto px-5 py-3 rounded-xl shadow-2xl border ${n.type === 'success' ? 'bg-green-600 border-green-500 text-white' : 'bg-blue-600 border-blue-500 text-white'} animate-in slide-in-from-right-10 flex items-center gap-3 ml-auto max-w-sm`}>
            <i className={`fa-solid ${n.type === 'success' ? 'fa-circle-check' : 'fa-bell'}`}></i>
            <span className="font-bold text-xs md:text-sm">{n.message}</span>
          </div>
        ))}
      </div>

      <Navbar user={user} currentView={currentView} setView={handleSetView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      
      <div className="flex-grow flex flex-col h-screen overflow-y-auto relative z-10 custom-scrollbar">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between md:hidden">
           <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><i className="fa-solid fa-bars-staggered text-xl"></i></button>
            <span className="font-serif text-xl font-bold dark:text-white text-slate-800">ZUCA</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500"><i className={`fa-solid ${isDarkMode ? 'fa-sun text-yellow-500' : 'fa-moon'}`}></i></button>
            <button onClick={() => setCurrentView('Profile')} className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-100 dark:border-blue-900/50"><img src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}`} className="w-full h-full object-cover" alt="" /></button>
          </div>
        </header>

        <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full flex-grow">
          {renderView()}
        </main>

        <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 p-6 md:p-8 text-center text-slate-400 dark:text-slate-600 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
          &copy; {new Date().getFullYear()} Zetech University Catholic Action
        </footer>
      </div>
    </div>
  );
};

export default App;
