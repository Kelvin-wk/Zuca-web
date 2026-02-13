
import { User, ChatMessage, UpdatePost, PrayerPetition, ChoirMaterial } from '../types';

/**
 * Storage Service: Centralizes all "Backend" logic.
 * To switch to a real backend (Supabase/Firebase/Vercel Postgres), 
 * you only need to update the methods in this file.
 */

const KEYS = {
  USERS: 'zuca_all_users',
  CHAT: 'zuca_chat_history',
  UPDATES: 'zuca_updates',
  PETITIONS: 'zuca_petitions',
  CHOIR: 'zuca_choir_materials',
  CURRENT_USER: 'zuca_user'
};

const get = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const set = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
  // Dispatch a custom event so other tabs can sync (Simulates a real-time backend)
  window.dispatchEvent(new Event('storage_sync'));
};

export const storageService = {
  // --- USER MANAGEMENT ---
  getUsers: (): User[] => get(KEYS.USERS, []),
  saveUser: (user: User) => {
    const users = storageService.getUsers();
    const idx = users.findIndex(u => u.id === user.id || u.email === user.email);
    if (idx > -1) users[idx] = user;
    else users.push(user);
    set(KEYS.USERS, users);
  },
  
  // --- CHAT ---
  getChat: (): ChatMessage[] => get(KEYS.CHAT, []),
  addChatMessage: (msg: ChatMessage) => {
    const history = storageService.getChat();
    set(KEYS.CHAT, [...history, msg]);
  },
  deleteChatMessage: (id: string) => {
    const history = storageService.getChat().filter(m => m.id !== id);
    set(KEYS.CHAT, history);
  },

  // --- UPDATES ---
  getUpdates: (): UpdatePost[] => get(KEYS.UPDATES, []),
  addUpdate: (post: UpdatePost) => {
    const updates = [post, ...storageService.getUpdates()];
    set(KEYS.UPDATES, updates);
  },
  deleteUpdate: (id: string) => {
    const updates = storageService.getUpdates().filter(u => u.id !== id);
    set(KEYS.UPDATES, updates);
  },

  // --- PETITIONS ---
  getPetitions: (): PrayerPetition[] => get(KEYS.PETITIONS, []),
  addPetition: (petition: PrayerPetition) => {
    const petitions = [petition, ...storageService.getPetitions()];
    set(KEYS.PETITIONS, petitions);
  },
  deletePetition: (id: string) => {
    const petitions = storageService.getPetitions().filter(p => p.id !== id);
    set(KEYS.PETITIONS, petitions);
  },
  likePetition: (id: string) => {
    const petitions = storageService.getPetitions().map(p => 
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    );
    set(KEYS.PETITIONS, petitions);
  },

  // --- CHOIR ---
  getChoir: (): ChoirMaterial[] => get(KEYS.CHOIR, []),
  addChoirMaterial: (item: ChoirMaterial) => {
    const choir = [item, ...storageService.getChoir()];
    set(KEYS.CHOIR, choir);
  },
  deleteChoirMaterial: (id: string) => {
    const choir = storageService.getChoir().filter(c => c.id !== id);
    set(KEYS.CHOIR, choir);
  }
};
