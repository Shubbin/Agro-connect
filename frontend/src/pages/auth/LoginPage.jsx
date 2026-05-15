import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff, Mail, Lock, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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
        title: 'Authentication Successful',
        description: 'Secure terminal session initialized.',
      });

      const storedUser = localStorage.getItem('agro_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        navigate(user.role === 'farmer' ? '/farmer/dashboard' : '/marketplace');
      }
    } catch (error) {
      toast({
        title: 'Security Breach',
        description: error.message || 'Invalid credentials provided.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen-dvh flex bg-background relative overflow-hidden">
      {/* 
        LEFT SIDE: CINEMATIC STAGING 
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
                  AGRODIRECT TERMINAL ACCESS
               </div>
               <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-10">
                  Global <br />
                  <span className="text-primary">Standards</span> <br />
                  Local Trade
               </h2>
               <p className="text-white/60 text-xl font-medium max-w-lg leading-relaxed">
                  Enter Nigeria's most secure agricultural trading portal. 
                  Verified producers. Secure escrow. Intelligent trade.
               </p>
            </div>
         </div>
      </div>

      {/* 
        RIGHT SIDE: ACCESS TERMINAL 
      */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-24 relative overflow-hidden">
         <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
         
         <div className="max-w-md w-full mx-auto reveal-up">
            <Link to="/" className="inline-flex items-center gap-4 mb-16 group">
               <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:rotate-6 transition-transform">
                  <Leaf className="w-8 h-8 text-white" />
               </div>
               <span className="text-3xl font-black text-foreground tracking-tighter uppercase">
                  Agro<span className="text-primary">Direct</span>
               </span>
            </Link>

            <div className="mb-12">
               <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none mb-4">
                  Access <span className="text-gradient">Secure</span>
               </h1>
               <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px]">
                  Initialize Session with your credentials
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                     Terminal Address (Email)
                  </label>
                  <div className="relative">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors z-20" />
                     <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-premium pl-16 h-18 text-lg"
                        placeholder="operator@agrodirect.net"
                     />
                  </div>
               </div>

               <div className="space-y-2 group">
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                        Access Key (Password)
                     </label>
                     <Link to="/forgot-password" title="Recover Access Key" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                        Lost Key?
                     </Link>
                  </div>
                  <div className="relative">
                     <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors z-20" />
                     <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input-premium pl-16 pr-16 h-18 text-lg"
                        placeholder="••••••••"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors z-20"
                     >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                     </button>
                  </div>
               </div>

               <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer group/check">
                     <div className="relative w-6 h-6">
                        <input
                           type="checkbox"
                           checked={rememberMe}
                           onChange={(e) => setRememberMe(e.target.checked)}
                           className="peer appearance-none w-6 h-6 rounded-lg bg-secondary border-2 border-border/50 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                        />
                        <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover/check:text-foreground">
                        Maintain Session
                     </span>
                  </label>
               </div>

               <div className="pt-4">
                  <button
                     type="submit"
                     disabled={isLoading}
                     className="btn-premium w-full h-18 text-base"
                  >
                     {isLoading ? 'Decrypting...' : 'Initialize Terminal Access'}
                     <ArrowRight className="w-6 h-6" />
                  </button>
               </div>
            </form>

            <div className="mt-16 pt-16 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
               <p className="text-muted-foreground font-bold text-sm">
                  New Operator? 
                  <Link to="/signup" className="text-primary hover:underline underline-offset-8 ml-2">Register Hub</Link>
               </p>
               <div className="flex items-center gap-3 text-muted-foreground opacity-30">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">SSL Secure</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;
