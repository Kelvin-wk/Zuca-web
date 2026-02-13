
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';

interface ProfilePageProps {
  user: User;
  onUpdate: (user: User) => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...user, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {user.profilePic ? (
              <img src={user.profilePic} className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 dark:border-slate-800 shadow-xl" alt="" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-black shadow-xl">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><i className="fa-solid fa-camera"></i></div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>
          
          <div className="mt-6 text-center">
            <h3 className="font-serif text-2xl font-bold dark:text-white">{user.name}</h3>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-1">{user.role}</p>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black">
              <i className="fa-solid fa-star"></i> {user.points} Points
            </div>
          </div>
          
          <div className="w-full mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            <button onClick={() => setIsEditing(!isEditing)} className="w-full py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300">
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button onClick={onLogout} className="w-full py-3 text-red-600 font-bold text-sm">Logout</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:w-2/3">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 h-full">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-serif text-2xl font-bold dark:text-white mb-6">Update Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                  <input 
                    type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">About Your Journey</label>
                  <textarea 
                    value={formData.bio || ''} onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    rows={4} className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 dark:text-white outline-none resize-none"
                  ></textarea>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Save Changes</button>
            </form>
          ) : (
            <div className="space-y-8 text-left">
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Account Overview</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Email</p>
                    <p className="font-bold dark:text-white text-sm">{user.email}</p>
                  </div>
                  {user.studentId && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Admission No</p>
                      <p className="font-bold dark:text-white text-sm">{user.studentId}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Joined</p>
                    <p className="font-bold dark:text-white text-sm">{new Date(user.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Bio</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                  {user.bio || "Share a bit about your spiritual walk..."}
                </p>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
