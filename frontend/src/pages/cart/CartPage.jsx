import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { AITipCard } from '@/components/ai/AITipCard';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

export const CartPage = () => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const { toast } = useToast();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRemove = async (itemId) => {
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
    const farmerId = item.product.farmerId || 'unknown';
    if (!acc[farmerId]) {
      acc[farmerId] = {
        farmerName: item.product.farmerName || 'Unknown Farmer',
        items: [],
      };
    }
    acc[farmerId].items.push(item);
    return acc;
  }, {});

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-background pb-20">
        {/* Dynamic Background */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 animate-fade-in">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                  <ShoppingCart className="w-3 h-3" />
                  Your Cart
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.9]">
                  Your <span className="text-gradient">Cart</span>
               </h1>
            </div>
            <p className="text-xl text-muted-foreground font-medium max-w-sm">
               Review your selections and prepare for secure checkout.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items Area */}
            <div className="lg:col-span-2 space-y-10 animate-fade-in-up">
              {/* AI Tip */}
              <AITipCard
                title="Combined Delivery"
                description="Buying multiple items from the same partner makes delivery faster and cheaper."
                className="border-primary/20 bg-primary/[0.02]"
              />

              {Object.entries(itemsByFarmer).map(([farmerId, { farmerName, items: farmerItems }]) => (
                <div key={farmerId} className="space-y-4">
                  <div className="flex items-center gap-4 px-2">
                     <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-primary" />
                        From {farmerName}
                     </h3>
                     <VerificationBadge status="verified" size="sm" />
                  </div>
                  
                  <div className="glass-premium rounded-[2.5rem] border-border/50 overflow-hidden divide-y divide-border/30">
                    {farmerItems.map((item) => (
                      <div key={item.id} className="p-8 flex flex-col sm:flex-row gap-8 hover:bg-white/5 transition-colors group">
                        <div className="w-32 h-32 glass-premium rounded-2xl border-border/50 p-2 shrink-0 overflow-hidden">
                           <div className="w-full h-full rounded-xl overflow-hidden bg-muted">
                              <img
                                src={item.product.images?.[0] || '/placeholder.svg'}
                                alt={item.product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                           </div>
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                          <div>
                             <div className="flex items-start justify-between gap-4 mb-1">
                                <Link
                                  to={`/product/${item.product.id}`}
                                  className="text-2xl font-black text-foreground hover:text-primary transition-colors tracking-tight line-clamp-1"
                                >
                                  {item.product.name}
                                </Link>
                                <button
                                  onClick={() => handleRemove(item.id)}
                                  className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all active:scale-90"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                             </div>
                             <p className="text-sm text-muted-foreground font-medium mb-4">
                                {formatPrice(item.product.price)} / {item.product.unit}
                             </p>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center bg-secondary/50 rounded-xl border border-border/50 p-1">
                              <button
                                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all active:scale-90"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center text-lg font-black font-mono">
                                {item.quantity}
                              </span>
                              <button
                                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all active:scale-90"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="text-right">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Line Total</p>
                               <span className="text-2xl font-black text-foreground tracking-tighter">
                                 {formatPrice(item.product.price * item.quantity)}
                               </span>
                            </div>
                          </div>

                          {item.offerStatus && (
                            <div className="mt-4">
                              <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                item.offerStatus === 'accepted' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                                item.offerStatus === 'rejected' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                                item.offerStatus === 'countered' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                                'bg-primary/10 text-primary border border-primary/20'
                              }`}>
                                {item.offerStatus} Offer - {formatPrice(item.offeredPrice)}
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

            {/* Premium Summary Sidebar */}
            <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="sticky top-28 space-y-6">
                <div className="glass-premium p-10 rounded-[3rem] border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                     <ShieldCheck className="w-32 h-32 text-primary" />
                  </div>
                  
                  <h2 className="text-2xl font-black text-foreground tracking-tight mb-8 flex items-center gap-3">
                     Summary
                  </h2>
                  
                  <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center text-muted-foreground group">
                      <span className="text-sm font-bold uppercase tracking-widest">Subtotal</span>
                      <span className="text-lg font-black text-foreground tracking-tight">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground group">
                      <span className="text-sm font-bold uppercase tracking-widest">Est. Delivery</span>
                      <span className="text-xs font-black uppercase tracking-tighter">Calculated at Checkout</span>
                    </div>
                    
                    <div className="pt-6 border-t border-border/50">
                      <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Final Payable</p>
                           <span className="text-4xl font-black text-gradient tracking-tighter">{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to="/checkout" className="block group/btn">
                    <Button className="w-full h-20 rounded-[1.5rem] btn-premium text-lg font-black tracking-tight flex items-center justify-center gap-3">
                      Secure Checkout
                      <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                  
                  <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
                     <ShieldCheck className="w-5 h-5" />
                     <Truck className="w-5 h-5" />
                     <Leaf className="w-5 h-5" />
                  </div>
                </div>
                
                <Link to="/marketplace" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                  <ArrowRight className="w-3 h-3 rotate-180" />
                  Continue Discovery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
