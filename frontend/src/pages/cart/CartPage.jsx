import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, ShieldCheck, ShoppingBag, Info, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CartPage = () => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const { toast } = useToast();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleRemove = async (itemId) => {
    await removeItem(itemId);
    toast({
      title: 'Item Removed',
      description: 'The product has been successfully removed from your cart.',
    });
  };

  if (items.length === 0) {
    return (
      <MainLayout hideFooter hideAI>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
          <div className="w-24 h-24 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-inner mb-6">
            <Inbox className="w-10 h-10 text-gray-300" />
          </div>
          <div className="text-center space-y-2 mb-8 max-w-md">
             <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Your Cart is Empty</h2>
             <p className="text-gray-500">
                You haven't added any products to your cart yet. Visit our marketplace to find fresh produce and premium farming tools.
             </p>
          </div>
          <Link to="/marketplace">
             <button className="h-12 px-6 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm inline-flex items-center gap-2">
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
             </button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const itemsByFarmer = items.reduce((acc, item) => {
    const farmerId = item.product.farmerId || 'unknown';
    if (!acc[farmerId]) {
      acc[farmerId] = {
        farmerName: item.product.farmerName || 'Verified Seller',
        items: [],
      };
    }
    acc[farmerId].items.push(item);
    return acc;
  }, {});

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-12">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                       <ShoppingCart className="w-4 h-4" />
                       Shopping Cart
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Cart</h1>
                    <p className="text-gray-600">
                       Review the items in your cart, adjust quantities, and proceed to checkout to secure your order.
                    </p>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Products List Panel */}
            <div className="lg:col-span-2 space-y-8">
              {Object.entries(itemsByFarmer).map(([farmerId, { farmerName, items: farmerItems }]) => (
                <div key={farmerId} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 px-2">
                     <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Farmer / Seller</span>
                        <h3 className="font-bold text-gray-800 flex items-center gap-1">
                           {farmerName}
                           <ShieldCheck className="w-4 h-4 text-primary" />
                        </h3>
                     </div>
                     <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Verified Seller</span>
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                    {farmerItems.map((item) => (
                      <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors group">
                        <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                           <img
                             src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                             alt={item.product.name}
                             className="w-full h-full object-cover"
                           />
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="space-y-1">
                             <div className="flex items-start justify-between gap-4">
                                <div>
                                   <Link
                                     to={`/product/${item.product.id}`}
                                     className="font-bold text-gray-900 hover:text-primary transition-colors text-lg leading-snug line-clamp-1"
                                   >
                                     {item.product.name}
                                   </Link>
                                   <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Product ID: {item.product.id.slice(-8).toUpperCase()}</p>
                                </div>
                                <button
                                  onClick={() => handleRemove(item.id)}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                             <p className="text-sm font-bold text-gray-700">{formatPrice(item.product.price)} <span className="text-xs text-gray-400 font-medium">/ {item.product.unit}</span></p>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                              <button
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-400 hover:text-gray-800 shadow-sm"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center text-sm font-bold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-400 hover:text-gray-800 shadow-sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="text-right">
                               <span className="text-xs text-gray-400 block mb-0.5">Subtotal</span>
                               <span className="font-bold text-gray-900 text-lg">
                                 {formatPrice(item.product.price * item.quantity)}
                               </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                     <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <ShoppingBag className="w-5 h-5" />
                     </div>
                     <div>
                        <h2 className="font-bold text-gray-900 leading-tight">Order Summary</h2>
                        <p className="text-xs text-gray-400 font-semibold">{items.length} items in cart</p>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500 font-semibold">Items Subtotal</span>
                       <span className="font-bold text-gray-900">{formatPrice(total)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500 font-semibold">Delivery Fee</span>
                       <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-100">Calculated at checkout</span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                       <div className="flex justify-between items-end">
                          <span className="text-base font-bold text-gray-900">Total Price</span>
                          <span className="text-2xl font-bold text-primary leading-none">{formatPrice(total)}</span>
                       </div>
                    </div>
                  </div>

                  <Link to="/checkout" className="block">
                     <button className="w-full h-12 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2">
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4" />
                     </button>
                  </Link>
                </div>

                {/* Escrow Guarantee Widget */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-3 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-5 -mr-8 -mt-8 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-40 h-40 text-white" />
                   </div>
                   <div className="flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                         <Info className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-white uppercase tracking-wider">Escrow Safeguard Active</p>
                         <p className="text-[10px] text-slate-400 font-medium">100% Secure Payments</p>
                      </div>
                   </div>
                   <p className="text-xs text-slate-300 leading-relaxed pl-13 border-l border-primary/20">
                      AgroDirect protects your payments in secure escrow. The farmer only gets paid once you confirm that you have safely received your order.
                   </p>
                </div>
                
                <Link to="/marketplace" className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary transition-colors">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Go Back to Marketplace
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
