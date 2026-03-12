import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, ArrowLeft, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { aiAPI } from '@/services/api';
import { Link } from 'react-router-dom';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm AgroBot, your specialized agricultural intelligence. How can I assist you with your farming or trading operations today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
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
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        content: "I'm sorry, I'm experiencing a high volume of requests. Please try again in a moment.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout hideFooter>
      <div className="h-[calc(100vh-4.5rem)] flex flex-col bg-background relative overflow-hidden">
        {/* Ambient background effect */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <div className="p-4 md:p-8 border-b border-border/30 backdrop-blur-xl flex items-center justify-between relative z-20">
          <div className="flex items-center gap-6">
            <Link to="/" className="w-12 h-12 glass-premium rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary active:scale-90 transition-all">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="relative">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tighter uppercase leading-none mb-1">Agro Intelligence</h2>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Llama-3 Powered Core</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Secure Analysis</span>
             </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 md:space-y-8 scrollbar-hide relative z-10" ref={scrollRef}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn("flex gap-6 animate-fade-in-up", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-110",
                msg.role === 'user' ? "bg-secondary" : "bg-primary"
              )}>
                {msg.role === 'user' ? <User className="w-6 h-6 text-muted-foreground" /> : <Bot className="w-6 h-6 text-white" />}
              </div>
              <div className={cn(
                "max-w-[85%] md:max-w-2xl px-6 md:px-8 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl transition-all duration-500",
                msg.role === 'user' 
                  ? "bg-white text-foreground border border-border/50 rounded-tr-none hover:border-primary/20" 
                  : "glass-premium bg-white/50 text-foreground rounded-tl-none border-primary/10 hover:bg-white/80"
              )}>
                <p className="text-base md:text-lg font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
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
        <div className="p-8 bg-gradient-to-t from-background via-background/90 to-transparent relative z-20">
          <div className="max-w-4xl mx-auto">
            <div className="glass-premium bg-white/80 border-primary/20 rounded-[2rem] p-4 flex items-center gap-4 shadow-2xl shadow-primary/10 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 h-10 md:h-12 bg-transparent border-none focus:ring-0 text-base md:text-lg font-medium placeholder:text-muted-foreground/40 px-2 md:px-4"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-14 h-14 rounded-2xl btn-premium shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                <div className={cn(isLoading ? "animate-spin" : "group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform")}>
                   {isLoading ? <RefreshCw className="w-6 h-6" /> : <Send className="w-6 h-6" />}
                </div>
              </Button>
            </div>
            <p className="text-center mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
              AI Agent may produce marketplace predictions based on historical trends
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIAssistantPage;
