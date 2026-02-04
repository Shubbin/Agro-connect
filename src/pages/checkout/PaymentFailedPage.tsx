import { Link } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PaymentFailedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <XCircle className="w-12 h-12 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Payment Failed
        </h1>
        <p className="text-muted-foreground mb-8">
          We couldn't process your payment. Your cart items are still saved. Please try again or use a different payment method.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/checkout" className="flex-1">
            <Button className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </Link>
          <Link to="/cart" className="flex-1">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
