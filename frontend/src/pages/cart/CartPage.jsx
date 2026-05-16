import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, Leaf, ShieldCheck, Truck, ChevronRight, Hash, Info, Lock, Landmark, Database, RefreshCw, Archive, ShoppingBag, Activity, FileText, Smartphone, Monitor, LayoutGrid, Calendar, Box, Shield, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CartPage = () => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const { toast } = useToast();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleRemove = async (itemId) => {
    await removeItem(itemId);
    toast({
      title: 'Procurement Manifest Synchronized',
      description: 'Asset record successfully purged from the active trade session registry.',
    });
  };

  if (items.length === 0) {
    return (
      <MainLayout hideFooter hideAI>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
          <div className="w-48 h-48 bg-white border border-slate-200 rounded-[4rem] flex items-center justify-center shadow-inner mb-16 transform -rotate-12 hover:rotate-0 transition-transform duration-1000 group/empty">
            <Archive className="w-20 h-20 text-slate-100 group-hover:text-primary transition-colors duration-700" />
          </div>
          <div className="text-center space-y-8 mb-20 max-w-2xl px-10">
             <h2 className="text-6xl font-bold text-slate-900 tracking-tighter leading-none">Procurement Matrix Empty</h2>
             <p className="text-2xl text-slate-500 font-medium leading-relaxed opacity-80">
                No agricultural commodity assets have been allocated for institutional procurement in this active trade cycle manifest registry.
             </p>
          </div>
          <Link to="/marketplace">
             <button className="h-24 px-20 rounded-[1.5rem] bg-slate-900 text-white font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-slate-800 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.4)] transition-all active:scale-95 flex items-center gap-8 group/discovery">
                Initialize Asset Discovery Hub
                <ChevronRight className="w-7 h-7 group-discovery:translate-x-4 transition-transform duration-700" />
             </button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const itemsByFarmer = items.reduce((acc, item) => {
    const farmerId = item.product.farmerId || 'unknown';
    if (!acc[farmerId]) {
      acc[farmerId] = {
        farmerName: item.product.farmerName || 'Verified Principal Producer Node',
        items: [],
      };
    }
    acc[farmerId].items.push(item);
    return acc;
  }, {});

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-slate-50 min-h-screen pb-60">
        {/* Institutional Procurement Matrix Header Registry */}
        <section className="bg-white border-b border-slate-200 pt-32 pb-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
           <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-16">
                 <div className="space-y-10">
                    <div className="inline-flex items-center gap-6 text-[11px] font-bold text-white uppercase tracking-[0.4em] bg-slate-900 px-8 py-3 rounded-2xl border border-slate-800 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.4)]">
                       <ShoppingCart className="w-6 h-6 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                       Procurement Manifest Review
                    </div>
                    <div className="space-y-6">
                       <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-none transition-all">Trade Procurement Matrix</h1>
                       <p className="text-2xl font-medium text-slate-500 max-w-4xl leading-relaxed opacity-80">
                          Audit selected commodity assets and verify technical specifications before authorizing final trade settlement synchronization and logistics hub mobilization.
                       </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-8 text-slate-400 bg-white px-10 py-6 rounded-[2.5rem] border border-slate-200 shadow-2xl relative group/node overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/node:opacity-100 transition-opacity duration-1000" />
                    <Database className="w-8 h-8 text-primary shadow-[0_0_10px_rgba(0,166,81,0.3)] group-hover/node:scale-110 transition-transform duration-700 relative z-10" />
                    <div className="space-y-1 relative z-10">
                       <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 leading-none mb-2 opacity-60">Session Authorization</p>
                       <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">#{Date.now().toString().slice(-8).toUpperCase()}</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-32 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-32">
            
            {/* High-Fidelity Commodity Asset Stream Ledger */}
            <div className="lg:col-span-2 space-y-32">
              {Object.entries(itemsByFarmer).map(([farmerId, { farmerName, items: farmerItems }]) => (
                <div key={farmerId} className="space-y-16">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-12 px-6">
                     <div className="flex items-center gap-8">
                        <div className="w-18 h-18 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-primary shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] border border-slate-800">
                           <Landmark className="w-10 h-10 shadow-[0_0_10px_rgba(0,166,81,0.3)]" />
                        </div>
                        <div className="space-y-2">
                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none opacity-60">Source Producer Terminal Node</p>
                           <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 leading-none">
                              {farmerName}
                              <ShieldCheck className="w-7 h-7 text-primary" />
                           </h3>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-2xl">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">Terminal Synchronized</span>
                     </div>
                  </div>
                  
                  <div className="bg-white rounded-[4rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] overflow-hidden divide-y divide-slate-50">
                    {farmerItems.map((item) => (
                      <div key={item.id} className="p-16 flex flex-col xl:flex-row gap-20 hover:bg-slate-50/30 transition-all duration-1000 group/asset">
                        <div className="w-64 h-64 bg-slate-50 rounded-[3rem] overflow-hidden shrink-0 border border-slate-100 shadow-inner group-hover/asset:scale-110 group-hover/asset:rotate-6 transition-all duration-[2000ms] relative">
                           <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/asset:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                           <img
                             src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                             alt={item.product.name}
                             className="w-full h-full object-cover grayscale group-hover/asset:grayscale-0 transition-all duration-[2000ms]"
                           />
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-6">
                          <div className="space-y-10">
                             <div className="flex items-start justify-between gap-12">
                                <div className="space-y-4">
                                   <Link
                                     to={`/product/${item.product.id}`}
                                     className="text-5xl font-black text-slate-900 hover:text-primary transition-all tracking-tighter line-clamp-1 leading-[0.9]"
                                   >
                                     {item.product.name}
                                   </Link>
                                   <div className="flex flex-wrap items-center gap-10">
                                      <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] opacity-60">
                                         <Hash className="w-5 h-5 text-primary" />
                                         ASSET NODE: {item.product.id.slice(-8).toUpperCase()}
                                      </div>
                                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                                      <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] opacity-60">
                                         <LayoutGrid className="w-5 h-5" />
                                         {item.product.category || 'Commodity Asset'}
                                      </div>
                                   </div>
                                </div>
                                <button
                                  onClick={() => handleRemove(item.id)}
                                  className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-slate-100 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 shadow-sm active:scale-90 group/del"
                                >
                                  <Trash2 className="w-8 h-8 group-hover/del:scale-125 group-hover/del:rotate-12 transition-transform duration-700" />
                                </button>
                             </div>
                             <div className="pt-2">
                                <div className="inline-flex items-center gap-6 bg-slate-900 px-8 py-3 rounded-2xl border border-slate-800 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)]">
                                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] opacity-60 leading-none">Institutional Exchange Rate</p>
                                   <p className="text-2xl font-black text-white tracking-tighter leading-none">{formatPrice(item.product.price)} <span className="text-primary text-[10px] uppercase ml-2 tracking-widest">/ {item.product.unit} MAGNITUDE</span></p>
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between gap-16 mt-16 pt-16 border-t border-slate-50">
                            <div className="flex items-center bg-white rounded-[1.75rem] border border-slate-200 p-4 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] group/qty">
                              <button
                                className="w-16 h-16 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all active:scale-90 text-slate-200 hover:text-slate-900 border border-transparent hover:border-slate-100 shadow-sm"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="w-8 h-8" />
                              </button>
                              <div className="w-32 flex flex-col items-center">
                                 <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none group-hover/qty:text-primary transition-colors duration-700">
                                   {item.quantity}
                                 </span>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3 leading-none opacity-60">{item.product.unit} MANIFEST</span>
                              </div>
                              <button
                                className="w-16 h-16 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all active:scale-90 text-slate-200 hover:text-slate-900 border border-transparent hover:border-slate-100 shadow-sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-8 h-8" />
                              </button>
                            </div>
                            
                            <div className="text-right space-y-4">
                               <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-slate-400 leading-none opacity-60">Allocated Asset Settlement Magnitude</p>
                               <p className="text-6xl font-black text-slate-900 tracking-tighter group-hover/asset:text-primary transition-all duration-1000 leading-none">
                                 {formatPrice(item.product.price * item.quantity)}
                               </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Institutional Trade Settlement Command Terminal */}
            <div className="lg:col-span-1">
              <div className="sticky top-40 space-y-16">
                <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-[0_80px_200px_-50px_rgba(0,0,0,0.15)] relative overflow-hidden group/settle">
                  <div className="absolute top-0 right-0 p-16 opacity-[0.03] -mr-24 -mt-24 group-hover/settle:scale-150 transition-transform duration-[2000ms] pointer-events-none">
                     <Lock className="w-96 h-96 text-slate-900" />
                  </div>
                  <div className="flex items-center gap-8 mb-20 pb-10 border-b border-slate-100 relative z-10">
                     <div className="w-20 h-20 bg-slate-900 rounded-[1.75rem] flex items-center justify-center text-primary shadow-[0_40px_100px_-20px_rgba(15,23,42,0.4)] border border-slate-800">
                        <ShoppingBag className="w-10 h-10 shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
                     </div>
                     <div className="space-y-2">
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tighter leading-none">Settlement Matrix</h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] opacity-60 leading-none">Trade Terminal Hub v4.2.0</p>
                     </div>
                  </div>
                  
                  <div className="space-y-12 mb-20 relative z-10">
                    <div className="flex justify-between items-center group/row">
                       <div className="space-y-2">
                          <span className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em] block opacity-60">Aggregate Asset Value</span>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">{items.length} Procurement Hub Nodes Active</span>
                       </div>
                       <span className="text-2xl font-black text-slate-900 tracking-tighter group-hover/row:scale-110 transition-transform duration-700">{formatPrice(total)}</span>
                    </div>
                    
                    <div className="flex justify-between items-start gap-10 group/row">
                       <div className="space-y-2">
                          <span className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em] block opacity-60">Supply Chain Logistics Hub</span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Calculated per Authorized Fulfillment Terminal</span>
                       </div>
                       <div className="text-right">
                          <div className="flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-2xl group-hover/row:bg-white transition-all duration-700">
                             <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                             <span className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.3em]">Pending Sync</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="pt-16 border-t border-slate-100 group/total">
                       <div className="flex justify-between items-end">
                         <div className="space-y-6">
                            <p className="text-[12px] font-bold uppercase tracking-[0.5em] text-slate-400 opacity-60 leading-none">Total Settlement Magnitude</p>
                            <p className="text-7xl font-black text-slate-900 tracking-tighter group-hover/total:text-primary transition-all duration-[1000ms] leading-none">{formatPrice(total)}</p>
                         </div>
                       </div>
                    </div>
                  </div>

                  <Link to="/checkout" className="block group relative z-10">
                     <button className="w-full h-28 bg-primary text-white rounded-[2rem] font-bold text-2xl uppercase tracking-[0.4em] shadow-[0_40px_100px_-20px_rgba(0,166,81,0.6)] hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-8 group/authorize">
                        Authorize Settlement
                        <ArrowRight className="w-10 h-10 transition-transform group-hover/authorize:translate-x-4 duration-700" />
                     </button>
                  </Link>
                  
                  <div className="mt-20 flex items-center justify-between gap-10 opacity-10 border-t border-slate-50 pt-16">
                     <Shield className="w-10 h-10 text-slate-900" />
                     <div className="h-px flex-1 bg-slate-200" />
                     <Truck className="w-10 h-10 text-slate-900" />
                     <div className="h-px flex-1 bg-slate-200" />
                     <Landmark className="w-10 h-10 text-slate-900" />
                     <div className="h-px flex-1 bg-slate-200" />
                     <Globe className="w-10 h-10 text-slate-900" />
                  </div>
                </div>

                {/* Trade Compliance Protocol Logic Widget */}
                <div className="bg-slate-900 p-16 rounded-[4rem] border border-slate-800 shadow-[0_60px_120px_-30px_rgba(15,23,42,0.5)] space-y-10 relative overflow-hidden group/compliance">
                   <div className="absolute top-0 right-0 p-14 opacity-10 -mr-16 -mt-16 group-hover/compliance:rotate-12 transition-transform duration-[2000ms]">
                      <ShieldCheck className="w-[300px] h-[300px] text-white" />
                   </div>
                   <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center shadow-inner group-hover/compliance:bg-primary/20 transition-all duration-700">
                         <Info className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(0,166,81,0.3)]" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[12px] font-bold text-white uppercase tracking-[0.4em]">Compliance Protocol</p>
                         <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">Authorized Oversight Active</p>
                      </div>
                   </div>
                   <p className="text-xl font-medium text-slate-400 leading-relaxed italic relative z-10 opacity-80 border-l-2 border-primary/20 pl-8 transition-opacity duration-1000 group-hover/compliance:opacity-100">
                      "Verify procurement parameters against industrial grade requirements. Authorized escrow release is contingent upon logistics hub node synchronization and quality verification."
                   </p>
                   <div className="pt-12 relative z-10 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-5">
                         {[...Array(3)].map((_, i) => <div key={i} className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(0,166,81,0.5)]" style={{ animationDelay: `${i * 0.3}s` }} />)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.5em]">Auth Level 1 Specification Verified</span>
                   </div>
                </div>
                
                <Link to="/marketplace" className="flex items-center justify-center gap-6 text-[11px] font-bold text-slate-400 hover:text-primary transition-all uppercase tracking-[0.4em] group/backhub">
                  <ArrowRight className="w-6 h-6 rotate-180 group-hover/backhub:-translate-x-4 transition-transform duration-700" />
                  Return to Discovery Hub Terminal
                </Link>
                
                {/* Institutional Synchronization Node Registry */}
                <div className="pt-40 flex items-center justify-center gap-20 opacity-10">
                   <Smartphone className="w-10 h-10 text-slate-900" />
                   <Monitor className="w-10 h-10 text-slate-900" />
                   <Landmark className="w-10 h-10 text-slate-900" />
                   <LayoutGrid className="w-10 h-10 text-slate-900" />
                   <Activity className="w-10 h-10 text-slate-900" />
                   <Database className="w-10 h-10 text-slate-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
