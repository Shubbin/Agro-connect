import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, MessageCircle, Clock, CheckCircle, Truck, X, Leaf, ChevronRight, Hash, ShieldCheck, ExternalLink, Database, RefreshCw, FileText, ArrowRight, Activity, Archive, Filter, Landmark, Box, Smartphone, Monitor, LayoutGrid, Calendar, Globe, Shield } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ordersAPI } from '@/services/api';
import { cn } from '@/lib/utils';
import { OrderTimeline } from '@/components/orders/OrderTimeline';

const statusConfig = {
  pending: { label: 'Pending Settlement', icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-100 shadow-[0_20px_50px_-10px_rgba(217,119,6,0.1)]' },
  confirmed: { label: 'Trade Authorized', icon: CheckCircle, color: 'bg-blue-50 text-blue-700 border-blue-100 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.1)]' },
  shipped: { label: 'Logistics Active', icon: Truck, color: 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-[0_20px_50px_-10px_rgba(79,70,229,0.1)]' },
  delivered: { label: 'Contract Fulfilled', icon: Package, color: 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_20px_50px_-10px_rgba(0,166,81,0.1)]' },
  cancelled: { label: 'Trade Voided', icon: X, color: 'bg-red-50 text-red-700 border-red-100 shadow-[0_20px_50px_-10px_rgba(220,38,38,0.1)]' },
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getAll();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirmDelivery = async (orderId) => {
    try {
      if (!confirm('Authorize Final Fulfillment Verification: Are you certain this procurement contract has reached its final destination hub node?')) return;
      await ordersAPI.confirmDelivery(orderId);
      const data = await ordersAPI.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to confirm delivery:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-slate-50 min-h-screen pb-60">
        {/* Institutional Procurement Manifest Header Registry */}
        <section className="bg-white border-b border-slate-200 pt-32 pb-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
           <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-16">
                 <div className="space-y-10">
                    <div className="inline-flex items-center gap-6 text-[11px] font-bold text-white uppercase tracking-[0.4em] bg-slate-900 px-8 py-3 rounded-2xl border border-slate-800 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.4)]">
                       <FileText className="w-6 h-6 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                       Corporate Trade Portfolio Registry
                    </div>
                    <div className="space-y-6">
                       <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-none transition-all">Procurement Ledger Hub</h1>
                       <p className="text-2xl font-medium text-slate-500 max-w-4xl leading-relaxed opacity-80">
                          Comprehensive audit of active trade cycles, logistics synchronization, and historical settlement manifests for verified institutional procurement cycles.
                       </p>
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-8">
                    <button className="h-18 px-10 rounded-2xl bg-white border border-slate-200 text-slate-900 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-slate-50 shadow-2xl transition-all flex items-center gap-5 active:scale-95 group/audit">
                       <Filter className="w-6 h-6 text-primary group-hover/audit:rotate-90 transition-transform duration-700" />
                       Audit Filtering
                    </button>
                    <button className="h-18 px-12 rounded-2xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] transition-all flex items-center gap-6 active:scale-95 group/export">
                       <ExternalLink className="w-6 h-6 text-primary group-hover/export:translate-y-[-4px] group-hover/export:translate-x-[4px] transition-transform duration-700" />
                       Export Statement Manifest
                    </button>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-32 max-w-7xl">
          {isLoading ? (
            <div className="space-y-20">
               {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[4rem] h-96 animate-pulse border border-slate-200 shadow-sm" />
               ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-[5rem] p-48 text-center border border-slate-200 shadow-[0_80px_200px_-50px_rgba(0,0,0,0.1)] max-w-5xl mx-auto space-y-16 relative overflow-hidden group/empty">
               <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-[2000ms]" />
               <div className="w-48 h-48 bg-slate-50 border border-slate-100 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-inner transform -rotate-12 relative z-10 group-hover/empty:rotate-0 transition-transform duration-1000">
                  <Archive className="w-20 h-20 text-slate-100" />
               </div>
               <div className="space-y-8 relative z-10 px-20">
                  <h2 className="text-5xl font-bold text-slate-900 tracking-tighter leading-none">Zero Active Procurement Manifests</h2>
                  <p className="text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed opacity-80">
                     Explore verified agricultural commodity nodes in the global marketplace hub to initiate your first institutional trade cycle manifest.
                  </p>
               </div>
               <Link to="/marketplace" className="inline-block relative z-10">
                  <button className="h-24 px-20 rounded-[1.5rem] bg-slate-900 text-white font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-slate-800 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.4)] transition-all active:scale-95 flex items-center gap-8 group/discovery">
                    Initialize Trade Discovery Hub
                    <ChevronRight className="w-7 h-7 group-hover/discovery:translate-x-4 transition-transform duration-700" />
                  </button>
               </Link>
            </div>
          ) : (
            <div className="space-y-28">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <div key={order.id} className="bg-white rounded-[4rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] overflow-hidden hover:border-primary/40 transition-all duration-1000 group/card relative">
                    <div className="absolute inset-0 bg-slate-50/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    
                    {/* Institutional Contract Registry Hub Header */}
                    <div className="bg-white px-16 py-12 flex flex-col xl:flex-row xl:items-center justify-between gap-16 border-b border-slate-100 relative z-10">
                      <div className="flex flex-wrap items-center gap-20">
                         <div className="flex items-center gap-8 group/idnode">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-slate-900 border border-slate-800 flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] group-hover/idnode:scale-110 transition-all duration-700 group-hover/idnode:rotate-12">
                               <Hash className="w-10 h-10 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                            </div>
                            <div className="space-y-2">
                               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mb-1 opacity-60">Contract Manifest Identifier</p>
                               <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">#{order.id.toString().toUpperCase().slice(-8)}</p>
                            </div>
                         </div>
                         <div className="hidden lg:block h-16 w-px bg-slate-100" />
                         <div className="space-y-2">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mb-1 opacity-60">Cycle Authorized Hub</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tighter flex items-center gap-4 leading-none">
                               <Calendar className="w-6 h-6 text-primary" />
                               {formatDate(order.createdAt)}
                            </p>
                         </div>
                         <div className="hidden lg:block h-16 w-px bg-slate-100" />
                         <div className="space-y-2">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mb-1 opacity-60">Operational Sync Hub</p>
                            <div className="flex items-center gap-4">
                               <Activity className="w-6 h-6 text-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                               <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.3em]">Node Active</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-12">
                        <div className={cn(
                          "inline-flex items-center gap-6 px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.4em] border shadow-2xl transition-all duration-700 group-hover/card:scale-105",
                          status.color
                        )}>
                          <StatusIcon className="w-7 h-7" />
                          {status.label}
                        </div>
                        <div className="text-right space-y-2">
                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-2 leading-none opacity-60">Net Settlement Magnitude</p>
                           <p className="text-5xl font-black text-slate-900 tracking-tighter group-hover/card:text-primary transition-colors duration-700 leading-none">
                             {formatPrice(order.total)}
                           </p>
                        </div>
                      </div>
                    </div>

                    {/* Procurement Analysis Detail Matrix Registry */}
                    <div className="p-16 relative z-10">
                      <div className="grid lg:grid-cols-3 gap-32">
                         <div className="lg:col-span-2 space-y-20">
                            <div className="space-y-16">
                               <div className="flex items-center gap-8 border-b border-slate-50 pb-10">
                                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)]">
                                     <Database className="w-6 h-6" />
                                  </div>
                                  <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.5em]">Commodity Allocation Manifest Hub</h4>
                               </div>
                               <div className="space-y-16">
                                 {order.items.map((item) => (
                                   <div key={item.id} className="flex flex-col sm:flex-row gap-12 group/item relative overflow-hidden p-8 rounded-[3rem] bg-slate-50/30 border border-transparent hover:border-slate-100 hover:bg-white transition-all duration-1000 hover:shadow-2xl">
                                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                                     <div className="w-40 h-40 bg-white rounded-[2.5rem] overflow-hidden shrink-0 border border-slate-100 shadow-2xl group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-[2000ms] relative z-10">
                                        <img
                                          src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                                          alt={item.product?.name}
                                          className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-[2000ms]"
                                        />
                                     </div>
                                     <div className="flex-1 min-w-0 flex flex-col justify-center space-y-6 relative z-10">
                                       <div className="space-y-3">
                                          <h4 className="text-4xl font-black text-slate-900 tracking-tighter group-hover/item:text-primary transition-all duration-700 leading-none">{item.product?.name}</h4>
                                          <div className="flex flex-wrap items-center gap-8">
                                             <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] opacity-60">
                                                <Hash className="w-5 h-5 text-primary" />
                                                ASSET NODE: {item.product?.id.slice(-8).toUpperCase()}
                                             </div>
                                             <div className="w-2 h-2 rounded-full bg-slate-200" />
                                             <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] opacity-60">
                                                <Landmark className="w-5 h-5 text-primary" />
                                                Source Terminal: {order.farmerName || 'Verified Producer Node'}
                                             </div>
                                          </div>
                                       </div>
                                       <div className="flex flex-wrap items-center gap-10">
                                          <div className="flex items-center gap-5 bg-slate-900 px-8 py-3 rounded-2xl border border-slate-800 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)]">
                                             <span className="text-[12px] font-bold text-white uppercase tracking-[0.3em] leading-none">
                                                Magnitude: <span className="text-primary font-black ml-2">{item.quantity} {item.product?.unit}</span>
                                             </span>
                                          </div>
                                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] flex items-center gap-4 opacity-60">
                                             <RefreshCw className="w-5 h-5" />
                                             Unit Valuation: {formatPrice(item.product?.price)}
                                          </p>
                                       </div>
                                     </div>
                                     <div className="text-right flex flex-col justify-center space-y-3 relative z-10 border-t sm:border-t-0 sm:border-l border-slate-100 pt-8 sm:pt-0 sm:pl-12">
                                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] leading-none opacity-60">Asset Settlement Value</p>
                                       <p className="text-4xl font-black text-slate-900 tracking-tighter group-hover/item:text-primary transition-all duration-1000 leading-none">
                                         {formatPrice((item.product?.price || 0) * item.quantity)}
                                       </p>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                            </div>
                         </div>

                         {/* Strategic Logistics & Hub Authorization Console */}
                         <div className="bg-slate-900 p-16 rounded-[4rem] border border-slate-800 space-y-20 flex flex-col justify-between relative group/sidebar overflow-hidden shadow-[0_80px_150px_-30px_rgba(15,23,42,0.5)]">
                            <div className="absolute top-0 right-0 p-16 opacity-[0.03] -mr-24 -mt-24 group-hover/sidebar:scale-125 transition-transform duration-[3000ms]">
                               <Truck className="w-[500px] h-[500px] text-white" />
                            </div>
                            
                            <div className="space-y-16 relative z-10">
                               <div className="space-y-12">
                                  <div className="flex items-center gap-6 border-b border-white/5 pb-10">
                                     <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center text-primary shadow-inner group-hover/sidebar:rotate-12 transition-transform duration-700">
                                        <MapPin className="w-8 h-8 shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
                                     </div>
                                     <div className="space-y-1">
                                        <h4 className="text-[12px] font-bold text-primary uppercase tracking-[0.5em]">Logistics Hub Destination</h4>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em]">Fulfillment Node Verification</p>
                                     </div>
                                  </div>
                                  <div className="p-12 bg-white/5 rounded-[3rem] border border-white/10 shadow-inner space-y-6 group/locnode">
                                     <p className="text-2xl font-black text-white leading-relaxed tracking-tighter italic opacity-90 group-hover/locnode:text-primary transition-all duration-700">"{order.deliveryAddress}"</p>
                                     <div className="pt-8 flex items-center justify-between border-t border-white/5">
                                        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.4em]">Verified Delivery Node Terminal</p>
                                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                           <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                           <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em]">Link Authorized</span>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                               
                               <div className="space-y-12">
                                  <div className="flex items-center justify-between group/settlematrix">
                                     <div className="space-y-4">
                                        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.5em] leading-none opacity-60">Settlement Matrix magnitude</p>
                                        <p className="text-7xl font-black text-white tracking-tighter group-hover/settlematrix:text-primary transition-all duration-[1000ms] leading-none">{formatPrice(order.total)}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-8 bg-white/5 px-10 py-6 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group/escrow">
                                     <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/escrow:opacity-100 transition-opacity duration-1000" />
                                     <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-primary border border-slate-800 shadow-2xl group-hover/escrow:rotate-12 transition-transform duration-700 relative z-10">
                                        <ShieldCheck className="w-8 h-8 shadow-[0_0_15px_rgba(0,166,81,0.3)]" />
                                     </div>
                                     <div className="space-y-1 relative z-10">
                                        <p className="text-[12px] font-bold text-white uppercase tracking-[0.4em] leading-none mb-1">Escrow Safeguard Active</p>
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] leading-none">Capital Authorized in Settlement Node</p>
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-8 relative z-10">
                               {order.status === 'shipped' && (
                                 <button 
                                   onClick={() => handleConfirmDelivery(order.id)}
                                   className="w-full h-24 bg-primary text-white text-[13px] font-bold uppercase tracking-[0.4em] rounded-[1.5rem] shadow-[0_40px_100px_-20px_rgba(0,166,81,0.6)] hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-8 group/verify"
                                 >
                                   <CheckCircle className="w-10 h-10 group-hover/verify:rotate-12 transition-transform duration-700" />
                                   Authorize Final Fulfillment
                                 </button>
                               )}
                               <div className="grid grid-cols-2 gap-8">
                                  <Link to="/chat" className="block">
                                    <button className="w-full h-20 bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-[0.4em] rounded-[1.25rem] hover:bg-white/10 hover:text-primary transition-all flex items-center justify-center gap-5 shadow-2xl group/syncbtn active:scale-95">
                                      <MessageCircle className="w-7 h-7 text-primary group-hover/syncbtn:scale-125 transition-transform duration-700" />
                                      Trade Sync Hub
                                    </button>
                                  </Link>
                                  <button className="w-full h-20 bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-[0.4em] rounded-[1.25rem] hover:bg-white/10 hover:text-primary transition-all flex items-center justify-center gap-5 shadow-2xl group/archivebtn active:scale-95">
                                    <Archive className="w-7 h-7 text-primary group-hover/archivebtn:scale-125 group-hover/archivebtn:rotate-[-12deg] transition-transform duration-700" />
                                    Archive manifest
                                  </button>
                               </div>
                               <div className="flex items-center gap-6 opacity-10 justify-center pt-12 border-t border-white/5">
                                  <Smartphone className="w-6 h-6 text-white" />
                                  <Monitor className="w-6 h-6 text-white" />
                                  <Landmark className="w-6 h-6 text-white" />
                                  <LayoutGrid className="w-6 h-6 text-white" />
                                  <Globe className="w-6 h-6 text-white" />
                                  <Database className="w-6 h-6 text-white" />
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default OrdersPage;
