import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, X, Send, ShieldCheck, Activity, RefreshCw, Smartphone, Monitor, ChevronRight, Hash, Database, Globe, Shield, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const AIAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Institutional Trade Intelligence Hub initialized. Authorized Trade Assistant v4.2.0 synchronized with regional logistics nodes. How may I facilitate your procurement or settlement parameters today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response with high-fidelity institutional logic
    setTimeout(() => {
      const responses = [
        "Verified commodity positions for Grade-AAA assets are currently accessible via the Exchange Hub. Regional hub pricing manifest is synchronized with national benchmarks.",
        "Operational trade manifests can be audited through the Procurement Ledger Terminal. Escrow settlement protocols are active for all authorized synchronization cycles.",
        "Logistics tracking node IDs are synchronized once producers initialize supply chain manifests. Institutional delivery verification is mandatory for capital disbursement.",
        "Your institutional performance metrics can be reviewed in the Command Matrix for strategic appraisal and credit hub synchronization.",
      ];
      
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)] },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Institutional Operational Assistant Trigger Node */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-12 right-12 z-[100] w-24 h-24 bg-slate-900 text-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(15,23,42,0.4)] flex items-center justify-center transition-all duration-700 hover:scale-110 hover:bg-slate-800 group border-[6px] border-white active:scale-95",
          isOpen && "opacity-0 pointer-events-none scale-0"
        )}
      >
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity rounded-[2rem]" />
        <MessageCircle className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform duration-700 shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 border-[6px] border-white rounded-full animate-pulse shadow-2xl" />
      </button>

      {/* Institutional Trade Intelligence Command Console */}
      <div className={cn(
        "fixed bottom-12 right-12 z-[100] w-[480px] max-w-[calc(100vw-3rem)] bg-white rounded-[4rem] shadow-[0_80px_200px_-50px_rgba(0,0,0,0.4)] border border-slate-200 overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col group/console origin-bottom-right",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-40 pointer-events-none"
      )}>
        {/* High-Fidelity Intelligence Header Registry */}
        <div className="bg-slate-900 p-10 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] -mr-12 -mt-12 pointer-events-none group-hover/console:scale-125 transition-transform duration-[3000ms]">
             <Sparkles className="w-48 h-48 text-white" />
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-inner group-hover/console:bg-primary/20 transition-all duration-700">
              <Sparkles className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(0,166,81,0.3)]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white tracking-tighter leading-none">Trade Intelligence</h3>
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-none">Operational Desk Online</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all active:scale-90 border border-white/5 hover:bg-white/10"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Operational Message Journal Ledger */}
        <div className="h-[520px] overflow-y-auto p-12 space-y-12 bg-slate-50/50 scroll-smooth scrollbar-hide">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700",
                msg.role === 'user' ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "text-[10px] font-bold uppercase tracking-[0.3em] mb-4 px-2 opacity-60 flex items-center gap-3",
                msg.role === 'user' ? "text-slate-400" : "text-primary"
              )}>
                 {msg.role === 'user' ? (
                   <>OPERATOR COMMAND <Activity className="w-3.5 h-3.5" /></>
                 ) : (
                   <><Activity className="w-3.5 h-3.5" /> INTELLIGENCE HUB NODE</>
                 )}
              </div>
              <div
                className={cn(
                  "max-w-[92%] px-8 py-6 rounded-[2.5rem] text-lg font-medium leading-relaxed shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border relative transition-all duration-700 hover:shadow-2xl",
                  msg.role === 'user'
                    ? "bg-slate-900 text-white border-slate-800 rounded-tr-none"
                    : "bg-white text-slate-700 border-slate-100 rounded-tl-none"
                )}
              >
                {msg.content}
                {msg.role === 'assistant' && (
                  <div className="absolute -left-3 -top-3 w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-primary shadow-xl">
                     <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start animate-pulse">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 px-2 text-primary flex items-center gap-3">
                 <Activity className="w-3.5 h-3.5" /> INTELLIGENCE HUB NODE
              </div>
              <div className="bg-white px-10 py-6 rounded-[2.5rem] border border-slate-100 shadow-xl rounded-tl-none flex items-center gap-4">
                <div className="flex gap-3">
                  {[0, 1, 2].map((i) => (
                     <span key={i} className="w-3 h-3 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.3em]">Synchronizing Nodes...</span>
              </div>
            </div>
          )}
        </div>

        {/* Command Terminal Input Node Hub */}
        <div className="p-10 border-t border-slate-100 bg-white relative group/inputnode">
          <div className="flex gap-6">
            <div className="flex-1 relative group/input">
               <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-200 group-focus-within/input:text-primary transition-colors duration-700" />
               <input
                 type="text"
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Audit commodity nodes or trade cycles manifest..."
                 className="w-full h-20 pl-16 pr-8 bg-slate-50 border border-slate-200 rounded-[1.75rem] text-lg font-bold placeholder:text-slate-200 focus:outline-none focus:ring-[15px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all shadow-inner tracking-tight"
               />
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="w-20 h-20 bg-primary text-white rounded-[1.75rem] flex items-center justify-center hover:bg-primary/90 transition-all duration-700 disabled:opacity-30 shadow-[0_30px_60px_-15px_rgba(0,166,81,0.5)] active:scale-90 group/send"
            >
              {isLoading ? <RefreshCw className="w-8 h-8 animate-spin" /> : <Send className="w-8 h-8 group-hover/send:translate-x-2 group-hover/send:-translate-y-2 transition-transform duration-700" />}
            </button>
          </div>
          
          <div className="mt-10 pt-10 border-t border-slate-50 flex flex-col gap-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner group-hover/inputnode:bg-white transition-all duration-1000">
                   <ShieldCheck className="w-6 h-6 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                   <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 leading-none">Verified Intelligence Protocol Hub</span>
                </div>
                <Link
                  to="/ai-assistant"
                  className="flex items-center gap-4 text-[11px] font-bold text-primary uppercase tracking-[0.4em] hover:underline group/launch active:scale-95 transition-all"
                >
                  Initialize Full Hub
                  <ChevronRight className="w-5 h-5 group-hover/launch:translate-x-2 transition-transform duration-700" />
                </Link>
             </div>
             
             {/* Institutional Status Registry */}
             <div className="flex items-center gap-10 opacity-10 justify-center group-hover/inputnode:opacity-30 transition-opacity duration-[2000ms]">
                <Activity className="w-6 h-6 text-slate-900" />
                <div className="h-px w-10 bg-slate-900" />
                <Database className="w-6 h-6 text-slate-900" />
                <div className="h-px w-10 bg-slate-900" />
                <Globe className="w-6 h-6 text-slate-900" />
                <div className="h-px w-10 bg-slate-900" />
                <Landmark className="w-6 h-6 text-slate-900" />
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistantButton;
