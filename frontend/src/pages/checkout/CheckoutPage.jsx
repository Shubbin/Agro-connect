import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ordersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ArrowLeft, MapPin, CreditCard, Shield, Truck, ShieldCheck, Lock, Leaf, CheckCircle2 } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

const paymentMethods = [
  { id: 'paystack', name: 'Paystack', description: 'Pay with card, bank transfer, or USSD' },
  { id: 'flutterwave', name: 'Flutterwave', description: 'Secure payment gateway' },
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
    }).format(price);
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
        title: 'Order placed successfully!',
        description: 'You will receive a confirmation shortly.',
      });
      
      navigate('/payment-success');
    } catch (error) {
      toast({
        title: 'Checkout failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      navigate('/payment-failed');
    } finally {
      setIsLoading(false);
    }
  };

  const deliveryFee = 3500;
  const grandTotal = total + deliveryFee;

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-background pb-20">
        {/* Ambient background */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 animate-fade-in">
             <div className="space-y-4">
                <button
                  onClick={() => navigate(-1)}
                  className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-black uppercase tracking-widest text-[10px] mb-4"
                >
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  Return to Cart
                </button>
                <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.9]">
                   Review & <span className="text-gradient">Pay</span>
                </h1>
             </div>
             <div className="flex flex-col items-end gap-2 text-right">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                   <Lock className="w-3 h-3" />
                   SSL Encrypted Session
                </div>
                <p className="text-sm text-muted-foreground font-medium">Finalize your transaction with end-to-end security.</p>
             </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Checkout Main Flow */}
              <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
                {/* Delivery Logistics Section */}
                <div className="glass-premium p-10 rounded-[3rem] border-border/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                     <MapPin className="w-32 h-32 text-primary" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Delivery Address</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                    <div className="sm:col-span-2 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 px-1">
                        Street Address / Landmark
                      </label>
                      <input
                        type="text"
                        required
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="w-full h-14 px-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-2xl transition-all"
                        placeholder="e.g., 12 Marina Road"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 px-1">
                        Metropolis / City
                      </label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full h-14 px-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-2xl transition-all"
                        placeholder="e.g., Lagos Island"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 px-1">
                        Federal State
                      </label>
                      <input
                        type="text"
                        required
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full h-14 px-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-2xl transition-all"
                        placeholder="e.g., Lagos"
                      />
                    </div>
                    <div className="sm:col-span-2 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 px-1">
                        Primary Contact Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full h-14 px-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-2xl transition-all"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>
                </div>

                {/* Secure Payout Section */}
                <div className="glass-premium p-10 rounded-[3rem] border-border/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                     <CreditCard className="w-32 h-32 text-primary" />
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Payment Gateway</h2>
                  </div>

                  <div className="grid gap-4 relative z-10">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          "flex items-center gap-6 p-6 glass-premium rounded-3xl cursor-pointer transition-all duration-500 group/method",
                          selectedPayment === method.id
                            ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20 scale-[1.01] shadow-xl shadow-primary/5"
                            : "border-border/50 hover:border-primary/30"
                        )}
                      >
                        <div className={cn(
                           "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                           selectedPayment === method.id ? "border-primary bg-primary" : "border-border"
                        )}>
                           {selectedPayment === method.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="hidden"
                        />
                        <div className="flex-1">
                          <p className="text-lg font-black text-foreground tracking-tight">{method.name}</p>
                          <p className="text-sm text-muted-foreground font-medium">{method.description}</p>
                        </div>
                        <div className="hidden sm:block">
                           <ShieldCheck className={cn(
                              "w-8 h-8 transition-colors",
                              selectedPayment === method.id ? "text-primary" : "text-muted-foreground/20"
                           )} />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Security Assurance */}
                <div className="flex items-center justify-center gap-12 py-6 opacity-60">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Data Sovereignty</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Compliant</span>
                  </div>
                </div>
              </div>

              {/* Order Manifest Sidebar */}
              <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="sticky top-28 space-y-6">
                  <div className="glass-premium p-10 rounded-[3rem] border-primary/20 bg-primary/[0.01] relative overflow-hidden group shadow-xl shadow-primary/5">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                       <Leaf className="w-32 h-32 text-primary" />
                    </div>

                    <h2 className="text-2xl font-black text-foreground tracking-tight mb-8">Order List</h2>
                    
                    {/* Items List */}
                    <div className="space-y-6 mb-10 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 group/item">
                          <div className="w-14 h-14 glass-premium rounded-xl border-border/50 p-1.5 shrink-0">
                            <img
                              src={item.product.images?.[0] || '/placeholder.svg'}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg group-hover/item:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="text-sm font-black text-foreground truncate group-hover/item:text-primary transition-colors">
                              {item.product.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                              {item.quantity} × {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <div className="text-right flex flex-col justify-center">
                             <span className="text-sm font-black text-foreground tracking-tight">
                               {formatPrice(item.product.price * item.quantity)}
                             </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-8 border-t border-border/50">
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="text-xs font-black uppercase tracking-widest">Subtotal</span>
                        <span className="text-md font-black text-foreground">{formatPrice(total)}</span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="text-xs font-black uppercase tracking-widest">Delivery Fee</span>
                        <span className="text-md font-black text-foreground">{formatPrice(deliveryFee)}</span>
                      </div>
                      
                      <div className="pt-8 border-t border-border/50 flex justify-between items-end">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Grand Total</p>
                           <span className="text-4xl font-black text-gradient tracking-tighter">
                             {formatPrice(grandTotal)}
                           </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-20 mt-10 rounded-[1.5rem] btn-premium text-lg font-black tracking-tight"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                           <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                           Finalizing...
                        </div>
                      ) : (
                        `Finalize Payment`
                      )}
                    </Button>
                    
                    <p className="text-center text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-6">
                       Funds held in Escrow until delivery
                    </p>
                  </div>
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
