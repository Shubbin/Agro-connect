import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, MessageCircle, Clock, CheckCircle, Truck, X, FileText, ArrowRight, Archive, ShieldCheck, Inbox } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ordersAPI } from '@/services/api';
import { cn } from '@/lib/utils';
import { OrderTimeline } from '@/components/orders/OrderTimeline';

const statusConfig = {
  pending: { label: 'Pending Payment', icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-100' },
  confirmed: { label: 'Order Confirmed', icon: CheckCircle, color: 'bg-blue-50 text-blue-700 border-blue-100' },
  shipped: { label: 'In Transit', icon: Truck, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  delivered: { label: 'Delivered', icon: Package, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  cancelled: { label: 'Cancelled', icon: X, color: 'bg-red-50 text-red-700 border-red-100' },
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
      if (!confirm('Are you sure you want to confirm delivery? This will release the escrow payment to the farmer.')) return;
      await ordersAPI.confirmDelivery(orderId);
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
    <MainLayout hideFooter hideAI>
      <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-12">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                       <FileText className="w-4 h-4" />
                       Order Management
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Orders</h1>
                    <p className="text-gray-600">
                       Track your active purchases, shipment statuses, and review your payment receipts.
                    </p>
                 </div>
                 <div className="flex gap-3">
                    <button className="h-11 px-5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm">
                       Filters
                    </button>
                    <button className="h-11 px-5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm">
                       Export Receipt
                    </button>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {isLoading ? (
            <div className="space-y-6">
               {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-200 shadow-sm" />
               ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto space-y-6">
               <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Inbox className="w-10 h-10 text-gray-300" />
               </div>
               <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">No Orders Found</h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                     You haven't made any purchases yet. Browse the marketplace to find fresh produce and equipment to start shopping!
                  </p>
               </div>
               <Link to="/marketplace" className="inline-block">
                  <button className="h-12 px-6 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm inline-flex items-center gap-2">
                    Shop Marketplace
                    <ArrowRight className="w-4 h-4" />
                  </button>
               </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-primary/30 transition-all duration-300 flex flex-col">
                    
                    {/* Order Meta Header */}
                    <div className="bg-gray-50/50 px-6 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                         <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                            <p className="font-bold text-gray-900">#{order.id.toString().toUpperCase().slice(-8)}</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                         <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order Date</p>
                            <p className="font-medium text-gray-800">{formatDate(order.createdAt)}</p>
                         </div>
                         <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                         <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Seller</p>
                            <p className="font-medium text-gray-800">{order.farmerName || 'Verified Farmer'}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border",
                          status.color
                        )}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </div>
                      </div>
                    </div>

                    {/* Order Timeline Progress Stepper */}
                    {order.status !== 'cancelled' && (
                      <div className="px-6 border-b border-gray-100 bg-white">
                        <OrderTimeline status={order.status} />
                      </div>
                    )}

                    {/* Order Details */}
                    <div className="p-6 grid lg:grid-cols-3 gap-8">
                         {/* Product List */}
                         <div className="lg:col-span-2 space-y-4">
                           {order.items.map((item) => (
                             <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                               <div className="flex items-center gap-4 flex-grow">
                                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                                    <img
                                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                                      alt={item.product?.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-grow min-w-0 flex flex-col justify-center">
                                     <h4 className="font-bold text-gray-900 truncate text-base leading-snug">{item.product?.name}</h4>
                                     <p className="text-xs text-gray-500">
                                        Qty: <span className="font-semibold text-gray-800">{item.quantity} {item.product?.unit}</span>
                                        <span className="mx-1.5">•</span>
                                        Price: <span className="font-semibold text-gray-800">{formatPrice(item.product?.price)}</span>
                                     </p>
                                  </div>
                               </div>
                               <div className="text-left sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 mt-2 sm:mt-0">
                                 <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Subtotal</p>
                                 <p className="font-extrabold text-gray-900 text-sm sm:text-base">
                                   {formatPrice((item.product?.price || 0) * item.quantity)}
                                 </p>
                               </div>
                             </div>
                           ))}
                         </div>

                         {/* Delivery & Escrow Panel */}
                         <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6 flex flex-col justify-between">
                            <div className="space-y-4">
                               <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                     <MapPin className="w-4 h-4" />
                                  </div>
                                  <div className="space-y-1">
                                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Address</h4>
                                     <p className="text-sm font-semibold text-gray-800 leading-relaxed">{order.deliveryAddress}</p>
                                  </div>
                               </div>
                               
                               <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                     <ShieldCheck className="w-4 h-4" />
                                  </div>
                                  <div className="space-y-1">
                                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Escrow Secured</h4>
                                     <p className="text-sm text-gray-600">Fund is held securely in escrow until you verify delivery.</p>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                               <div className="flex justify-between items-end">
                                  <span className="text-sm font-semibold text-gray-500">Total Price</span>
                                  <span className="text-3xl font-bold text-gray-900 leading-none">{formatPrice(order.total)}</span>
                               </div>
                               
                               {order.status === 'shipped' && (
                                 <button 
                                   onClick={() => handleConfirmDelivery(order.id)}
                                   className="w-full h-12 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
                                 >
                                   <CheckCircle className="w-4 h-4" />
                                   Confirm Delivery
                                 </button>
                               )}

                               <div className="grid grid-cols-2 gap-2">
                                  <Link to="/chat" className="block">
                                    <button className="w-full h-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                                      <MessageCircle className="w-4 h-4 text-primary" />
                                      Chat with Farmer
                                    </button>
                                  </Link>
                                  <button className="w-full h-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                                    <Archive className="w-4 h-4 text-primary" />
                                    Archive Order
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

export default OrdersPage;
