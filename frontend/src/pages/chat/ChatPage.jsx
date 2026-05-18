import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Search, MoreHorizontal, Paperclip, Smile, ShieldCheck, User, Mic, MicOff, X, Image as ImageIcon, Film, Play, Pause, ChevronRight, MessageSquare, Info, UserCheck, RefreshCw, FileText, Check, ShoppingCart, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { chatAPI, uploadAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export const ChatPage = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const farmerId = searchParams.get('farmerId');
  const farmerName = searchParams.get('farmerName');
  const productId = searchParams.get('productId');
  const productName = searchParams.get('productName');
  const productPrice = searchParams.get('productPrice');
  const productImage = searchParams.get('productImage');
  const productUnit = searchParams.get('productUnit');

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
        let updatedList = [...data];
        
        // If farmerId is passed in URL query, check if conversation already exists
        if (farmerId) {
          const exists = data.some(c => c.participantId === farmerId);
          if (!exists) {
            // Synthesize a new placeholder conversation for the farmer
            const tempConv = {
              id: `${user.id}_${farmerId}`,
              participantId: farmerId,
              participantName: decodeURIComponent(farmerName || 'Farmer'),
              participantRole: 'farmer',
              isVerified: true,
              lastMessage: 'Start a conversation...',
              unread: 0,
              timestamp: new Date().toISOString()
            };
            updatedList.unshift(tempConv);
          }
        }

        setConversations(updatedList);

        // Auto-select the conversation matching farmerId, or default to first conversation
        if (farmerId && !selectedConv) {
          const match = updatedList.find(c => c.participantId === farmerId);
          if (match) setSelectedConv(match);
        } else if (updatedList.length > 0 && !selectedConv) {
          setSelectedConv(updatedList[0]);
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
  }, [user, selectedConv, farmerId, farmerName]);

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

  const renderTicks = (msg) => {
    if (msg.id.startsWith('temp-') || !msg.id.includes('-')) {
      return <Check className="w-3.5 h-3.5 text-white/50" />;
    }
    if (msg.is_read) {
      return (
        <div className="flex -space-x-1.5 items-center">
          <Check className="w-3.5 h-3.5 text-emerald-300 font-bold" />
          <Check className="w-3.5 h-3.5 text-emerald-300 font-bold" />
        </div>
      );
    }
    return (
      <div className="flex -space-x-1.5 items-center">
        <Check className="w-3.5 h-3.5 text-white/70" />
        <Check className="w-3.5 h-3.5 text-white/70" />
      </div>
    );
  };

  const groupMessagesByDate = (msgList) => {
    const groups = {};
    msgList.forEach(msg => {
      if (!msg.timestamp) return;
      const date = new Date(msg.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <MainLayout hideFooter hideAI>
        <div className="h-screen flex items-center justify-center bg-gray-50">
           <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
              <div className="text-center space-y-1">
                 <p className="text-sm font-semibold text-gray-500">Loading Chats...</p>
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
    const barsCount = 22;
    const [barHeights] = useState(() => Array.from({ length: barsCount }, () => Math.floor(Math.random() * 20) + 6));

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
        "flex items-center gap-3.5 p-3.5 rounded-2xl min-w-[280px] border shadow-sm relative overflow-hidden backdrop-blur-sm",
        isMe ? "bg-white/10 border-white/10 text-white" : "bg-white border-slate-100 text-gray-800"
      )}>
        <button 
          onClick={togglePlay}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md shrink-0",
            isMe ? "bg-white text-primary" : "bg-primary text-white"
          )}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-end gap-0.5 h-6 px-0.5">
            {barHeights.map((h, i) => {
              const isActive = progress > (i / barsCount) * 100;
              return (
                <div 
                  key={i} 
                  style={{ height: `${h}px` }} 
                  className={cn(
                    "w-[3px] rounded-full transition-all duration-300",
                    isActive 
                      ? (isMe ? "bg-white" : "bg-primary") 
                      : (isMe ? "bg-white/35" : "bg-slate-200"),
                    isPlaying && isActive && "animate-pulse"
                  )}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-[9px] font-bold opacity-80 font-mono tracking-wider">
            <span>{formatDuration(audioRef.current?.currentTime || 0)}</span>
            <span>{formatDuration(duration || 12)}</span>
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
        
        {/* Chats Sidebar */}
        <div className={cn(
          "w-full md:w-96 border-r border-gray-200 bg-white flex flex-col relative z-20 transition-all",
          selectedConv ? "hidden md:flex" : "flex"
        )}>
          <div className="p-6 border-b border-gray-100 space-y-4">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Messages</h2>
                </div>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors border border-gray-100">
                   <MoreHorizontal className="w-5 h-5" />
                </button>
             </div>
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white outline-none transition-all placeholder:text-gray-400 shadow-inner"
                />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 scrollbar-hide">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={cn(
                  "w-full p-5 text-left transition-all relative group flex items-start gap-4", 
                  selectedConv?.id === conv.id 
                    ? "bg-gray-50 border-l-4 border-primary" 
                    : "hover:bg-gray-50/50 border-l-4 border-transparent"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0",
                  selectedConv?.id === conv.id ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"
                )}>
                  {conv.participantName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                     <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-gray-900 block truncate">{conv.participantName}</span>
                        {conv.isVerified && <ShieldCheck className="w-4 h-4 text-primary shrink-0" />}
                     </div>
                     <span className="text-[10px] font-semibold text-gray-400 shrink-0">{conv.lastTime || 'Live'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-sm text-gray-500 truncate">{conv.lastMessage || 'Sent a message'}</p>
                     {conv.unread > 0 && (
                       <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                         {conv.unread}
                       </span>
                     )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Conversation Pane */}
        <div className={cn(
          "flex-1 flex flex-col relative z-10 bg-gray-50/50 transition-all",
          !selectedConv ? "hidden md:flex" : "flex"
        )}>
          {selectedConv ? (
            <>
              {/* Active Chat Header */}
              <div className="px-6 py-4 bg-white/95 border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-4">
                   <button onClick={() => setSelectedConv(null)} className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all border border-gray-200">
                      <ArrowLeft className="w-5 h-5" />
                   </button>
                   <div className="relative cursor-pointer">
                      <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-lg">
                        {selectedConv.participantName.charAt(0)}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
                   </div>
                   <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{selectedConv.participantName}</h3>
                        {selectedConv.isVerified && (
                           <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-[9px] font-bold text-primary uppercase tracking-wider">
                              <UserCheck className="w-3 h-3" /> Verified
                           </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 capitalize">{selectedConv.participantRole || 'Farmer'}</p>
                   </div>
                </div>
                
                <button className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                   <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Glassmorphic Product Context Banner */}
              {productName && selectedConv && selectedConv.participantId === farmerId && (
                <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-800/10 via-primary/5 to-slate-900/[0.02] border border-primary/10 backdrop-blur-md shadow-sm flex items-center justify-between gap-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                  <div className="flex items-center gap-3 relative z-10">
                    {productImage ? (
                      <img 
                        src={decodeURIComponent(productImage)} 
                        alt={productName} 
                        className="w-12 h-12 rounded-xl object-cover border border-primary/10 bg-white shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                    )}
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Product Inquiry</p>
                      <h4 className="font-bold text-gray-950 text-sm leading-tight">{decodeURIComponent(productName)}</h4>
                      <p className="text-xs font-semibold text-slate-500">
                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(productPrice || 0)} / {decodeURIComponent(productUnit || 'kg')}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      if (isAddingToCart) return;
                      setIsAddingToCart(true);
                      try {
                        await addItem(productId, 1);
                        toast({
                          title: 'Added to Cart',
                          description: `${decodeURIComponent(productName)} has been added to your shopping cart.`,
                        });
                      } catch (error) {
                        toast({
                          title: 'Error',
                          description: 'Failed to add item to cart.',
                          variant: 'destructive',
                        });
                      } finally {
                        setIsAddingToCart(false);
                      }
                    }}
                    disabled={isAddingToCart}
                    className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1.5 shrink-0 relative z-10 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {isAddingToCart ? 'Adding...' : 'Quick Buy'}
                  </button>
                </div>
              )}

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-24 relative" ref={scrollRef}>
                {/* Organic Leafy Radial Grid Pattern Background */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.035]" 
                  style={{ 
                    backgroundImage: `radial-gradient(#15803d 0.8px, transparent 0.8px), radial-gradient(#15803d 0.8px, transparent 0.8px)`,
                    backgroundSize: '24px 24px',
                    backgroundPosition: '0 0, 12px 12px',
                    zIndex: 0
                  }} 
                />

                {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
                  <React.Fragment key={date}>
                    {/* Date Divider Bubble */}
                    <div className="flex justify-center my-6 relative z-10">
                      <span className="bg-slate-250/85 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 shadow-sm border border-slate-300/30 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {date}
                      </span>
                    </div>

                    {msgs.map((msg) => {
                      const isMe = msg.sender_id === user.id;
                      return (
                        <div 
                          key={msg.id} 
                          className={cn("flex flex-col relative z-10", isMe ? "items-end" : "items-start")}
                        >
                          <div className="max-w-[75%] lg:max-w-[60%] space-y-1">
                             <div className={cn(
                               "px-5 py-3.5 rounded-2xl shadow-sm border", 
                               isMe 
                                 ? "bg-primary text-white border-primary rounded-tr-none" 
                                 : "bg-white text-gray-800 border-slate-100 rounded-tl-none"
                             )}>
                              {msg.media_url && (
                                <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 relative">
                                  {msg.media_type === 'image' && (
                                    <img 
                                      src={getMediaUrl(msg.media_url)} 
                                      alt="Documentation" 
                                      className="max-w-full h-auto object-cover cursor-zoom-in hover:scale-105 transition-transform duration-500"
                                      onClick={() => window.open(getMediaUrl(msg.media_url), '_blank')}
                                    />
                                  )}
                                  {msg.media_type === 'video' && (
                                    <div className="aspect-video relative">
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
                              {msg.content && <p className="text-base leading-relaxed">{msg.content}</p>}
                               <div className={cn(
                                 "text-[9px] font-semibold mt-3 flex items-center justify-end gap-1.5 uppercase tracking-wider", 
                                 isMe ? "text-white/70" : "text-gray-400"
                               )}>
                                {formatTime(msg.timestamp)}
                                {isMe && renderTicks(msg)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 bg-white border-t border-gray-100 shadow-sm relative z-40">
                <div className="max-w-4xl mx-auto relative">
                  
                  {/* Media Upload Preview */}
                  {mediaPreview && (
                    <div className="absolute bottom-full left-0 mb-4">
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-lg flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                           {mediaFile?.type.startsWith('image/') ? (
                             <img src={mediaPreview} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                               <Film className="w-8 h-8 text-gray-300" />
                             </div>
                           )}
                        </div>
                        <div className="space-y-2">
                           <p className="text-xs font-semibold text-gray-800 truncate max-w-[150px]">{mediaFile?.name}</p>
                           <button 
                             onClick={() => {setMediaFile(null); setMediaPreview(null);}}
                             className="px-3 py-1 rounded bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
                           >
                             Remove
                           </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attach Menu */}
                  {showAttachMenu && !mediaPreview && (
                    <div className="absolute bottom-full left-0 mb-4">
                       <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xl flex flex-col gap-1 min-w-[200px]">
                          {[
                            { id: 'image', icon: ImageIcon, label: 'Image', accept: 'image/*' },
                            { id: 'video', icon: Film, label: 'Video', accept: 'video/*' },
                            { id: 'doc', icon: Paperclip, label: 'Document', accept: '.pdf,.doc,.docx' },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveMediaType(item.id);
                                fileInputRef.current.accept = item.accept;
                                fileInputRef.current.click();
                                setShowAttachMenu(false);
                              }}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-xl transition-all text-xs font-semibold text-gray-600 hover:text-gray-900 text-left"
                            >
                                <item.icon className="w-5 h-5 text-primary" />
                                <span>{item.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-2.5 flex items-center gap-3 shadow-inner">
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileSelect}
                    />
                    
                    <button 
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-sm",
                        showAttachMenu ? "bg-primary text-white" : "bg-white border border-gray-100 text-gray-400 hover:text-primary"
                      )}
                      onClick={() => setShowAttachMenu(!showAttachMenu)}
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      {isRecording ? (
                        <div className="flex-1 flex items-center justify-between px-4 bg-gray-900 text-white rounded-xl h-12 animate-pulse shadow-md">
                           <div className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
                              <span className="text-xs font-bold text-primary">Recording Voice Note: {recordingTime}s</span>
                           </div>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                          placeholder="Type a message..."
                          className="w-full h-12 bg-transparent border-none focus:ring-0 text-base font-medium text-gray-800 placeholder:text-gray-400 outline-none px-3"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                       <button 
                         className={cn(
                           "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm",
                           isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white border border-gray-100 text-gray-400 hover:text-primary"
                         )}
                         onClick={isRecording ? stopRecording : startRecording}
                       >
                         {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                       </button>
                       
                       <button 
                         onClick={handleSend} 
                         disabled={!message.trim() && !mediaFile}
                         className="h-12 px-6 rounded-xl bg-primary text-white font-semibold text-sm shadow-sm disabled:opacity-30 disabled:shadow-none hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
                       >
                         <span>Send</span>
                         <Send className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
               <div className="space-y-6 max-w-md">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-100 mx-auto">
                     <MessageSquare className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-bold text-gray-900">Your Chatbox</h3>
                     <p className="text-gray-500">
                        Chat directly with verified farmers and buyers on AgroDirect. Discuss prices, shipping, and verify product documentation securely.
                     </p>
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
