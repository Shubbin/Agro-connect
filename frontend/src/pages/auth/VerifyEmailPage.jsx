import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Leaf, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/services/api';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        await authAPI.verifyEmail(token);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg text-center relative z-10 transition-all">
        {/* Logo Terminal */}
        <div className="mb-12 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-4 group">
            <div className="w-16 h-16 glass-premium bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
               <span className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none block">
                 Agro<span className="text-primary">Direct</span>
               </span>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Protocol Terminal</span>
            </div>
          </Link>
        </div>

        {/* Status Architecture */}
        <div className="glass-premium border-primary/20 rounded-[3rem] p-12 shadow-2xl shadow-primary/5 animate-scale-in">
          {status === 'loading' && (
            <div className="py-8 space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                 <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                 <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary opacity-20" />
                 </div>
              </div>
              <div>
                 <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Verifying Identity</h2>
                 <p className="text-muted-foreground font-medium mt-2 italic">
                   Synchronizing with the central verification authority...
                 </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 space-y-8 animate-fade-in-up">
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group transition-transform hover:scale-105">
                <CheckCircle className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Identity Confirmed</h2>
                 <p className="text-muted-foreground font-medium mt-2 max-w-xs mx-auto">
                   Your account has been successfully synchronized and authorized for network access.
                 </p>
              </div>
              <Link to="/login" className="block pt-4">
                <Button size="xl" className="w-full rounded-2xl btn-premium h-16 text-lg font-black tracking-tight">
                  Enter Login Terminal
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8 space-y-8 animate-fade-in-up">
              <div className="w-24 h-24 bg-destructive/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group transition-transform hover:scale-105">
                <XCircle className="w-12 h-12 text-destructive group-hover:scale-110 transition-transform" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Protocol Error</h2>
                 <p className="text-muted-foreground font-medium mt-2 max-w-xs mx-auto">
                   The provided verification token is invalid or has reached its expiration threshold.
                 </p>
              </div>
              <div className="flex flex-col gap-4">
                 <Link to="/login" className="block pt-4">
                   <Button size="xl" variant="outline" className="w-full rounded-2xl border-border/50 h-16 text-lg font-black tracking-tight hover:bg-white transition-all">
                     Back to Terminal
                   </Button>
                 </Link>
                 <p className="text-[10px] font-black uppercase text-muted-foreground">Contact support if this persists</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
