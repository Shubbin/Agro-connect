import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PaymentFailedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
       {/* Ambient Effect */}
       <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-destructive/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="text-center max-w-xl relative z-10">
        <div className="w-32 h-32 bg-destructive/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 animate-scale-in group shadow-2xl shadow-destructive/10">
          <XCircle className="w-16 h-16 text-destructive group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter mb-6 uppercase">
          Transfer <span className="text-red-600">Failed</span>
        </h1>
        <p className="text-xl text-muted-foreground font-medium mb-12 max-w-md mx-auto italic">
          The capital synchronization was unsuccessful. Your procurement queue remains cached. Please re-authorize the settlement.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up">
          <Link to="/checkout" className="flex-1">
            <Button size="xl" className="w-full rounded-2xl btn-premium h-20 text-lg font-black tracking-tight shadow-xl shadow-primary/20">
              <RefreshCw className="w-6 h-6 mr-3" />
              Re-authorize
            </Button>
          </Link>
          <Link to="/cart" className="flex-1">
            <Button variant="outline" size="xl" className="w-full rounded-2xl border-border/50 h-20 text-lg font-black tracking-tight hover:bg-white transition-all">
              <ArrowLeft className="w-6 h-6 mr-3" />
              Return to Queue
            </Button>
          </Link>
        </div>
        
        <p className="mt-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-opacity hover:opacity-100 opacity-50">
           Ref: SEC-TRANS-ERR-TERMINAL-01
        </p>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
