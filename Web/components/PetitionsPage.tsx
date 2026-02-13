
import React, { useState, useEffect } from 'react';
import { User, PrayerPetition, UserRole } from '../types';
import { storageService } from '../services/storageService';

interface PetitionsPageProps {
  user: User;
}

const PetitionsPage: React.FC<PetitionsPageProps> = ({ user }) => {
  const [petitions, setPetitions] = useState<PrayerPetition[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const refreshData = () => {
    setPetitions(storageService.getPetitions());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('storage_sync', refreshData);
    return () => window.removeEventListener('storage_sync', refreshData);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    const petition: PrayerPetition = { 
      id: Math.random().toString(36).substr(2, 9), 
      userId: user.id, 
      userName: user.name, 
      content: newContent, 
      timestamp: Date.now(), 
      likes: 0 
    };
    storageService.addPetition(petition);
    setNewContent('');
    setIsAdding(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Remove this prayer petition?')) {
      storageService.deletePetition(id);
    }
  };

  const handleLike = (id: string) => {
    storageService.likePetition(id);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 dark:text-white tracking-tight">Prayer Wall</h2>
        <button onClick={() => setIsAdding(true)} className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm">
          <i className="fa-solid fa-plus"></i> Request Prayer
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border-2 border-blue-500 shadow-xl animate-in slide-in-from-top-4">
          <form onSubmit={handleCreate}>
            <textarea autoFocus className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none min-h-[120px] text-sm md:text-base dark:text-white resize-none" placeholder="Share your prayer petition..." value={newContent} onChange={e => setNewContent(e.target.value)} />
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2 font-bold text-slate-500 text-sm">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">Post</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {petitions.map((petition) => {
          const isOwner = petition.userId === user.id;
          const canManage = isOwner || user.role === UserRole.TRAINER;
          
          return (
            <div key={petition.id} className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 dark:border-slate-800 group transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center font-bold text-xs md:text-sm">{petition.userName.charAt(0)}</div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 dark:text-white text-xs md:text-sm">{petition.userName}</p>
                    <p className="text-[8px] md:text-[9px] text-slate-400 uppercase font-bold tracking-widest">{new Date(petition.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                {canManage && petition.userId !== 'system' && (
                  <button onClick={(e) => handleDelete(e, petition.id)} className="p-2 text-red-400 hover:text-red-600 md:opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-trash-can text-[10px] md:text-xs"></i></button>
                )}
              </div>
              <div className="text-left">
                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed italic mb-6">"{petition.content}"</p>
                <button onClick={() => handleLike(petition.id)} className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 rounded-full text-[10px] md:text-xs font-black active:scale-95 transition-all"><i className="fa-solid fa-heart"></i> Amen ({petition.likes})</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PetitionsPage;
