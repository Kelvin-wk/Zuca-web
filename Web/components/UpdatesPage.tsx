
import React, { useState, useEffect, useRef } from 'react';
import { UpdatePost, User, UserRole } from '../types';
import { storageService } from '../services/storageService';

interface UpdatesPageProps {
  user: User;
  onNewUpdate: (title: string) => void;
}

const UpdatesPage: React.FC<UpdatesPageProps> = ({ user, onNewUpdate }) => {
  const [updates, setUpdates] = useState<UpdatePost[]>([]);
  const [filter, setFilter] = useState<'All' | 'Event' | 'Notice' | 'Spiritual'>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdatePost>>({ 
    title: '', 
    content: '', 
    category: 'Event',
    image: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshData = () => {
    setUpdates(storageService.getUpdates());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('storage_sync', refreshData);
    return () => window.removeEventListener('storage_sync', refreshData);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUpdate: UpdatePost = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      title: formData.title || 'Untitled',
      content: formData.content || '',
      category: formData.category as any || 'Event',
      date: new Date().toISOString(),
      image: formData.image
    };
    
    storageService.addUpdate(newUpdate);
    onNewUpdate(newUpdate.title);
    setIsAdding(false);
    setFormData({ title: '', content: '', category: 'Event', image: '' });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Remove this update?")) {
      storageService.deleteUpdate(id);
    }
  };

  const filteredUpdates = filter === 'All' ? updates : updates.filter(u => u.category === filter);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-1">Community Updates</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">Shared news from the ZUCA community.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <i className="fa-solid fa-plus"></i> Post Update
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
        {['All', 'Event', 'Notice', 'Spiritual'].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat as any)} 
            className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-bold border transition-all ${filter === cat ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-6 text-left">Create Update</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Event', 'Notice', 'Spiritual'].map(c => (
                    <button 
                      key={c} type="button" 
                      onClick={() => setFormData({...formData, category: c as any})} 
                      className={`py-2 rounded-xl text-[10px] font-bold border ${formData.category === c ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Banner</label>
                <div onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 overflow-hidden relative">
                  {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="" /> : <i className="fa-solid fa-image text-2xl text-slate-300"></i>}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>

              <input type="text" placeholder="Title" required className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 outline-none text-sm dark:text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <textarea placeholder="Details..." required rows={4} className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 outline-none resize-none text-sm dark:text-white" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-grow py-3 font-bold text-slate-500 text-sm">Cancel</button>
                <button type="submit" className="flex-grow py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg text-sm">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUpdates.map((update) => {
          const canDelete = update.userId === user.id || user.role === UserRole.TRAINER;
          return (
            <div key={update.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group relative transition-all hover:shadow-lg">
              <div className="relative h-40 md:h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                {update.image ? <img src={update.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" /> : <div className="w-full h-full flex items-center justify-center text-blue-600/20"><i className="fa-solid fa-cross text-3xl"></i></div>}
                <div className="absolute top-3 left-3"><span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest">{update.category}</span></div>
                {canDelete && (
                  <button onClick={(e) => handleDelete(e, update.id)} className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 dark:bg-slate-800/90 text-red-500 flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white md:opacity-0 group-hover:opacity-100 transition-all">
                    <i className="fa-solid fa-trash-can text-[10px]"></i>
                  </button>
                )}
              </div>
              <div className="p-4 md:p-6 text-left">
                <p className="text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-widest">{new Date(update.date).toLocaleDateString()}</p>
                <h3 className="font-serif text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2 truncate">{update.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] md:text-xs leading-relaxed line-clamp-3">"{update.content}"</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpdatesPage;
