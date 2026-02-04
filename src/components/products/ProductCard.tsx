import { Link } from 'react-router-dom';
import { Star, MapPin, ShoppingCart } from 'lucide-react';
import { Product } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addItem(product.id, product.minOrder);
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

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="product-card overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2.5 py-1 rounded-full capitalize">
              {product.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{product.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
                <span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Min. order: {product.minOrder} {product.unit}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-agro-warning fill-current" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {product.farmerName}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.available} {product.unit} available
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="shrink-0"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
