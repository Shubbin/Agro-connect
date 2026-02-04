import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <CheckCircle className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground mb-8">
          Your order has been placed and the farmers have been notified. You'll receive updates via SMS and email.
        </p>

        <div className="bg-secondary/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center gap-4 text-left">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Order Confirmed</p>
              <p className="text-sm text-muted-foreground">
                Estimated delivery: 2-5 business days
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/orders" className="flex-1">
            <Button className="w-full">
              View Orders
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/marketplace" className="flex-1">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
