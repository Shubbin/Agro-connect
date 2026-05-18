import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { productsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star, MapPin, MessageCircle, ShoppingCart, Minus, Plus, Truck, Shield, ShieldCheck, Heart, Share2, ChevronRight, CheckCircle2, Info, ShoppingBag } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { cn } from '@/lib/utils';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  
  const { isAuthenticated } = useAuth();
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
        title: 'Login Required',
        description: 'Please login or signup to add items to your cart and make purchases.',
        variant: 'destructive',
      });
      navigate('/signup', { state: { from: `/product/${product.id}` } });
      return;
    }

    try {
      await addItem(product.id, quantity);
      toast({
        title: 'Added to Cart',
        description: `${product.name} has been successfully added to your shopping cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please refresh the page and try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout hideFooter hideAI>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
           <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
              <div className="text-center space-y-1">
                 <p className="text-sm font-semibold text-gray-500">Loading Product Details...</p>
              </div>
           </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout hideFooter hideAI>
        <div className="container mx-auto px-4 py-20 text-center bg-gray-50 min-h-screen flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
             <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <div className="space-y-2">
             <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
             <p className="text-gray-500 max-w-sm mx-auto">The requested product is currently unavailable or has been removed from the platform.</p>
          </div>
          <Link to="/marketplace">
             <button className="h-12 px-6 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm inline-flex items-center gap-2">
                Return to Marketplace
                <ChevronRight className="w-4 h-4" />
             </button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const total = product.price * quantity;

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Navigation Bar */}
        <div className="bg-white border-b border-gray-200 py-4">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate(-1)}
                      className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Marketplace
                    </button>
                    <div className="hidden sm:block w-px h-6 bg-gray-200" />
                    <nav className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                       Products <ChevronRight className="w-3.5 h-3.5 opacity-50" /> {product.category || 'Produce'} <ChevronRight className="w-3.5 h-3.5 opacity-50" /> <span className="text-gray-900 font-bold">{product.name}</span>
                    </nav>
                 </div>
                 <div className="flex gap-2">
                    <button className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-colors shadow-sm">
                       <Heart className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/20 transition-colors shadow-sm">
                       <Share2 className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Left: Product Images Panel */}
            <div className="space-y-6">
              <div className="aspect-[4/3] sm:aspect-[4/3] bg-white rounded-2xl border border-gray-200 p-2.5 shadow-sm overflow-hidden relative group">
                <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 relative">
                  <img
                    src={product.images?.[activeImg] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-6 right-6">
                   <div className="bg-gray-900/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 shadow-sm flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
                      Premium Quality
                   </div>
                </div>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2">
                 {(product.images || [null, null, null, null]).map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImg(i)}
                      className={cn(
                        "w-16 h-16 shrink-0 rounded-xl border-2 p-0.5 transition-all duration-300",
                        activeImg === i ? "border-primary bg-white shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                       <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
                          <img src={img || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'} className="w-full h-full object-cover" />
                       </div>
                    </button>
                 ))}
              </div>
            </div>

            {/* Right: Buy/Details Panel */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
                    {product.category || 'Produce'}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-gray-900 font-bold">{product.rating || 4.9}</span>
                    <span className="text-xs text-gray-400 font-medium">({product.reviewsCount || 12} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                   <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                     {product.name}
                   </h1>
                   <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                     <div className="flex items-center gap-1">
                       <MapPin className="w-4 h-4 text-primary" />
                       {product.location}
                     </div>
                     <span className="text-gray-300">•</span>
                     <div className="flex items-center gap-1 text-emerald-600">
                       <ShieldCheck className="w-4 h-4" />
                       Verified Safe Product
                     </div>
                     <span className="text-gray-300">•</span>
                     <div className="text-gray-400 font-medium">
                        ID: {product.id?.slice(-8).toUpperCase()}
                     </div>
                   </div>
                </div>
              </div>

              {/* Price Panel */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                 <div className="flex items-baseline gap-2">
                   <span className="text-4xl font-bold text-gray-900 tracking-tight">
                     {formatPrice(product.price)}
                   </span>
                   <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">/ per {product.unit}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-sm">
                    <div>
                       <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Available Quantity</p>
                       <p className="font-bold text-gray-900">{product.available} {product.unit}</p>
                    </div>
                    <div>
                       <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Minimum Order</p>
                       <p className="font-bold text-gray-900">{product.minOrder || 1} {product.unit}</p>
                    </div>
                 </div>
              </div>

              {/* Farmer Info */}
              <div className="bg-gray-900 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-sm relative overflow-hidden group">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-2xl font-bold text-gray-950 shadow-md shrink-0">
                    {product.farmerName?.charAt(0) || 'F'}
                  </div>
                  <div>
                     <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white leading-tight">{product.farmerName}</h4>
                        <VerificationBadge status={product.farmerVerified ? 'verified' : 'unverified'} />
                     </div>
                     <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Verified Farmer</p>
                  </div>
                </div>
                <Link to={`/chat?farmerId=${product.farmer_id}&farmerName=${encodeURIComponent(product.farmerName || 'Farmer')}`} className="relative z-10 shrink-0">
                   <button className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 hover:text-primary transition-colors flex items-center gap-1.5">
                     <span>Chat with Farmer</span>
                     <MessageCircle className="w-4 h-4 text-primary" />
                   </button>
                </Link>
              </div>

              {/* Add to Cart Actions */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1 shrink-0">
                    <button
                      className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-md transition-all active:scale-95 text-gray-400 hover:text-gray-800 border border-transparent hover:border-gray-100 shadow-sm"
                      onClick={() => setQuantity(Math.max((product.minOrder || 1), quantity - 1))}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="w-20 text-center">
                       <input
                         type="number"
                         value={quantity}
                         onChange={(e) => setQuantity(Math.max((product.minOrder || 1), parseInt(e.target.value) || (product.minOrder || 1)))}
                         className="w-full text-center text-lg font-bold bg-transparent focus:outline-none text-gray-900"
                       />
                       <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider leading-none mt-0.5">{product.unit}</p>
                    </div>
                    <button
                      className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-md transition-all active:scale-95 text-gray-400 hover:text-gray-800 border border-transparent hover:border-gray-100 shadow-sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                     <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Total Price</p>
                     <div className="text-3xl font-bold text-gray-900 leading-none">
                       {formatPrice(total)}
                     </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-grow h-12 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm" onClick={handleAddToCart}>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Guarantees Section */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-gray-200">
                {[
                  { icon: Truck, label: 'Reliable Shipping', sub: 'Standard Delivery' },
                  { icon: Shield, label: 'Escrow Secured', sub: 'Payment Safe' },
                  { icon: CheckCircle2, label: 'Quality Produce', sub: '100% Inspected' }
                ].map((feat, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mx-auto text-primary shadow-inner">
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider leading-none">{feat.label}</p>
                       <p className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider opacity-80">{feat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info Description */}
          <div className="mt-16 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Product Description & Details</h2>
            <div className="bg-white p-6 md:p-10 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
               <div className="relative z-10 max-w-4xl space-y-8">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
                     <Info className="w-4 h-4" />
                     Verified Product Details
                  </div>
                  <div className="text-gray-600 text-base leading-relaxed space-y-6">
                     <p>
                        {product.description || "This product has been physically inspected and verified to meet high standards of size, maturity, and quality. Stored under proper ventilation and handled with sanitary guidelines to ensure optimal freshness upon delivery."}
                     </p>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-6 text-sm">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary">
                              <Truck className="w-4 h-4" />
                           </div>
                           <h4 className="font-bold text-gray-800">Shipping & Delivery Details</h4>
                        </div>
                        <p className="text-gray-500 leading-relaxed pl-10">
                           Standard shipping is handled from the location of {product.location}. Transport takes place in temperature-controlled environments to keep fresh produce in optimal condition.
                        </p>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary">
                              <ShieldCheck className="w-4 h-4" />
                           </div>
                           <h4 className="font-bold text-gray-800">Quality Guarantee</h4>
                        </div>
                        <p className="text-gray-500 leading-relaxed pl-10">
                           All purchases on AgroDirect are fully covered by our buyer protection guarantee. If you are not satisfied with the quality of delivery, you can easily open a dispute before the escrow payment releases.
                        </p>
                     </div>
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
