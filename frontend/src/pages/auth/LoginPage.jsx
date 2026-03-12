import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
              Access <span className="text-gradient">Portal</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Authenticate to manage your agro-operations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2 group">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                Security Identifier (Email)
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-18 pl-14 pr-6 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold text-foreground text-lg placeholder:font-medium placeholder:text-muted-foreground/50"
                  placeholder="name@organization.com"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                  Access Key (Password)
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-primary hover:underline underline-offset-4"
                >
                  Lost Access Key?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="w-6 h-6" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
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
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="xl"
                className="w-full h-18 rounded-2xl btn-premium text-lg font-black tracking-tight"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying Credentials...' : 'Secure Authorization'}
              </Button>
            </div>
          </form>

          <div className="mt-10 pt-10 border-t border-border/50 text-center">
            <p className="text-muted-foreground font-bold">
              New to the ecosystem?{' '}
              <Link to="/signup" className="text-primary hover:underline underline-offset-8 decoration-2 ml-1">
                Initialize Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center space-y-4">
           <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
             © 2026 AgroDirect Connect • Secure Terminal v2.0
           </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
