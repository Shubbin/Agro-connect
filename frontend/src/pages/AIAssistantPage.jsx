import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, ArrowLeft, RefreshCw, Zap, ShieldCheck, Plus, MessageSquare, Trash2, History, Menu, X as CloseIcon, ChevronRight, Terminal, Info, BarChart3, Database, Globe, Landmark, Box, Activity, Smartphone, Monitor, LayoutGrid, FileText } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { aiAPI } from '@/services/api';
import { Link } from 'react-router-dom';

const AIAssistantPage = () => {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('agro_ai_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeSessionId, setActiveSessionId] = useState(() => {
    return localStorage.getItem('agro_ai_active_session') || null;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;
  const messages = activeSession ? activeSession.messages : [
    {
      id: 'welcome',
      role: 'assistant',
      content: "Institutional Trade Intelligence Engine Online. I am authorized to facilitate complex market synchronization analysis, regional supply chain auditing, and procurement strategy manifestations. How may I assist with your professional trade operations within the Nigerian agrarian network today?",
      timestamp: new Date().toISOString()
    }
  ];

  useEffect(() => {
    localStorage.setItem('agro_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem('agro_ai_active_session', activeSessionId);
    } else {
      localStorage.removeItem('agro_ai_active_session');
    }
  }, [activeSessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeSessionId]);

  const startNewChat = () => {
    setActiveSessionId(null);
    setShowHistory(false);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
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

    let updatedSessions = [...sessions];
    let currentSessionId = activeSessionId;

    if (!currentSessionId) {
      currentSessionId = Date.now().toString();
      const newSession = {
        id: currentSessionId,
        title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
        messages: [userMessage],
        timestamp: new Date().toISOString()
      };
      updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      setActiveSessionId(currentSessionId);
    } else {
      updatedSessions = sessions.map(s => 
        s.id === currentSessionId 
          ? { ...s, messages: [...s.messages, userMessage], timestamp: new Date().toISOString() }
          : s
      );
      setSessions(updatedSessions);
    }

    setInput('');
    setIsLoading(true);

    try {
      const response = await aiAPI.chat(input);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };

      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, messages: [...s.messages, botMessage] }
          : s
      ));
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: "Operational delay encountered during intelligence retrieval. Potential network congestion within the analytical matrix hub. Please re-initialize your inquiry for synchronization.",
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
        
        {/* Institutional Intelligence Hub Sidebar */}
        <div className={cn(
          "w-80 md:w-[420px] border-r border-slate-200 bg-white flex flex-col relative z-50 transition-all duration-500 shadow-[20px_0_100px_-20px_rgba(0,0,0,0.05)]",
          "fixed inset-y-0 left-0 md:relative md:flex",
          showHistory ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="p-12 border-b border-slate-100 space-y-12">
            <div className="flex items-center justify-between">
               <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tighter">Intelligence Hub</h2>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,166,81,0.5)]" />
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none">Historical Inquiries Synchronized</p>
                  </div>
               </div>
               <button onClick={() => setShowHistory(false)} className="md:hidden w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <CloseIcon className="w-6 h-6" />
               </button>
            </div>
            
            <button 
              onClick={startNewChat}
              className="w-full h-18 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-[0_30px_70px_-15px_rgba(15,23,42,0.3)] active:scale-95 group"
            >
              <Plus className="w-6 h-6 text-primary group-hover:rotate-90 transition-transform duration-500" />
              Initialize New Analysis
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
            {sessions.length === 0 ? (
               <div className="p-16 text-center space-y-6 opacity-30">
                  <Database className="w-16 h-16 mx-auto text-slate-100" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] leading-relaxed">No analytical manifests identified in hub archive.</p>
               </div>
            ) : sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => { setActiveSessionId(session.id); setShowHistory(false); }}
                className={cn(
                  "group p-6 rounded-2xl cursor-pointer transition-all flex items-center justify-between border relative overflow-hidden",
                  activeSessionId === session.id 
                    ? "bg-slate-50 border-primary/20 shadow-[0_20px_50px_-10px_rgba(0,166,81,0.1)]" 
                    : "bg-white border-transparent hover:bg-slate-50 text-slate-400 hover:text-slate-900"
                )}
              >
                {activeSessionId === session.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />}
                <div className="flex items-center gap-5 overflow-hidden">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all", activeSessionId === session.id ? "bg-slate-900 text-primary shadow-xl" : "bg-slate-50 text-slate-200 group-hover:text-primary group-hover:bg-white")}>
                     <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                     <span className="text-sm font-bold truncate block tracking-tight group-hover:translate-x-1 transition-transform">{session.title}</span>
                     <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40">{new Date(session.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => deleteSession(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-3 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all active:scale-90"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="p-10 bg-slate-50/50 border-t border-slate-100">
             <div className="flex items-center gap-5 text-slate-400">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed">
                   Analysis localized within high-security institutional parameters cycle v4.2.
                </p>
             </div>
          </div>
        </div>

        {/* Intelligence Stream Analytical Console */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/20 relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center justify-center">
             <Terminal className="w-[1200px] h-[1200px] text-slate-900 -rotate-12" />
          </div>
          
          {/* Analytical Console Header */}
          <div className="px-12 py-10 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40 shadow-2xl shadow-slate-900/5">
            <div className="flex items-center gap-10">
              <button onClick={() => setShowHistory(true)} className="md:hidden w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <Menu className="w-6 h-6" />
              </button>
              <Link to="/" className="hidden sm:flex w-14 h-14 bg-white border border-slate-200 rounded-2xl items-center justify-center text-slate-300 hover:text-primary transition-all shadow-xl active:scale-90 hover:border-primary/20 group">
                <ArrowLeft className="w-7 h-7 group-hover:-translate-x-2 transition-transform" />
              </Link>
              <div className="flex items-center gap-8">
                 <div className="w-18 h-18 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-slate-800 group-hover:scale-110 transition-transform duration-1000">
                    <Terminal className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
                 </div>
                 <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tighter leading-none">
                       {activeSession ? activeSession.title : "Trade Intelligence Console"}
                    </h2>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,166,81,0.5)]" />
                          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">Node Sync: Synchronized</span>
                       </div>
                       <div className="w-1 h-1 bg-slate-200 rounded-full" />
                       <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">Auth Level: Institutional</p>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-6 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-2xl">
               <ShieldCheck className="w-5 h-5 text-primary" />
               <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900">Proprietary AI Engine</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none">AgroDirect Strategic Matrix v4.0</p>
               </div>
            </div>
          </div>

          {/* Intelligence Stream Analytical Flow */}
          <div className="flex-1 overflow-y-auto p-12 md:p-20 space-y-16 scrollbar-hide pb-48" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-10 relative z-10 animate-fade-up", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center border shadow-2xl transition-all duration-700",
                  msg.role === 'user' ? "bg-white border-slate-100" : "bg-slate-900 border-slate-800"
                )}>
                  {msg.role === 'user' ? <User className="w-8 h-8 text-slate-300" /> : <Bot className="w-8 h-8 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />}
                </div>
                <div className={cn(
                  "max-w-[85%] md:max-w-5xl px-10 py-8 rounded-[2.5rem] shadow-2xl border text-xl font-medium leading-relaxed transition-all duration-1000",
                  msg.role === 'user' 
                    ? "bg-primary text-white border-primary shadow-[0_30px_70px_-15px_rgba(0,166,81,0.3)] rounded-tr-none" 
                    : "bg-white text-slate-900 border-slate-100 rounded-tl-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]"
                )}>
                  <p className="tracking-tighter opacity-90">{msg.content}</p>
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.4em] mt-10 flex items-center justify-between border-t pt-6",
                    msg.role === 'user' ? "text-white/40 border-white/10" : "text-slate-300 border-slate-50"
                  )}>
                     <div className="flex items-center gap-4">
                        <Landmark className="w-4 h-4" />
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                     {msg.role === 'assistant' && (
                        <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400">
                           <Activity className="w-3 h-3 text-primary animate-pulse" />
                           Audit Status: Authorized Manifest
                        </div>
                     )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-10 animate-fade-in relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl shadow-primary/20">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div className="bg-white px-12 py-8 rounded-[2.5rem] border border-slate-100 shadow-2xl flex flex-col gap-6">
                   <div className="flex items-center gap-3">
                      {[...Array(3)].map((_, i) => (
                         <div key={i} className="w-2.5 h-2.5 bg-primary/20 rounded-full animate-bounce shadow-inner" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                   </div>
                   <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900">Synchronizing Analysis Matrix Hub</p>
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-300">Retrieving proprietary trade datasets...</p>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Secure Institutional Analysis Command Terminal */}
          <div className="p-12 bg-white border-t border-slate-100 shadow-[0_-40px_100px_-20px_rgba(0,0,0,0.08)] relative z-50">
            <div className="max-w-6xl mx-auto space-y-10">
              <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-4 flex items-center gap-6 focus-within:bg-white focus-within:ring-[16px] focus-within:ring-primary/5 focus-within:border-primary/40 focus-within:shadow-2xl transition-all shadow-inner relative group/input">
                <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-200 group-focus-within/input:text-primary group-focus-within/input:bg-slate-900 transition-all duration-700 shadow-2xl">
                   <Sparkles className="w-8 h-8 group-focus-within/input:animate-pulse" />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Inquire regarding market trends, procurement manifestations, or regional logistics strategy..."
                  className="flex-1 h-16 bg-transparent border-none focus:ring-0 text-xl font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-medium px-4 tracking-tighter"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="h-18 px-14 bg-primary text-white rounded-2xl flex items-center justify-center gap-6 text-[11px] font-bold uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(0,166,81,0.4)] hover:bg-primary/90 transition-all disabled:opacity-20 disabled:shadow-none active:scale-95 group/btn"
                >
                  {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : (
                     <>
                        Initialize Sync
                        <Send className="w-5 h-5 group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-all duration-700" />
                     </>
                  )}
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6 opacity-30">
                 <div className="flex items-center gap-4 group/spec cursor-default">
                    <Globe className="w-5 h-5 text-slate-900 group-hover/spec:text-primary transition-colors" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Regional Trade Matrix v4.2</p>
                 </div>
                 <div className="flex items-center gap-4 group/spec cursor-default">
                    <BarChart3 className="w-5 h-5 text-slate-900 group-hover/spec:text-primary transition-colors" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Real-Time Liquidity Hub Sync</p>
                 </div>
                 <div className="flex items-center gap-4 group/spec cursor-default">
                    <ShieldCheck className="w-5 h-5 text-slate-900 group-hover/spec:text-primary transition-colors" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Institutional AES-256 Protocol</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile History Hub Overlay */}
        {showHistory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl z-40 md:hidden animate-fade-in" onClick={() => setShowHistory(false)} />
        )}
      </div>
    </MainLayout>
  );
};

export default AIAssistantPage;
