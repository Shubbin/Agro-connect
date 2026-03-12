import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setIsSent(true);
      toast({
        title: 'Email sent',
        description: 'Check your inbox for password reset instructions.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reset email. Please try again.',
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

      <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
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

        {/* Premium Form Card */}
        <div className="glass-premium border-border/50 rounded-[2.5rem] p-10 lg:p-12 shadow-2xl">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>

          {!isSent ? (
            <>
              <div className="mb-10 space-y-3">
                <h1 className="text-4xl font-black text-foreground tracking-tighter leading-[0.95]">
                  Reset <span className="text-gradient">Password</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  Enter your email address to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Mail className="w-6 h-6" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-18 pl-14 pr-6 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-0 focus:bg-white rounded-2xl transition-all font-bold text-foreground text-lg placeholder:font-medium placeholder:text-muted-foreground/50"
                      placeholder="e.g. farmer@agrodirect.ng"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="xl"
                  className="w-full h-18 rounded-2xl btn-premium text-lg font-black tracking-tight"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Send Recovery Link'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-12 space-y-8 animate-fade-in">
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                <Mail className="w-12 h-12 text-primary animate-pulse-gentle" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-foreground tracking-tighter">Email Sent</h2>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                  A reset link has been sent to <br />
                  <span className="text-foreground font-black">{email}</span>
                </p>
              </div>
              <div className="pt-6">
                <Button
                  variant="ghost"
                  className="h-14 px-8 rounded-2xl text-muted-foreground hover:text-primary font-bold transition-all"
                  onClick={() => setIsSent(false)}
                >
                  Try another email
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
           <p className="text-muted-foreground text-sm font-medium">
             Need help? <span className="text-primary font-bold hover:underline cursor-pointer transition-all">Contact Support</span>
           </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
