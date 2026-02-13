import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface LeaderboardProps {
  currentUser?: User;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Pull real registered users from local storage
    const savedUsers = localStorage.getItem('zuca_all_users');
    if (savedUsers) {
      const parsed: User[] = JSON.parse(savedUsers);
      // Sort by points descending
      const sorted = parsed.sort((a, b) => b.points - a.points);
      setUsers(sorted);
    } else if (currentUser) {
      setUsers([currentUser]);
    }
  }, [currentUser]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="p-8 bg-blue-600 text-white text-center">
        <h3 className="font-serif text-3xl font-bold mb-2">Hall of Faith</h3>
        <p className="text-blue-100 opacity-80">Celebrating our community's knowledge of the scriptures.</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-medium italic">
              No participants recorded yet. Join the trivia to see yourself here!
            </div>
          ) : (
            users.map((entry, idx) => {
              const isCurrentUser = currentUser && entry.id === currentUser.id;
              const isTrainer = entry.role === UserRole.TRAINER;
              const rank = idx + 1;
              
              return (
                <div 
                  key={entry.id} 
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    isCurrentUser 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm ${
                    rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    rank === 2 ? 'bg-slate-300 text-slate-700' :
                    rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {rank}
                  </div>
                  
                  <div className="flex-shrink-0">
                    {entry.profilePic ? (
                      <img src={entry.profilePic} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" alt="" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">
                        {entry.name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-white">{entry.name}</span>
                      {isTrainer && <i className="fa-solid fa-shield-check text-amber-500" title="Verified Trainer"></i>}
                      {rank <= 3 && <i className="fa-solid fa-medal text-yellow-500"></i>}
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{entry.role}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{entry.points}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-tighter font-bold">Points</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/30">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-yellow-400 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <i className="fa-solid fa-gift text-xl"></i>
            </div>
            <div>
              <h4 className="font-bold text-yellow-900 dark:text-yellow-400">Current Monthly Reward</h4>
              <p className="text-sm text-yellow-800/80 dark:text-yellow-300/80 leading-relaxed mt-1">
                The top performers this month will receive a <span className="font-bold underline">Custom ZUCA Spiritual Kit</span> including a rosary, journal, and exclusive community merchandise!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;