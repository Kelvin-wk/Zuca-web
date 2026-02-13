
import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage, MediaType, UserRole } from '../types';
import { getSpiritualInsight } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface ChatPageProps {
  user: User;
  onNewMessage: (name: string) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ user, onNewMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaFile, setMediaFile] = useState<{type: MediaType, data: string, name?: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const refreshData = () => {
    setMessages(storageService.getChat());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('storage_sync', refreshData);
    return () => window.removeEventListener('storage_sync', refreshData);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText !== undefined ? customText : input;
    if (!textToSend.trim() && !mediaFile) return;

    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      userPic: user.profilePic,
      content: textToSend,
      timestamp: Date.now(),
      media: mediaFile ? { type: mediaFile.type, url: mediaFile.data, fileName: mediaFile.name } : undefined
    };

    storageService.addChatMessage(newMsg);
    setInput('');
    setMediaFile(null);
    onNewMessage(user.name);

    if (textToSend.toLowerCase().includes('pray') || textToSend.toLowerCase().includes('bible')) {
      setIsTyping(true);
      const insight = await getSpiritualInsight(textToSend);
      const botMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        userId: 'bot',
        userName: 'Spiritual Guide',
        userRole: UserRole.GUEST,
        content: insight,
        timestamp: Date.now()
      };
      setIsTyping(false);
      storageService.addChatMessage(botMsg);
    }
  };

  const deleteMessage = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Remove this message permanently?")) {
      storageService.deleteChatMessage(id);
    }
  };

  const startMeeting = () => {
    const meetUrl = "https://meet.google.com/new";
    window.open(meetUrl, '_blank');
    handleSend(undefined, `Join the online fellowship: ${meetUrl}`);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => e.data.size > 0 && audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => setMediaFile({ type: 'audio', data: reader.result as string, name: 'VoiceNote.webm' });
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { alert("Mic access denied"); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      let type: MediaType = 'document';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      const reader = new FileReader();
      reader.onloadend = () => setMediaFile({ type, data: reader.result as string, name: file.name });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[75vh] md:h-[85vh] flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative group/chat transition-all">
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl animate-float">
              <i className="fa-solid fa-comments text-lg md:text-xl"></i>
            </div>
            <div>
              <h3 className="font-black text-slate-800 dark:text-white text-base md:text-lg font-serif">Fellowship Chat</h3>
              <p className="text-[8px] md:text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Community Active
              </p>
            </div>
          </div>
          <button 
            onClick={startMeeting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] md:text-xs font-bold transition-all shadow-lg"
          >
            <i className="fa-solid fa-video"></i> <span className="hidden sm:inline">Video Call</span>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {messages.map((msg) => {
            const isMe = msg.userId === user.id;
            const isSystem = msg.userId === 'system' || msg.userId === 'bot';
            const canDelete = isMe || user.role === UserRole.TRAINER;

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[10px] py-1.5 px-6 rounded-full font-bold uppercase tracking-widest border border-slate-200/50 dark:border-slate-700/50">
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex gap-3 group/msg ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0 mt-1">
                  {msg.userPic ? (
                    <img src={msg.userPic} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md" alt="" />
                  ) : (
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white text-[10px] md:text-xs font-black shadow-md ${isMe ? 'bg-blue-600' : 'bg-slate-400'}`}>
                      {msg.userName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={`max-w-[85%] sm:max-w-[70%] ${isMe ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] md:text-[11px] font-bold text-slate-800 dark:text-slate-100">{msg.userName}</span>
                    <span className="text-[8px] md:text-[9px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {canDelete && (
                      <button onClick={(e) => deleteMessage(e, msg.id)} className="text-red-400 hover:text-red-600 p-1 md:opacity-0 group-hover/msg:opacity-100 transition-opacity">
                         <i className="fa-solid fa-trash-can text-[9px] md:text-[10px]"></i>
                      </button>
                    )}
                  </div>

                  <div className={`p-3 md:p-4 rounded-2xl shadow-md text-xs md:text-sm leading-relaxed ${
                    isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100/50 dark:border-slate-700/50'
                  }`}>
                    {msg.media && (
                      <div className="mb-2">
                        {msg.media.type === 'image' && <img src={msg.media.url} className="rounded-xl max-h-48 md:max-h-60 object-contain w-full shadow-lg" alt="" />}
                        {msg.media.type === 'video' && <video src={msg.media.url} controls className="rounded-xl max-h-48 md:max-h-60 w-full" />}
                        {msg.media.type === 'audio' && <audio src={msg.media.url} controls className="w-full h-8 mt-1" />}
                      </div>
                    )}
                    <p>{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {isTyping && <div className="flex gap-1.5 p-2 bg-slate-100 dark:bg-slate-800 rounded-full w-fit"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></div><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></div></div>}
        </div>

        {/* Input */}
        <div className="p-4 md:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSend} className="flex items-center gap-2 md:gap-3">
            <div className="flex gap-1 md:gap-2">
              <label className="cursor-pointer w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all">
                <i className="fa-solid fa-paperclip text-sm"></i>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
              <button 
                type="button"
                onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              >
                <i className="fa-solid fa-microphone text-sm"></i>
              </button>
            </div>
            <input 
              type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Type message..."
              className="flex-grow px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white text-xs md:text-sm"
            />
            <button 
              type="submit" disabled={!input.trim() && !mediaFile}
              className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50 transition-all active:scale-90"
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
