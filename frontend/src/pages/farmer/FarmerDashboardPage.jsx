import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { walletAPI, ordersAPI, productsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Package, ShoppingCart, Wallet, MessageCircle, ArrowRight, ShieldCheck, TrendingUp, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Globe, Info, Database, Landmark, Building2, UserCheck, RefreshCw, FileText, Smartphone, ChevronRight } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { cn } from '@/lib/utils';

export const FarmerDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, balance: 0, pending: 0, recentOrders: [] });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [wallet, orders, products] = await Promise.all([
          walletAPI.getBalance().catch(() => ({ available: 0, pending: 0 })),
          ordersAPI.getFarmerOrders().catch(() => []),
          productsAPI.getByFarmer(user.id),
        ]);
        setStats({
          products: products.length,
          orders: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
          balance: wallet?.available || 0,
          pending: wallet?.pending || 0,
          recentOrders: orders.slice(0, 3)
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, [user]);

  const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price || 0);

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-sm shrink-0">
                   {user?.name?.charAt(0) || 'F'}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                     <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Farmer Dashboard: {user?.name || 'Farmer'}</h1>
                     <VerificationBadge status={user?.is_verified ? 'verified' : 'unverified'} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
                     <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm">
                        <Activity className="w-3 h-3" />
                        <span>Live Account Active</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-primary" />
                        <span>Farmer ID: {user?.id?.toString().toUpperCase().slice(-8)}</span>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link to="/farmer/products/new">
                  <button className="h-10 px-4 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm active:scale-95 group">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Add New Product
                  </button>
                </Link>
                <Link to="/profile">
                  <button className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 shadow-sm active:scale-95 flex items-center gap-1.5">
                    My Profile
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Landmark, label: 'Available Balance', value: formatPrice(stats.balance), sub: 'Ready for payout request', trend: 'Available', color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
              { icon: Clock, label: 'Escrow Balance', value: formatPrice(stats.pending), sub: 'Pending delivery confirmation', trend: 'Locked', color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100' },
              { icon: FileText, label: 'Active Orders', value: stats.orders, sub: 'Orders to deliver', trend: 'Active', color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
              { icon: Database, label: 'Listed Products', value: stats.products, sub: 'Products on store', trend: 'Live', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 hover:shadow-md hover:border-primary/20 transition-all group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <stat.icon className="w-20 h-20 text-slate-900" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner", stat.bg, stat.color, stat.border)}>
                       <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-gray-400 tracking-wider uppercase">{stat.trend}</span>
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-primary transition-colors">{stat.value}</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                       <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.sub}</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Orders Panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group">
                <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-sm">
                         <Activity className="w-5 h-5" />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-900 leading-tight">Active Sales Orders</h3>
                         <p className="text-xs text-gray-400 font-semibold">Manage and fulfill your customer orders</p>
                      </div>
                   </div>
                   <Link to="/farmer/orders" className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-50 shadow-sm">
                      View All Orders
                      <ChevronRight className="w-4 h-4 text-primary" />
                   </Link>
                </div>
                
                <div className="p-0">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-gray-50/20 border-b border-gray-100">
                            <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                               <th className="px-6 py-3">Order Details</th>
                               <th className="px-6 py-3">Amount Paid</th>
                               <th className="px-6 py-3">Status</th>
                               <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100 text-sm">
                            {stats.recentOrders.length > 0 ? (
                              stats.recentOrders.map((row) => {
                                const isDelivered = row.status === 'delivered';
                                const isCancelled = row.status === 'cancelled';
                                const colorClass = isDelivered 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                  : isCancelled 
                                    ? 'bg-red-50 text-red-700 border-red-100' 
                                    : 'bg-amber-50 text-amber-700 border-amber-100';

                                return (
                                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group/row">
                                     <td className="px-6 py-4">
                                        <p className="font-bold text-gray-950 group-hover/row:text-primary transition-colors">Order #{row.id.toString().toUpperCase().slice(-8)}</p>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1 truncate max-w-xs">{row.deliveryAddress}</p>
                                     </td>
                                     <td className="px-6 py-4">
                                        <p className="font-bold text-gray-950">{formatPrice(row.total)}</p>
                                     </td>
                                     <td className="px-6 py-4">
                                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider shadow-sm", colorClass)}>{row.status}</span>
                                     </td>
                                     <td className="px-6 py-4 text-right">
                                        <Link to="/farmer/orders">
                                           <button className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover/row:text-primary group-hover/row:border-primary/20 shadow-sm ml-auto">
                                              <ArrowRight className="w-4 h-4" />
                                           </button>
                                        </Link>
                                     </td>
                                  </tr>
                                );
                              })
                            ) : (
                               <tr>
                                  <td colSpan="4" className="text-center py-10 text-gray-400 font-medium">No sales orders found yet. Make sure you list your products on the shop!</td>
                               </tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="grid sm:grid-cols-2 gap-6">
                 {[
                   { title: 'Manage Products', icon: Database, desc: 'View and update your product listings, pricing parameters, and stock quantities.', link: '/farmer/products' },
                   { title: 'Manage Orders', icon: FileText, desc: 'Track active sales, fulfill shipping, and confirm secure escrow release balances.', link: '/farmer/orders' },
                 ].map((card, i) => (
                   <Link key={i} to={card.link} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between h-full relative overflow-hidden active:scale-95">
                      <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-slate-900 transition-all shadow-inner">
                           <card.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-gray-950 text-lg group-hover:text-primary transition-colors">{card.title}</h4>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">{card.desc}</p>
                        </div>
                      </div>
                      <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-primary uppercase tracking-wider group-hover:translate-x-1.5 transition-transform">
                         Open Section 
                         <ChevronRight className="w-4 h-4" />
                      </div>
                   </Link>
                 ))}
              </div>
            </div>

            {/* Sidebar Insights & Sync */}
            <div className="space-y-6">
               {/* Farm Insights */}
               <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm border border-gray-800">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                     <Globe className="w-40 h-40 text-white" />
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center shadow-inner">
                           <TrendingUp className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Market Trends</h3>
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-lg font-bold tracking-tight leading-tight">Increase in Demand!</h3>
                        <p className="text-sm text-slate-300 leading-relaxed font-semibold italic">
                           "Fresh corn, grains, and tubers are seeing an 18.5% increase in buyer interest in Lagos regional hubs."
                        </p>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2 shadow-inner">
                        <div className="flex items-center gap-2">
                           <Info className="w-4 h-4 text-primary" />
                           <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Farmer Tip</p>
                        </div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">Consider listing your grains or updating your prices to take advantage of this high demand.</p>
                     </div>
                     <Link to="/farmer/products" className="block">
                        <button className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-primary uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                           Manage My Products
                           <ArrowRight className="w-4 h-4" />
                        </button>
                     </Link>
                  </div>
               </div>

               {/* Chat with Buyers */}
               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 relative overflow-hidden group">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-primary shadow-sm shrink-0">
                           <MessageCircle className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-gray-900">Direct Buyer Messages</h3>
                     </div>
                     <span className="text-[8px] font-bold px-2 py-0.5 bg-primary text-white rounded shadow-sm">Online</span>
                  </div>
                  <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer">
                         <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                            B
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate text-sm">AgroDirect Buyer</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none">Inquiry about products</p>
                         </div>
                      </div>
                  </div>
                  <Link to="/chat" className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-400 hover:text-primary transition-colors pt-2">
                     <span>Open Messages</span>
                     <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FarmerDashboardPage;
