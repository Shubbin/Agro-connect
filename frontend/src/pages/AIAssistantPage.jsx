import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, ArrowLeft, RefreshCw, Zap, ShieldCheck, Plus, MessageSquare, Trash2, Menu, X as CloseIcon, ChevronRight, Terminal, Info, BarChart3, Database, Globe, Landmark, Box, Activity } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { aiAPI } from '@/services/api';
import { Link } from 'react-router-dom';

const AIAssistantPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef(null);

  // Load database sessions on mount or login
  useEffect(() => {
    if (user) {
      const loadSessions = async () => {
        try {
          const fetchedSessions = await aiAPI.getSessions().catch(() => []);
          setSessions(fetchedSessions.map(s => ({
            id: s.id,
            title: s.title,
            timestamp: s.created_at || s.updated_at,
            messages: []
          })));
        } catch (err) {
          console.error('Failed to load AI sessions:', err);
        }
      };
      loadSessions();
    } else {
      setSessions([]);
      setActiveSessionId(null);
    }
  }, [user]);

  // Load message history on activeSessionId change
  useEffect(() => {
    if (!activeSessionId || activeSessionId === 'new') return;
    
    const loadHistory = async () => {
      try {
        const history = await aiAPI.getHistory(activeSessionId).catch(() => []);
        setSessions(prev => prev.map(s => 
          s.id === activeSessionId 
            ? { ...s, messages: history }
            : s
        ));
      } catch (err) {
        console.error('Failed to load session history:', err);
      }
    };
    loadHistory();
  }, [activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;
  const messages = activeSession ? activeSession.messages : [
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am Ago, your warm agricultural expert and AI guide. Ask me about crop pricing dynamics, regional bargains, bulk logistics, or dashboard insights! How can I help you today?",
      timestamp: new Date().toISOString()
    }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeSessionId]);

  const startNewChat = () => {
    setActiveSessionId('new');
    setShowHistory(false);
  };

  const deleteSession = async (e, id) => {
    e.stopPropagation();
    // We filter locally first, sessions are managed by database lifecycle
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) setActiveSessionId(null);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = 'new';
    }

    // Instantly append user message for seamless performance
    setSessions(prev => {
      const match = prev.find(s => s.id === currentSessionId);
      if (match) {
        return prev.map(s => s.id === currentSessionId ? { ...s, messages: [...s.messages, userMessage] } : s);
      } else {
        return [{ id: 'new', title: input.substring(0, 30) + '...', timestamp: new Date().toISOString(), messages: [userMessage] }, ...prev];
      }
    });

    setInput('');
    setIsLoading(true);

    try {
      const response = await aiAPI.chat(input, currentSessionId === 'new' ? null : currentSessionId);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };

      const serverSessionId = response.sessionId;

      // Sync activeSessionId and session data
      setSessions(prev => {
        const withBot = prev.map(s => 
          s.id === currentSessionId 
            ? { ...s, id: serverSessionId, messages: [...s.messages, botMessage] }
            : s
        );
        return withBot;
      });

      setActiveSessionId(serverSessionId);

      // Trigger asynchronous background session refresh to synchronize server titles
      aiAPI.getSessions().then(fetched => {
        setSessions(prev => fetched.map(s => {
          const prevMatch = prev.find(x => x.id === s.id);
          return {
            id: s.id,
            title: s.title,
            timestamp: s.created_at || s.updated_at,
            messages: prevMatch ? prevMatch.messages : []
          };
        }));
      }).catch(() => {});

    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: "I had a brief connection issue. Please send your question again.",
        timestamp: new Date().toISOString()
      };
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, messages: [...s.messages, errorMessage] }
          : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout hideFooter hideAI>
      <div className="h-[calc(100vh-4.5rem)] flex bg-white relative overflow-hidden">
        
        {/* Chat History Sidebar */}
        <div className={cn(
          "w-80 md:w-[360px] border-r border-slate-200 bg-white flex flex-col relative z-50 transition-all duration-500 shadow-md",
          "fixed inset-y-0 left-0 md:relative md:flex",
          showHistory ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="p-6 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">AI Assistant</h2>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Chat History Secure</p>
                  </div>
               </div>
               <button onClick={() => setShowHistory(false)} className="md:hidden w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <CloseIcon className="w-5 h-5" />
               </button>
            </div>
            
            <button 
              onClick={startNewChat}
              className="w-full h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-semibold hover:bg-slate-800 transition-all shadow-sm active:scale-95 group"
            >
              <Plus className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform duration-350" />
              Start New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sessions.length === 0 ? (
               <div className="py-12 text-center space-y-4 opacity-40">
                  <Database className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-relaxed">No past chats yet.</p>
               </div>
            ) : sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => { setActiveSessionId(session.id); setShowHistory(false); }}
                className={cn(
                  "group p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between border relative overflow-hidden",
                  activeSessionId === session.id 
                    ? "bg-slate-50 border-primary/20 shadow-sm" 
                    : "bg-white border-transparent hover:bg-slate-50 text-slate-400 hover:text-slate-950"
                )}
              >
                {activeSessionId === session.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0", activeSessionId === session.id ? "bg-slate-900 text-primary shadow" : "bg-slate-50 text-gray-400 group-hover:text-primary group-hover:bg-white")}>
                     <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                     <span className="text-xs font-bold truncate block text-gray-800 group-hover:text-slate-950">{session.title}</span>
                     <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 opacity-80">{new Date(session.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => deleteSession(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all active:scale-90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-slate-50/50 border-t border-slate-100">
             <div className="flex items-center gap-3 text-gray-500">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-[9px] font-semibold leading-relaxed">
                   Your conversations are encrypted and isolated under your private account.
                </p>
             </div>
          </div>
        </div>

        {/* Chat Console */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30 relative">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden flex items-center justify-center">
             <Terminal className="w-[800px] h-[800px] text-slate-900 -rotate-12" />
          </div>
          
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowHistory(true)} className="md:hidden w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <Menu className="w-5 h-5" />
              </button>
              <Link to="/profile" className="flex w-10 h-10 bg-white border border-gray-200 rounded-xl items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-90 shadow-sm group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                 </div>
                 <div className="space-y-0.5">
                    <h2 className="text-base font-bold text-gray-900 tracking-tight leading-none">
                       {activeSession ? activeSession.title : "Agro-Connect AI"}
                    </h2>
                    <div className="flex items-center gap-2">
                       <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Online & Secure</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
               <ShieldCheck className="w-4 h-4 text-primary animate-bounce" />
               <div className="space-y-0.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Encrypted direct chat</p>
               </div>
            </div>
          </div>

          {/* Chat Stream Flow */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 scrollbar-hide pb-28" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3.5 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border shadow-sm",
                  msg.role === 'user' ? "bg-white border-gray-100" : "bg-slate-900 border-slate-800"
                )}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-gray-400" /> : <Bot className="w-5 h-5 text-primary" />}
                </div>
                <div className={cn(
                  "max-w-[80%] px-5 py-4 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm border relative",
                  msg.role === 'user' 
                    ? "bg-slate-900 text-white border-slate-800 rounded-tr-none" 
                    : "bg-white text-gray-700 border-gray-100 rounded-tl-none"
                )}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div className={cn(
                    "text-[8px] font-bold uppercase tracking-wider mt-3 flex items-center justify-between border-t pt-2.5",
                    msg.role === 'user' ? "text-white/40 border-white/10" : "text-gray-400 border-gray-50"
                  )}>
                     <div className="flex items-center gap-2">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3.5 animate-pulse relative z-10">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                </div>
                <div className="bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm rounded-tl-none flex items-center gap-2">
                   <div className="flex gap-1 shrink-0">
                      {[...Array(3)].map((_, i) => (
                         <span key={i} className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                   </div>
                   <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-slate-100 shadow-sm relative z-50">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 flex items-center gap-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all shadow-inner relative group/input">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask any question about agricultural prices, farmers, or listings..."
                  className="flex-grow h-10 bg-transparent border-none focus:outline-none focus:ring-0 text-xs font-semibold text-gray-800 placeholder:text-gray-300 px-2 outline-none"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="h-10 px-5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-20 active:scale-95 group/btn shrink-0"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (
                     <>
                        Send Message
                        <Send className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                     </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Overlay */}
        {showHistory && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={() => setShowHistory(false)} />
        )}
      </div>
    </MainLayout>
  );
};

export default AIAssistantPage;
