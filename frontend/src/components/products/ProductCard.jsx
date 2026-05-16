import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, ShoppingCart, ShieldCheck, Database, Landmark, UserCheck, ChevronRight } from 'lucide-react';
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
        title: 'Authentication Required',
        description: 'Please initialize an institutional session to manage procurement baskets.',
        variant: 'destructive',
      });
      navigate('/signup', { state: { from: '/marketplace' } });
      return;
    }

    try {
      if (!product || !product.id) return;
      await addItem(product.id, product.minOrder || 1);
      toast({
        title: 'Manifest Updated',
        description: `${product.name} has been synchronized with your active basket.`,
      });
    } catch (error) {
      toast({
        title: 'Synchronization Error',
        description: 'Critical failure during basket update. Please re-initialize terminal.',
        variant: 'destructive',
      });
    }
  };

  if (!product) return null;

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-primary/40 flex flex-col h-full relative group/card">
        
        {/* Institutional Asset Visualization */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-1000 group-hover/card:scale-105"
          />
          
          <div className="absolute inset-0 bg-slate-900/0 group-hover/card:bg-slate-900/5 transition-all duration-700 pointer-events-none" />
          
          {/* Classification Tags */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-white px-3 py-1.5 rounded-lg text-[9px] font-bold text-slate-900 uppercase tracking-[0.2em] border border-slate-200 shadow-xl shadow-slate-900/5">
              {product.category}
            </span>
          </div>
          
          <div className="absolute top-4 right-4">
             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-xl shadow-slate-900/5 group-hover/card:bg-slate-900 group-hover/card:text-primary transition-all duration-500">
                <Landmark className="w-5 h-5" />
             </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover/card:translate-y-0 transition-transform duration-500 bg-white/90 backdrop-blur-md border-t border-slate-100">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                   <Database className="w-3.5 h-3.5 text-primary" />
                   SKU: {product.id.slice(-8).toUpperCase()}
                </span>
                <ChevronRight className="w-4 h-4 text-primary" />
             </div>
          </div>
        </div>

        {/* Technical Specification Deck */}
        <div className="p-8 flex-1 flex flex-col space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight group-hover/card:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-100 rounded-md">
                 <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                 <span className="text-[10px] font-bold text-amber-700">{product.rating || 4.5}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
               <MapPin className="w-4 h-4 text-primary" />
               <p className="text-[10px] font-bold uppercase tracking-widest">{product.location}</p>
            </div>
          </div>

          <div className="mt-auto space-y-8 pt-6 border-t border-slate-50">
             {/* Verified Producer Matrix */}
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-lg border border-slate-800">
                   {product.farmerName?.[0] || 'F'}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2">
                      <p className="text-[11px] font-bold text-slate-900 truncate tracking-tight">{product.farmerName || 'Verified Producer'}</p>
                      <UserCheck className="w-3.5 h-3.5 text-primary" />
                   </div>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Authorized Node Partner</p>
                </div>
             </div>

             <div className="flex items-center justify-between gap-6 pt-2">
                <div className="space-y-0.5">
                   <p className="text-2xl font-bold text-slate-900 tracking-tighter leading-none mb-1">
                      {formatPrice(product.price)}
                   </p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Unit Settlement / {product.unit}</p>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="w-14 h-14 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/10 active:scale-90 group/btn border border-slate-800"
                >
                  <ShoppingCart className="w-5 h-5 group-hover/btn:text-primary transition-colors" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
