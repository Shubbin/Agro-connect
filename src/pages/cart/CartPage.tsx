import { Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { AITipCard } from '@/components/ai/AITipCard';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export const CartPage = () => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRemove = async (itemId: string) => {
    await removeItem(itemId);
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart.',
    });
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Browse our marketplace to find fresh produce and farm equipment
          </p>
          <Link to="/marketplace">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Group items by farmer
  const itemsByFarmer = items.reduce((acc, item) => {
    const farmerId = item.product.farmerId;
    if (!acc[farmerId]) {
      acc[farmerId] = {
        farmerName: item.product.farmerName,
        items: [],
      };
    }
    acc[farmerId].items.push(item);
    return acc;
  }, {} as Record<string, { farmerName: string; items: typeof items }>);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Tip */}
            <AITipCard
              title="Save on delivery!"
              description="Order from the same farmer to combine shipping and save up to ₦2,000."
            />

            {Object.entries(itemsByFarmer).map(([farmerId, { farmerName, items: farmerItems }]) => (
              <div key={farmerId} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="bg-secondary/50 px-5 py-3 border-b border-border">
                  <p className="font-semibold text-foreground">From: {farmerName}</p>
                </div>
                <div className="divide-y divide-border">
                  {farmerItems.map((item) => (
                    <div key={item.id} className="p-5 flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-semibold text-foreground hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.product.price)} per {item.product.unit}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button
                              className="qty-btn border-0 rounded-none h-8 w-8"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-12 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              className="qty-btn border-0 rounded-none h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-foreground">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {item.offerStatus && (
                          <div className="mt-2">
                            <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                              item.offerStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                              item.offerStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                              item.offerStatus === 'countered' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              Offer: {item.offerStatus}
                              {item.offeredPrice && ` - ${formatPrice(item.offeredPrice)}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-24 bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full h-12">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link to="/marketplace" className="block text-center text-sm text-primary hover:underline mt-4">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
