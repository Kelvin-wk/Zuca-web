
import React, { useState, useEffect } from 'react';
import { User, TriviaQuestion } from '../types';
import { generateBibleTrivia } from '../services/geminiService';
import Leaderboard from './Leaderboard';

interface TriviaPageProps {
  user: User;
  onPointsUpdate: (user: User) => void;
}

const TriviaPage: React.FC<TriviaPageProps> = ({ user, onPointsUpdate }) => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [view, setView] = useState<'play' | 'leaderboard'>('play');

  // Background images for each question
  const questionImages = [
    "https://images.unsplash.com/photo-1504052434139-44b5509e6f9d?q=80&w=1200",
    "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1200",
    "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=1200",
    "https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&w=1200",
    "https://images.unsplash.com/photo-1519810755548-39cd217da494?q=80&w=1200",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200",
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200"
  ];

  const loadQuestions = async () => {
    setLoading(true);
    const qs = await generateBibleTrivia();
    setQuestions(qs);
    setLoading(false);
    setCurrentIdx(0);
    setScore(0);
    setGameOver(false);
    setAnswered(false);
    setSelectedOption(null);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);
    if (idx === questions[currentIdx].correctAnswer) {
      setScore(prev => prev + (questions[currentIdx].points || 0));
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setGameOver(true);
      onPointsUpdate({ ...user, points: user.points + score });
    }
  };

  if (view === 'leaderboard') {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-3xl font-bold dark:text-white">Hall of Faith</h2>
          <button 
            onClick={() => setView('play')}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg"
          >
            Back to Trivia
          </button>
        </div>
        <Leaderboard currentUser={user} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl font-bold dark:text-white">Bible Trivia</h2>
        <button 
          onClick={() => setView('leaderboard')}
          className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
        >
          View Leaderboard
        </button>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Seeking wisdom from the scriptures...</p>
        </div>
      ) : gameOver ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-xl border border-blue-50 dark:border-slate-800 transition-colors">
          <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
            <i className="fa-solid fa-crown"></i>
          </div>
          <h3 className="font-serif text-4xl mb-4 dark:text-white">Quiz Complete!</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xl mb-8">You earned <span className="font-bold text-blue-600 dark:text-blue-400">{score} / 50</span> points.</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={loadQuestions}
              className="py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
            >
              Play Again
            </button>
            <button 
              onClick={() => setView('leaderboard')}
              className="py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Leaderboard
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">Question {currentIdx + 1} of {questions.length}</span>
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-sm font-bold">Value: {questions[currentIdx].points} pts</span>
               <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold">Score: {score}</span>
            </div>
          </div>

          <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors min-h-[500px] flex flex-col">
            {/* Dynamic Background Image */}
            <div className="absolute inset-0 h-48">
              <img 
                src={questionImages[currentIdx % questionImages.length]} 
                className="w-full h-full object-cover opacity-60 dark:opacity-40 transition-opacity duration-1000"
                alt="Question Theme"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12 mt-20 flex-grow flex flex-col">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-10 leading-snug">
                {questions[currentIdx].question}
              </h3>

              <div className="grid grid-cols-1 gap-4 flex-grow">
                {questions[currentIdx].options.map((option, idx) => {
                  let statusClass = "bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200";
                  if (answered) {
                    if (idx === questions[currentIdx].correctAnswer) {
                      statusClass = "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400 ring-2 ring-green-100 dark:ring-green-900/30";
                    } else if (idx === selectedOption) {
                      statusClass = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400 ring-2 ring-red-100 dark:ring-red-900/30";
                    } else {
                      statusClass = "bg-slate-50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={answered}
                      className={`p-5 rounded-2xl border text-left font-semibold text-lg transition-all duration-300 flex items-center gap-4 ${statusClass}`}
                    >
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                        answered && idx === questions[currentIdx].correctAnswer ? 'bg-green-500 text-white border-green-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-10 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex-shrink-0 flex items-center justify-center">
                      <i className="fa-solid fa-info"></i>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">Explanation</h4>
                      <p className="text-blue-800/80 dark:text-blue-300/80 text-sm leading-relaxed">{questions[currentIdx].explanation}</p>
                      <button 
                        onClick={handleNext}
                        className="mt-6 px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg w-full md:w-auto"
                      >
                        {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-4">
             <div 
               className="h-full bg-blue-600 transition-all duration-700" 
               style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
             ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriviaPage;
