import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { AITipCard } from '@/components/ai/AITipCard';
import { walletAPI, ordersAPI, productsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Package, ShoppingCart, Wallet, MessageCircle, ArrowRight, Leaf, Sparkles, ShieldCheck } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

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
      <div className="relative min-h-screen bg-background">
        {/* Abstract Background Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                <Leaf className="w-3 h-3" />
                Farm Summary
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.9] max-w-xl">
                 Farmer <span className="text-gradient">Dashboard</span>
              </h1>
              <div className="flex items-center gap-4">
                 <p className="text-xl text-muted-foreground font-medium max-w-md">
                   Welcome, {user?.name || 'Partner'}. Monitor your yields and manage operations.
                 </p>
                 <VerificationBadge status={user?.is_verified ? 'verified' : 'unverified'} className="px-4 py-1.5" />
              </div>
            </div>
            <Link to="/farmer/products/new" className="group">
              <Button size="xl" className="rounded-2xl btn-premium h-16 px-8 text-lg font-black tracking-tight">
                <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                Add New Product
              </Button>
            </Link>
          </div>

          {/* AI Insights Bar */}
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="glass-premium p-8 rounded-[2.5rem] border-primary/20 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-24 h-24 text-primary" />
               </div>
               <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <Sparkles className="w-8 h-8 text-white" />
               </div>
               <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-black text-foreground tracking-tight">Market News</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Local mango prices are up <span className="text-primary font-bold">15%</span> this week in Kaduna. Consider updating your listings to maximize profit.
                  </p>
               </div>
               <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5 font-bold">View Market Trends</Button>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {[
              { icon: Package, label: 'Products for Sale', value: stats.products, sub: 'Product Listings', color: 'primary', trend: '+2' },
              { icon: ShoppingCart, label: 'New Orders', value: stats.orders, sub: 'Recent Sales', color: 'blue', trend: '+5' },
              { icon: Wallet, label: 'Money You Can Withdraw', value: formatPrice(stats.balance), sub: 'Available for Payout', color: 'green', trend: 'Verified' },
              { icon: Wallet, label: 'Money Coming Soon', value: formatPrice(stats.pending), sub: 'In Escrow Settlement', color: 'amber', trend: 'Locked' },
            ].map((stat, i) => (
              <div key={i} className="glass-premium p-8 rounded-[2rem] border-border/50 group hover:border-primary/50 transition-all duration-500 relative overflow-hidden active:scale-[0.98]">
                 <div className="absolute bottom-[-10%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
                    <stat.icon className="w-24 h-24" />
                 </div>
                 <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-${stat.color}/10 flex items-center justify-center text-${stat.color} shadow-inner`}>
                       <stat.icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-secondary text-muted-foreground">{stat.trend}</span>
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</h4>
                 <div className="text-3xl font-black text-foreground tracking-tighter mb-1">{stat.value}</div>
                 <p className="text-xs text-muted-foreground font-medium">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Quick Action Navigation */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            {[
              { title: 'Your Store', icon: Package, desc: 'Manage your products and prices.', link: '/farmer/products', color: 'primary' },
              { title: 'Sales Record', icon: ShoppingCart, desc: 'Track your sales and talk to buyers.', link: '/farmer/orders', color: 'blue' },
              { title: 'Money & Payments', icon: Wallet, desc: 'Manage your money and withdrawals.', link: '/farmer/wallet', color: 'green' }
            ].map((action, i) => (
              <Link key={i} to={action.link} className="glass-premium p-10 rounded-[2.5rem] border-border/50 hover:border-primary/50 transition-all duration-500 group relative overflow-hidden active:scale-[0.98]">
                 <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowRight className="w-12 h-12 text-primary/20" />
                 </div>
                 <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center mb-8 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <action.icon className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-black text-foreground tracking-tight mb-3 group-hover:text-primary transition-colors">{action.title}</h3>
                 <p className="text-muted-foreground font-medium mb-8 leading-relaxed">{action.desc}</p>
                 <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                    Open
                    <ArrowRight className="w-4 h-4" />
                 </div>
              </Link>
            ))}
          </div>

          {/* Operational Support & Verification Tiles */}
          <div className="grid lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {/* Chat Tile */}
            <Link to="/chat" className="glass-premium p-8 rounded-[2.5rem] border-primary/20 flex items-center gap-8 hover:bg-secondary/30 transition-all group overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-20 h-20 bg-primary/10 rounded-[1.75rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle className="w-10 h-10 text-primary" />
               </div>
               <div className="flex-1 space-y-1 relative z-10">
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Chat with Buyers</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Talk directly to buyers and close deals.
                  </p>
               </div>
               <Button size="icon" className="w-14 h-14 rounded-2xl btn-premium shadow-primary/20 shrink-0">
                  <ArrowRight className="w-6 h-6" />
               </Button>
            </Link>

            {/* Verification Center Tile */}
            <div className="glass-premium p-8 rounded-[2.5rem] border-amber-500/20 flex items-center gap-8 hover:bg-amber-500/5 transition-all group overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-20 h-20 bg-amber-500/10 rounded-[1.75rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="w-10 h-10 text-amber-500" />
               </div>
               <div className="flex-1 space-y-1 relative z-10">
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Get Trusted Badge</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Get verified to build more trust with buyers.
                  </p>
               </div>
               <Button size="xl" variant="outline" className="rounded-2xl border-amber-500/20 hover:bg-amber-500/10 text-amber-500 font-black tracking-tight shrink-0">
                  {user?.is_verified ? 'Manage Badge' : 'Get Verified'}
               </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FarmerDashboardPage;
