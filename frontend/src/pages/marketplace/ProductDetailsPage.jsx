import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { AITipCard } from '@/components/ai/AITipCard';
import { productsAPI } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star, MapPin, MessageCircle, ShoppingCart, Minus, Plus, Truck, Shield, Clock, ShieldCheck, Heart, Share2, Leaf } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showOffer, setShowOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  
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
    
    try {
      await addItem(product.id, quantity);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-6" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-10 bg-muted rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Product not found</h2>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const total = product.price * quantity;

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-background pb-20">
        {/* Ambient background */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Breadcrumb & Top Actions */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-all font-black uppercase tracking-widest text-[10px]"
            >
              <div className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                 <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Market
            </button>
            <div className="flex gap-2">
               <Button variant="outline" size="icon" className="rounded-full border-border/50 hover:bg-secondary">
                  <Heart className="w-4 h-4" />
               </Button>
               <Button variant="outline" size="icon" className="rounded-full border-border/50 hover:bg-secondary">
                  <Share2 className="w-4 h-4" />
               </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Product Visuals */}
            <div className="space-y-6 animate-fade-in-up">
              <div className="aspect-square glass-premium rounded-[3rem] p-4 border-border/50 overflow-hidden group">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden">
                  <img
                    src={product.images?.[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
              </div>
              
              {/* Thumbnail strip (mock) */}
              <div className="grid grid-cols-4 gap-4">
                 {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square glass-premium rounded-2xl border-border/50 p-2 cursor-pointer hover:border-primary/50 transition-all">
                       <div className="w-full h-full rounded-xl bg-muted overflow-hidden">
                          <img src={product.images?.[0] || '/placeholder.svg'} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
                       </div>
                    </div>
                 ))}
              </div>
            </div>

            {/* Information Stack */}
            <div className="space-y-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="glass-premium bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/20">
                    {product.category}
                  </span>
                  {product.certifications?.map(cert => (
                    <span key={cert} className="glass-premium bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-500/20">
                      {cert}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.9]">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 glass-premium rounded-xl border-border/50">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-black text-foreground">{product.rating || 4.8}</span>
                    <span className="text-xs text-muted-foreground font-medium">({product.reviewCount || 24} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <MapPin className="w-4 h-4 text-primary" />
                    {product.location}
                  </div>
                </div>
              </div>

              {/* Price & Inventory Card */}
              <div className="glass-premium p-10 rounded-[3rem] border-primary/20 bg-primary/[0.02] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Leaf className="w-32 h-32 text-primary" />
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-black text-gradient tracking-tighter">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xl text-muted-foreground font-bold tracking-tight">/ {product.unit}</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="px-3 py-1 rounded-lg bg-white/50 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Available: {product.available} {product.unit}
                   </div>
                   <div className="px-3 py-1 rounded-lg bg-white/50 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground uppercase">
                      Min Order: {product.minOrder || 1} {product.unit}
                   </div>
                </div>
              </div>

              {/* Farmer Profile Card */}
              <div className="glass-premium p-8 rounded-[2.5rem] border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-primary/50 transition-all duration-500">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-2xl font-black text-primary border border-primary/10 shadow-inner group-hover:scale-105 transition-transform">
                    {product.farmerName?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                       <h4 className="text-xl font-black text-foreground tracking-tight">{product.farmerName}</h4>
                       <VerificationBadge status={product.farmerVerified ? 'verified' : 'unverified'} />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-primary" />
                       Background Verified Agro-Partner
                    </p>
                  </div>
                </div>
                <Link to="/chat">
                  <Button variant="outline" size="xl" className="rounded-2xl border-primary/20 hover:bg-primary/5 font-black tracking-tight px-10">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Chat with Farmer
                  </Button>
                </Link>
              </div>

              {/* Purchase Controls */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-full sm:w-auto flex items-center bg-secondary/50 rounded-2xl border border-border/50 p-2 group-focus-within:border-primary/50 transition-all">
                    <button
                      className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all active:scale-90"
                      onClick={() => setQuantity(Math.max((product.minOrder || 1), quantity - 1))}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max((product.minOrder || 1), parseInt(e.target.value) || (product.minOrder || 1)))}
                      className="w-24 text-center text-xl font-black bg-transparent focus:outline-none"
                    />
                    <button
                      className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all active:scale-90"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 text-right sm:text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Price</p>
                    <div className="text-4xl font-black text-foreground tracking-tighter">
                      {formatPrice(total)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button className="flex-1 h-20 rounded-[1.5rem] btn-premium text-lg font-black tracking-tight" onClick={handleAddToCart}>
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-20 rounded-[1.5rem] border-white/20 glass-premium text-lg font-black tracking-tight hover:bg-white/10"
                    onClick={() => setShowOffer(!showOffer)}
                  >
                    Make an Offer
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border/50">
                {[
                  { icon: Truck, label: 'Fast Delivery', sub: 'To your door' },
                  { icon: Shield, label: 'Escrow Lock', sub: 'Secured Capital' },
                  { icon: Clock, label: 'Freshness Seal', sub: 'Harv-to-Gate' }
                ].map((feat, i) => (
                  <div key={i} className="text-center group">
                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <feat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black uppercase text-foreground leading-tight">{feat.label}</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">{feat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-24 space-y-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-4">
               <h2 className="text-3xl font-black text-foreground tracking-tight">Technical Specifications</h2>
               <div className="flex-1 h-px bg-border/50" />
            </div>
            <div className="glass-premium p-12 rounded-[3.5rem] border-border/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <Leaf className="w-64 h-64 text-primary" />
               </div>
               <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-4xl relative z-10 whitespace-pre-line">
                 {product.description}
               </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
