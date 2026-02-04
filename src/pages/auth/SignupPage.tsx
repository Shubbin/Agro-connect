import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, User, Tractor, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const SignupPage = () => {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<'farmer' | 'user' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole: 'farmer' | 'user') => {
    setRole(selectedRole);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role,
        phone: formData.phone,
      });
      
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      });
      
      navigate(role === 'farmer' ? '/farmer/dashboard' : '/marketplace');
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
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-background rounded-full" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-background rounded-full" />
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-primary" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">
              AgroDirect
            </span>
          </Link>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
            Join Nigeria's Largest<br />
            Agricultural Marketplace
          </h1>
          <ul className="space-y-4">
            {[
              'Connect directly with farmers or buyers',
              'Negotiate prices in real-time',
              'Secure payments & fast delivery',
              'AI-powered assistance 24/7',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-primary-foreground/90">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-primary-foreground/60 text-sm">
          Trusted by 10,000+ farmers and businesses across Nigeria
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Agro<span className="text-primary">Direct</span>
              </span>
            </Link>
          </div>

          {step === 'role' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Create your account
                </h2>
                <p className="text-muted-foreground mt-2">
                  Choose how you want to use AgroDirect
                </p>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => handleRoleSelect('user')}
                  className="flex items-center gap-4 p-5 border-2 border-border rounded-xl hover:border-primary hover:bg-secondary/50 transition-all group text-left"
                >
                  <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">I want to buy</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse and purchase fresh produce from verified farmers
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>

                <button
                  onClick={() => handleRoleSelect('farmer')}
                  className="flex items-center gap-4 p-5 border-2 border-border rounded-xl hover:border-primary hover:bg-secondary/50 transition-all group text-left"
                >
                  <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Tractor className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">I want to sell</h3>
                    <p className="text-sm text-muted-foreground">
                      List your produce and connect with buyers directly
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <button
                  type="button"
                  onClick={() => setStep('role')}
                  className="text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  ← Back to role selection
                </button>
                <h2 className="text-2xl font-bold text-foreground">
                  {role === 'farmer' ? 'Create a Farmer Account' : 'Create a Buyer Account'}
                </h2>
                <p className="text-muted-foreground mt-2">
                  Fill in your details to get started
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-agro w-full"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-agro w-full"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-agro w-full"
                    placeholder="+234 800 000 0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input-agro w-full pr-12"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input-agro w-full"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
