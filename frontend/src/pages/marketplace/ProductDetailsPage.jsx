import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { productsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star, MapPin, MessageCircle, ShoppingCart, Minus, Plus, Truck, Shield, Clock, ShieldCheck, Heart, Share2, Leaf, Sparkles, TrendingUp } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { cn } from '@/lib/utils';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showOffer, setShowOffer] = useState(false);
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
        title: 'Security Verification Required',
        description: 'Please sign in to proceed with this purchase.',
        variant: 'destructive',
      });
      navigate('/signup', { state: { from: `/product/${product.id}` } });
      return;
    }

    try {
      await addItem(product.id, quantity);
      toast({
        title: 'Inventory Reserved',
        description: `${product.name} has been added to your trade terminal.`,
      });
    } catch (error) {
      toast({
        title: 'Terminal Error',
        description: 'Failed to process inventory request.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Syncing Inventory Data...</p>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-8">Record Not Found</h2>
          <Link to="/marketplace">
            <button className="btn-premium px-10 h-16">Return to Marketplace</button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const total = product.price * quantity;

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-background pb-32">
        {/* Cinematic Backdrop */}
        <div className="absolute top-0 right-0 w-full h-[70vh] bg-[radial-gradient(circle_at_80%_20%,rgba(0,100,0,0.08),transparent)] pointer-events-none" />

        <div className="container mx-auto px-4 py-8 lg:py-12 relative z-10">
          
          {/* Navigation & Actions Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 reveal-up">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all"
            >
              <div className="w-12 h-12 rounded-2xl border border-border/50 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-white transition-all">
                 <ArrowLeft className="w-5 h-5" />
              </div>
              Back to Inventory
            </button>
            <div className="flex gap-4">
               <button className="w-14 h-14 glass-card bg-white/50 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-white transition-all">
                  <Heart className="w-6 h-6" />
               </button>
               <button className="w-14 h-14 glass-card bg-white/50 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white transition-all">
                  <Share2 className="w-6 h-6" />
               </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 xl:gap-32">
            {/* 
              PHASE 1: VISUAL STAGING 
              High-end gallery with cinematic presentation.
            */}
            <div className="space-y-8 reveal-up">
              <div className="aspect-square glass-card rounded-[4rem] p-5 border-white/60 bg-white/40 shadow-2xl overflow-hidden relative group">
                <div className="w-full h-full rounded-[3rem] overflow-hidden">
                  <img
                    src={product.images?.[activeImg] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="absolute top-10 right-10 flex flex-col gap-3">
                   <div className="glass-premium bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest text-white border border-white/10 animate-float">
                      High Quality Grade A
                   </div>
                </div>
              </div>
              
              {/* Cinematic Thumbnails */}
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                 {(product.images || [product.images?.[0], product.images?.[0], product.images?.[0], product.images?.[0]]).map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImg(i)}
                      className={cn(
                        "w-24 h-24 shrink-0 glass-card rounded-3xl p-2 transition-all duration-500",
                        activeImg === i ? "border-primary bg-primary/5 scale-110" : "border-white/50 opacity-50 hover:opacity-100"
                      )}
                    >
                       <div className="w-full h-full rounded-2xl overflow-hidden bg-muted">
                          <img src={img || '/placeholder.svg'} className="w-full h-full object-cover" />
                       </div>
                    </button>
                 ))}
              </div>
            </div>

            {/* 
              PHASE 2: INFORMATION TERMINAL 
              Clear hierarchy and high-impact pricing.
            */}
            <div className="flex flex-col reveal-up" style={{ animationDelay: '150ms' }}>
              <div className="space-y-6 mb-12">
                <div className="flex flex-wrap gap-3">
                  <span className="glass-premium bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border border-primary/20">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-2 px-4 py-2 glass-premium rounded-full border-border/50">
                    <Star className="w-4 h-4 text-accent-gold fill-current" />
                    <span className="font-black text-xs text-foreground uppercase tracking-tighter">{product.rating || 4.8} Rated</span>
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter uppercase leading-[0.85] mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 text-muted-foreground text-sm font-bold uppercase tracking-widest">
                    <MapPin className="w-5 h-5 text-primary" />
                    {product.location} Hub
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <div className="flex items-center gap-3 text-primary text-sm font-black uppercase tracking-widest">
                    <TrendingUp className="w-5 h-5" />
                    High Demand
                  </div>
                </div>
              </div>

              {/* Pricing Terminal */}
              <div className="glass-card p-12 rounded-[3.5rem] border-primary/30 bg-primary/[0.03] relative overflow-hidden group mb-12">
                <div className="absolute -top-10 -right-10 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                   <Leaf className="w-64 h-64 text-primary" />
                </div>
                
                <div className="relative z-10">
                   <div className="flex items-baseline gap-4 mb-4">
                     <span className="text-6xl md:text-8xl font-black text-gradient tracking-tighter">
                       {formatPrice(product.price)}
                     </span>
                     <span className="text-2xl text-muted-foreground font-black uppercase tracking-tighter">/ {product.unit}</span>
                   </div>
                   
                   <div className="flex flex-wrap gap-3">
                      <div className="px-4 py-2 rounded-2xl bg-white/60 border border-white/80 text-[10px] font-black uppercase tracking-widest text-muted-foreground shadow-sm">
                         Stock: {product.available} Units
                      </div>
                      <div className="px-4 py-2 rounded-2xl bg-white/60 border border-white/80 text-[10px] font-black uppercase tracking-widest text-muted-foreground shadow-sm">
                         Minimum: {product.minOrder || 1} {product.unit}
                      </div>
                   </div>
                </div>
              </div>

              {/* Producer Intelligence */}
              <div className="glass-card p-8 rounded-[3rem] border-border/50 flex flex-col md:flex-row items-center justify-between gap-8 mb-12 hover:border-primary/40 transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary/20">
                    {product.farmerName?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                       <h4 className="text-2xl font-black text-foreground tracking-tighter uppercase">{product.farmerName}</h4>
                       <VerificationBadge status={product.farmerVerified ? 'verified' : 'unverified'} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-primary" />
                       Gold Partner Network
                    </p>
                  </div>
                </div>
                <Link to="/chat">
                  <button className="h-16 px-10 rounded-2xl border-2 border-primary/20 text-primary hover:bg-primary/5 font-black uppercase tracking-widest text-[10px] transition-all">
                    Initialize Trade Chat
                  </button>
                </Link>
              </div>

              {/* Transaction Control Unit */}
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-10">
                  <div className="w-full sm:w-auto flex items-center bg-secondary/50 rounded-[2rem] border border-border/50 p-2 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                    <button
                      className="w-14 h-14 flex items-center justify-center hover:bg-white rounded-2xl transition-all active:scale-90 text-primary"
                      onClick={() => setQuantity(Math.max((product.minOrder || 1), quantity - 1))}
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max((product.minOrder || 1), parseInt(e.target.value) || (product.minOrder || 1)))}
                      className="w-28 text-center text-3xl font-black bg-transparent focus:outline-none tracking-tighter"
                    />
                    <button
                      className="w-14 h-14 flex items-center justify-center hover:bg-white rounded-2xl transition-all active:scale-90 text-primary"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-1">Contract Value</p>
                    <div className="text-5xl font-black text-foreground tracking-tighter leading-none">
                      {formatPrice(total)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                  <button className="flex-1 h-24 rounded-[2rem] btn-premium text-base" onClick={handleAddToCart}>
                    <ShoppingCart className="w-6 h-6" />
                    Finalize Order
                  </button>
                  <button
                    className="flex-1 h-24 rounded-[2rem] border-2 border-border/50 glass-card bg-white/50 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all"
                  >
                    Negotiate Quote
                  </button>
                </div>
              </div>

              {/* Utility Grid */}
              <div className="grid grid-cols-3 gap-8 pt-16 mt-16 border-t border-border/50">
                {[
                  { icon: Truck, label: 'Secured Logistics', sub: 'Verified Carriers' },
                  { icon: Shield, label: 'Trade Escrow', sub: 'Funds Protected' },
                  { icon: Clock, label: 'Quality Audit', sub: 'Standardized' }
                ].map((feat, i) => (
                  <div key={i} className="text-center group">
                    <div className="w-16 h-16 bg-secondary/50 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-700">
                      <feat.icon className="w-7 h-7" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground leading-tight mb-1">{feat.label}</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{feat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Specifications */}
          <div className="mt-32 reveal-up">
            <div className="flex items-center gap-6 mb-12">
               <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase">Product Narrative</h2>
               <div className="flex-1 h-px bg-border/50" />
            </div>
            <div className="glass-card p-16 rounded-[4rem] border-white/60 bg-white/40 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-16 opacity-[0.03] rotate-12 scale-150">
                  <Leaf className="w-64 h-64 text-primary" />
               </div>
               <div className="relative z-10 max-w-4xl">
                 <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-primary/20">
                    <Sparkles className="w-4 h-4" />
                    AI Analyzed Product Report
                 </div>
                 <p className="text-2xl text-muted-foreground font-medium leading-relaxed whitespace-pre-line tracking-tight">
                   {product.description}
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
