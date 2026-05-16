import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ordersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, Truck, Package, X, ArrowLeft, MessageCircle, MoreVertical, ExternalLink, MapPin, Box, ChevronRight, Hash, ShieldCheck, Terminal, Filter, RefreshCw, Activity, Landmark, Database, FileText, Smartphone, Monitor, Globe } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending Settlement', icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-100 shadow-[0_20px_50px_-10px_rgba(217,119,6,0.1)]' },
  confirmed: { label: 'Trade Authorized', icon: CheckCircle, color: 'bg-blue-50 text-blue-700 border-blue-100 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.1)]' },
  shipped: { label: 'Logistics Active', icon: Truck, color: 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-[0_20px_50px_-10px_rgba(79,70,229,0.1)]' },
  delivered: { label: 'Contract Completed', icon: Package, color: 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_20px_50px_-10px_rgba(0,166,81,0.1)]' },
  cancelled: { label: 'Transaction Voided', icon: X, color: 'bg-red-50 text-red-700 border-red-100 shadow-[0_20px_50px_-10px_rgba(220,38,38,0.1)]' },
};

export const FarmerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getFarmerOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      if (newStatus === 'shipped') {
        const tracking = prompt("Enter Logistics Tracking Identifier (e.g. AGRO-LOG-2024):");
        const estDelivery = prompt("Enter Estimated Fulfillment Duration (e.g. 72 Hours):");
        if (!tracking) return;
        await ordersAPI.updateTracking(orderId, tracking, estDelivery);
      } else if (newStatus === 'delivered') {
        if (!confirm('Authorize Final Fulfillment Verification: Are you certain this contract manifest has reached its final logistics destination hub?')) return;
        await ordersAPI.confirmDelivery(orderId);
      } else {
        // Generic status update logic here
      }
      
      const data = await ordersAPI.getFarmerOrders();
      setOrders(data);
      
      toast({
        title: 'Protocol Synchronized',
        description: `Trade contract successfully advanced to '${newStatus}' operational state within the hub registry.`,
      });
    } catch (error) {
      toast({
        title: 'System Authorization Error',
        description: error.message || 'Critical failure: Could not synchronize contract status within the institutional ledger.',
        variant: 'destructive',
      });
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-slate-50 min-h-screen pb-60">
        {/* Institutional Trade Fulfillment Console Registry Header */}
        <section className="bg-white border-b border-slate-200 pt-32 pb-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
           <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-16">
                 <div className="space-y-8">
                    <div className="inline-flex items-center gap-4 px-6 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(15,23,42,0.4)]">
                       <Terminal className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                       Operational Fulfillment Terminal Registry
                    </div>
                    <div className="space-y-4">
                       <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-none">Supply Chain Trade Manifests</h1>
                       <p className="text-xl font-medium text-slate-500 max-w-3xl leading-relaxed opacity-80">
                          Authorize procurement cycles, manage logistics deployment, and synchronize settlement transitions for verified institutional buyers through the global trade ledger.
                       </p>
                    </div>
                 </div>
                 <div className="flex gap-6">
                    <div className="bg-white px-12 py-8 rounded-[2.5rem] border border-slate-200 shadow-2xl flex items-center gap-10 group/stats overflow-hidden relative">
                       <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/stats:opacity-100 transition-opacity duration-1000" />
                       <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-2xl relative z-10 group-hover/stats:scale-110 transition-transform duration-700">
                          <Activity className="w-8 h-8 shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                       </div>
                       <div className="space-y-1 relative z-10">
                          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 leading-none mb-2">Pipeline Density</p>
                          <p className="text-4xl font-bold text-slate-900 tracking-tighter">{orders.filter(o => o.status !== 'delivered').length} Active Nodes</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-32 max-w-7xl">
          {/* Status Matrix Terminal Controller Command Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-28 pb-12 border-b border-slate-200/50">
            <div className="flex flex-wrap items-center gap-6">
               <div className="flex items-center gap-4 text-[11px] font-bold text-slate-900 uppercase tracking-[0.4em] mr-6">
                  <Filter className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(0,166,81,0.3)]" />
                  Operational State Matrix
               </div>
               {(['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).map((status) => (
                 <button
                   key={status}
                   onClick={() => setFilter(status)}
                   className={cn(
                     "px-8 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] transition-all whitespace-nowrap border shadow-2xl active:scale-95 group/btn",
                     filter === status
                       ? "bg-slate-900 text-white border-slate-800 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.3)]"
                       : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-900"
                   )}
                 >
                   {status === 'all' ? 'Universal Node Ledger' : status}
                 </button>
               ))}
            </div>
            <button className="h-16 px-10 rounded-2xl bg-white border border-slate-200 text-slate-900 text-[11px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-slate-50 transition-all shadow-2xl active:scale-95 group/sync">
               <RefreshCw className="w-5 h-5 text-primary group-hover/sync:rotate-180 transition-transform duration-1000" />
               Synchronize Pipeline Hub
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-16">
               {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[3rem] h-64 animate-pulse border border-slate-200 shadow-sm" />
               ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[4rem] p-40 text-center border border-slate-200 shadow-[0_80px_200px_-50px_rgba(0,0,0,0.15)] max-w-5xl mx-auto space-y-16 relative overflow-hidden group/empty">
               <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-[2000ms]" />
               <div className="w-36 h-36 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner transform -rotate-12 group-hover/empty:rotate-0 transition-transform duration-1000">
                  <Box className="w-16 h-16 text-slate-100" />
               </div>
               <div className="space-y-6 relative z-10 px-20">
                  <h3 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-none">Zero Manifests Identified</h3>
                  <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed opacity-80">
                    {filter !== 'all' ? `No trade manifests are currently in the '${filter}' state within your operations terminal hub registry.` : 'The operational pipeline is currently idle. Waiting for institutional trade requests from the global marketplace discovery hubs.'}
                  </p>
               </div>
               <Link to="/farmer/products" className="inline-block relative z-10">
                  <button className="h-20 px-16 rounded-2xl bg-slate-900 text-white font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-slate-800 transition-all active:scale-95 shadow-2xl flex items-center gap-6 group/inv">
                    <Database className="w-6 h-6 text-primary" />
                    Inventory Matrix Overview
                    <ChevronRight className="w-5 h-5 group-hover/inv:translate-x-3 transition-transform" />
                  </button>
               </Link>
            </div>
          ) : (
            <div className="space-y-24">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <div key={order.id} className="bg-white rounded-[4rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] overflow-hidden hover:border-primary/40 transition-all duration-1000 group/card relative">
                    <div className="absolute inset-0 bg-slate-50/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    
                    {/* Institutional Trade Manifest Header Hub */}
                    <div className="bg-white px-16 py-12 flex flex-col xl:flex-row xl:items-center justify-between gap-16 border-b border-slate-100 relative z-10">
                      <div className="flex flex-wrap items-center gap-20">
                         <div className="flex items-center gap-8">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl transition-all duration-700 group-hover/card:scale-110 group-hover/card:rotate-6">
                               <Hash className="w-10 h-10 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                            </div>
                            <div className="space-y-2">
                               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mb-1">Contract Manifest Identifier</p>
                               <p className="text-2xl font-bold text-slate-900 tracking-tighter">#{order.id.toString().toUpperCase().slice(-8)}</p>
                            </div>
                         </div>
                         <div className="hidden lg:block h-16 w-px bg-slate-100" />
                         <div className="space-y-2">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mb-1">Authorization Cycle Date</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tighter flex items-center gap-4">
                               <Calendar className="w-6 h-6 text-primary" />
                               {new Date(order.createdAt).toLocaleDateString('en-NG', {
                                 year: 'numeric',
                                 month: 'short',
                                 day: 'numeric',
                               })}
                            </p>
                         </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-12">
                        <div className={cn(
                          "inline-flex items-center gap-6 px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.4em] border shadow-2xl transition-all duration-700 group-hover/card:scale-105",
                          status.color
                        )}>
                          <StatusIcon className="w-6 h-6" />
                          {status.label}
                        </div>
                        <div className="text-right space-y-2">
                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-2 leading-none opacity-60">Gross Settlement Value</p>
                           <p className="text-5xl font-bold text-slate-900 tracking-tighter group-hover/card:text-primary transition-colors">
                             {formatPrice(order.total)}
                           </p>
                        </div>
                      </div>
                    </div>

                    {/* Operational Asset Feed Manifest Deck */}
                    <div className="p-16 relative z-10">
                      <div className="grid lg:grid-cols-3 gap-24">
                         <div className="lg:col-span-2 space-y-20">
                            <div className="space-y-12">
                               <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
                                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-xl">
                                     <Database className="w-5 h-5" />
                                  </div>
                                  <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.4em]">Commodity Allocation Matrix</h4>
                               </div>
                               
                               <div className="space-y-16">
                                 {order.items.map((item) => (
                                   <div key={item.id} className="flex items-center gap-12 group/item relative overflow-hidden p-8 rounded-[2rem] bg-slate-50/30 border border-transparent hover:border-slate-100 hover:bg-white transition-all duration-700 hover:shadow-2xl">
                                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                                     <div className="w-32 h-32 bg-white rounded-[2rem] overflow-hidden shrink-0 border border-slate-200 shadow-2xl group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-[1000ms] relative z-10">
                                        <img
                                          src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                                          alt={item.product?.name}
                                          className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-[2000ms]"
                                        />
                                     </div>
                                     <div className="flex-1 min-w-0 space-y-6 relative z-10">
                                       <div className="space-y-2">
                                          <p className="text-3xl font-bold text-slate-900 tracking-tighter group-hover/item:text-primary transition-colors">{item.product?.name}</p>
                                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] opacity-60">
                                             <Landmark className="w-4 h-4 text-primary" />
                                             Asset Hub Registry: {item.product?.id.slice(-8).toUpperCase()}
                                          </div>
                                       </div>
                                       <div className="flex flex-wrap items-center gap-8">
                                          <div className="flex items-center gap-4 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(15,23,42,0.3)] border border-slate-800">
                                             <Box className="w-4 h-4 text-primary" />
                                             Magnitude: {item.quantity} {item.product?.unit}
                                          </div>
                                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em]">
                                             Unit Rate Settlement: {formatPrice(item.product?.price || 0)}
                                          </p>
                                       </div>
                                     </div>
                                     <div className="hidden sm:block text-right relative z-10">
                                        <p className="text-2xl font-bold text-slate-900 tracking-tighter">{formatPrice(item.quantity * (item.product?.price || 0))}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Itemized Total</p>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                            </div>

                            <div className="bg-slate-50 p-16 rounded-[3rem] border border-slate-100 flex flex-col sm:flex-row items-start gap-12 shadow-inner relative overflow-hidden group/loc">
                               <div className="absolute top-0 right-0 p-16 opacity-5 -mr-16 -mt-16 group-hover/loc:scale-125 transition-transform duration-[2000ms]">
                                  <MapPin className="w-64 h-64 text-slate-900" />
                               </div>
                               <div className="w-20 h-20 bg-white rounded-[1.75rem] border border-slate-200 flex items-center justify-center text-primary shadow-[0_30px_60px_-15px_rgba(0,166,81,0.2)] shrink-0 group-hover/loc:scale-110 group-hover/loc:rotate-12 transition-all duration-700 relative z-10">
                                  <MapPin className="w-10 h-10" />
                               </div>
                               <div className="relative z-10 space-y-6">
                                  <div className="space-y-2">
                                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none">Logistics Destination Hub Manifest</p>
                                     <p className="text-2xl font-bold text-slate-900 tracking-tighter leading-relaxed italic opacity-90">"{order.deliveryAddress}"</p>
                                  </div>
                                  <div className="flex items-center gap-4 text-[10px] font-bold text-primary uppercase tracking-[0.3em] bg-white/50 w-fit px-4 py-2 rounded-xl border border-white">
                                     <Globe className="w-4 h-4" />
                                     Regional Node Verification Active
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* High-Fidelity Contract Command Console Hub */}
                         <div className="bg-slate-900 p-16 rounded-[4rem] border border-slate-800 space-y-20 flex flex-col justify-between shadow-[0_80px_150px_-30px_rgba(15,23,42,0.4)] relative overflow-hidden group/console">
                            <div className="absolute top-0 right-0 p-16 opacity-[0.03] -mr-24 -mt-24 group-hover/console:scale-125 transition-transform duration-[2000ms]">
                               <ShieldCheck className="w-[600px] h-[600px] text-white" />
                            </div>
                            
                            <div className="space-y-16 relative z-10">
                               <div className="flex items-center gap-6 border-b border-white/5 pb-12">
                                  <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-primary shadow-inner group-hover/console:scale-110 transition-all">
                                     <Activity className="w-8 h-8 shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
                                  </div>
                                  <div className="space-y-1">
                                     <h4 className="text-[12px] font-bold text-primary uppercase tracking-[0.4em]">Contract Command</h4>
                                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">Authorized Control Terminal</p>
                                  </div>
                               </div>
                               
                               <div className="space-y-8">
                                 {order.status === 'pending' && (
                                   <div className="grid gap-8">
                                     <button
                                       className="h-24 w-full bg-primary text-white rounded-[1.5rem] font-bold text-xl uppercase tracking-[0.3em] shadow-[0_30px_70px_-15px_rgba(0,166,81,0.5)] hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-6 group/auth"
                                       onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                     >
                                       <CheckCircle className="w-8 h-8 group-hover/auth:rotate-12 transition-transform duration-700" />
                                       Authorize Trade Sync
                                     </button>
                                     <button
                                       className="h-20 w-full bg-white/5 border border-white/10 text-red-400 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-red-500/10 hover:text-red-300 transition-all active:scale-95 shadow-2xl"
                                       onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                     >
                                       Void Trade Manifest Hub
                                     </button>
                                   </div>
                                 )}
                                 {order.status === 'confirmed' && (
                                   <button
                                     className="h-24 w-full bg-primary text-white rounded-[1.5rem] font-bold text-xl uppercase tracking-[0.3em] shadow-[0_30px_70px_-15px_rgba(0,166,81,0.5)] hover:bg-primary/90 transition-all flex items-center justify-center gap-6 group/log"
                                     onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                   >
                                     <Truck className="w-8 h-8 group-hover/log:translate-x-4 transition-transform duration-700" />
                                     Authorize Logistics Flow
                                   </button>
                                 )}
                                 {order.status === 'shipped' && (
                                   <button
                                     className="h-24 w-full bg-primary text-white rounded-[1.5rem] font-bold text-xl uppercase tracking-[0.3em] shadow-[0_30px_70px_-15px_rgba(0,166,81,0.5)] hover:bg-primary/90 transition-all flex items-center justify-center gap-6 group/full"
                                     onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                   >
                                     <Package className="w-8 h-8 group-hover/full:scale-110 transition-transform duration-700" />
                                     Verify Final Fulfillment
                                   </button>
                                 )}
                                 
                                 <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/5">
                                    <Link to="/chat" className="block">
                                      <button className="h-18 w-full bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 hover:text-primary transition-all flex items-center justify-center gap-4 shadow-2xl group/chat active:scale-95">
                                        <MessageCircle className="w-6 h-6 text-primary group-hover/chat:scale-125 transition-all duration-500" />
                                        Buyer Sync
                                      </button>
                                    </Link>
                                    <button className="h-18 w-full bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-4 shadow-2xl group/exp active:scale-95">
                                      <ExternalLink className="w-6 h-6 text-primary group-hover/exp:scale-125 group-hover/exp:-translate-y-2 transition-all duration-500" />
                                      Audit Trail
                                    </button>
                                 </div>
                               </div>
                            </div>

                            <div className="space-y-12 relative z-10">
                               <div className="flex items-center justify-between p-10 bg-white/5 rounded-3xl border border-white/10 shadow-inner group/status">
                                  <div className="flex items-center gap-6 text-slate-400">
                                     <ShieldCheck className="w-8 h-8 text-primary group-hover/status:scale-110 transition-transform duration-700 shadow-[0_0_15px_rgba(0,166,81,0.3)]" />
                                     <div className="space-y-1">
                                        <p className="text-[12px] font-bold uppercase tracking-[0.3em] leading-none text-white">Escrow Settlement Protocol</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em]">Capital Protection Cycle v4.0</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                                     <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,166,81,0.5)]" />
                                     <span className="text-[11px] font-bold text-white uppercase tracking-[0.3em]">{order.status}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-6 opacity-30 justify-center">
                                   <Landmark className="w-5 h-5 text-white" />
                                   <span className="text-[9px] font-bold text-white uppercase tracking-[0.5em]">Institutional Trade Settlement Hub Node</span>
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
          
          {/* Institutional Global Trade Sync Terminal */}
          <div className="pt-48 flex items-center justify-center gap-20 opacity-10">
             <Smartphone className="w-10 h-10 text-slate-900" />
             <Monitor className="w-10 h-10 text-slate-900" />
             <Landmark className="w-10 h-10 text-slate-900" />
             <LayoutGrid className="w-10 h-10 text-slate-900" />
             <Activity className="w-10 h-10 text-slate-900" />
             <Database className="w-10 h-10 text-slate-900" />
             <Globe className="w-10 h-10 text-slate-900" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FarmerOrdersPage;
