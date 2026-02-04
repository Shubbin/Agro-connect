import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, MessageCircle, Minus, Plus, ShoppingCart, Truck, Shield, Clock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { AITipCard } from '@/components/ai/AITipCard';
import { productsAPI, Product } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
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
          setQuantity(data.minOrder);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
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
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <div className="aspect-square bg-muted rounded-xl overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full capitalize mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
              
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-agro-warning fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {product.location}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-secondary/50 rounded-xl p-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-muted-foreground">per {product.unit}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Minimum order: {product.minOrder} {product.unit}
              </p>
            </div>

            {/* Farmer */}
            <div className="flex items-center justify-between p-4 border border-border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-lg font-semibold text-secondary-foreground">
                  {product.farmerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{product.farmerName}</p>
                  <p className="text-sm text-muted-foreground">Verified Farmer</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantity ({product.unit})
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button
                    className="qty-btn border-0 rounded-none"
                    onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.minOrder, parseInt(e.target.value) || product.minOrder))}
                    className="w-20 text-center py-2 border-0 focus:outline-none bg-transparent"
                  />
                  <button
                    className="qty-btn border-0 rounded-none"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  Total: {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* AI Tip */}
            <AITipCard
              variant="compact"
              title="Bulk Discount Available"
              description="Order 100+ kg for a 10% discount. Make an offer to negotiate!"
            />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 h-12" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => setShowOffer(!showOffer)}
              >
                Make an Offer
              </Button>
            </div>

            {/* Offer Input */}
            {showOffer && (
              <div className="p-4 bg-secondary/50 rounded-xl space-y-3 animate-fade-in">
                <label className="block text-sm font-medium text-foreground">
                  Your offer per {product.unit}
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder={`Current: ${formatPrice(product.price)}`}
                    className="input-agro flex-1"
                  />
                  <Button onClick={() => {
                    toast({
                      title: 'Offer sent!',
                      description: `Your offer of ${formatPrice(parseInt(offerPrice))} has been sent to the farmer.`,
                    });
                    setShowOffer(false);
                    setOfferPrice('');
                  }}>
                    Send Offer
                  </Button>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Fast Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Secure Payment</p>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Fresh Produce</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-4">Product Description</h2>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
