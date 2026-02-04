import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, MapPin, MessageCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ordersAPI, Order } from '@/services/api';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-600 bg-amber-100', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-600 bg-blue-100', label: 'Confirmed' },
  shipped: { icon: Truck, color: 'text-purple-600 bg-purple-100', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600 bg-green-100', label: 'Delivered' },
  cancelled: { icon: Package, color: 'text-red-600 bg-red-100', label: 'Cancelled' },
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getAll();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/4 mb-4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
            <Link to="/marketplace">
              <Button>Browse Marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-secondary/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-semibold text-foreground">{order.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Placed on</p>
                        <p className="font-medium text-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                        status.color
                      )}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × {formatPrice(item.product.price)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              From: {item.product.farmerName}
                            </p>
                          </div>
                          <span className="font-semibold text-foreground">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-primary">
                          Total: {formatPrice(order.total)}
                        </span>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Seller
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrdersPage;
