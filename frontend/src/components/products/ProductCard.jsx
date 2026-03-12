import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { VerificationBadge } from '@/components/ui/VerificationBadge';



export const ProductCard = ({product }) => {
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
        title: 'Login Required',
        description: 'Please create an account or login to add items to your cart.',
        variant: 'destructive',
      });
      navigate('/signup', { state: { from: '/marketplace' } });
      return;
    }

    try {
      if (!product || !product.id) return;
      await addItem(product.id, product.minOrder || 1);
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

  if (!product) return null;

  return (
    <Link to={`/product/${product.id}`} className="block group h-full">
      <div className="card-premium h-full overflow-hidden flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-4 left-4">
            <span className="glass-premium text-primary-foreground bg-primary/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              {product.category}
            </span>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            {(() => {
              let certs = product.certifications;
              if (typeof certs === 'string') {
                try { certs = JSON.parse(certs); } catch { certs = []; }
              }
              return Array.isArray(certs) ? certs.map((cert) => (
                <span key={cert} className="glass-premium bg-white/20 backdrop-blur-md text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg text-white border border-white/10">
                  {cert}
                </span>
              )) : null;
            })()}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="flex text-yellow-500 shrink-0">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-sm font-bold text-foreground">{product.rating || 4.5}</span>
              <span className="text-xs text-muted-foreground font-medium">({product.reviewCount || 12})</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border/50 flex items-end justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-black uppercase tracking-tighter mb-1">Price / {product.unit}</div>
              <p className="text-2xl font-black text-foreground tracking-tighter">
                {formatPrice(product.price)}
              </p>
            </div>
            
            <Button
              size="icon"
              onClick={handleAddToCart}
              className="w-12 h-12 rounded-2xl btn-premium bg-primary text-white shadow-primary/20"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-primary border border-primary/10">
                {product.farmerName?.[0] || 'F'}
             </div>
             <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                   <p className="text-xs font-black text-foreground truncate">{product.farmerName || 'Verified Farmer'}</p>
                   <VerificationBadge status={product.farmerVerified ? 'verified' : 'unverified'} />
                </div>
                <div className="flex items-center gap-2">
                   <MapPin className="w-2.5 h-2.5 text-primary" />
                   <p className="text-[10px] text-muted-foreground font-medium truncate">{product.location}</p>
                   <span className="text-[10px] text-muted-foreground/30">•</span>
                   <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{product.available} {product.unit} in stock</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

