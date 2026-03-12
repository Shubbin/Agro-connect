import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Ambient Effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="text-center max-w-xl relative z-10">
        <div className="w-32 h-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 animate-scale-in group shadow-2xl shadow-primary/10">
          <CheckCircle className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter mb-6 uppercase">
          Authorization <span className="text-gradient">Successful</span>
        </h1>
        <p className="text-xl text-muted-foreground font-medium mb-12 max-w-md mx-auto italic">
          Capital transfer verified. The production pipeline has been notified and fulfillment is now in progress.
        </p>

        <div className="glass-premium rounded-[3rem] p-10 mb-12 border-primary/20 shadow-2xl shadow-primary/5 animate-fade-in-up">
          <div className="flex items-center justify-center gap-6 text-left">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-105">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Contract Status</p>
              <p className="text-xl font-black text-foreground tracking-tight italic">Logistics Cycle Initialized</p>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                Estimated arrival: 2-5 standard business cycles.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Link to="/orders" className="flex-1">
            <Button size="xl" className="w-full rounded-2xl btn-premium h-20 text-lg font-black tracking-tight shadow-xl shadow-primary/20">
              Review Acquisitions
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
          <Link to="/marketplace" className="flex-1">
            <Button variant="outline" size="xl" className="w-full rounded-2xl border-border/50 h-20 text-lg font-black tracking-tight hover:bg-white transition-all">
              Market Terminal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
