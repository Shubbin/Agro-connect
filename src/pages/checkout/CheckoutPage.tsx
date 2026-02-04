import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, Shield, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ordersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Delivery Address</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="input-agro w-full"
                      placeholder="e.g., 12 Marina Road"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="input-agro w-full"
                      placeholder="e.g., Lagos Island"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="input-agro w-full"
                      placeholder="e.g., Lagos"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="input-agro w-full"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all",
                        selectedPayment === method.id
                          ? "border-primary bg-secondary/50"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="w-5 h-5 text-primary"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-sm">Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-hide">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Pay ${formatPrice(grandTotal)}`}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
