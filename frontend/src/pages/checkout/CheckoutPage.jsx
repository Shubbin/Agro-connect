import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { ordersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ArrowLeft, MapPin, CreditCard, ShieldCheck, Lock, ChevronRight, FileText, RefreshCw, Smartphone, Building2, Globe } from 'lucide-react';

const paymentMethods = [
  { id: 'paystack', name: 'Card / Bank Transfer (Paystack)', description: 'Pay securely using your Debit/Credit card (Visa, Mastercard, Verve) or direct bank transfer.', icon: CreditCard },
  { id: 'flutterwave', name: 'Mobile Money / Wallet (Flutterwave)', description: 'Pay securely using mobile money, USSD code, cards, or online digital wallets.', icon: Smartphone },
];

export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('paystack');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    phone: '',
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fullAddress = `${address.street}, ${address.city}, ${address.state}`;
      
      await ordersAPI.create({
        items,
        deliveryAddress: fullAddress,
        paymentMethod: selectedPayment,
      });

      await clearCart();
      
      toast({
        title: 'Order Placed Successfully',
        description: 'Your order has been placed and is currently being processed.',
      });
      
      navigate('/payment-success');
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: 'Failed to place your order. Please check your details and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deliveryFee = 3500;
  const grandTotal = total + deliveryFee;

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                   <button
                     onClick={() => navigate(-1)}
                     className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider"
                   >
                     <ArrowLeft className="w-4 h-4" />
                     Back to Cart
                   </button>
                   <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Checkout</h1>
                   <p className="text-gray-600">
                      Provide your delivery address and choose a payment method to complete your purchase.
                   </p>
                </div>
                
                {/* Progress Indicators */}
                <div className="flex items-center gap-4 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 shadow-sm shrink-0">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">1</div>
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Step 1</p>
                         <p className="text-sm font-bold text-gray-900 leading-none">Checkout Details</p>
                      </div>
                   </div>
                   <ChevronRight className="w-4 h-4 text-gray-300" />
                   <div className="flex items-center gap-2 opacity-40">
                      <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-500 flex items-center justify-center font-bold border border-gray-300">2</div>
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Step 2</p>
                         <p className="text-sm font-bold text-gray-950 leading-none">Order Status</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Delivery Address Section */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="font-bold text-gray-900 text-lg leading-tight">Delivery Address</h2>
                     <p className="text-xs text-gray-400 font-semibold">Where should we deliver your products?</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Street Address</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                       <input
                         type="text"
                         required
                         value={address.street}
                         onChange={(e) => setAddress({ ...address, street: e.target.value })}
                         className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold placeholder:text-gray-300 focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none shadow-inner"
                         placeholder="e.g. 15 Herbert Macaulay Way"
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">City</label>
                    <div className="relative">
                       <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                       <input
                         type="text"
                         required
                         value={address.city}
                         onChange={(e) => setAddress({ ...address, city: e.target.value })}
                         className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold placeholder:text-gray-300 focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none shadow-inner"
                         placeholder="e.g. Yaba"
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">State</label>
                    <div className="relative">
                       <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                       <input
                         type="text"
                         required
                         value={address.state}
                         onChange={(e) => setAddress({ ...address, state: e.target.value })}
                         className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold placeholder:text-gray-300 focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none shadow-inner"
                         placeholder="e.g. Lagos"
                       />
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                    <div className="relative">
                       <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                       <input
                         type="tel"
                         required
                         value={address.phone}
                         onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                         className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold placeholder:text-gray-300 focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none shadow-inner"
                         placeholder="e.g. +234 801 234 5678"
                       />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Section */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary animate-pulse">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="font-bold text-gray-900 text-lg leading-tight">Payment Methods</h2>
                     <p className="text-xs text-gray-400 font-semibold">Choose your preferred payment method securely.</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border group/method relative overflow-hidden active:scale-[0.99]",
                        selectedPayment === method.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
                      )}
                    >
                      <div className={cn(
                         "w-6 h-6 rounded-full border-4 flex items-center justify-center shrink-0 transition-colors",
                         selectedPayment === method.id ? "border-primary bg-white" : "border-gray-200 bg-white"
                      )}>
                         {selectedPayment === method.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex-1 space-y-1">
                        <p className="font-bold text-gray-950 leading-snug">{method.name}</p>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-md">{method.description}</p>
                      </div>
                      <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                         <method.icon className={cn(
                            "w-6 h-6",
                            selectedPayment === method.id ? "text-primary" : "text-gray-300"
                         )} />
                      </div>
                    </label>
                  ))}
                </div>
                
                {/* Escrow Guarantee Banner */}
                <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 flex items-start gap-4">
                   <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                      <Lock className="w-5 h-5 text-primary" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Escrow Safeguard Active</p>
                      <p className="text-xs text-slate-300 leading-relaxed italic border-l border-primary/20 pl-3">
                         Your payment is safely guarded by AgroDirect escrow. Farmers are only paid once you confirm that the products have been delivered safely in good condition.
                      </p>
                   </div>
                </div>
              </div>
            </div>

            {/* Order Items Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                     <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <FileText className="w-5 h-5" />
                     </div>
                     <div>
                        <h2 className="font-bold text-gray-900 leading-tight">Order Details</h2>
                        <p className="text-xs text-gray-400 font-semibold">Review your shopping bag</p>
                     </div>
                  </div>
                  
                  {/* Item List */}
                  <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="font-bold text-gray-900 truncate text-sm leading-snug">{item.product.name}</p>
                          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                             <span>Qty: {item.quantity} {item.product.unit}</span>
                             <span className="font-bold text-gray-800">
                                {formatPrice(item.product.price * item.quantity)}
                             </span>
                          </div>
                        </div>
                       </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
                       <span>Subtotal</span>
                       <span className="font-bold text-gray-900">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
                       <span>Delivery Fee</span>
                       <span className="font-bold text-gray-900">{formatPrice(deliveryFee)}</span>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-gray-100">
                       <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Amount</span>
                          <span className="text-3xl font-bold text-primary leading-none">
                            {formatPrice(grandTotal)}
                          </span>
                       </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 mt-6 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                       <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                       <>
                          Complete Order
                          <ArrowRight className="w-4 h-4" />
                       </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
