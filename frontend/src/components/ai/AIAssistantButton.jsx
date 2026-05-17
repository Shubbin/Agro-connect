import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, X, Send, ShieldCheck, Activity, RefreshCw, ChevronRight, Hash, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AIAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your Agro-Connect Assistant. I can help you find fresh products, check your orders, track escrow payments, or navigate the dashboard. What can I do for you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response with clean, simple, helpful layman replies
    setTimeout(() => {
      const query = userMessage.toLowerCase();
      const greetings = ["hi", "hello", "hey", "yo", "hola", "greetings", "good morning", "good afternoon", "good evening"];
      const words = query.split(/[\s,?.!]+/);
      const isGreeting = words.some(w => greetings.includes(w));

      let reply = "";
      if (isGreeting) {
        reply = "Hello there! Welcome to Agro-Connect. How can I help you today?";
      } else if (query.includes("payment") || query.includes("money") || query.includes("pay") || query.includes("escrow") || query.includes("secure")) {
        reply = "Your payments are completely safe on Agro-Connect! We hold your money securely in escrow until you receive and check your farm products. Once you confirm delivery, the funds are released to the farmer.";
      } else if (query.includes("shipping") || query.includes("deliver") || query.includes("track") || query.includes("order") || query.includes("receive")) {
        reply = "Once a farmer ships your order and enters the tracking details, you will see all active shipping updates directly on your Orders page.";
      } else if (query.includes("marketplace") || query.includes("crops") || query.includes("buy") || query.includes("sell") || query.includes("produce")) {
        reply = "You can easily view and browse all active fresh farm produce, tools, and machinery on our Marketplace page. Prices are transparent and direct from local farmers.";
      } else {
        reply = "I am here to make farm trading easy for you! You can ask me about finding crops, checking your orders, tracking payments, or navigating your dashboard.";
      }
      
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: reply },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-[100] w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-slate-800 group border-4 border-white active:scale-95",
          isOpen && "opacity-0 pointer-events-none scale-90"
        )}
      >
        <MessageCircle className="w-6 h-6 text-primary group-hover:rotate-6 transition-transform" />
        <span className="absolute top-0 right-0 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </button>

      {/* Assistant Chat Window */}
      <div className={cn(
        "fixed bottom-6 right-6 z-[100] w-[380px] max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-500 ease-out flex flex-col origin-bottom-right",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-12 pointer-events-none"
      )}>
        
        {/* Header */}
        <div className="bg-slate-900 px-5 py-4 flex items-center justify-between relative overflow-hidden shrink-0">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 shadow-inner">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight text-sm">Agro-Connect AI</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Online & Ready to Help</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Logs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === 'user' ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "text-[8px] font-bold uppercase tracking-wider mb-1 px-1.5",
                msg.role === 'user' ? "text-gray-400" : "text-primary"
              )}>
                 {msg.role === 'user' ? "YOU" : "AGRO-CONNECT AI"}
              </div>
              <div
                className={cn(
                  "max-w-[85%] px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm border relative",
                  msg.role === 'user'
                    ? "bg-slate-900 text-white border-slate-800 rounded-tr-none"
                    : "bg-white text-gray-700 border-gray-100 rounded-tl-none"
                )}
              >
                {msg.content}
                {msg.role === 'assistant' && (
                  <div className="absolute -left-2 -top-2 w-5 h-5 bg-white border border-gray-100 rounded-md flex items-center justify-center text-primary shadow-sm">
                     <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start animate-pulse">
              <div className="text-[8px] font-bold uppercase tracking-wider mb-1 px-1.5 text-primary">
                 AGRO-CONNECT AI
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm rounded-tl-none flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                     <span key={i} className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
                  ))}
                </div>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
          <div className="flex gap-3">
            <div className="flex-grow relative">
               <input
                 type="text"
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Ask a question about the platform..."
                 className="w-full h-10 pl-3 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
               />
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-30 shadow-sm active:scale-95 group/send shrink-0"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 transition-transform" />}
            </button>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
             <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-gray-700 leading-none">Secure Direct Chat</span>
             </div>
             <Link
               to="/ai-assistant"
               onClick={() => setIsOpen(false)}
               className="flex items-center gap-1 text-[8px] font-bold text-primary uppercase tracking-wider hover:underline shrink-0"
             >
               Go to AI Page
               <ChevronRight className="w-3.5 h-3.5" />
             </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistantButton;
