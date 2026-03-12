import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, ArrowLeft, RefreshCw, Zap, ShieldCheck, Plus, MessageSquare, Trash2, History, Menu, X as CloseIcon } from 'lucide-react';
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
      content: "Hello! I'm AgroBot, your specialized agricultural intelligence. How can I assist you with your farming or trading operations today?",
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
        content: "I'm sorry, I'm experiencing a high volume of requests. Please try again in a moment.",
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
      <div className="h-[calc(100vh-4.5rem)] flex bg-background relative overflow-hidden">
        {/* Ambient background effect */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Sidebar - History */}
        <div className={cn(
          "w-80 border-r border-border/30 bg-background/50 backdrop-blur-2xl flex flex-col relative z-30 transition-all duration-500",
          "fixed inset-y-0 left-0 md:relative md:flex",
          showHistory ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-foreground tracking-tighter uppercase">History</h2>
              <button 
                onClick={() => setShowHistory(false)}
                className="md:hidden w-10 h-10 glass-premium rounded-xl flex items-center justify-center text-muted-foreground"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={startNewChat}
              className="w-full py-4 px-6 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => { setActiveSessionId(session.id); setShowHistory(false); }}
                className={cn(
                  "group p-4 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-between",
                  activeSessionId === session.id 
                    ? "bg-white shadow-xl shadow-primary/5 border border-primary/20" 
                    : "hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare className={cn("w-4 h-4 shrink-0", activeSessionId === session.id ? "text-primary" : "text-muted-foreground/40")} />
                  <span className="text-sm font-bold truncate tracking-tight">{session.title}</span>
                </div>
                <button 
                  onClick={(e) => deleteSession(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">No past sessions</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Header */}
          <div className="p-4 md:p-8 border-b border-border/30 backdrop-blur-xl flex items-center justify-between relative z-20">
            <div className="flex items-center gap-4 md:gap-6">
              <button 
                onClick={() => setShowHistory(true)}
                className="md:hidden w-12 h-12 glass-premium rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
              >
                <History className="w-6 h-6" />
              </button>
              <Link to="/" className="hidden sm:flex w-12 h-12 glass-premium rounded-2xl items-center justify-center text-muted-foreground hover:text-primary active:scale-90 transition-all">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 border-4 border-white rounded-full" />
              </div>
              <div>
                <h2 className="text-lg md:text-2xl font-black text-foreground tracking-tighter uppercase leading-none mb-1 truncate max-w-[150px] md:max-w-none">
                  {activeSession ? activeSession.title : "Agro Intelligence"}
                </h2>
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Llama-3 Powered Core</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
               <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary">Secure Analysis</span>
               </div>
               <Button variant="ghost" size="icon" onClick={() => setActiveSessionId(null)} className="md:hidden text-muted-foreground">
                  <Plus className="w-6 h-6" />
               </Button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-8 md:space-y-12 scrollbar-hide relative z-10" ref={scrollRef}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn("flex gap-4 md:gap-6 animate-fade-in-up", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
              >
                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-110",
                  msg.role === 'user' ? "bg-secondary" : "bg-primary"
                )}>
                  {msg.role === 'user' ? <User className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" /> : <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />}
                </div>
                <div className={cn(
                  "max-w-[85%] md:max-w-2xl px-5 md:px-8 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl transition-all duration-500",
                  msg.role === 'user' 
                    ? "bg-white text-foreground border border-border/50 rounded-tr-none hover:border-primary/20" 
                    : "glass-premium bg-white/50 text-foreground rounded-tl-none border-primary/10 hover:bg-white/80"
                )}>
                  <p className="text-sm md:text-lg font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-[10px] font-black uppercase tracking-widest mt-4 block text-muted-foreground opacity-50">
                     {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-6 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 shrink-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary/40" />
                </div>
                <div className="glass-premium bg-white/30 h-16 w-32 rounded-3xl animate-shimmer" />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-8 bg-gradient-to-t from-background via-background/90 to-transparent relative z-20">
            <div className="max-w-4xl mx-auto">
              <div className="glass-premium bg-white/80 border-primary/20 rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-4 flex items-center gap-2 md:gap-4 shadow-2xl shadow-primary/10 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="flex-1 h-10 md:h-12 bg-transparent border-none focus:ring-0 text-sm md:text-lg font-medium placeholder:text-muted-foreground/40 px-2 md:px-4"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl btn-premium shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <div className={cn(isLoading ? "animate-spin" : "group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform")}>
                     {isLoading ? <RefreshCw className="w-5 h-5 md:w-6 md:h-6" /> : <Send className="w-5 h-5 md:w-6 md:h-6" />}
                  </div>
                </Button>
              </div>
              <p className="text-center mt-4 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                AI Agent may produce marketplace predictions based on historical trends
              </p>
            </div>
          </div>
        </div>
        
        {/* Overlay for mobile sidebar */}
        {showHistory && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-25 md:hidden"
            onClick={() => setShowHistory(false)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default AIAssistantPage;
