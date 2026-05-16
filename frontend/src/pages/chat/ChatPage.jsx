import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Search, MoreHorizontal, Paperclip, Smile, ShieldCheck, User, Store, Mic, MicOff, X, Image as ImageIcon, Film, Play, Pause, ChevronRight, MessageSquare, Terminal, Hash, Info, UserCheck, RefreshCw, Activity, Smartphone, Monitor, LayoutGrid, FileText, Globe } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { chatAPI, uploadAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const ChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMediaType, setActiveMediaType] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace('/api', '');
    return `${baseUrl}${path}`;
  };

  // Poll for conversations
  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const data = await chatAPI.getConversations(user.id);
        setConversations(data);
        if (data.length > 0 && !selectedConv) {
          setSelectedConv(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [user, selectedConv]);

  // Poll for messages
  useEffect(() => {
    if (!selectedConv) return;

    const fetchMessages = async () => {
      try {
        const data = await chatAPI.getMessages(selectedConv.id);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [selectedConv]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], "voice_note.webm", { type: 'audio/webm' });
        setMediaFile(file);
        setMediaPreview(URL.createObjectURL(file));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async () => {
    if ((!message.trim() && !mediaFile) || !selectedConv) return;
    
    let mediaUrl = null;
    let mediaType = null;

    if (mediaFile) {
      try {
        const uploadRes = await uploadAPI.uploadFile(mediaFile);
        mediaUrl = uploadRes.url;
        mediaType = activeMediaType || uploadRes.type;
      } catch (error) {
        console.error('Upload failed:', error);
        return;
      }
    }

    const newMessage = {
      receiverId: selectedConv.participantId,
      content: message,
      senderId: user.id,
      mediaUrl,
      mediaType: mediaType || 'text'
    };

    try {
      const currentMessage = message;
      setMessage('');
      setMediaFile(null);
      setMediaPreview(null);
      setActiveMediaType(null);
      setShowAttachMenu(false);

      // Optimistic update
      const tempId = Date.now().toString();
      setMessages([...messages, { 
        id: tempId, 
        sender_id: user.id, 
        senderName: 'You', 
        content: currentMessage, 
        media_url: mediaUrl,
        media_type: mediaType,
        timestamp: new Date().toISOString() 
      }]);

      await chatAPI.sendMessage(newMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <MainLayout hideFooter hideAI>
        <div className="h-screen flex items-center justify-center bg-slate-50">
           <div className="flex flex-col items-center gap-8">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin shadow-2xl" />
              <div className="space-y-2 text-center">
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Synchronizing Trade Nodes</p>
                 <div className="flex items-center justify-center gap-2">
                    {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                 </div>
              </div>
           </div>
        </div>
      </MainLayout>
    );
  }

  const VoiceMessage = ({ url, isMe }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    };

    const formatDuration = (sec) => {
      const min = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${min}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
      <div className={cn(
        "flex items-center gap-5 p-5 rounded-2xl min-w-[280px] shadow-xl border",
        isMe ? "bg-white/10 border-white/10" : "bg-slate-50 border-slate-200"
      )}>
        <button 
          onClick={togglePlay}
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-2xl",
            isMe ? "bg-white text-slate-900" : "bg-primary text-white"
          )}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <div className="flex-1 space-y-3">
          <div className="h-2 bg-slate-200/20 rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-100", isMe ? "bg-primary" : "bg-primary")} 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-60">
            <span>{formatDuration(audioRef.current?.currentTime || 0)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>
        <audio 
          ref={audioRef} 
          src={url} 
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
          onTimeUpdate={() => setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      </div>
    );
  };

  return (
    <MainLayout hideFooter hideAI>
      <div className="h-[calc(100vh-4.5rem)] flex bg-white relative overflow-hidden">
        
        {/* Institutional Trade Sync Sidebar */}
        <div className={cn(
          "w-full md:w-[450px] border-r border-slate-200 bg-white flex flex-col relative z-20 transition-all",
          selectedConv ? "hidden md:flex" : "flex"
        )}>
          <div className="p-12 border-b border-slate-100">
             <div className="flex items-center justify-between mb-10">
                <div className="space-y-2">
                   <h2 className="text-3xl font-bold text-slate-900 tracking-tighter">Trade Communications</h2>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none">Operational Sync Active</p>
                   </div>
                </div>
                <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all border border-slate-100 shadow-xl">
                   <MoreHorizontal className="w-6 h-6" />
                </button>
             </div>
             <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-all duration-500" />
                <input 
                  type="text" 
                  placeholder="Audit trade nodes..." 
                  className="w-full h-16 pl-16 pr-6 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold focus:ring-[12px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-inner"
                />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={cn(
                  "w-full p-10 text-left transition-all relative group/item", 
                  selectedConv?.id === conv.id 
                    ? "bg-slate-50 border-l-[6px] border-primary" 
                    : "hover:bg-slate-50/50 border-l-[6px] border-transparent"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-6">
                     <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-2xl transition-all group-hover/item:scale-110",
                        selectedConv?.id === conv.id ? "bg-slate-900 text-primary" : "bg-white border border-slate-200 text-slate-300"
                     )}>
                        {conv.participantName.charAt(0)}
                     </div>
                     <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-3">
                           <span className="font-bold text-slate-900 text-xl block truncate tracking-tighter">{conv.participantName}</span>
                           {conv.isVerified && <ShieldCheck className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{conv.participantRole || 'Trade Partner'}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                     <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">{conv.lastTime || 'Live'}</span>
                     {conv.unread > 0 && (
                       <span className="w-6 h-6 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 border-2 border-white">
                         {conv.unread}
                       </span>
                     )}
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-22 opacity-60">
                   <p className="text-sm text-slate-500 font-medium truncate italic">"{conv.lastMessage}"</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-10 border-t border-slate-100 bg-slate-50/50">
             <div className="flex items-center gap-5 text-slate-400">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed">
                   Direct authorization protocol for institutional trade verification hubs.
                </p>
             </div>
          </div>
        </div>

        {/* Dynamic Trade Manifest Console */}
        <div className={cn(
          "flex-1 flex flex-col relative z-10 bg-slate-50/30 transition-all",
          !selectedConv ? "hidden md:flex" : "flex"
        )}>
          {selectedConv ? (
            <>
              {/* Institutional Channel Header */}
              <div className="px-12 py-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-2xl shadow-slate-900/5">
                <div className="flex items-center gap-8">
                   <button onClick={() => setSelectedConv(null)} className="md:hidden w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all border border-slate-200 shadow-xl">
                      <ArrowLeft className="w-6 h-6" />
                   </button>
                   <div className="relative group cursor-pointer">
                      <div className="w-18 h-18 bg-slate-900 rounded-2xl flex items-center justify-center font-bold text-white text-2xl shadow-2xl group-hover:scale-110 transition-all duration-700">
                        {selectedConv.participantName.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-2xl animate-pulse" />
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-4">
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{selectedConv.participantName}</h3>
                        {selectedConv.isVerified && (
                           <div className="flex items-center gap-2.5 px-3 py-1 rounded-xl bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-[0.3em] shadow-xl shadow-primary/5">
                              <UserCheck className="w-4 h-4" />
                              Verified Node
                           </div>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Hash className="w-4 h-4 text-primary" />
                            CHANNEL ID: {selectedConv.participantId.toString().toUpperCase().slice(-8)}
                         </p>
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            REGIONAL SYNC: Lagos Hub
                         </p>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-6">
                   <div className="hidden lg:flex flex-col items-end space-y-2 mr-6">
                      <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.4em]">Hub Authorization Status</p>
                      <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,166,81,0.5)]" />
                         <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.3em]">Operational Node Synchronized</span>
                      </div>
                   </div>
                   <button className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all shadow-2xl active:scale-90">
                      <MoreHorizontal className="w-8 h-8" />
                   </button>
                </div>
              </div>

              {/* End-to-End Encrypted Communication Flow */}
              <div className="flex-1 overflow-y-auto p-12 space-y-16 scrollbar-hide pb-40" ref={scrollRef}>
                {messages.map((msg, idx) => {
                  const isMe = msg.sender_id === user.id;
                  return (
                    <div 
                      key={msg.id} 
                      className={cn("flex flex-col animate-fade-up", isMe ? "items-end" : "items-start")}
                    >
                      <div className={cn("text-[9px] font-bold uppercase tracking-[0.3em] mb-4 px-2", isMe ? "text-slate-400" : "text-primary")}>
                         {isMe ? 'Authorization Node' : 'Hub Principal'}
                      </div>
                      <div className={cn("max-w-[80%] lg:max-w-[60%] space-y-3")}>
                         <div className={cn(
                          "px-8 py-7 rounded-[2rem] shadow-2xl relative transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border", 
                          isMe 
                            ? "bg-slate-900 text-white border-slate-800 rounded-tr-none" 
                            : "bg-white text-slate-900 border-slate-100 rounded-tl-none"
                        )}>
                          {msg.media_url && (
                            <div className="mb-6 overflow-hidden rounded-2xl border border-white/5 shadow-inner bg-slate-50 group/media relative">
                               <div className="absolute inset-0 bg-primary/10 opacity-0 group/media:hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                              {msg.media_type === 'image' && (
                                <img 
                                  src={getMediaUrl(msg.media_url)} 
                                  alt="Trade Asset Documentation" 
                                  className="max-w-full h-auto object-cover cursor-zoom-in hover:scale-110 transition-transform duration-[2000ms] grayscale group/media:hover:grayscale-0"
                                  onClick={() => window.open(getMediaUrl(msg.media_url), '_blank')}
                                />
                              )}
                              {msg.media_type === 'video' && (
                                <div className="aspect-video relative group/vid">
                                   <video controls className="w-full h-full">
                                     <source src={getMediaUrl(msg.media_url)} />
                                   </video>
                                </div>
                              )}
                               {msg.media_type === 'audio' && (
                                <VoiceMessage url={getMediaUrl(msg.media_url)} isMe={isMe} />
                               )}
                            </div>
                          )}
                          {msg.content && <p className="text-lg font-medium leading-relaxed tracking-tight opacity-90">{msg.content}</p>}
                           <div className={cn(
                             "text-[9px] font-bold mt-6 flex items-center justify-end gap-3 uppercase tracking-[0.3em]", 
                             isMe ? "text-white/30" : "text-slate-300"
                           )}>
                            {formatTime(msg.timestamp)}
                            {isMe && <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> <span className="text-primary">SYNCED</span></div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Secure Command Input Terminal */}
              <div className="p-12 bg-white border-t border-slate-100 shadow-[0_-30px_100px_-20px_rgba(0,0,0,0.05)] relative z-40">
                <div className="max-w-6xl mx-auto relative">
                  
                  {/* Technical Asset Manifest Preview */}
                  {mediaPreview && (
                    <div className="absolute bottom-full left-0 mb-10 animate-fade-up">
                      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-[0_50px_150px_-30px_rgba(0,0,0,0.3)] flex items-center gap-8 group/prev overflow-hidden relative">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/prev:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                        <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-2xl border border-slate-100 relative z-10">
                           {mediaFile?.type.startsWith('image/') ? (
                             <img src={mediaPreview} className="w-full h-full object-cover transition-transform group-hover/prev:scale-110 duration-1000" />
                           ) : (
                             <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                               <Film className="w-12 h-12 text-slate-100" />
                             </div>
                           )}
                        </div>
                        <div className="space-y-6 relative z-10">
                           <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                 <FileText className="w-5 h-5 text-primary" />
                                 <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.4em]">Asset Manifest Ready</p>
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] pl-8">{mediaFile?.name} ({(mediaFile?.size / 1024 / 1024).toFixed(2)} MB)</p>
                           </div>
                           <button 
                             onClick={() => {setMediaFile(null); setMediaPreview(null);}}
                             className="h-12 px-8 rounded-xl bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95 border border-red-100"
                           >
                             Purge Asset Manifest
                           </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attachment Protocol Framework */}
                  {showAttachMenu && !mediaPreview && (
                    <div className="absolute bottom-full left-0 mb-10 animate-fade-up">
                       <div className="bg-slate-900 p-4 rounded-[2.5rem] border border-slate-800 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.5)] flex flex-col gap-3 min-w-[280px]">
                          {[
                            { id: 'image', icon: ImageIcon, label: 'Asset Manifest (IMG)', accept: 'image/*' },
                            { id: 'video', icon: Film, label: 'Logistics Documentation (VID)', accept: 'video/*' },
                            { id: 'doc', icon: Paperclip, label: 'Trade Contract (PDF)', accept: '.pdf,.doc,.docx' },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveMediaType(item.id);
                                fileInputRef.current.accept = item.accept;
                                fileInputRef.current.click();
                                setShowAttachMenu(false);
                              }}
                              className="flex items-center justify-between px-8 py-6 hover:bg-white/5 rounded-2xl transition-all text-[11px] font-bold text-slate-400 hover:text-white group/opt"
                            >
                                <div className="flex items-center gap-6">
                                   <item.icon className="w-6 h-6 text-primary group-hover/opt:scale-125 transition-all duration-500" />
                                   <span className="uppercase tracking-[0.3em]">{item.label}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 opacity-0 group-hover/opt:opacity-100 transition-all translate-x-4 group-hover/opt:translate-x-0" />
                            </button>
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-4 flex items-center gap-6 focus-within:bg-white focus-within:border-primary/40 focus-within:ring-[16px] focus-within:ring-primary/5 transition-all shadow-inner">
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileSelect}
                    />
                    
                    <button 
                      className={cn(
                        "w-18 h-18 rounded-2xl flex items-center justify-center transition-all shadow-2xl active:scale-95 group/attach",
                        showAttachMenu ? "bg-primary text-white" : "bg-white border border-slate-100 text-slate-300 hover:text-primary hover:border-primary/20"
                      )}
                      onClick={() => setShowAttachMenu(!showAttachMenu)}
                    >
                      <Paperclip className="w-7 h-7 group-hover/attach:rotate-12 transition-transform" />
                    </button>
                    
                    <div className="flex-1 flex items-center min-w-0">
                      {isRecording ? (
                        <div className="flex-1 flex items-center justify-between px-10 bg-slate-900 text-white rounded-2xl h-18 animate-pulse shadow-2xl">
                          <div className="flex items-center gap-6">
                             <div className="w-4 h-4 bg-primary rounded-full animate-ping" />
                             <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Voice Modulation Terminal Active: {recordingTime}s</span>
                          </div>
                          <div className="flex items-center gap-3 h-full py-4">
                             {[...Array(8)].map((_, i) => (
                                <div key={i} className="w-1.5 bg-primary/40 rounded-full" style={{ height: `${20 + Math.random() * 80}%` }} />
                             ))}
                          </div>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                          placeholder="Synchronize command with trade node..."
                          className="w-full h-18 bg-transparent border-none focus:ring-0 text-xl font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-medium transition-all px-6"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-5">
                       <button 
                         className={cn(
                           "w-18 h-18 rounded-2xl flex items-center justify-center transition-all shadow-2xl active:scale-95 group/mic",
                           isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white border border-slate-100 text-slate-300 hover:text-primary hover:border-primary/20"
                         )}
                         onClick={isRecording ? stopRecording : startRecording}
                       >
                         {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7 group-hover/mic:scale-110 transition-transform" />}
                       </button>
                       
                       <button 
                         onClick={handleSend} 
                         disabled={!message.trim() && !mediaFile}
                         className="h-18 px-12 rounded-2xl bg-primary text-white font-bold text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(0,166,81,0.4)] disabled:opacity-20 disabled:shadow-none hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-5 group/send"
                       >
                         Sync Communication
                         <Send className="w-5 h-5 group-hover/send:translate-x-2 group-hover/send:-translate-y-2 transition-all duration-500" />
                       </button>
                     </div>
                   </div>
                   
                   <div className="mt-8 flex items-center justify-center gap-12 opacity-20">
                      <div className="flex items-center gap-3">
                         <Terminal className="w-4 h-4" />
                         <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Protocol: Encrypted Node Transfer</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <RefreshCw className="w-4 h-4" />
                         <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Synchronization: Authorized Live Hub</span>
                      </div>
                   </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-32 text-center bg-slate-50/50 relative overflow-hidden">
               <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden flex items-center justify-center">
                  <MessageSquare className="w-[1000px] h-[1000px] text-slate-900 rotate-12" />
               </div>
               
               <div className="relative z-10 space-y-16 max-w-xl">
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-slate-100 mx-auto transform -rotate-12 transition-transform hover:rotate-0 duration-1000 group/empty">
                     <Terminal className="w-14 h-14 text-slate-100 group-hover/empty:text-primary transition-colors" />
                  </div>
                  <div className="space-y-6">
                     <h3 className="text-4xl font-bold text-slate-900 tracking-tighter">Institutional Trade Manifest Hub</h3>
                     <p className="text-xl text-slate-500 font-medium leading-relaxed opacity-80">
                        Authorize trade negotiations, verify asset manifests, and finalize procurement parameters through secure direct-node communication terminals.
                     </p>
                  </div>
                  <div className="pt-12 grid grid-cols-2 gap-8">
                     <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-2xl space-y-4 group/box transition-all hover:translate-y-2">
                        <ShieldCheck className="w-8 h-8 text-primary mx-auto group-hover/box:scale-125 transition-transform" />
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em]">End-to-End Encrypted</p>
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Authorized AES-256</p>
                        </div>
                     </div>
                     <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-2xl space-y-4 group/box transition-all hover:translate-y-2">
                        <UserCheck className="w-8 h-8 text-primary mx-auto group-hover/box:scale-125 transition-transform" />
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em]">Verified Participants</p>
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Identity Node Audited</p>
                        </div>
                     </div>
                  </div>
                  <div className="pt-20 flex items-center justify-center gap-10 opacity-10">
                     <Smartphone className="w-8 h-8 text-slate-900" />
                     <Monitor className="w-8 h-8 text-slate-900" />
                     <Landmark className="w-8 h-8 text-slate-900" />
                     <LayoutGrid className="w-8 h-8 text-slate-900" />
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
