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

    if (!role) return;

    setIsLoading(true);
    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role,
        phone: formData.phone,
      });
      
      toast({
        title: 'Signup successful',
        description: 'Please sign in with your credentials.',
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Premium Branding Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground p-16 flex-col justify-between relative overflow-hidden group">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse-gentle" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[100px] animate-float-gentle" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-4 group/logo">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover/logo:scale-110">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-black text-white tracking-tighter">
              Agro<span className="text-primary">Direct</span>
            </span>
          </Link>
        </div>
        
        <div className="relative z-10 space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Nigerian Agriculture
          </div>
          <h1 className="text-6xl font-black text-white leading-[0.9] tracking-tighter max-w-md">
            The Future of <span className="text-gradient">Agro-Commerce</span> Starts Here.
          </h1>
          <div className="grid gap-6">
            {[
              { icon: User, title: 'Direct Access', desc: 'No middlemen. Deal directly with verified partners.' },
              { icon: Star, title: 'Grade-A Produce', desc: 'Access the highest quality agricultural exports.' },
              { icon: ShieldCheck, title: 'Secure Escrow', desc: 'Safeguarded payments for complete peace of mind.' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                   <h3 className="text-white font-bold">{feature.title}</h3>
                   <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/10">
           <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-foreground bg-secondary" />
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-foreground bg-primary flex items-center justify-center text-[10px] font-black text-white">+10k</div>
              </div>
              <p className="text-white/60 text-xs font-medium">Join 10,000+ farmers fueling the ecosystem</p>
           </div>
        </div>
      </div>

      {/* Right Panel - Premium Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-lg animate-fade-in-up">
          {/* Mobile Logo Visibility */}
          <div className="lg:hidden mb-12">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black text-foreground tracking-tighter">
                Agro<span className="text-primary">Direct</span>
              </span>
            </Link>
          </div>

          {step === 'role' ? (
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-[0.95]">
                  Create Your <span className="text-gradient">Account</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium">
                  Select your primary role to customize your experience.
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  { 
                    id: 'user', 
                    icon: User, 
                    title: 'I am a Buyer', 
                    desc: 'Sourcing premium produce and equipment for business or personal use.',
                    color: 'blue'
                  },
                  { 
                    id: 'farmer', 
                    icon: Tractor, 
                    title: 'I am a Farmer', 
                    desc: 'Scaling my reach and selling direct to verified high-intent buyers.',
                    color: 'primary'
                  }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleRoleSelect(option.id)}
                    className="flex items-center gap-6 p-8 glass-premium border-border/50 rounded-[2rem] hover:border-primary/50 transition-all duration-500 group text-left relative overflow-hidden active:scale-[0.98]"
                  >
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                    
                    <div className="w-20 h-20 bg-secondary rounded-[1.5rem] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                      <option.icon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-black text-foreground text-2xl tracking-tight group-hover:text-primary transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-muted-foreground font-medium leading-relaxed group-hover:text-foreground/80 transition-colors">
                        {option.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-7 h-7 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                  </button>
                ))}
              </div>

              <div className="pt-6 text-center">
                <p className="text-muted-foreground font-bold">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline underline-offset-8 decoration-2">
                    Log in here
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setStep('role')}
                  className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Role Selection
                </button>
                <h2 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-[0.95]">
                  Finish <span className="text-gradient">Sign Up</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
                  Setting up your {role} profile
                </p>
              </div>

              <div className="grid gap-6">
                {[
                   { label: 'Full Legal Name', type: 'text', key: 'name', placeholder: 'Kenedy Okoro', icon: User },
                   { label: 'Email Address', type: 'email', key: 'email', placeholder: 'kenedy@agrodirect.ng', icon: Mail },
                   { label: 'Phone Number', type: 'tel', key: 'phone', placeholder: '+234 812 345 6789', icon: Phone }
                ].map((field) => (
                  <div key={field.key} className="space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                      {field.label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <field.icon className="w-5 h-5" />
                      </div>
                      <input
                        type={field.type}
                        required
                        value={formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full h-16 pl-14 pr-6 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold text-foreground placeholder:font-medium placeholder:text-muted-foreground/50"
                        placeholder={field.placeholder}
                      />
                    </div>
                  </div>
                ))}

                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full h-16 pl-14 pr-14 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold text-foreground"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={cn(
                        "w-full h-16 pl-14 pr-14 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold text-foreground",
                        formData.confirmPassword && formData.confirmPassword !== formData.password
                          ? "border-destructive/50 bg-destructive/5"
                          : formData.confirmPassword && formData.confirmPassword === formData.password
                          ? "border-primary/50"
                          : ""
                      )}
                      placeholder="••••••••"
                    />
                    {formData.confirmPassword && (
                      <div className="absolute right-5 top-1/2 -translate-y-1/2">
                        {formData.confirmPassword === formData.password
                          ? <Check className="w-5 h-5 text-primary" />
                          : <span className="text-[10px] font-black text-destructive uppercase tracking-widest whitespace-nowrap">No match</span>
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="xl"
                  className="w-full h-18 rounded-[1.25rem] btn-premium text-lg font-black tracking-tight"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create My Account'}
                </Button>
              </div>

              <div className="text-center">
                 <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                   By creating an account, you agree to our <span className="text-foreground font-bold hover:text-primary cursor-pointer transition-colors">Terms of Service</span> and <span className="text-foreground font-bold hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>.
                 </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
