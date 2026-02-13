
import React from 'react';
import { User } from '../types';

interface HeroProps {
  user: User;
  onPlayTrivia: () => void;
}

interface Saint {
  name: string;
  feast: string;
  patronage: string;
  bio: string;
  image: string;
}

const Hero: React.FC<HeroProps> = ({ user, onPlayTrivia }) => {
  const dailyVerses = [
    { verse: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
    { verse: "For I know the plans I have for you, declares the Lord.", ref: "Jeremiah 29:11" },
    { verse: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
    { verse: "Trust in the Lord with all your heart.", ref: "Proverbs 3:5" }
  ];

  const saints: Saint[] = [
    {
      name: "St. Thomas Aquinas",
      feast: "January 28",
      patronage: "Students",
      bio: "Doctor of the Church and patron of students. He is famous for providing the foundation for Catholic theology.",
      image: "https://images.unsplash.com/photo-1548625313-039e44749549?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "St. Therese of Lisieux",
      feast: "October 1",
      patronage: "Missions",
      bio: "Known as the 'Little Flower', she taught the 'Little Way' of seeking holiness through small everyday acts of love.",
      image: "https://images.unsplash.com/photo-1519810755548-39cd217da494?q=80&w=400&auto=format&fit=crop"
    }
  ];
  
  const dayOfYear = new Date().getDate() + new Date().getMonth() * 31;
  const dailyVerse = dailyVerses[dayOfYear % dailyVerses.length];
  const dailySaint = saints[dayOfYear % saints.length];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Blessed Morning";
    if (hour < 17) return "Peaceful Afternoon";
    return "Blessed Evening";
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 relative">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3.5rem] bg-blue-900 text-white shadow-2xl min-h-[400px] md:min-h-[520px] flex items-center group">
        <div className="absolute inset-0">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJajwZ8_x2r6asaSAgtwAncW7vZuM_95dZQ&s" 
            alt="Faith Center" 
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[20s]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-blue-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-6 md:px-20 py-12 md:py-20 max-w-5xl">
          <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-blue-100 font-black text-[9px] md:text-xs mb-6 md:mb-10 uppercase tracking-widest animate-float">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            ZUCA Community
          </div>
          
          <div className="mb-6 md:mb-10">
            <h2 className="text-2xl md:text-5xl font-serif font-bold text-blue-200/90 mb-2 md:mb-4">
              {getGreeting()}, <span className="text-white">{user.name.split(' ')[0]}</span>.
            </h2>
            <h1 className="font-serif text-5xl md:text-9xl mb-6 md:mb-8 leading-[1.1] md:leading-[0.95] font-black tracking-tighter">
              Welcome <span className="text-blue-300 italic">Home.</span>
            </h1>
          </div>

          <p className="text-base md:text-2xl text-blue-100/80 mb-8 md:mb-14 max-w-2xl leading-relaxed">
            Your sacred space for spiritual growth, fellowship, and university excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onPlayTrivia}
              className="px-8 md:px-12 py-4 md:py-6 bg-white text-blue-900 rounded-[1.5rem] md:rounded-[2.5rem] font-black text-base md:text-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <i className="fa-solid fa-trophy text-orange-500"></i>
              Daily Trivia
            </button>
            <button className="px-8 md:px-12 py-4 md:py-6 bg-white/5 border-2 border-white/20 text-white rounded-[1.5rem] md:rounded-[2.5rem] font-black text-base md:text-xl backdrop-blur-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <i className="fa-solid fa-calendar-days text-blue-400"></i>
              Events
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-16">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-blue-600 text-white rounded-[1.2rem] md:rounded-[2rem] flex items-center justify-center text-2xl md:text-4xl shadow-xl shadow-blue-500/20">
                <i className="fa-solid fa-book-open"></i>
              </div>
              <div>
                <h3 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white font-serif tracking-tight">Today's Word</h3>
                <p className="text-[10px] md:text-sm text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">Scripture Insight</p>
              </div>
            </div>

            <p className="text-2xl md:text-5xl font-serif text-slate-800 dark:text-slate-100 leading-tight mb-8 md:mb-12 italic font-bold">
              "{dailyVerse.verse}"
            </p>
            
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-grow bg-slate-100 dark:bg-slate-800"></div>
              <cite className="not-italic font-black text-blue-600 dark:text-blue-400 text-lg md:text-3xl">
                — {dailyVerse.ref}
              </cite>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center text-xl shadow-lg">
              <i className="fa-solid fa-star-of-life"></i>
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-black text-slate-800 dark:text-white font-serif tracking-tight">Patron Saint</h3>
              <p className="text-[10px] text-amber-600 font-bold uppercase">Feast: {dailySaint.feast}</p>
            </div>
          </div>

          <div className="relative mb-6 rounded-2xl md:rounded-[2rem] overflow-hidden aspect-video lg:aspect-[4/5] shadow-xl">
            <img src={dailySaint.image} className="w-full h-full object-cover" alt={dailySaint.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="text-white font-serif text-xl md:text-2xl font-black">{dailySaint.name}</h4>
              <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">{dailySaint.patronage}</p>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic border-l-4 border-amber-500/20 pl-4">
            "{dailySaint.bio}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
