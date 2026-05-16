import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ordersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ArrowLeft, MapPin, CreditCard, Shield, Truck, ShieldCheck, Lock, Leaf, CheckCircle2, ChevronRight, Hash, Landmark, Globe, RefreshCw, FileText, Smartphone, Building2, UserCheck, Activity, Database, ShoppingBag, Box, Landmark as BankIcon } from 'lucide-react';

const paymentMethods = [
  { id: 'paystack', name: 'Institutional Gateway', description: 'Visa, Mastercard, Verve & Direct Bank Settlement Protocols', icon: BankIcon },
  { id: 'flutterwave', name: 'Strategic Wallet', description: 'Enterprise Digital Liquidity & Mobile Procurement Channels', icon: Smartphone },
];

export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('paystack');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    phone: '',
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fullAddress = `${address.street}, ${address.city}, ${address.state}`;
      
      await ordersAPI.create({
        items,
        deliveryAddress: fullAddress,
        paymentMethod: selectedPayment,
      });

      await clearCart();
      
      toast({
        title: 'Trade Transaction Authorized',
        description: 'Your procurement contract manifest has been successfully initialized and queued for institutional settlement.',
      });
      
      navigate('/payment-success');
    } catch (error) {
      toast({
        title: 'Settlement Hub Error',
        description: 'The trade authorization protocol failed to synchronize. Please verify credentials and re-initialize terminal.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deliveryFee = 3500;
  const grandTotal = total + deliveryFee;

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-slate-50 min-h-screen pb-60">
        {/* Institutional Settlement Hub Registry Header */}
        <section className="bg-white border-b border-slate-200 pt-32 pb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-16">
                <div className="space-y-10">
                   <button
                     onClick={() => navigate(-1)}
                     className="flex items-center gap-6 text-[11px] font-bold text-slate-400 hover:text-primary transition-all uppercase tracking-[0.4em] group/backbtn"
                   >
                     <ArrowLeft className="w-6 h-6 group-hover/backbtn:-translate-x-3 transition-transform duration-700" />
                     Return to Manifest Review
                   </button>
                   <div className="space-y-6">
                      <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-none">Settlement Terminal</h1>
                      <p className="text-2xl font-medium text-slate-500 max-w-4xl leading-relaxed opacity-80">
                         Authorize procurement contracts and define institutional logistics parameters within our secure trade settlement hub node.
                      </p>
                   </div>
                </div>
                
                {/* Protocol Progress Hub Visualization */}
                <div className="flex items-center gap-12 bg-white px-10 py-8 rounded-[2.5rem] border border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] relative group/progress overflow-hidden">
                   <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/progress:opacity-100 transition-opacity duration-1000" />
                   <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 text-primary flex items-center justify-center text-xl font-bold shadow-[0_30px_70px_-15px_rgba(15,23,42,0.4)] border border-slate-800">01</div>
                      <div className="space-y-2">
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mb-1 opacity-60">Protocol Node</p>
                         <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Logistics</p>
                      </div>
                   </div>
                   <ChevronRight className="w-8 h-8 text-slate-100 relative z-10" />
                   <div className="flex items-center gap-6 opacity-30 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-xl font-bold border border-slate-200">02</div>
                      <div className="space-y-2">
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mb-1 opacity-60">Authorization</p>
                         <p className="text-2xl font-black text-slate-400 tracking-tighter leading-none">Sync</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-32 max-w-7xl">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-32">
            
            {/* Operational Configuration Matrix Deck */}
            <div className="lg:col-span-2 space-y-24">
              
              {/* Logistics Strategy Module Registry */}
              <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-[0_80px_200px_-50px_rgba(0,0,0,0.1)] space-y-16 relative group/logistics overflow-hidden">
                <div className="absolute top-0 right-0 p-16 opacity-[0.03] -mr-24 -mt-24 pointer-events-none group-hover/logistics:scale-125 transition-transform duration-[3000ms]">
                   <Truck className="w-[600px] h-[600px] text-slate-900" />
                </div>
                
                <div className="flex items-center gap-8 pb-12 border-b border-slate-100 relative z-10">
                  <div className="w-20 h-20 bg-slate-900 rounded-[1.75rem] flex items-center justify-center shadow-[0_40px_100px_-20px_rgba(15,23,42,0.5)] border border-slate-800">
                    <Truck className="w-10 h-10 text-primary shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
                  </div>
                  <div className="space-y-2">
                     <h2 className="text-4xl font-bold text-slate-900 tracking-tighter leading-none">Logistics Specifications</h2>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none opacity-60">Regional Delivery Node Allocation</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-16 relative z-10">
                  <div className="sm:col-span-2 space-y-6">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] ml-2 opacity-60">Terminal Hub Street Address Manifest</label>
                    <div className="relative group/input">
                       <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-200 group-focus-within/input:text-primary transition-all duration-700" />
                       <input
                         type="text"
                         required
                         value={address.street}
                         onChange={(e) => setAddress({ ...address, street: e.target.value })}
                         className="w-full h-24 pl-20 pr-10 bg-slate-50 border border-slate-100 rounded-[2rem] text-xl font-bold placeholder:text-slate-200 focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner tracking-tight"
                         placeholder="e.g. 15 Industrial Procurement Hub Terminal"
                       />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] ml-2 opacity-60">Regional Hub Center / City</label>
                    <div className="relative group/input">
                       <Building2 className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-200 group-focus-within/input:text-primary transition-all duration-700" />
                       <input
                         type="text"
                         required
                         value={address.city}
                         onChange={(e) => setAddress({ ...address, city: e.target.value })}
                         className="w-full h-24 pl-20 pr-10 bg-slate-50 border border-slate-100 rounded-[2rem] text-xl font-bold placeholder:text-slate-200 focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner tracking-tight"
                         placeholder="e.g. Ikeja Strategic Hub"
                       />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] ml-2 opacity-60">State Trade Jurisdiction</label>
                    <div className="relative group/input">
                       <Globe className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-200 group-focus-within/input:text-primary transition-all duration-700" />
                       <input
                         type="text"
                         required
                         value={address.state}
                         onChange={(e) => setAddress({ ...address, state: e.target.value })}
                         className="w-full h-24 pl-20 pr-10 bg-slate-50 border border-slate-100 rounded-[2rem] text-xl font-bold placeholder:text-slate-200 focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner tracking-tight"
                         placeholder="e.g. Lagos Regional Hub"
                       />
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-6">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] ml-2 opacity-60">Fulfillment Lead Hub Contact</label>
                    <div className="relative group/input">
                       <Smartphone className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-200 group-focus-within/input:text-primary transition-all duration-700" />
                       <input
                         type="tel"
                         required
                         value={address.phone}
                         onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                         className="w-full h-24 pl-20 pr-10 bg-slate-50 border border-slate-100 rounded-[2rem] text-xl font-bold placeholder:text-slate-200 focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner tracking-tight"
                         placeholder="Authorized institutional mobile hub number..."
                       />
                    </div>
                  </div>
                </div>
              </div>

              {/* Settlement Protocol Registry Matrix */}
              <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-[0_80px_200px_-50px_rgba(0,0,0,0.1)] space-y-16 relative group/payment overflow-hidden">
                <div className="absolute top-0 right-0 p-16 opacity-[0.03] -mr-24 -mt-24 pointer-events-none group-hover/payment:scale-125 transition-transform duration-[3000ms]">
                   <Landmark className="w-[600px] h-[600px] text-slate-900" />
                </div>
                
                <div className="flex items-center gap-8 pb-12 border-b border-slate-100 relative z-10">
                  <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[1.75rem] flex items-center justify-center text-slate-200 shadow-inner group-hover/payment:text-primary group-hover/payment:bg-white group-hover/payment:shadow-2xl transition-all duration-700">
                    <CreditCard className="w-10 h-10 shadow-[0_0_10px_rgba(0,166,81,0.2)]" />
                  </div>
                  <div className="space-y-2">
                     <h2 className="text-4xl font-bold text-slate-900 tracking-tighter leading-none">Settlement Channels</h2>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none opacity-60">Authorized Trade Settlement Gateway</p>
                  </div>
                </div>

                <div className="grid gap-10 relative z-10">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center gap-12 p-12 rounded-[2.5rem] cursor-pointer transition-all border group/method relative overflow-hidden active:scale-95",
                        selectedPayment === method.id
                          ? "border-primary bg-primary/5 shadow-[0_40px_100px_-20px_rgba(0,166,81,0.1)]"
                          : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 shadow-xl"
                      )}
                    >
                      <div className={cn(
                         "w-10 h-10 rounded-full border-8 flex items-center justify-center transition-all duration-700",
                         selectedPayment === method.id ? "border-primary bg-white shadow-2xl" : "border-slate-200 bg-white"
                      )}>
                         {selectedPayment === method.id && <div className="w-3.5 h-3.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(0,166,81,0.5)]" />}
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex-1 space-y-4">
                        <p className={cn("text-3xl font-black transition-colors tracking-tighter leading-none", selectedPayment === method.id ? "text-slate-900" : "text-slate-400")}>{method.name}</p>
                        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xl opacity-80">{method.description}</p>
                      </div>
                      <div className="hidden sm:flex w-24 h-24 bg-white rounded-[2rem] border border-slate-100 items-center justify-center shadow-2xl group-hover/method:scale-110 group-hover/method:rotate-12 transition-all duration-700">
                         <method.icon className={cn(
                            "w-12 h-12 transition-colors duration-700 shadow-[0_0_15px_rgba(0,166,81,0.2)]",
                            selectedPayment === method.id ? "text-primary" : "text-slate-100"
                         )} />
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="bg-slate-900 p-12 rounded-[3rem] border border-slate-800 flex flex-col sm:flex-row items-start gap-10 shadow-[0_60px_120px_-30px_rgba(15,23,42,0.5)] relative overflow-hidden group/alert">
                   <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/alert:opacity-100 transition-opacity duration-[2000ms]" />
                   <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center shrink-0 relative z-10 shadow-inner group-hover/alert:bg-primary/20 transition-all">
                      <Lock className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(0,166,81,0.3)]" />
                   </div>
                   <div className="space-y-4 relative z-10">
                      <p className="text-[12px] font-bold text-white uppercase tracking-[0.4em] leading-none mb-1">Escrow Safeguard Protocol Activated</p>
                      <p className="text-lg font-medium text-slate-400 leading-relaxed italic opacity-80 border-l-2 border-primary/20 pl-8">
                         "All procurement settlements are architected through the AgroDirect Verification Protocol v4.0. Assets are localized in a secure clearing node and only disbursed to producers upon institutional proof of delivery hub synchronization."
                      </p>
                   </div>
                </div>
              </div>
            </div>

            {/* Contract Manifest Command Terminal Ledger */}
            <div className="lg:col-span-1">
              <div className="sticky top-40 space-y-16">
                <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-[0_80px_200px_-50px_rgba(0,0,0,0.15)] relative overflow-hidden group/summary">
                  <div className="absolute top-0 right-0 p-16 opacity-[0.03] -mr-24 -mt-24 pointer-events-none group-hover/summary:scale-125 transition-transform duration-[3000ms]">
                     <FileText className="w-[600px] h-[600px] text-slate-900" />
                  </div>
                  <div className="flex items-center gap-8 mb-16 pb-8 border-b border-slate-100 relative z-10">
                     <div className="w-18 h-18 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-200 shadow-inner group-hover/summary:text-primary group-hover/summary:bg-white group-hover/summary:shadow-2xl transition-all duration-1000">
                        <FileText className="w-10 h-10 shadow-[0_0_10px_rgba(0,166,81,0.2)]" />
                     </div>
                     <div className="space-y-1">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tighter leading-none">Contract Manifest</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] opacity-60">Authorized Ledger</p>
                     </div>
                  </div>
                  
                  <div className="space-y-10 mb-16 max-h-[500px] overflow-y-auto pr-6 relative z-10 scrollbar-hide">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-8 group/item hover:bg-slate-50/50 p-4 rounded-2xl transition-all duration-700 border border-transparent hover:border-slate-100">
                        <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-2xl group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-1000">
                          <img
                            src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                            alt={item.product.name}
                            className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-[2000ms]"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-3">
                          <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.2em] truncate group-hover/item:text-primary transition-colors leading-none">{item.product.name}</p>
                          <div className="flex items-center justify-between">
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] opacity-60">
                                MAGNITUDE: {item.quantity} {item.product.unit}
                             </p>
                             <span className="text-[13px] font-black text-slate-900 tracking-tighter">
                                {formatPrice(item.product.price * item.quantity)}
                             </span>
                          </div>
                        </div>
                       </div>
                    ))}
                  </div>

                  <div className="space-y-10 pt-12 border-t border-slate-100 relative z-10">
                    <div className="flex justify-between items-center group/row">
                       <div className="space-y-1">
                          <span className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em] block opacity-60 leading-none mb-1">Aggregate Asset Value</span>
                          <span className="text-[9px] font-bold text-primary uppercase tracking-[0.3em]">{items.length} Procurement Nodes Active</span>
                       </div>
                       <span className="text-2xl font-black text-slate-900 tracking-tighter group-hover/row:scale-110 transition-transform duration-700">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between items-center group/row">
                       <div className="space-y-1">
                          <span className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em] block opacity-60 leading-none mb-1">Logistics Hub Surcharge</span>
                          <span className="text-2xl font-black text-slate-900 tracking-tighter group-hover/row:scale-110 transition-transform duration-700">{formatPrice(deliveryFee)}</span>
                       </div>
                    </div>
                    
                    <div className="pt-16 mt-16 border-t border-slate-100 relative group/total">
                       <div className="flex flex-col gap-6">
                          <p className="text-[12px] font-bold uppercase tracking-[0.5em] text-primary opacity-80 leading-none">Total Settlement Magnitude</p>
                          <p className="text-6xl font-black text-slate-900 tracking-tighter group-hover/total:scale-105 transition-transform origin-left duration-1000 leading-none">
                            {formatPrice(grandTotal)}
                          </p>
                       </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-28 mt-20 rounded-[2rem] bg-primary text-white font-bold text-2xl uppercase tracking-[0.4em] shadow-[0_40px_100px_-20px_rgba(0,166,81,0.6)] hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-8 relative z-10 group/authorizebtn"
                  >
                    {isLoading ? (
                       <RefreshCw className="w-10 h-10 animate-spin" />
                    ) : (
                       <>
                          Authorize Contract
                          <ArrowRight className="w-10 h-10 group-hover/authorizebtn:translate-x-4 transition-transform duration-700" />
                       </>
                    )}
                  </button>
                  
                  <div className="mt-16 pt-16 border-t border-slate-50 flex items-center justify-center gap-8 opacity-10 relative z-10">
                     <UserCheck className="w-8 h-8 text-slate-900" />
                     <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.3em]">Institutional Trade Verification Matrix Hub</p>
                  </div>
                </div>

                {/* Institutional Synchronization Terminal Node */}
                <div className="pt-40 flex items-center justify-center gap-16 opacity-10">
                   <Smartphone className="w-8 h-8 text-slate-900" />
                   <Monitor className="w-8 h-8 text-slate-900" />
                   <Landmark className="w-8 h-8 text-slate-900" />
                   <LayoutGrid className="w-8 h-8 text-slate-900" />
                   <Activity className="w-8 h-8 text-slate-900" />
                   <Database className="w-8 h-8 text-slate-900" />
                   <Globe className="w-8 h-8 text-slate-900" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
