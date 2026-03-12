import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, MessageCircle, Clock, CheckCircle, Truck, X, Leaf } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ordersAPI } from '@/services/api';
import { cn } from '@/lib/utils';
import { OrderTimeline } from '@/components/orders/OrderTimeline';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', icon: Truck, color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', icon: Package, color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', icon: X, color: 'bg-red-100 text-red-800' },
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
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

  const handleConfirmDelivery = async (orderId) => {
    try {
      await ordersAPI.confirmDelivery(orderId);
      // Refresh orders
      const data = await ordersAPI.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to confirm delivery:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-background pb-20">
        {/* Ambient Background Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <div className="mb-12 space-y-4 animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                <Package className="w-3 h-3" />
                Purchase History
             </div>
             <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.9]">
                My <span className="text-gradient">Acquisitions</span>
             </h1>
             <p className="text-xl text-muted-foreground font-medium max-w-xl italic">
                Track your active logistics and review your past agricultural investments.
             </p>
          </div>

          {isLoading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-premium rounded-[2.5rem] p-10 border-border/50 animate-pulse">
                  <div className="h-8 bg-muted rounded-xl w-1/4 mb-6" />
                  <div className="h-4 bg-muted rounded-lg w-1/2" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="glass-premium rounded-[3rem] p-20 text-center border-border/50 animate-fade-in-up">
              <div className="w-24 h-24 bg-secondary/50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-4xl font-black text-foreground tracking-tight mb-4">The Ledger is Empty</h2>
              <p className="text-xl text-muted-foreground font-medium mb-10 max-w-md mx-auto">
                No active order cycles found. Initialize your first acquisition from the marketplace.
              </p>
              <Link to="/marketplace">
                <Button size="xl" className="rounded-2xl btn-premium px-10 h-16 text-lg font-black tracking-tight">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {orders.map((order, idx) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <div 
                    key={order.id} 
                    className="glass-premium rounded-[3rem] border-border/50 overflow-hidden animate-fade-in-up group hover:border-primary/50 transition-all duration-500 shadow-2xl shadow-transparent hover:shadow-primary/5"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Order Meta Header */}
                    <div className="bg-secondary/30 px-10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-2xl bg-white border border-border/50 flex items-center justify-center shadow-sm">
                            <div className="text-center">
                               <p className="text-[10px] font-black uppercase text-muted-foreground leading-none">ID</p>
                               <p className="text-lg font-black text-foreground tracking-tighter">#{order.id.toString().slice(-4)}</p>
                            </div>
                         </div>
                         <div>
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Authorization Timestamp</p>
                            <p className="text-xl font-bold text-foreground">{formatDate(order.createdAt)}</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg transition-transform group-hover:scale-105",
                          status.color,
                          "bg-white border border-current shadow-transparent"
                        )}>
                          <StatusIcon className="w-5 h-5" />
                          {status.label}
                        </div>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-10">
                      {/* Tracking Visualizer (Phase 2 Premium) */}
                      <div className="mb-12 glass-premium rounded-3xl p-8 border-border/30">
                         <OrderTimeline status={order.status} />
                         
                         {order.tracking_number && (
                           <div className="mt-8 flex items-center justify-between px-4 border-t border-border/20 pt-6 animate-fade-in">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                  <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Global Tracking ID</p>
                                  <p className="font-bold text-foreground font-mono">{order.tracking_number}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">ETA Projection</p>
                                <p className="font-bold text-foreground">{order.estimated_delivery || 'Calculating...'}</p>
                              </div>
                           </div>
                         )}
                      </div>

                      <div className="space-y-8 mb-10">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-8 group/item">
                            <div className="w-24 h-24 bg-secondary rounded-[1.5rem] overflow-hidden shrink-0 border border-border/50 group-hover/item:scale-105 transition-transform duration-500">
                              <img
                                src={item.product?.images?.[0] || '/placeholder.svg'}
                                alt={item.product?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0 py-2">
                              <h4 className="text-2xl font-black text-foreground tracking-tight group-hover/item:text-primary transition-colors">{item.product?.name}</h4>
                              <p className="text-lg text-muted-foreground font-medium">
                                Quantity Unit: <span className="font-bold text-foreground">{item.quantity}</span>
                              </p>
                              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary text-xs font-black uppercase">
                                 Unit Price: {formatPrice(item.product?.price)}
                              </div>
                            </div>
                            <div className="text-right py-2">
                              <p className="text-xs font-black uppercase text-muted-foreground mb-1">Subtotal</p>
                              <p className="text-3xl font-black text-foreground tracking-tighter">
                                {formatPrice((item.product?.price || 0) * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="border-t border-border/50 pt-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="space-y-2">
                           <div className="flex items-center gap-3 text-muted-foreground">
                              <MapPin className="w-5 h-5 text-primary" />
                              <span className="text-sm font-black uppercase tracking-widest">Delivery Coordinates</span>
                           </div>
                           <p className="text-lg font-bold text-foreground max-w-md pl-8 leading-tight">{order.deliveryAddress}</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                           <div className="text-right">
                              <p className="text-xs font-black uppercase text-muted-foreground mb-1">Grand Aggregate Total</p>
                              <div className="text-4xl font-black text-gradient tracking-tighter">
                                {formatPrice(order.total)}
                              </div>
                           </div>
                           <div className="flex gap-3">
                              {order.status === 'shipped' && (
                                <Button 
                                  onClick={() => handleConfirmDelivery(order.id)}
                                  size="xl" 
                                  className="rounded-2xl btn-premium h-16 px-8 font-black tracking-tight flex items-center gap-3"
                                >
                                  <CheckCircle className="w-6 h-6" />
                                  Confirm Delivery
                                </Button>
                              )}
                              <Link to="/chat">
                                <Button variant="outline" size="xl" className="rounded-2xl border-primary/20 hover:bg-primary/10 font-black h-16 w-16 p-0 flex items-center justify-center">
                                  <MessageCircle className="w-8 h-8 text-primary" />
                                </Button>
                              </Link>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default OrdersPage;
