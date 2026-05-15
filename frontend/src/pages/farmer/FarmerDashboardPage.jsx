import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { walletAPI, ordersAPI, productsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Package, ShoppingCart, Wallet, MessageCircle, ArrowRight, Leaf, Sparkles, ShieldCheck, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { cn } from '@/lib/utils';

export const FarmerDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, balance: 0, pending: 0 });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [wallet, orders, products] = await Promise.all([
          walletAPI.getBalance().catch(() => ({ available: 0, pending: 0 })),
          ordersAPI.getFarmerOrders().catch(() => []),
          productsAPI.getByFarmer(user.id),
        ]);
        setStats({
          products: products.length,
          orders: orders.length,
          balance: wallet?.available || 0,
          pending: wallet?.pending || 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, [user]);

  const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-background pb-32">
        {/* Cinematic Backdrop */}
        <div className="absolute top-0 right-0 w-full h-[60vh] bg-[radial-gradient(circle_at_80%_20%,rgba(0,100,0,0.05),transparent)] pointer-events-none" />

        <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
          
          {/* PHASE 1: COMMAND HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 reveal-up">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                <Activity className="w-4 h-4 animate-pulse" />
                Operational Status: Active
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter uppercase leading-[0.85] max-w-2xl">
                 Producer <br />
                 <span className="text-gradient">Command Deck</span>
              </h1>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center font-black text-primary border border-primary/10">
                       {user?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Welcome back, Operator</p>
                       <p className="text-xl font-black text-foreground tracking-tight">{user?.name || 'Agro Partner'}</p>
                    </div>
                 </div>
                 <div className="w-px h-10 bg-border" />
                 <VerificationBadge status={user?.is_verified ? 'verified' : 'unverified'} className="px-5 py-2 rounded-xl" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
               <Link to="/farmer/products/new">
                  <button className="btn-premium h-18 px-10 group">
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                    Expand Inventory
                  </button>
               </Link>
            </div>
          </div>

          {/* PHASE 2: INTELLIGENCE STRIP */}
          <div className="mb-16 reveal-up" style={{ animationDelay: '100ms' }}>
            <div className="glass-card p-10 rounded-[3rem] border-primary/30 bg-primary/[0.03] flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles className="w-32 h-32 text-primary" />
               </div>
               <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center shrink-0 shadow-2xl shadow-primary/30 animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
               </div>
               <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                     <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase">Market Intelligence</h3>
                     <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-lg">High Priority</span>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl">
                    Llama Analysis: <span className="text-foreground font-bold">Yam prices in Abuja Hub</span> are projected to rise by <span className="text-primary font-bold">18.4%</span> over the next 72 hours. Recommend holding stock for peak margin.
                  </p>
               </div>
               <button className="h-14 px-8 rounded-2xl bg-white border border-border/50 font-black uppercase tracking-widest text-[10px] hover:bg-muted transition-all active:scale-95 shrink-0 shadow-sm">
                  Full Analytics Report
               </button>
            </div>
          </div>

          {/* PHASE 3: KPI TERMINAL */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 reveal-up" style={{ animationDelay: '200ms' }}>
            {[
              { icon: Package, label: 'Active Inventory', value: stats.products, sub: 'Verified Listings', color: 'primary', trend: '+12%', type: 'units' },
              { icon: ShoppingCart, label: 'Order Velocity', value: stats.orders, sub: 'Confirmed Contracts', color: 'primary', trend: '+5', type: 'orders' },
              { icon: Wallet, label: 'Liquidity Reserve', value: formatPrice(stats.balance), sub: 'Ready for Payout', color: 'primary', trend: 'Verified', type: 'balance' },
              { icon: Activity, label: 'Escrow Volume', value: formatPrice(stats.pending), sub: 'Awaiting Settlement', color: 'primary', trend: 'In-Transit', type: 'pending' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-10 rounded-[3rem] border-white/60 bg-white/40 group relative overflow-hidden active:scale-[0.98]">
                 <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-12 group-hover:rotate-0">
                    <stat.icon className="w-32 h-32" />
                 </div>
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-inner">
                       <stat.icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-white border border-border/50 shadow-sm">{stat.trend}</span>
                 </div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{stat.label}</h4>
                 <div className="text-4xl font-black text-foreground tracking-tighter mb-2 leading-none">{stat.value}</div>
                 <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* PHASE 4: MISSION NAVIGATION */}
          <div className="grid lg:grid-cols-3 gap-10 mb-16 reveal-up" style={{ animationDelay: '300ms' }}>
            {[
              { title: 'Inventory Control', icon: Package, desc: 'Configure product metrics, pricing tiers, and global availability.', link: '/farmer/products' },
              { title: 'Contract Management', icon: ShoppingCart, desc: 'Monitor active sales cycles, track deliveries, and manage buyer relations.', link: '/farmer/orders' },
              { title: 'Financial Terminal', icon: Wallet, desc: 'Access wallet settlements, withdrawal logs, and trade financial history.', link: '/farmer/wallet' }
            ].map((action, i) => (
              <Link key={i} to={action.link} className="glass-card p-12 rounded-[3.5rem] border-white/60 bg-white/40 hover:bg-white/80 transition-all duration-700 group relative overflow-hidden active:scale-[0.98]">
                 <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-10 translate-x-8 group-hover:translate-x-0 transition-all duration-1000">
                    <BarChart3 className="w-24 h-24 text-primary" />
                 </div>
                 <div className="w-20 h-20 rounded-[2rem] bg-secondary flex items-center justify-center mb-10 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-700">
                    <action.icon className="w-10 h-10" />
                 </div>
                 <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase mb-4 group-hover:text-primary transition-colors">{action.title}</h3>
                 <p className="text-lg text-muted-foreground font-medium mb-12 leading-relaxed">{action.desc}</p>
                 <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:gap-8 transition-all">
                    Access System
                    <ArrowRight className="w-5 h-5" />
                 </div>
              </Link>
            ))}
          </div>

          {/* PHASE 5: SUPPORT TERMINALS */}
          <div className="grid lg:grid-cols-2 gap-10 reveal-up" style={{ animationDelay: '400ms' }}>
            {/* Communication Hub */}
            <Link to="/chat" className="glass-card p-10 rounded-[3.5rem] border-primary/20 bg-primary/[0.02] flex items-center gap-10 hover:bg-white transition-all group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-700">
                  <MessageCircle className="w-12 h-12 text-primary" />
               </div>
               <div className="flex-1 space-y-2 relative z-10">
                  <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">Trade Communication</h3>
                  <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                    Direct low-latency negotiation with verified buyers.
                  </p>
               </div>
               <div className="w-16 h-16 rounded-[1.5rem] btn-premium shrink-0 hidden sm:flex items-center justify-center">
                  <ArrowRight className="w-7 h-7" />
               </div>
            </Link>

            {/* Security Certification Hub */}
            <div className="glass-card p-10 rounded-[3.5rem] border-accent-gold/20 bg-accent-gold/[0.02] flex items-center gap-10 hover:bg-white transition-all group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-24 h-24 bg-accent-gold/10 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-700">
                  <ShieldCheck className="w-12 h-12 text-accent-gold" />
               </div>
               <div className="flex-1 space-y-2 relative z-10">
                  <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">Trust Protocol</h3>
                  <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                    Level up your operational credibility score.
                  </p>
               </div>
               <button className="h-16 px-8 rounded-2xl border-2 border-accent-gold/20 text-accent-gold font-black uppercase tracking-widest text-[10px] hover:bg-accent-gold hover:text-white transition-all shrink-0">
                  {user?.is_verified ? 'Manage Badge' : 'Apply for Trust'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FarmerDashboardPage;
