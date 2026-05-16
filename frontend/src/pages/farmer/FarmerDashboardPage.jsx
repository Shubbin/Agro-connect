import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { walletAPI, ordersAPI, productsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Package, ShoppingCart, Wallet, MessageCircle, ArrowRight, ShieldCheck, TrendingUp, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Globe, Info, Terminal, Database, Landmark, Building2, UserCheck, RefreshCw, FileText, Smartphone, ChevronRight, Box } from 'lucide-react';
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

  const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price || 0);

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen pb-60">
        {/* Institutional Producer Console Registry Header */}
        <section className="bg-white border-b border-slate-200 pt-32 pb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-16">
              <div className="flex items-center gap-10">
                <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-5xl font-bold text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border-[10px] border-white relative group">
                   <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity rounded-[2rem]" />
                   {user?.name?.charAt(0) || 'P'}
                </div>
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-6">
                     <h1 className="text-5xl font-bold text-slate-900 tracking-tighter leading-none">Producer Console: {user?.name || 'Authorized Partner'}</h1>
                     <VerificationBadge status={user?.is_verified ? 'verified' : 'unverified'} />
                  </div>
                  <div className="flex flex-wrap items-center gap-8">
                     <div className="flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-xl">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Operational Sync Active</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-400">
                        <Database className="w-5 h-5 text-primary" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] leading-none">Node Registry: {user?.id?.toString().toUpperCase().slice(-8)}</span>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <Link to="/farmer/products/new">
                  <button className="h-20 px-12 rounded-2xl bg-primary text-white font-bold text-[11px] uppercase tracking-[0.3em] flex items-center gap-6 hover:bg-primary/90 transition-all shadow-[0_30px_70px_-15px_rgba(0,166,81,0.4)] active:scale-95 group">
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-700" />
                    Initialize Asset
                  </button>
                </Link>
                <Link to="/profile">
                  <button className="h-20 px-12 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-slate-50 transition-all shadow-2xl active:scale-95 flex items-center gap-4">
                    Identity Matrix
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-32 max-w-7xl">
          {/* High-Fidelity Performance Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-32">
            {[
              { icon: Landmark, label: 'Settled Capital', value: formatPrice(stats.balance), sub: 'Verified for Withdrawal', trend: 'Verified', color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
              { icon: Activity, label: 'Escrow Liquidity', value: formatPrice(stats.pending), sub: 'Logistics Synchronization', trend: 'Locked', color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100' },
              { icon: FileText, label: 'Active Contracts', value: stats.orders, sub: 'In Fulfillment Cycle', trend: 'Active', color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
              { icon: Database, label: 'Asset Listings', value: stats.products, sub: 'Verified Commodities', trend: 'Operational', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-14 rounded-[3.5rem] border border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] space-y-12 hover:shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] hover:border-primary/20 transition-all group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-1000">
                    <stat.icon className="w-48 h-48 text-slate-900" />
                 </div>
                 <div className="flex items-center justify-between relative z-10">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl transition-all", stat.bg, stat.color, stat.border, "group-hover:scale-110 duration-500")}>
                       <stat.icon className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-bold px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 tracking-[0.3em] uppercase shadow-inner">{stat.trend}</span>
                 </div>
                 <div className="relative z-10 space-y-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mb-4">{stat.label}</p>
                    <p className="text-5xl font-bold text-slate-900 tracking-tighter group-hover:text-primary transition-colors">{stat.value}</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                       <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,166,81,0.5)]" />
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.sub}</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-32">
            {/* Primary Institutional Trade Registry Ledger */}
            <div className="lg:col-span-2 space-y-24">
              <div className="bg-white rounded-[3rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] overflow-hidden group">
                <div className="px-14 py-14 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                   <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-2xl group-hover:scale-110 transition-transform duration-700">
                         <Activity className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                         <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">Active Trade Registry</h3>
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Real-time Institutional Settlement Logs</p>
                      </div>
                   </div>
                   <Link to="/farmer/orders" className="h-14 px-10 rounded-2xl bg-white border border-slate-200 text-slate-900 text-[11px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-slate-50 transition-all shadow-xl group/btn">
                      View Full Ledger
                      <ChevronRight className="w-5 h-5 text-primary group-hover/btn:translate-x-2 transition-transform" />
                   </Link>
                </div>
                <div className="p-0">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                               <th className="px-14 py-8 text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Contract Reference</th>
                               <th className="px-14 py-8 text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Authorized Capital</th>
                               <th className="px-14 py-8 text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Settlement Status</th>
                               <th className="px-14 py-8 text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] text-right">Operational Detail</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            {[
                               { id: 'TX-88293', type: 'Premium Commodity Bulk', amount: 1450000, status: 'Settled', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                               { id: 'TX-88294', type: 'Industrial Asset Transfer', amount: 825000, status: 'Escrow Lock', color: 'bg-amber-50 text-amber-700 border-amber-100' }
                            ].map((row) => (
                               <tr key={row.id} className="hover:bg-slate-50/30 transition-all group/row cursor-pointer">
                                  <td className="px-14 py-12">
                                     <p className="text-xl font-bold text-slate-900 group-hover/row:text-primary transition-colors tracking-tighter">Contract #{row.id}</p>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 opacity-60">{row.type}</p>
                                  </td>
                                  <td className="px-14 py-12">
                                     <p className="text-xl font-bold text-slate-900 tracking-tighter">{formatPrice(row.amount)}</p>
                                  </td>
                                  <td className="px-14 py-12">
                                     <span className={cn("inline-flex items-center px-5 py-2 rounded-xl text-[10px] font-bold border uppercase tracking-[0.2em] shadow-xl", row.color)}>{row.status}</span>
                                  </td>
                                  <td className="px-14 py-12 text-right">
                                     <button className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover/row:text-primary group-hover/row:border-primary/20 shadow-2xl transition-all ml-auto active:scale-90">
                                        <ArrowRight className="w-6 h-6" />
                                     </button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
              </div>

              {/* Module Command Center Hub */}
              <div className="grid sm:grid-cols-2 gap-12">
                 {[
                   { title: 'Asset Management', icon: Database, desc: 'Update commodity inventory, technical specifications, and regional pricing parameters.', link: '/farmer/products' },
                   { title: 'Contract Terminal', icon: FileText, desc: 'Monitor active trade fulfillment cycles and logistics verification protocol logs.', link: '/farmer/orders' },
                 ].map((card, i) => (
                   <Link key={i} to={card.link} className="bg-white p-16 rounded-[3.5rem] border border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] hover:border-primary/40 hover:shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] transition-all group flex flex-col justify-between h-full relative overflow-hidden active:scale-95">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      <div className="space-y-12 relative z-10">
                        <div className="w-20 h-20 rounded-[1.75rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-slate-900 group-hover:border-slate-800 transition-all duration-700 shadow-inner">
                           <card.icon className="w-10 h-10" />
                        </div>
                        <div className="space-y-6">
                          <h4 className="text-3xl font-bold text-slate-900 tracking-tighter group-hover:text-primary transition-colors">{card.title}</h4>
                          <p className="text-lg text-slate-500 leading-relaxed font-medium opacity-80">{card.desc}</p>
                        </div>
                      </div>
                      <div className="mt-16 pt-10 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-primary uppercase tracking-[0.3em] relative z-10 group-hover:translate-x-3 transition-transform duration-500">
                         Initialize Module 
                         <ChevronRight className="w-6 h-6" />
                      </div>
                   </Link>
                 ))}
              </div>
            </div>

            {/* Strategic Trade Intelligence & Synchronization Sidebar */}
            <div className="space-y-16">
               <div className="bg-slate-900 rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-[0_60px_120px_-20px_rgba(15,23,42,0.4)] group border border-slate-800">
                  <div className="absolute top-0 right-0 p-14 opacity-10 -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-[2000ms]">
                     <Globe className="w-80 h-80 text-white" />
                  </div>
                  <div className="relative z-10 space-y-12">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl">
                           <TrendingUp className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
                        </div>
                        <h3 className="text-[11px] font-bold text-primary uppercase tracking-[0.4em]">Trade Intelligence</h3>
                     </div>
                     <div className="space-y-8">
                        <h3 className="text-3xl font-bold tracking-tighter leading-tight">Optimization Window Detected</h3>
                        <p className="text-base text-slate-400 leading-relaxed font-medium italic opacity-80">
                           "Grade-A Cereal Assets are observing an 18.5% increase in institutional procurement demand within the Kano Supply Node."
                        </p>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] space-y-6 shadow-inner relative group/intel">
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/intel:opacity-100 transition-opacity duration-1000" />
                        <div className="flex items-center gap-4 relative z-10">
                           <Info className="w-5 h-5 text-primary" />
                           <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-300">Operational Insight</p>
                        </div>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed relative z-10">Adjust inventory volume and regional pricing parameters to optimize for the Q2 institutional procurement cycle.</p>
                     </div>
                     <button className="w-full h-18 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold text-primary uppercase tracking-[0.3em] flex items-center justify-center gap-6 hover:bg-white/10 transition-all shadow-2xl group/btn active:scale-95">
                        Update Asset Parameters
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-3 transition-transform duration-500" />
                     </button>
                  </div>
               </div>

               <div className="bg-white p-14 rounded-[3.5rem] border border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] space-y-12 relative overflow-hidden group/sync">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/sync:opacity-100 transition-opacity duration-1000" />
                  <div className="flex items-center justify-between border-b border-slate-50 pb-10 relative z-10">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-2xl group-hover/sync:rotate-12 transition-transform duration-700">
                           <MessageCircle className="w-7 h-7 shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                        </div>
                        <h3 className="font-bold text-2xl text-slate-900 tracking-tighter">Trade Sync</h3>
                     </div>
                     <div className="flex items-center gap-3 px-5 py-2 bg-primary text-white rounded-xl text-[10px] font-bold shadow-[0_15px_40px_-5px_rgba(0,166,81,0.3)] border-2 border-white">
                        1 Active
                     </div>
                  </div>
                  <div className="space-y-8 relative z-10">
                     <div className="flex items-center gap-8 group/msg cursor-pointer p-8 rounded-[2rem] hover:bg-white transition-all border border-transparent hover:border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-700" />
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-bold text-slate-300 group-hover/msg:bg-slate-900 group-hover/msg:text-primary transition-all duration-700 shadow-inner relative z-10">
                           <Building2 className="w-8 h-8" />
                        </div>
                        <div className="flex-1 space-y-1.5 relative z-10">
                           <p className="text-lg font-bold text-slate-900 group-hover/msg:text-primary transition-colors tracking-tighter">Institutional Buyer Node</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] leading-none">Inquiry: Contract #88294</p>
                        </div>
                     </div>
                  </div>
                  <Link to="/chat" className="flex items-center justify-center gap-5 text-[11px] font-bold text-slate-400 hover:text-primary transition-all uppercase tracking-[0.3em] relative z-10 group/terminal">
                     Open Communication Terminal Hub
                     <ArrowRight className="w-5 h-5 group-hover/terminal:translate-x-3 transition-transform duration-500" />
                  </Link>
               </div>
               
               {/* Terminal Status Ledger */}
               <div className="pt-10 flex items-center justify-center gap-12 opacity-10">
                  <Smartphone className="w-8 h-8 text-slate-900" />
                  <Monitor className="w-8 h-8 text-slate-900" />
                  <Landmark className="w-8 h-8 text-slate-900" />
                  <LayoutGrid className="w-8 h-8 text-slate-900" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FarmerDashboardPage;
