export enum UserRole {
  STUDENT = 'Student',
  NON_STUDENT = 'Non-Student',
  GUEST = 'Guest',
  TRAINER = 'Trainer'
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string; // This will act as the Admission Number
  profilePic?: string;
  bio?: string;
  points: number;
  rank?: number;
  joinedAt: string;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userPic?: string;
  content: string;
  timestamp: number;
  media?: {
    type: MediaType;
    url: string;
    fileName?: string;
  };
}

export interface UpdatePost {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  category: 'Event' | 'Notice' | 'Spiritual';
}

export interface PrayerPetition {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  likes: number;
}

export interface ChoirMaterial {
  id: string;
  title: string;
  description: string;
  type: MediaType;
  url: string;
  fileName?: string;
  uploadedBy: string;
  uploaderName: string;
  timestamp: number;
}

export type View = 'Home' | 'Trivia' | 'Chat' | 'Profile' | 'Updates' | 'Petitions' | 'FaithAI' | 'Choir';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success';
}