import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff, Mail, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [otpToken, setOtpToken] = useState('');
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('remembered_email') ? true : false);
  const [formData, setFormData] = useState({
    email: localStorage.getItem('remembered_email') || '',
    password: '',
  });

  const { login, requestOtp, verifyOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await requestOtp(formData.email);
      setStep('otp');
      toast({
        title: 'OTP Sent',
        description: 'Please check your email for the 6-digit code.',
      });
    } catch (error) {
      toast({
        title: 'Failed to send OTP',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyOtp(formData.email, otpToken);
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });

      const storedUser = localStorage.getItem('agro_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        navigate(user.role === 'farmer' ? '/farmer/dashboard' : '/marketplace');
      }
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: 'Invalid or expired OTP code.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });

      // Check role from stored user to redirect
      const storedUser = localStorage.getItem('agro_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        navigate(user.role === 'farmer' ? '/farmer/dashboard' : '/marketplace');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[100%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[80%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-lg relative z-10 animate-fade-in-up md:max-w-lg">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-4 group">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-black text-foreground tracking-tighter">
              Agro<span className="text-primary">Direct</span>
            </span>
          </Link>
        </div>

        {/* Premium Access Terminal Card */}
        <div className="glass-premium border-border/50 rounded-[2.5rem] p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="text-center mb-10 space-y-3">
            <h1 className="text-4xl font-black text-foreground tracking-tighter leading-[0.95]">
              Sign <span className="text-gradient">In</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Sign in to your account to buy or sell.
            </p>
          </div>

          <form onSubmit={step === 'email' ? handleRequestOtp : handleVerifyOtp} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                Your Email
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <input
                  type="email"
                  required
                  disabled={step === 'otp'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-18 pl-14 pr-6 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold text-foreground text-lg placeholder:font-medium placeholder:text-muted-foreground/50 disabled:opacity-50"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            {step === 'otp' ? (
              <div className="space-y-2 group animate-in slide-in-from-bottom-2 duration-500">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Check className="w-6 h-6" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value)}
                    className="w-full h-18 pl-14 pr-6 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold text-foreground text-lg tracking-[0.5em]"
                    placeholder="000000"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-xs font-bold text-primary hover:underline underline-offset-4 mt-2"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <div className="space-y-2 group animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                    Your Password (Optional)
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-primary hover:underline underline-offset-4"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="w-6 h-6" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-18 pl-14 pr-14 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold text-foreground text-lg"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium italic">
                  * Leaving password blank will send an OTP code instead.
                </p>
              </div>
            )}

            {step === 'email' && (
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-3 cursor-pointer group/check">
                  <div className="relative w-6 h-6">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer appearance-none w-6 h-6 rounded-lg bg-secondary/50 border border-border group-hover/check:border-primary/50 checked:bg-primary checked:border-primary transition-all cursor-pointer shadow-inner"
                    />
                    <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover/check:text-foreground transition-colors">
                    Remember me
                  </span>
                </label>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                size="xl"
                className="w-full h-18 rounded-2xl btn-premium text-lg font-black tracking-tight"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (
                  step === 'email' 
                    ? (formData.password ? 'Sign In' : 'Get Secure Code') 
                    : 'Verify & Enter'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-10 pt-10 border-t border-border/50 text-center">
            <p className="text-muted-foreground font-bold">
              New to Agro-Direct?{' '}
              <Link to="/signup" className="text-primary hover:underline underline-offset-8 decoration-2 ml-1">
                Join here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center space-y-4">
           <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
             © 2026 AgroDirect Connect • Direct Farming
           </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
