import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff, Mail, Lock, Check, ArrowRight, ShieldCheck, Sparkles, Database, Landmark, Globe, Activity, ChevronRight, RefreshCw, Key, Shield, UserCheck, LayoutGrid, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('remembered_email') ? true : false);
  const [formData, setFormData] = useState({
    email: localStorage.getItem('remembered_email') || '',
    password: '',
  });

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('remembered_email', formData.email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      await login(formData.email, formData.password);
      
      toast({
        title: 'Institutional Authorization Granted',
        description: 'Trade session successfully synchronized with the national clearing hub registry.',
      });

      const storedUser = localStorage.getItem('agro_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        navigate(user.role === 'farmer' ? '/farmer/dashboard' : '/marketplace');
      }
    } catch (error) {
      toast({
        title: 'Authorization Failure',
        description: error.message || 'Invalid credentials within the secure access protocol manifest.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">
      {/* 
        Institutional Identity Sidebar Ledger
      */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-slate-900">
         <img 
           src="https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=2072&auto=format&fit=crop" 
           alt="Institutional Agriculture Nigeria" 
           className="w-full h-full object-cover grayscale opacity-20 scale-105 group-hover:scale-100 transition-transform duration-[3000ms]"
         />
         <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/80 to-primary/20" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(15,23,42,0.9)_100%)]" />
         
         <div className="absolute inset-0 flex flex-col justify-between p-24 relative z-10">
            <Link to="/" className="inline-flex items-center gap-6 group/logo">
               <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-700 group-hover/logo:scale-110 group-hover/logo:rotate-12">
                  <Leaf className="w-9 h-9 text-primary shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
               </div>
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-white tracking-tighter leading-none">
                     Agro<span className="text-primary italic">Direct</span>
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.5em] leading-none mt-2">Authorized Exchange</span>
               </div>
            </Link>

            <div className="space-y-16">
               <div className="space-y-10">
                  <div className="inline-flex items-center gap-6 bg-white/5 text-white px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[0.4em] backdrop-blur-3xl border border-white/10 shadow-2xl">
                     <ShieldCheck className="w-6 h-6 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                     Institutional Trade Authority
                  </div>
                  <h2 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] transition-all">
                     Synchronizing <br />
                     <span className="text-primary italic">Trade Hubs</span> <br />
                     at Scale.
                  </h2>
                  <p className="text-slate-400 text-2xl font-medium max-w-2xl leading-relaxed opacity-80 border-l-4 border-primary/20 pl-10">
                     Access the national clearing registry for verified producers and industrial commodity procurement nodes.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 gap-16 pt-16 border-t border-white/5">
                  <div className="space-y-4 group/stat">
                     <div className="flex items-center gap-5">
                        <Database className="w-8 h-8 text-primary group-hover/stat:scale-125 transition-transform duration-700" />
                        <p className="text-5xl font-black text-white tracking-tighter leading-none">8.1k+</p>
                     </div>
                     <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-none ml-1">Asset Node Manifests</p>
                  </div>
                  <div className="space-y-4 group/stat">
                     <div className="flex items-center gap-5">
                        <Landmark className="w-8 h-8 text-primary group-hover/stat:scale-125 transition-transform duration-700" />
                        <p className="text-5xl font-black text-white tracking-tighter leading-none">₦2.4B</p>
                     </div>
                     <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-none ml-1">Aggregate Settlement Value</p>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between text-slate-500 border-t border-white/5 pt-12">
               <div className="flex items-center gap-5">
                  <Globe className="w-6 h-6 opacity-30" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Regional Trade Matrix v4.2.0</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500">Systems Operational</span>
               </div>
            </div>
         </div>
      </div>

      {/* 
        Institutional Authorization Terminal Node
      */}
      <div className="flex-1 flex flex-col justify-center p-12 md:p-32 lg:p-48 bg-white relative">
         <div className="absolute top-0 left-0 w-full h-2 bg-slate-50" />
         <div className="max-w-xl w-full mx-auto space-y-24">
            <div className="space-y-8">
               <div className="w-20 h-20 bg-slate-50 rounded-[1.75rem] flex items-center justify-center text-slate-200 shadow-inner group-hover:bg-white group-hover:shadow-2xl transition-all duration-700">
                  <Key className="w-10 h-10" />
               </div>
               <div className="space-y-4">
                  <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Authorization Terminal</h1>
                  <p className="text-slate-500 font-medium text-2xl leading-relaxed opacity-80">
                     Enter your secure credentials to synchronize with the institutional trade hub command console.
                  </p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
               <div className="space-y-6">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] ml-2 opacity-60">
                     Security Email Manifest
                  </label>
                  <div className="relative group/input">
                     <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-200 group-focus-within/input:text-primary transition-all duration-700" />
                     <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-24 pl-20 pr-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-2xl font-black text-slate-900 placeholder:text-slate-200 focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner tracking-tight"
                        placeholder="e.g. operations@enterprise.ng"
                     />
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] opacity-60">
                        Authorization Access Key
                     </label>
                     <Link to="/forgot-password" title="Recover Access Key" className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] hover:underline transition-all active:scale-95">
                        Recover Key?
                     </Link>
                  </div>
                  <div className="relative group/input">
                     <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-200 group-focus-within/input:text-primary transition-all duration-700" />
                     <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full h-24 pl-20 pr-20 bg-slate-50 border border-slate-100 rounded-[2rem] text-2xl font-black text-slate-900 placeholder:text-slate-200 focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner tracking-tight"
                        placeholder="••••••••"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200 hover:text-primary transition-all duration-700 active:scale-90"
                     >
                        {showPassword ? <EyeOff className="w-8 h-8" /> : <Eye className="w-8 h-8" />}
                     </button>
                  </div>
               </div>

               <div className="flex items-center justify-between px-2">
                  <label className="flex items-center gap-4 cursor-pointer group/check">
                     <div className="relative w-8 h-8">
                        <input
                           type="checkbox"
                           checked={rememberMe}
                           onChange={(e) => setRememberMe(e.target.checked)}
                           className="peer appearance-none w-8 h-8 rounded-xl border-4 border-slate-100 checked:bg-primary checked:border-primary transition-all duration-700 shadow-inner"
                        />
                        <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-all duration-700" />
                     </div>
                     <span className="text-[12px] font-black text-slate-400 group-hover/check:text-slate-900 transition-colors uppercase tracking-[0.3em]">
                        Persistent Node Session
                     </span>
                  </label>
               </div>

               <div className="pt-8">
                  <button
                     type="submit"
                     disabled={isLoading}
                     className="w-full h-28 bg-primary text-white rounded-[2rem] font-bold text-2xl uppercase tracking-[0.4em] shadow-[0_40px_100px_-20px_rgba(0,166,81,0.6)] hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-8 group/authorize"
                  >
                     {isLoading ? (
                        <RefreshCw className="w-10 h-10 animate-spin" />
                     ) : (
                        <>
                           Authorize Access
                           <ArrowRight className="w-10 h-10 transition-transform group-hover/authorize:translate-x-4 duration-700" />
                        </>
                     )}
                  </button>
               </div>
            </form>

            <div className="pt-24 border-t border-slate-50 flex flex-col items-center gap-16">
               <div className="flex flex-col sm:flex-row items-center gap-8 text-slate-400">
                  <p className="text-xl font-medium opacity-60">New institutional partner?</p>
                  <Link to="/signup" className="h-16 px-10 rounded-[1.25rem] bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] flex items-center border border-slate-800 hover:bg-slate-800 transition-all shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] active:scale-95 group/registry">
                     Initialize Registry Hub
                     <ChevronRight className="w-5 h-5 ml-4 group-hover/registry:translate-x-2 transition-transform duration-700" />
                  </Link>
               </div>
               
               <div className="flex items-center gap-16 opacity-10 grayscale">
                  <div className="flex items-center gap-4">
                     <Shield className="w-8 h-8 text-slate-900" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.5em]">SSL v3 Protocol Secured</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <Activity className="w-8 h-8 text-slate-900" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Institutional Hub Grade</span>
                  </div>
               </div>
               
               {/* Mobile Display Sync Indicators */}
               <div className="flex items-center gap-10 opacity-5">
                  <Smartphone className="w-6 h-6" />
                  <Monitor className="w-6 h-6" />
                  <LayoutGrid className="w-6 h-6" />
               </div>
            </div>
         </div>
      </div>
   </div>
  );
};

export default LoginPage;
