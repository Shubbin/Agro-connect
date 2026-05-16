import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Leaf, Check, User, Tractor, ArrowRight, Eye, EyeOff, ShieldCheck, Mail, Lock, ArrowLeft, Building2, Database, Landmark, Globe, Activity, RefreshCw, UserCheck, Key, Shield, LayoutGrid, Smartphone, Monitor, ChevronRight } from 'lucide-react';

export const SignupPage = () => {
  const [step, setStep] = useState('role');
  const [role, setRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep('details');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Authorization access keys do not match. Please verify and retry synchronization.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        ...formData,
        role
      });
      
      toast({
        title: 'Registry Hub Initialized',
        description: 'Your institutional trade profile has been successfully recorded in the national clearing hub.',
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration Failure',
        description: error.message || 'The security protocol encountered a critical failure during account initialization.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">
      {/* 
        Institutional Identity Sidebar Registry
      */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-slate-900">
         <img 
           src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2045&auto=format&fit=crop" 
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
                     Trade Infrastructure Onboarding
                  </div>
                  <h2 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] transition-all">
                     Architecting the <br />
                     <span className="text-primary italic">Next Generation</span> <br />
                     of African Trade.
                  </h2>
                  <p className="text-slate-400 text-2xl font-medium max-w-2xl leading-relaxed opacity-80 border-l-4 border-primary/20 pl-10">
                     Join over 2,400 verified producers and procurement networks trading with end-to-end institutional security.
                  </p>
               </div>
               
               <div className="space-y-8 pt-12 border-t border-white/5">
                  {[
                     'Direct access to national commodity hubs',
                     'Escrow-protected capital settlement node',
                     'Institutional-grade trade analytics ledger'
                  ].map((benefit) => (
                     <div key={benefit} className="flex items-center gap-6 text-white/90 group/benefit">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/benefit:rotate-12 transition-transform duration-700">
                           <Check className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-lg font-black tracking-tighter uppercase opacity-80">{benefit}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="flex items-center justify-between text-slate-500 border-t border-white/5 pt-12">
               <div className="flex items-center gap-5">
                  <Globe className="w-6 h-6 opacity-30" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Protocol Version 4.2.0-STABLE NODE</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500">Registry Active</span>
               </div>
            </div>
         </div>
      </div>

      {/* 
        Institutional Registration Terminal Node
      */}
      <div className="flex-1 flex flex-col justify-center p-12 md:p-32 lg:p-48 bg-white overflow-y-auto relative">
         <div className="absolute top-0 left-0 w-full h-2 bg-slate-50" />
         <div className="max-w-2xl w-full mx-auto space-y-24 py-20">
            {step === 'role' ? (
              <div className="space-y-20 animate-fade-in">
                <div className="space-y-8">
                   <div className="w-20 h-20 bg-slate-50 rounded-[1.75rem] flex items-center justify-center text-slate-200 shadow-inner group-hover:bg-white group-hover:shadow-2xl transition-all duration-700">
                      <UserCheck className="w-10 h-10" />
                   </div>
                   <div className="space-y-4">
                      <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Registry Initialization</h1>
                      <p className="text-slate-500 font-medium text-2xl leading-relaxed opacity-80">Select your operational capacity within the national marketplace matrix hub.</p>
                   </div>
                </div>

                <div className="grid gap-10">
                  {[
                    { id: 'user', icon: UserCheck, title: 'Institutional Buyer', desc: 'Sourcing high-fidelity agricultural commodities for industrial procurement nodes.' },
                    { id: 'farmer', icon: Landmark, title: 'Verified Producer', desc: 'Authorized agrarian node listing verified inventory and trade assets for exchange.' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleRoleSelect(option.id)}
                      className="flex items-center gap-10 p-12 rounded-[3rem] border border-slate-100 hover:border-primary/40 hover:bg-slate-50 transition-all duration-700 text-left group/role active:scale-95 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/role:opacity-100 transition-opacity duration-1000" />
                      <div className="w-20 h-20 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover/role:bg-slate-900 group-hover/role:text-primary group-hover/role:border-slate-800 transition-all duration-700 shadow-2xl relative z-10">
                        <option.icon className="w-10 h-10" />
                      </div>
                      <div className="flex-1 relative z-10">
                        <h3 className="font-black text-slate-900 text-3xl tracking-tighter mb-2 group-hover/role:text-primary transition-colors duration-700">{option.title}</h3>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed opacity-80">{option.desc}</p>
                      </div>
                      <ChevronRight className="w-10 h-10 text-slate-200 group-hover/role:text-primary transition-all translate-x-0 group-hover/role:translate-x-4 duration-700 relative z-10" />
                    </button>
                  ))}
                </div>

                <div className="pt-16 text-center sm:text-left border-t border-slate-50 flex flex-col sm:flex-row items-center gap-8">
                   <p className="text-xl font-medium opacity-60 text-slate-500">
                      Already archived in our network registry? 
                   </p>
                   <Link to="/login" className="h-16 px-10 rounded-[1.25rem] bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] inline-flex items-center border border-slate-800 hover:bg-slate-800 transition-all shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] active:scale-95">
                      Sign In Terminal
                   </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-16 animate-fade-in">
                <div className="space-y-12">
                   <button type="button" onClick={() => setStep('role')} className="inline-flex items-center gap-4 text-[11px] font-bold text-slate-400 hover:text-primary transition-all uppercase tracking-[0.4em] group active:scale-95">
                      <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-700" /> Return to Role Matrix Terminal
                   </button>
                   <div className="space-y-4">
                      <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Operational Profile</h1>
                      <p className="text-slate-500 font-medium text-2xl leading-relaxed opacity-80 flex items-center gap-4">
                         Complete initialization as a 
                         <span className="text-primary font-black uppercase tracking-[0.2em] bg-primary/5 px-6 py-2 rounded-2xl border border-primary/10 shadow-2xl">{role === 'farmer' ? 'Producer' : 'Procurement Desk'}</span>
                      </p>
                   </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-12">
                  <div className="space-y-6 sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] ml-2 opacity-60">Full Legal Identity Hub</label>
                    <div className="relative group/input">
                       <User className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-200 group-focus-within/input:text-primary transition-all duration-700" />
                       <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-24 pl-20 pr-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-2xl font-black text-slate-900 placeholder:text-slate-200 focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner tracking-tight" placeholder="e.g. John Doe / Enterprise LTD" />
                    </div>
                  </div>
                  <div className="space-y-6 sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] ml-2 opacity-60">Institutional Email Manifest</label>
                    <div className="relative group/input">
                       <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-200 group-focus-within/input:text-primary transition-all duration-700" />
                       <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full h-24 pl-20 pr-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-2xl font-black text-slate-900 placeholder:text-slate-200 focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner tracking-tight" placeholder="e.g. trade@enterprise.ng" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] ml-2 opacity-60">Authorization Key</label>
                    <div className="relative group/input">
                      <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-200 group-focus-within/input:text-primary transition-all duration-700" />
                      <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full h-24 pl-20 pr-20 bg-slate-50 border border-slate-100 rounded-[2rem] text-2xl font-black text-slate-900 placeholder:text-slate-200 focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner tracking-tight" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200 hover:text-primary transition-all duration-700 active:scale-90">
                        {showPassword ? <EyeOff className="w-8 h-8" /> : <Eye className="w-8 h-8" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] ml-2 opacity-60">Verify Access Key</label>
                    <div className="relative group/input">
                       <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-200 group-focus-within/input:text-primary transition-all duration-700" />
                       <input type={showPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full h-24 pl-20 pr-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-2xl font-black text-slate-900 placeholder:text-slate-200 focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner tracking-tight" placeholder="Synchronize key..." />
                    </div>
                  </div>
                </div>

                <div className="pt-12">
                   <button type="submit" disabled={isLoading} className="w-full h-28 bg-primary text-white rounded-[2.5rem] font-bold text-2xl uppercase tracking-[0.4em] shadow-[0_40px_100px_-20px_rgba(0,166,81,0.6)] hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-8 group/authorize">
                      {isLoading ? (
                         <RefreshCw className="w-10 h-10 animate-spin" />
                      ) : (
                         <>
                            Authorize Initialization
                            <ArrowRight className="w-10 h-10 transition-transform group-hover/authorize:translate-x-6 duration-700" />
                         </>
                      )}
                   </button>
                </div>
              </form>
            )}

            <div className="mt-24 pt-16 border-t border-slate-50 flex items-center justify-center gap-20 opacity-10 grayscale">
               <div className="flex items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-slate-900" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em]">SSL v3 Secured</span>
               </div>
               <div className="flex items-center gap-4">
                  <Activity className="w-8 h-8 text-slate-900" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Institutional Hub Grade</span>
               </div>
            </div>
            
            {/* Mobile Display Sync Indicators */}
            <div className="flex items-center gap-10 opacity-5 justify-center">
               <Smartphone className="w-6 h-6" />
               <Monitor className="w-6 h-6" />
               <LayoutGrid className="w-6 h-6" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default SignupPage;
