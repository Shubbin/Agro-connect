import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Search, MoreHorizontal, Paperclip, Smile, ShieldCheck, User, Store } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { chatAPI, uploadAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Mic, MicOff, X, Image as ImageIcon, Film, Play, Pause } from 'lucide-react';

export const ChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

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

    const getMediaUrl = (path) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace('/api', '');
      return `${baseUrl}${path}`;
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
        mediaType = uploadRes.type;
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
      mediaType
    };

    try {
      // Clear inputs immediately for better UX
      const currentMessage = message;
      setMessage('');
      setMediaFile(null);
      setMediaPreview(null);

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
      <MainLayout hideFooter>
        <div className="h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideFooter>
      <div className="h-[calc(100vh-4.5rem)] flex bg-background relative overflow-hidden">
        {/* Ambient background effect */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Conversations Sidebar Architecture */}
        <div className={cn(
          "w-full md:w-96 border-r border-border/50 bg-background/50 backdrop-blur-xl flex flex-col relative z-20 transition-all",
          selectedConv ? "hidden md:flex" : "flex"
        )}>
          <div className="p-8 border-b border-border/30">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase">Channels</h2>
                <div className="w-10 h-10 glass-premium rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary transition-all cursor-pointer">
                   <MoreHorizontal className="w-5 h-5" />
                </div>
             </div>
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search communications..." 
                  className="w-full h-12 pl-11 pr-4 glass-premium bg-secondary/50 border-border/30 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 p-4 scrollbar-hide">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={cn(
                  "w-full p-6 text-left rounded-[2.5rem] transition-all duration-500 relative group", 
                  selectedConv?.id === conv.id 
                    ? "glass-premium bg-white border-primary/20 shadow-xl shadow-primary/5 border" 
                    : "hover:bg-primary/[0.02] border border-transparent"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                     <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm transition-transform group-hover:scale-105",
                        selectedConv?.id === conv.id ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                     )}>
                        {conv.participantName.charAt(0)}
                     </div>
                     <div>
                        <span className="font-black text-foreground tracking-tight block">{conv.participantName}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">{conv.participantRole}</span>
                        </div>
                     </div>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-6 h-6 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-background">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium truncate pl-[3.75rem]">{conv.lastMessage}</p>
                
                {selectedConv?.id === conv.id && (
                   <div className="absolute right-6 top-1/2 -translate-y-1/2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                   </div>
                )}
              </button>
            ))}
            {conversations.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm font-medium">No active channels.</p>
              </div>
            )}
          </div>
        </div>

        {/* Transmission Interface */}
        <div className={cn(
          "flex-1 flex flex-col relative z-10 bg-white/30 backdrop-blur-sm transition-all",
          !selectedConv ? "hidden md:flex" : "flex"
        )}>
          {selectedConv ? (
            <>
              {/* Interface Header */}
              <div className="p-6 md:p-8 border-b border-border/30 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <button onClick={() => setSelectedConv(null)} className="md:hidden w-12 h-12 glass-premium rounded-2xl flex items-center justify-center text-muted-foreground active:scale-90 transition-transform">
                      <ArrowLeft className="w-6 h-6" />
                   </button>
                   <div className="relative">
                      <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xl shadow-primary/20">
                        {selectedConv.participantName.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" title="Online Status" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase">{selectedConv.participantName}</h3>
                        {selectedConv.isVerified && <ShieldCheck className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Store className="w-3 h-3 text-primary" />
                            Direct Producer Interface
                         </span>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/30 rounded-full border border-border/50">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Real-time Sync Active</span>
                   </div>
                   <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl border border-border/30 hover:bg-white transition-all">
                      <MoreHorizontal className="w-6 h-6" />
                   </Button>
                </div>
              </div>

              {/* Data Payload Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-10 scrollbar-hide pb-24" ref={scrollRef}>
                {messages.map((msg, idx) => {
                  const isMe = msg.sender_id === user.id;
                  return (
                    <div 
                      key={msg.id} 
                      className={cn("flex flex-col animate-fade-in-up", isMe ? "items-end text-right" : "items-start text-left")}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className={cn("flex items-end gap-4 max-w-[80%] lg:max-w-[60%] group", isMe ? "flex-row-reverse" : "flex-row")}>
                        {!isMe && (
                           <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mb-1">
                              <User className="w-4 h-4 text-muted-foreground" />
                           </div>
                        )}
                        <div className={cn(
                          "px-4 md:px-6 py-3 md:py-4 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl transition-all duration-500", 
                          isMe 
                            ? "bg-primary text-white rounded-br-none shadow-primary/10 hover:shadow-primary/20" 
                            : "bg-white text-foreground border border-border/50 rounded-bl-none shadow-black/5 hover:border-primary/20"
                        )}>
                          {msg.media_url && (
                            <div className="mb-3 overflow-hidden rounded-xl">
                              {msg.media_type === 'image' && (
                                <img 
                                  src={getMediaUrl(msg.media_url)} 
                                  alt="Shared" 
                                  className="max-w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                  onClick={() => window.open(getMediaUrl(msg.media_url), '_blank')}
                                />
                              )}
                              {msg.media_type === 'video' && (
                                <video controls className="max-w-full rounded-xl">
                                  <source src={getMediaUrl(msg.media_url)} />
                                </video>
                              )}
                              {msg.media_type === 'audio' && (
                                <audio controls className="w-full max-w-[240px]">
                                  <source src={getMediaUrl(msg.media_url)} />
                                </audio>
                              )}
                            </div>
                          )}
                          {msg.content && <p className="text-base font-medium leading-relaxed">{msg.content}</p>}
                          <div className={cn(
                            "text-[9px] font-black uppercase tracking-widest mt-2 block", 
                            isMe ? "text-white/60" : "text-muted-foreground"
                          )}>
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Terminal Input Protocol */}
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background via-background/95 to-transparent">
                <div className="max-w-4xl mx-auto relative group">
                  <div className="absolute inset-x-0 bottom-0 h-2 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  {/* Media Preview Area */}
                  {mediaPreview && (
                    <div className="absolute bottom-full left-0 mb-4 animate-fade-in-up">
                      <div className="glass-premium bg-white/90 p-4 rounded-3xl border border-primary/20 relative group shadow-2xl">
                        <button 
                          onClick={() => {setMediaFile(null); setMediaPreview(null);}}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-20"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="w-32 h-32 rounded-2xl overflow-hidden relative">
                           {mediaFile?.type.startsWith('image/') ? (
                             <img src={mediaPreview} className="w-full h-full object-cover" />
                           ) : mediaFile?.type.startsWith('video/') ? (
                             <div className="w-full h-full bg-black flex items-center justify-center">
                               <Film className="w-8 h-8 text-white/50" />
                             </div>
                           ) : (
                             <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                               <Mic className="w-8 h-8 text-primary" />
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="glass-premium bg-white/80 border-primary/20 rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-4 flex items-center gap-2 md:gap-4 shadow-2xl shadow-primary/10 relative z-10">
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileSelect}
                      accept="image/*,video/*,audio/*"
                    />
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-12 h-12 rounded-2xl text-muted-foreground hover:text-primary transition-all shrink-0"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <Paperclip className="w-6 h-6" />
                    </Button>

                    {isRecording ? (
                      <div className="flex-1 flex items-center gap-4 px-4 bg-red-50 text-red-500 rounded-2xl h-12 animate-pulse">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-xs font-black uppercase tracking-widest">Recording: {recordingTime}s</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 h-10 md:h-12 bg-transparent border-none focus:ring-0 text-sm md:text-base font-medium placeholder:text-muted-foreground/50 placeholder:italic transition-all"
                      />
                    )}

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          "w-12 h-12 rounded-2xl transition-all shrink-0",
                          isRecording ? "bg-red-500 text-white hover:bg-red-600 scale-110 shadow-lg shadow-red-200" : "text-muted-foreground hover:text-primary"
                        )}
                        onClick={isRecording ? stopRecording : startRecording}
                      >
                        {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </Button>
                      
                      <Button 
                        onClick={handleSend} 
                        disabled={!message.trim() && !mediaFile}
                        className="w-14 h-14 rounded-2xl btn-premium shadow-lg shadow-primary/20 group-active:scale-95 transition-all shrink-0"
                      >
                        <Send className="w-6 h-6 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
               <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-8">
                  <Store className="w-12 h-12 text-primary" />
               </div>
               <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase mb-4">Secure Communication Node</h3>
               <p className="text-xl text-muted-foreground font-medium max-w-md mx-auto">
                 Select a transmission channel from the sidebar to begin direct negotiation with producers.
               </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
