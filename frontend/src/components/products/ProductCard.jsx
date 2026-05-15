import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, ShoppingCart, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { cn } from '@/lib/utils';

export const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: 'Please Sign In',
        description: 'Please join us or sign in to add items to your basket.',
        variant: 'destructive',
      });
      navigate('/signup', { state: { from: '/marketplace' } });
      return;
    }

    try {
      if (!product || !product.id) return;
      await addItem(product.id, product.minOrder || 1);
      toast({
        title: 'Added to basket',
        description: `${product.name} is now in your basket.`,
      });
    } catch (error) {
      toast({
        title: 'Problem',
        description: 'Could not add item to basket. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!product) return null;

  return (
    <Link to={`/product/${product.id}`} className="block group h-full">
      <div className="glass-card h-full flex flex-col bg-white/40 border-white/60 rounded-[2.5rem] p-3 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
        
        {/* Cinematic Image Stage */}
        <div className="relative aspect-[4/4] overflow-hidden rounded-[2rem] bg-muted mb-4">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <span className="glass-premium bg-white/40 backdrop-blur-md text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/20">
              {product.category}
            </span>
            <div className="w-8 h-8 rounded-full glass-premium bg-white/40 backdrop-blur-md flex items-center justify-center border border-white/20">
               <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
          </div>
          
          {/* Quick Stats Overlay */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <div className="glass-premium bg-black/20 backdrop-blur-md text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl text-white border border-white/10 flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               {product.available} {product.unit} Available
            </div>
          </div>
        </div>

        {/* Intelligence Area */}
        <div className="px-3 pb-3 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-black text-foreground tracking-tighter uppercase leading-none mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Lot {product.id.slice(0, 4)}</span>
                <span className="text-muted-foreground/30">•</span>
                <div className="flex items-center gap-1">
                   <Star className="w-3 h-3 text-accent-gold fill-current" />
                   <span className="text-[10px] font-black text-foreground">{product.rating || 4.5}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
               <p className="text-sm font-black text-primary tracking-tighter">
                 {formatPrice(product.price)}
               </p>
               <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Per {product.unit}</p>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            {/* Producer Info */}
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-2xl border border-border/30">
               <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-black text-[10px] text-white">
                  {product.farmerName?.[0] || 'F'}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                     <p className="text-[10px] font-black text-foreground truncate uppercase tracking-tight">{product.farmerName || 'Trusted Farmer'}</p>
                     <VerificationBadge status={product.farmerVerified ? 'verified' : 'unverified'} className="scale-75 origin-left" />
                  </div>
                  <div className="flex items-center gap-1">
                     <MapPin className="w-2.5 h-2.5 text-primary" />
                     <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest truncate">{product.location}</p>
                  </div>
               </div>
            </div>

            {/* Action Group */}
            <div className="flex gap-2">
               <Link to={`/product/${product.id}`} className="flex-1">
                  <button className="w-full h-12 rounded-xl bg-white border border-border/50 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-muted transition-all active:scale-95">
                     View Details
                  </button>
               </Link>
               <button 
                 onClick={handleAddToCart}
                 className="w-12 h-12 rounded-xl btn-premium flex items-center justify-center transition-all hover:scale-105"
               >
                 <ShoppingCart className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
