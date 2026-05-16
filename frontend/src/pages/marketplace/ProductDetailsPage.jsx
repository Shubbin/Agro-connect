import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { productsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star, MapPin, MessageCircle, ShoppingCart, Minus, Plus, Truck, Shield, Clock, ShieldCheck, Heart, Share2, Leaf, Sparkles, TrendingUp, ChevronRight, CheckCircle2, Globe, Info, Landmark, Box, Activity, RefreshCw, Smartphone, Monitor, LayoutGrid, FileText, Hash, Calendar } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { cn } from '@/lib/utils';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  
  const { user, isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await productsAPI.getById(id);
        setProduct(data);
        if (data) {
          setQuantity(data.minOrder || 1);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      toast({
        title: 'Institutional Authorization Required',
        description: 'Secure trade procurement requires an authenticated session registry.',
        variant: 'destructive',
      });
      navigate('/signup', { state: { from: `/product/${product.id}` } });
      return;
    }

    try {
      await addItem(product.id, quantity);
      toast({
        title: 'Asset Allocated to Manifest',
        description: `${product.name} successfully queued for trade settlement synchronization.`,
      });
    } catch (error) {
      toast({
        title: 'Allocation Error',
        description: 'Failed to synchronize trade manifest node. Please refresh terminal.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout hideFooter hideAI>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
           <div className="flex flex-col items-center gap-12">
              <div className="w-20 h-20 border-4 border-slate-200 border-t-primary rounded-full animate-spin shadow-2xl" />
              <div className="space-y-4 text-center">
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] animate-pulse">Synchronizing Asset Manifest Registry</p>
                 <div className="flex items-center justify-center gap-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="w-2 h-2 bg-primary/20 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,166,81,0.2)]" style={{ animationDelay: `${i * 0.3}s` }} />)}
                 </div>
              </div>
           </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout hideFooter hideAI>
        <div className="container mx-auto px-4 py-60 text-center bg-slate-50 min-h-screen flex flex-col items-center justify-center space-y-20">
          <div className="w-40 h-40 bg-white border border-slate-200 rounded-[3.5rem] flex items-center justify-center shadow-inner transform -rotate-12 transition-transform hover:rotate-0 duration-1000">
             <Landmark className="w-20 h-20 text-slate-100" />
          </div>
          <div className="space-y-8">
             <h2 className="text-5xl font-bold text-slate-900 tracking-tighter leading-none">Commodity Record Void</h2>
             <p className="text-2xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed opacity-80">The requested trade asset manifest is either unavailable or has been purged from the institutional ledger hub registry.</p>
          </div>
          <Link to="/marketplace">
             <button className="h-24 px-20 rounded-2xl bg-primary text-white font-bold text-[11px] uppercase tracking-[0.4em] shadow-[0_30px_70px_-15px_rgba(0,166,81,0.5)] hover:bg-primary/90 transition-all active:scale-95 group/back">
                Return to Discovery Hub
                <ChevronRight className="w-7 h-7 group-hover/back:translate-x-4 transition-transform duration-700" />
             </button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const total = product.price * quantity;

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-slate-50 min-h-screen pb-60">
        {/* Institutional Navigation Terminal Registry */}
        <div className="bg-white border-b border-slate-200 pt-32 pb-10">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-16">
                 <div className="flex items-center gap-12">
                    <button
                      onClick={() => navigate(-1)}
                      className="flex items-center gap-6 text-[11px] font-bold text-slate-400 hover:text-primary transition-all uppercase tracking-[0.4em] group/backbtn"
                    >
                      <ArrowLeft className="w-6 h-6 group-hover/backbtn:-translate-x-3 transition-transform duration-700" />
                      Back to Exchange
                    </button>
                    <div className="hidden sm:block w-px h-10 bg-slate-100" />
                    <nav className="hidden sm:flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                       Inventory <ChevronRight className="w-5 h-5 opacity-40" /> {product.category || 'Commodity'} <ChevronRight className="w-5 h-5 opacity-40" /> <span className="text-slate-900 tracking-tighter font-black">{product.name}</span>
                    </nav>
                 </div>
                 <div className="flex gap-8">
                    <button className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-100 transition-all shadow-2xl group/fav active:scale-90">
                       <Heart className="w-7 h-7 group-hover/fav:scale-125 transition-transform duration-700" />
                    </button>
                    <button className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-primary hover:border-primary/20 transition-all shadow-2xl group/share active:scale-90">
                       <Share2 className="w-7 h-7 group-hover/share:rotate-12 transition-transform duration-700" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="container mx-auto px-4 py-32 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-32 xl:gap-40">
            
            {/* High-Fidelity Asset Visual Terminal Command */}
            <div className="space-y-12">
              <div className="aspect-[4/5] bg-white rounded-[4rem] border border-slate-200 p-10 shadow-[0_80px_200px_-50px_rgba(0,0,0,0.1)] overflow-hidden relative group cursor-zoom-in">
                <div className="w-full h-full rounded-[3rem] overflow-hidden bg-slate-50 relative">
                  <img
                    src={product.images?.[activeImg] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                </div>
                <div className="absolute top-16 right-16">
                   <div className="bg-slate-900/95 backdrop-blur-2xl px-8 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.4em] text-white border border-white/10 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.5)] flex items-center gap-6">
                      <ShieldCheck className="w-6 h-6 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                      Institutional Grade: AAA
                   </div>
                </div>
              </div>
              
              <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide px-4">
                 {(product.images || [null, null, null, null]).map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImg(i)}
                      className={cn(
                        "w-40 h-40 shrink-0 rounded-[2.5rem] border-8 p-3 transition-all active:scale-90 duration-700",
                        activeImg === i ? "border-primary bg-white shadow-[0_40px_100px_-20px_rgba(0,166,81,0.3)]" : "border-transparent opacity-30 hover:opacity-100"
                      )}
                    >
                       <div className="w-full h-full rounded-[1.75rem] overflow-hidden bg-slate-100">
                          <img src={img || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                       </div>
                    </button>
                 ))}
              </div>
            </div>

            {/* Procurement Manifest Analysis Deck */}
            <div className="space-y-20">
              <div className="space-y-12">
                <div className="flex items-center gap-10">
                  <span className="bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-[0.4em] px-8 py-3 rounded-2xl border border-primary/10 shadow-2xl shadow-primary/5">
                    {product.category || 'Commodity Asset Class'}
                  </span>
                  <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                    <span className="text-slate-900 text-2xl tracking-tighter leading-none font-black">{product.rating || 4.9}</span>
                    <span className="opacity-40">/ Institutional Hub Review Aggregate</span>
                  </div>
                </div>
                
                <div className="space-y-8">
                   <h1 className="text-7xl font-bold text-slate-900 tracking-tighter leading-[0.9]">
                     {product.name}
                   </h1>
                   <div className="flex flex-wrap gap-16">
                     <div className="flex items-center gap-6 text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] group/locnode">
                       <MapPin className="w-6 h-6 text-primary group-hover/locnode:scale-125 transition-transform duration-700" />
                       {product.location} Logistics Hub Node
                     </div>
                     <div className="flex items-center gap-6 text-emerald-600 text-[11px] font-bold uppercase tracking-[0.4em]">
                       <TrendingUp className="w-6 h-6" />
                       Tier 1 Trade Liquidity Verified
                     </div>
                     <div className="flex items-center gap-6 text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] opacity-60">
                        <Hash className="w-6 h-6" />
                        MANIFEST NODE: {product.id?.slice(-8).toUpperCase()}
                     </div>
                   </div>
                </div>
              </div>

              {/* Asset Valuation Command Console */}
              <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] relative overflow-hidden group/valuation">
                <div className="absolute top-0 right-0 opacity-[0.03] -mr-24 -mt-24 group-hover/valuation:scale-150 transition-transform duration-[2000ms] pointer-events-none">
                   <Leaf className="w-96 h-96 text-primary" />
                </div>
                
                <div className="relative z-10 space-y-16">
                   <div className="flex items-baseline gap-6">
                     <span className="text-8xl font-bold text-slate-900 tracking-tighter group-hover/valuation:text-primary transition-colors duration-700">
                       {formatPrice(product.price)}
                     </span>
                     <span className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.5em] mb-4 leading-none opacity-60">/ Unit Magnitude ({product.unit})</span>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-16 pt-12 border-t border-slate-50">
                      <div className="space-y-4">
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] leading-none opacity-60">Net Available Positions</p>
                         <p className="text-4xl font-bold text-slate-900 tracking-tighter">{product.available} {product.unit} MAGNITUDE</p>
                      </div>
                      <div className="space-y-4">
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] leading-none opacity-60">Procurement Floor</p>
                         <p className="text-4xl font-bold text-slate-900 tracking-tighter">{product.minOrder || 1} {product.unit} MIN</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Strategic Source Terminal Partner Profile */}
              <div className="bg-slate-900 p-14 rounded-[3rem] flex flex-col xl:flex-row items-center justify-between gap-16 shadow-[0_60px_120px_-20px_rgba(15,23,42,0.4)] relative overflow-hidden group/partner">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/partner:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                <div className="flex items-center gap-10 relative z-10">
                  <div className="w-28 h-28 rounded-[2rem] bg-white flex items-center justify-center text-5xl font-bold text-slate-900 shadow-2xl border-8 border-slate-800 group-hover/partner:scale-110 group-hover/partner:rotate-12 transition-all duration-1000">
                    {product.farmerName?.charAt(0) || 'P'}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                       <h4 className="text-4xl font-bold text-white tracking-tighter">{product.farmerName}</h4>
                       <VerificationBadge status={product.farmerVerified ? 'verified' : 'unverified'} />
                    </div>
                    <div className="flex items-center gap-6">
                       <ShieldCheck className="w-6 h-6 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                       <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500 leading-none">
                          Authorized Institutional Network Producer Hub
                       </p>
                    </div>
                  </div>
                </div>
                <Link to="/chat" className="relative z-10 w-full xl:w-auto">
                   <button className="h-20 w-full xl:w-auto px-12 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-white/10 hover:text-primary transition-all active:scale-95 shadow-2xl backdrop-blur-2xl group/sync">
                     Initialize Hub Sync
                     <RefreshCw className="w-5 h-5 ml-6 inline-block group-hover/sync:rotate-180 transition-transform duration-700" />
                   </button>
                </Link>
              </div>

              {/* Institutional Trade Settlement Terminal */}
              <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.15)] space-y-16 group/settle">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-16">
                  <div className="flex items-center bg-slate-50 rounded-3xl border border-slate-100 p-4 shadow-inner group/qty">
                    <button
                      className="w-16 h-16 flex items-center justify-center hover:bg-white rounded-2xl transition-all active:scale-90 text-slate-200 hover:text-slate-900 border border-transparent hover:border-slate-100 shadow-sm"
                      onClick={() => setQuantity(Math.max((product.minOrder || 1), quantity - 1))}
                    >
                      <Minus className="w-8 h-8" />
                    </button>
                    <div className="w-40 text-center space-y-2">
                       <input
                         type="number"
                         value={quantity}
                         onChange={(e) => setQuantity(Math.max((product.minOrder || 1), parseInt(e.target.value) || (product.minOrder || 1)))}
                         className="w-full text-center text-5xl font-black bg-transparent focus:outline-none text-slate-900 tracking-tighter"
                       />
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none">{product.unit} Manifest MAGNITUDE</p>
                    </div>
                    <button
                      className="w-16 h-16 flex items-center justify-center hover:bg-white rounded-2xl transition-all active:scale-90 text-slate-200 hover:text-slate-900 border border-transparent hover:border-slate-100 shadow-sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-8 h-8" />
                    </button>
                  </div>
                  <div className="text-right space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-slate-400 leading-none opacity-60">Net Settlement Magnitude</p>
                    <div className="text-6xl font-black text-slate-900 tracking-tighter group-hover/settle:text-primary transition-all duration-1000">
                      {formatPrice(total)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-10 pt-4">
                  <button className="flex-1 h-28 bg-primary text-white rounded-[2rem] font-bold text-2xl uppercase tracking-[0.4em] shadow-[0_40px_100px_-20px_rgba(0,166,81,0.6)] hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-8 group/procure" onClick={handleAddToCart}>
                    <ShoppingCart className="w-10 h-10 group-hover/procure:scale-125 transition-all duration-700" />
                    Authorize Procurement
                  </button>
                  <button className="h-28 px-14 border border-slate-200 bg-white text-slate-900 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-slate-50 transition-all active:scale-95 shadow-2xl flex items-center gap-6 group/req">
                    Request Full Manifest
                    <ArrowRight className="w-6 h-6 group-hover/req:translate-x-3 transition-transform duration-700" />
                  </button>
                </div>
              </div>

              {/* Institutional Assurance Matrix Node Hub */}
              <div className="grid grid-cols-3 gap-12 pt-20 border-t border-slate-100">
                {[
                  { icon: Truck, label: 'Unified Logistics', sub: 'Hub Sync Active' },
                  { icon: Shield, label: 'Escrow Protocol', sub: 'Auth Level 4' },
                  { icon: CheckCircle2, label: 'Audit Verification', sub: '100% Fidelity' }
                ].map((feat, i) => (
                  <div key={i} className="text-center space-y-6 group/assurance">
                    <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-100 group-hover/assurance:text-primary group-hover/assurance:bg-primary/5 transition-all duration-[1000ms] shadow-2xl group-hover/assurance:scale-110 group-hover/assurance:rotate-12">
                      <feat.icon className="w-10 h-10 shadow-[0_0_15px_rgba(0,166,81,0.2)]" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 leading-none">{feat.label}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.5em] opacity-40">{feat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Specification & Intelligence Audit Report */}
          <div className="mt-60">
            <div className="flex items-center gap-12 mb-20">
               <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-primary shadow-[0_40px_100px_-20px_rgba(15,23,42,0.5)] border border-slate-800">
                  <FileText className="w-10 h-10 shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
               </div>
               <h2 className="text-5xl font-bold text-slate-900 tracking-tighter leading-none">Technical Specification & Intelligence Report</h2>
               <div className="flex-1 h-px bg-slate-100" />
               <div className="flex items-center gap-4 px-8 py-3 bg-white border border-slate-200 rounded-2xl shadow-2xl">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">Live Audit Synchronization Active</span>
               </div>
            </div>
            <div className="bg-white p-24 md:p-40 rounded-[5rem] border border-slate-200 shadow-[0_80px_200px_-50px_rgba(0,0,0,0.15)] relative overflow-hidden group/report">
               <div className="absolute top-0 right-0 p-32 opacity-[0.03] rotate-12 scale-150 grayscale pointer-events-none group-hover/report:scale-125 transition-transform duration-[3000ms]">
                  <Globe className="w-[1000px] h-[1000px] text-slate-900" />
               </div>
               <div className="relative z-10 max-w-6xl">
                 <div className="inline-flex items-center gap-6 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[12px] font-bold uppercase tracking-[0.4em] mb-20 border border-slate-800 shadow-2xl group-hover/report:translate-x-6 transition-transform duration-1000">
                    <Info className="w-6 h-6 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                    Authorized Trade Asset Manifest Intelligence
                 </div>
                 <div className="text-3xl text-slate-500 font-medium leading-[1.6] space-y-16">
                    <p className="first-letter:text-[10rem] first-letter:font-black first-letter:text-slate-900 first-letter:mr-10 first-letter:float-left first-letter:leading-[0.75] first-letter:tracking-tighter opacity-90 transition-opacity group-hover/report:opacity-100 duration-1000">
                       {product.description || "The specified agricultural commodity asset has undergone comprehensive institutional verification within the regional trade hub, confirming strict adherence to Grade-AAA quality standards. Procurement nodes must authorize logistics manifests within 24 hours of settlement cycle initialization to ensure optimal chain fidelity."}
                    </p>
                 </div>
                 
                 <div className="mt-32 pt-24 border-t border-slate-50 grid md:grid-cols-2 gap-24">
                    <div className="space-y-8 group/specnode">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary shadow-inner group-hover/specnode:scale-110 group-hover/specnode:rotate-6 transition-all duration-700">
                             <Truck className="w-7 h-7" />
                          </div>
                          <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.5em]">Logistics Hub Compliance Manifest</h4>
                       </div>
                       <p className="text-xl text-slate-500 font-medium leading-relaxed opacity-70 group-hover/specnode:opacity-100 transition-opacity duration-700">
                          "This asset is strictly localized within the {product.location} Hub Node. Logistics and regional freight handling must adhere to verified national agricultural transport protocols. Regional node synchronization mandatory for fulfillment."
                       </p>
                    </div>
                    <div className="space-y-8 group/specnode">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary shadow-inner group-hover/specnode:scale-110 group-hover/specnode:rotate-6 transition-all duration-700">
                             <ShieldCheck className="w-7 h-7" />
                          </div>
                          <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.5em]">Quality Assurance Audit Ledger</h4>
                       </div>
                       <p className="text-xl text-slate-500 font-medium leading-relaxed opacity-70 group-hover/specnode:opacity-100 transition-opacity duration-700">
                          "Verified through the AgroDirect Multi-Factor Verification Protocol v4.0. Grade-AAA certification confirms optimal humidity control, nutrient density analysis, and long-term storage fidelity. Hub Audit ID: 4.2.0-SYNC-ALPHA."
                       </p>
                    </div>
                 </div>
                 
                 {/* Institutional Support Sync Hub */}
                 <div className="mt-32 pt-24 border-t border-slate-50 flex flex-wrap items-center justify-center gap-24 opacity-10">
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
