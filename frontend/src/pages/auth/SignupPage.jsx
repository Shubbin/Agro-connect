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
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
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
        title: 'Signup successful!',
        description: 'You can now sign in with your account.',
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground p-16 flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-black text-white tracking-tighter">Agro<span className="text-primary">Direct</span></span>
          </Link>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h1 className="text-6xl font-black text-white leading-none tracking-tighter">
            Join the <span className="text-gradient">Green Revolution</span>
          </h1>
          <p className="text-white/60 text-xl max-w-md font-medium">Connect directly with farmers and buy fresh produce at the best prices.</p>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/10">
           <p className="text-white/40 text-sm font-bold uppercase tracking-widest">© 2026 AgroDirect Connect</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-lg">
          {step === 'role' ? (
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-foreground tracking-tighter">Join Agro-Direct</h2>
                <p className="text-lg text-muted-foreground font-medium">Are you a Buyer or a Farmer?</p>
              </div>

              <div className="grid gap-6">
                {[
                  { id: 'user', icon: User, title: 'I want to buy', desc: 'Buy fresh food or farm tools.' },
                  { id: 'farmer', icon: Tractor, title: 'I want to sell', desc: 'Sell your goods directly to buyers.' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleRoleSelect(option.id)}
                    className="flex items-center gap-6 p-8 glass-premium border-border/50 rounded-[2rem] hover:border-primary/50 transition-all text-left group"
                  >
                    <div className="w-20 h-20 bg-secondary rounded-[1.5rem] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <option.icon className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-2xl tracking-tight">{option.title}</h3>
                      <p className="text-muted-foreground font-medium">{option.desc}</p>
                    </div>
                    <ArrowRight className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <button type="button" onClick={() => setStep('role')} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
                  <ArrowLeft className="w-4 h-4" /> Change Role
                </button>
                <h2 className="text-4xl font-black text-foreground tracking-tighter">Almost there!</h2>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Setup your {role} profile</p>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary">Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-16 px-6 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold" placeholder="Kenedy Okoro" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary">Email Address</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full h-16 px-6 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold" placeholder="name@email.com" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full h-16 pl-6 pr-14 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                      {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary">Confirm Password</label>
                  <input type={showPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full h-16 px-6 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold" placeholder="••••••••" />
                </div>
              </div>

              <Button type="submit" size="xl" className="w-full h-18 rounded-[1.25rem] btn-premium text-lg font-black tracking-tight" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Join Now'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
