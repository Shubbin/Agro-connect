import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Leaf, Check, User, Tractor, ArrowRight, Eye, EyeOff, Sparkles, Star, ShieldCheck, Mail, Phone, Lock, ArrowLeft } from 'lucide-react';

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
        title: 'Security Mismatch',
        description: 'Passwords must be identical to initialize account.',
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
        title: 'Registration Successful!',
        description: 'Your trade profile has been initialized.',
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen-dvh flex bg-background relative overflow-hidden">
      {/* 
        LEFT PANEL: CINEMATIC STAGING 
      */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
         <img 
           src="/auth_bg_agriculture_1778880173697.png" 
           alt="Premium Agriculture" 
           className="w-full h-full object-cover reveal-up scale-110 group-hover:scale-100 transition-transform duration-2000"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-foreground/80 mix-blend-multiply" />
         
         <div className="absolute inset-0 flex flex-col justify-end p-24 relative z-10">
            <div className="reveal-up" style={{ animationDelay: '200ms' }}>
               <div className="inline-flex items-center gap-3 bg-white/10 text-white/90 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 backdrop-blur-md border border-white/5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AGRODIRECT REGISTRATION
               </div>
               <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-10">
                  Join the <br />
                  <span className="text-primary">Green</span> <br />
                  Revolution
               </h2>
               <p className="text-white/60 text-xl font-medium max-w-lg leading-relaxed">
                  Connect with Nigeria's premium agricultural network. 
                  Direct trade, verified partners, and intelligent commerce.
               </p>
            </div>
         </div>
      </div>

      {/* 
        RIGHT PANEL: REGISTRATION TERMINAL 
      */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-24 relative overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
         
         <div className="max-w-md w-full mx-auto reveal-up">
            <Link to="/" className="inline-flex items-center gap-4 mb-16 group">
               <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:rotate-6 transition-transform">
                  <Leaf className="w-8 h-8 text-white" />
               </div>
               <span className="text-3xl font-black text-foreground tracking-tighter uppercase">
                  Agro<span className="text-primary">Direct</span>
               </span>
            </Link>

            {step === 'role' ? (
              <div className="space-y-10 animate-fade-in">
                <div className="mb-12">
                   <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none mb-4">
                      Define <span className="text-gradient">Role</span>
                   </h1>
                   <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px]">
                      Select your operational identity
                   </p>
                </div>

                <div className="grid gap-6">
                  {[
                    { id: 'user', icon: User, title: 'Buyer Profile', desc: 'Sourcing fresh food or farm tools.' },
                    { id: 'farmer', icon: Tractor, title: 'Producer Hub', desc: 'Direct sale of agricultural goods.' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleRoleSelect(option.id)}
                      className="flex items-center gap-6 p-8 glass-card border-border/50 rounded-[2.5rem] hover:border-primary/40 transition-all text-left group active:scale-95 bg-white/40 border-white/60"
                    >
                      <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                        <option.icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-xl tracking-tighter uppercase mb-1">{option.title}</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{option.desc}</p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-2" />
                    </button>
                  ))}
                </div>

                <p className="text-center text-muted-foreground font-bold text-sm mt-12">
                   Already registered? 
                   <Link to="/login" className="text-primary hover:underline underline-offset-8 ml-2">Initialize Login</Link>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
                <div className="mb-12">
                   <button type="button" onClick={() => setStep('role')} className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary mb-6 group">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Role Selection
                   </button>
                   <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none mb-4">
                      Create <span className="text-gradient">Profile</span>
                   </h1>
                   <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px]">
                      Configuring {role} Hub Terminal
                   </p>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Operational Name</label>
                    <div className="relative">
                       <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors z-20" />
                       <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-premium pl-16 h-18 text-lg" placeholder="Full Name or Business Name" />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Terminal Address (Email)</label>
                    <div className="relative">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors z-20" />
                       <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-premium pl-16 h-18 text-lg" placeholder="operator@agrodirect.net" />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Access Key (Password)</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors z-20" />
                      <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="input-premium pl-16 pr-16 h-18 text-lg" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary z-20">
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Verification Key (Confirm Password)</label>
                    <div className="relative">
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors z-20" />
                       <input type={showPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="input-premium pl-16 h-18 text-lg" placeholder="••••••••" />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                   <button type="submit" disabled={isLoading} className="btn-premium w-full h-18 text-base">
                      {isLoading ? 'Synchronizing...' : 'Initialize Profile Creation'}
                      <ArrowRight className="w-6 h-6" />
                   </button>
                </div>
              </form>
            )}

            <div className="mt-16 pt-16 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-3 text-muted-foreground opacity-30">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Global Security Standard</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SignupPage;
