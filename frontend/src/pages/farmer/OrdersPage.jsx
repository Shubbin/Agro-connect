import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ordersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, Truck, Package, X, ArrowLeft, MessageCircle, MoreVertical, MapPin, Box, ChevronRight, Hash, ShieldCheck, RefreshCw, Activity, Database, FileText, Inbox } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending Payment', icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-100' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-50 text-blue-700 border-blue-100' },
  shipped: { label: 'In Transit', icon: Truck, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  delivered: { label: 'Delivered', icon: Package, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  cancelled: { label: 'Cancelled', icon: X, color: 'bg-red-50 text-red-700 border-red-100' },
};

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
    }).format(price || 0);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      if (newStatus === 'shipped') {
        const tracking = prompt("Enter Logistics Tracking ID (e.g. AGRO-LOG-2024):");
        const estDelivery = prompt("Enter Estimated Delivery (e.g. 3 days):");
        if (!tracking) return;
        await ordersAPI.updateTracking(orderId, tracking, estDelivery);
      } else if (newStatus === 'delivered') {
        if (!confirm('Are you sure you want to mark this order as delivered?')) return;
        await ordersAPI.confirmDelivery(orderId);
      } else {
        // Generic status update
      }
      
      const data = await ordersAPI.getFarmerOrders();
      setOrders(data);
      
      toast({
        title: 'Status Updated',
        description: `Order successfully updated to '${newStatus}'.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-12">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                       <FileText className="w-4 h-4" />
                       Fulfillment Center
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Farmer Orders</h1>
                    <p className="text-gray-600">
                       Manage orders from buyers, update shipping tracking details, and complete secure escrow settlements.
                    </p>
                 </div>
                 
                 <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center gap-4 shadow-sm shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                       <Activity className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Orders</p>
                       <p className="text-lg font-bold text-gray-900">{orders.filter(o => o.status !== 'delivered').length} Orders</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          
          {/* Filters and Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
               {(['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).map((status) => (
                 <button
                   key={status}
                   onClick={() => setFilter(status)}
                   className={cn(
                     "px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap capitalize",
                     filter === status
                       ? "bg-primary text-white shadow-sm"
                       : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                   )}
                 >
                   {status === 'all' ? 'All Orders' : status}
                 </button>
               ))}
            </div>
            
            <button className="h-10 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold text-sm flex items-center gap-2 hover:bg-gray-50 shadow-sm">
               <RefreshCw className="w-4 h-4 text-primary" />
               Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-6">
               {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-200 shadow-sm" />
               ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto space-y-6">
               <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Inbox className="w-10 h-10 text-gray-300" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">No Orders Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {filter !== 'all' ? `No orders are currently in the '${filter}' state.` : 'Your order history is currently empty. Make sure you list your products on the store!'}
                  </p>
               </div>
               <Link to="/farmer/products" className="inline-block">
                  <button className="h-12 px-6 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm inline-flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Manage Products
                  </button>
               </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-primary/30 transition-all duration-300 flex flex-col">
                    
                    {/* Header */}
                    <div className="bg-gray-50/50 px-6 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                         <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                            <p className="font-bold text-gray-900">#{order.id.toString().toUpperCase().slice(-8)}</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                         <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order Date</p>
                            <p className="font-medium text-gray-800">
                               {new Date(order.createdAt).toLocaleDateString('en-NG', {
                                 year: 'numeric',
                                 month: 'short',
                                 day: 'numeric',
                               })}
                            </p>
                         </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border",
                          status.color
                        )}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Gross Earnings</p>
                           <p className="font-bold text-gray-900 text-xl">
                             {formatPrice(order.total)}
                           </p>
                        </div>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 grid lg:grid-cols-3 gap-8">
                         {/* Product List */}
                         <div className="lg:col-span-2 space-y-4">
                           {order.items.map((item) => (
                             <div key={item.id} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                               <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                                  <img
                                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                                    alt={item.product?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                               <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <h4 className="font-bold text-gray-900 truncate text-lg leading-snug">{item.product?.name}</h4>
                                  <p className="text-sm text-gray-500">
                                     Qty: <span className="font-semibold text-gray-800">{item.quantity} {item.product?.unit}</span>
                                     <span className="mx-2">•</span>
                                     Unit Rate: <span className="font-semibold text-gray-800">{formatPrice(item.product?.price)}</span>
                                  </p>
                               </div>
                               <div className="text-right flex flex-col justify-center shrink-0">
                                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                                 <p className="font-bold text-gray-900 text-lg">
                                   {formatPrice(item.quantity * (item.product?.price || 0))}
                                 </p>
                               </div>
                             </div>
                           ))}
                         </div>

                         {/* Destination & Action Console */}
                         <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6 flex flex-col justify-between">
                            <div className="space-y-4">
                               <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                     <MapPin className="w-4 h-4" />
                                  </div>
                                  <div className="space-y-1">
                                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Destination</h4>
                                     <p className="text-sm font-semibold text-gray-800 leading-relaxed">"{order.deliveryAddress}"</p>
                                  </div>
                               </div>

                               <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                     <ShieldCheck className="w-4 h-4" />
                                  </div>
                                  <div className="space-y-1">
                                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Escrow Settlement</h4>
                                     <p className="text-sm text-gray-600">Fund is guaranteed and held safely in escrow.</p>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="space-y-3 pt-4 border-t border-gray-200">
                               {order.status === 'pending' && (
                                 <div className="grid gap-2">
                                   <button
                                     className="h-12 w-full bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                                     onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                   >
                                     <CheckCircle className="w-4 h-4" />
                                     Confirm Order
                                   </button>
                                   <button
                                     className="h-10 w-full bg-white border border-gray-200 text-red-500 rounded-xl font-semibold text-xs hover:bg-red-50 transition-all"
                                     onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                   >
                                     Cancel Order
                                   </button>
                                 </div>
                               )}
                               {order.status === 'confirmed' && (
                                 <button
                                   className="h-12 w-full bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                                   onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                 >
                                   <Truck className="w-4 h-4" />
                                   Mark as Shipped
                                 </button>
                               )}
                               {order.status === 'shipped' && (
                                 <button
                                   className="h-12 w-full bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                                   onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                 >
                                   <Package className="w-4 h-4" />
                                   Mark as Delivered
                                 </button>
                               )}
                               
                               <div className="grid grid-cols-2 gap-2">
                                  <Link to="/chat" className="block">
                                    <button className="w-full h-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                                      <MessageCircle className="w-4 h-4 text-primary" />
                                      Chat with Buyer
                                    </button>
                                  </Link>
                                  <button className="w-full h-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Order Details
                                  </button>
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

export default FarmerOrdersPage;
