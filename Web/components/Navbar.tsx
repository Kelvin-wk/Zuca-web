
import React from 'react';
import { User, View, UserRole } from '../types';

interface NavbarProps {
  user: User;
  currentView: View;
  setView: (view: View) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, currentView, setView, isDarkMode, setIsDarkMode, isOpen, setIsOpen }) => {
  const navItems: { name: string; icon: string; view: View }[] = [
    { name: 'Dashboard', icon: 'fa-house', view: 'Home' },
    { name: 'Updates', icon: 'fa-newspaper', view: 'Updates' },
    { name: 'Faith AI', icon: 'fa-wand-magic-sparkles', view: 'FaithAI' },
    { name: 'Bible Trivia', icon: 'fa-trophy', view: 'Trivia' },
    { name: 'Prayer Wall', icon: 'fa-hands-praying', view: 'Petitions' },
    { name: 'Choir Materials', icon: 'fa-music', view: 'Choir' },
    { name: 'Fellowship', icon: 'fa-comments', view: 'Chat' },
    { name: 'Profile', icon: 'fa-user', view: 'Profile' },
  ];

  const isTrainer = user.role === UserRole.TRAINER;

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 md:p-8 flex-grow overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-cross"></i>
          </div>
          <span className="font-serif text-2xl font-bold text-slate-800 dark:text-white tracking-tight">ZUCA</span>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] px-4 mb-4">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
                currentView === item.view 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-blue-600'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center ${currentView === item.view ? 'text-white' : 'text-slate-400'}`}></i>
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <i className={`fa-solid ${isDarkMode ? 'fa-sun text-yellow-500' : 'fa-moon'} w-5 text-center`}></i>
          <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className="bg-slate-50/50 dark:bg-slate-800/40 backdrop-blur rounded-2xl p-3 flex items-center gap-3 border border-slate-100 dark:border-slate-700">
          {user.profilePic ? (
            <img src={user.profilePic} className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" alt="" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-black text-sm">
              {user.name.charAt(0)}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-xs font-black text-slate-800 dark:text-white truncate">{user.name}</p>
            <p className="text-[9px] text-slate-400 font-bold truncate uppercase tracking-wider">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
        <div className={`absolute top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <NavContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 h-screen bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 sticky top-0 shrink-0 z-50">
        <NavContent />
      </nav>
    </>
  );
};

export default Navbar;
