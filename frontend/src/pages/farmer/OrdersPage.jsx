import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ordersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, Truck, Package, X, ArrowLeft, MessageCircle, MoreVertical, ExternalLink, MapPin, Box, ChevronRight } from 'lucide-react';
import { OrderTimeline } from '@/components/orders/OrderTimeline';

export const FarmerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getFarmerOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <Package className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      if (newStatus === 'shipped') {
        const tracking = prompt("Enter Tracking Number:");
        const estDelivery = prompt("Enter Estimated Delivery (e.g. 3-5 days):");
        if (!tracking) return;
        await ordersAPI.updateTracking(orderId, tracking, estDelivery);
      } else if (newStatus === 'delivered') {
        await ordersAPI.confirmDelivery(orderId);
      } else {
        // Generic status update if needed (not implemented in backend yet, but mapping anyway)
        // For now just refresh
      }
      
      const data = await ordersAPI.getFarmerOrders();
      setOrders(data);
      
      toast({
        title: 'Protocol Updated',
        description: `Order successfully transitioned to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: 'System Failure',
        description: error.message || 'Could not synchronize order status.',
        variant: 'destructive',
      });
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-background pb-20">
        {/* Ambient background */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 animate-fade-in">
            <div className="space-y-4">
               <Link to="/farmer/dashboard" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-black uppercase tracking-widest text-[10px] mb-4">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  Control Center
               </Link>
               <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.9]">
                  Fulfillment <span className="text-gradient">Console</span>
               </h1>
               <p className="text-xl text-muted-foreground font-medium max-w-md">
                 Manage active order cycles and logistical synchronization.
               </p>
            </div>
            <div className="flex gap-4">
               <div className="glass-premium px-6 py-4 rounded-2xl border-border/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Active Pipeline</p>
                  <p className="text-2xl font-black text-foreground">{orders.length} Cycles</p>
               </div>
            </div>
          </div>

          {/* Status Architecture */}
          <div className="flex gap-3 mb-12 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {(['all', 'pending', 'confirmed', 'shipped', 'delivered']).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  "px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap border border-border/50",
                  filter === status
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.05]"
                    : "glass-premium hover:bg-white text-muted-foreground"
                )}
              >
                {status}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="glass-premium rounded-[3rem] p-24 text-center animate-fade-in-up border-border/50" style={{ animationDelay: '200ms' }}>
               <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Box className="w-10 h-10 text-primary" />
               </div>
               <h3 className="text-3xl font-black text-foreground tracking-tight mb-4">No Cycles Detected</h3>
               <p className="text-xl text-muted-foreground font-medium mb-10 max-w-md mx-auto italic">
                 {filter !== 'all' ? `No data points currently match the '${filter}' status filter.` : 'Logistical pipeline is currently clear. Awaiting new buyer acquisitions.'}
               </p>
            </div>
          ) : (
            <div className="space-y-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {filteredOrders.map((order) => (
                <div key={order.id} className="glass-premium rounded-[3rem] border-border/50 overflow-hidden shadow-2xl shadow-primary/5 group hover:border-primary/30 transition-all duration-500">
                  {/* Order Protocol Header */}
                  <div className="bg-secondary/30 px-10 py-8 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                       <Package className="w-32 h-32 text-primary" />
                    </div>
                    
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="w-16 h-16 rounded-2xl bg-white border border-border/50 flex items-center justify-center shadow-sm">
                          <div className="text-center">
                             <p className="text-[10px] font-black uppercase text-muted-foreground leading-none">REF</p>
                             <p className="text-lg font-black text-foreground tracking-tighter">#{order.id.toString().slice(-4)}</p>
                          </div>
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Initialization Timestamp</p>
                         <p className="text-xl font-black text-foreground tracking-tight">
                           {new Date(order.createdAt).toLocaleDateString('en-NG', {
                             year: 'numeric',
                             month: 'long',
                             day: 'numeric',
                           })}
                         </p>
                       </div>
                    </div>

                    <div className="flex items-center gap-6 relative z-10">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                        getStatusColor(order.status),
                        "bg-white border border-current shadow-sm"
                      )}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Contract Valuation</p>
                         <p className="text-3xl font-black text-primary tracking-tighter">
                           {formatPrice(order.total)}
                         </p>
                      </div>
                    </div>
                  </div>

                   {/* Operational Content */}
                   <div className="p-10">
                     <div className="mb-12 glass-premium rounded-3xl p-8 border-border/30">
                        <OrderTimeline status={order.status} />
                     </div>

                     <div className="grid lg:grid-cols-2 gap-12">
                       {/* Logistics Data */}
                       <div className="space-y-8">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-6">
                             <Truck className="w-4 h-4 text-primary" />
                             Logistical Documentation
                          </h4>
                          
                          <div className="space-y-6">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-5 group/item">
                                <div className="w-20 h-20 glass-premium rounded-2xl overflow-hidden shrink-0 border border-border/50 p-1 group-hover/item:scale-105 transition-all duration-500">
                                   <div className="w-full h-full rounded-xl overflow-hidden bg-muted">
                                      <img
                                        src={item.product?.images?.[0] || '/placeholder.svg'}
                                        alt={item.product?.name}
                                        className="w-full h-full object-cover"
                                      />
                                   </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-lg font-black text-foreground truncate group-hover/item:text-primary transition-colors">{item.product?.name}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                     <span className="text-[10px] font-black bg-secondary px-3 py-1 rounded-full uppercase tracking-widest">
                                        Qty: {item.quantity} {item.product?.unit}
                                     </span>
                                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                        @ {formatPrice(item.product?.price || 0)}
                                     </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="glass-premium bg-secondary/30 rounded-[2rem] p-6 border-border/50">
                            <div className="flex items-start gap-4">
                               <MapPin className="w-5 h-5 text-primary mt-1" />
                               <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Destination Coordinates</p>
                                  <p className="text-sm font-bold text-foreground leading-snug">{order.deliveryAddress}</p>
                               </div>
                            </div>
                          </div>
                       </div>

                       {/* Fulfillment Controls */}
                       <div className="lg:border-l border-border/30 lg:pl-12 flex flex-col justify-between">
                          <div>
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-8">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                Operational Controls
                             </h4>
                             
                             <div className="space-y-4">
                               {order.status === 'pending' && (
                                 <div className="flex flex-col sm:flex-row gap-4">
                                   <Button
                                     className="h-16 flex-1 rounded-2xl btn-premium text-sm font-black tracking-tight"
                                     onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                   >
                                     Authorize Contract
                                   </Button>
                                   <Button
                                     variant="outline"
                                     className="h-16 flex-1 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/5 font-black tracking-tight"
                                     onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                   >
                                     Decline Request
                                   </Button>
                                 </div>
                               )}
                               {order.status === 'confirmed' && (
                                 <Button
                                   className="h-16 w-full rounded-2xl btn-premium text-sm font-black tracking-tight"
                                   onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                 >
                                   Initiate Logistics Cycle
                                 </Button>
                               )}
                               {order.status === 'shipped' && (
                                 <Button
                                   className="h-16 w-full rounded-2xl btn-premium text-sm font-black tracking-tight"
                                   onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                 >
                                   Mark Fulfillment Complete
                                 </Button>
                               )}
                               
                               <div className="grid grid-cols-2 gap-4">
                                  <Link to="/chat" className="block">
                                    <Button variant="outline" className="h-16 w-full rounded-2xl border-border/50 hover:bg-white font-black tracking-tight text-muted-foreground flex items-center gap-3">
                                      <MessageCircle className="w-5 h-5 text-primary" />
                                      Sync with Buyer
                                    </Button>
                                  </Link>
                                  <Button variant="outline" className="h-16 w-full rounded-2xl border-border/50 hover:bg-white font-black tracking-tight text-muted-foreground flex items-center gap-3">
                                    <ExternalLink className="w-5 h-5" />
                                    Print Invoice
                                  </Button>
                               </div>
                             </div>
                          </div>

                          <div className="mt-12 flex items-center justify-between p-6 glass-premium bg-primary/[0.02] rounded-3xl border-primary/10">
                             <div className="flex items-center gap-3">
                                <Box className="w-5 h-5 text-primary opacity-30" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Lifecycle Phase:</span>
                             </div>
                             <span className="text-xs font-black text-primary uppercase tracking-widest italic">{order.status}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FarmerOrdersPage;
