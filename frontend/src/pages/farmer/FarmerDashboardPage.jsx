import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { walletAPI, ordersAPI, productsAPI, statsAPI, aiAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, Package, ShoppingCart, Wallet, MessageCircle, ArrowRight, ShieldCheck, 
  TrendingUp, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Globe, Info, 
  Database, Landmark, Building2, UserCheck, RefreshCw, FileText, Smartphone, 
  ChevronRight, Clock, Star, Users, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

// Mock chart data for rich analytics (representing real Nigerian market cycles)
const salesTrendData = [
  { month: 'Jan', sales: 120000, orders: 15 },
  { month: 'Feb', sales: 195000, orders: 22 },
  { month: 'Mar', sales: 310000, orders: 35 },
  { month: 'Apr', sales: 280000, orders: 28 },
  { month: 'May', sales: 420000, orders: 48 },
  { month: 'Jun', sales: 580000, orders: 60 },
];

const categoryDistribution = [
  { name: 'Grains', value: 45 },
  { name: 'Tubers', value: 30 },
  { name: 'Vegetables', value: 15 },
  { name: 'Fruits', value: 10 },
];

export const FarmerDashboardPage = () => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [chartData, setChartData] = useState(salesTrendData);
  const [stats, setStats] = useState({ 
    products: 0, 
    orders: 0, 
    balance: 0, 
    pending: 0, 
    recentOrders: [],
    productListings: [],
    isLoading: true
  });
  
  const [farmerInsights, setFarmerInsights] = useState(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [wallet, orders, products, dashboard] = await Promise.all([
          walletAPI.getBalance().catch(() => ({ available: 0, pending: 0 })),
          ordersAPI.getFarmerOrders().catch(() => []),
          productsAPI.getByFarmer(user.id).catch(() => []),
          statsAPI.getFarmerDashboard().catch(() => null),
        ]);
        
        setStats({
          products: products.length,
          orders: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
          balance: wallet?.available || 0,
          pending: wallet?.pending || 0,
          recentOrders: orders.slice(0, 5),
          productListings: products.slice(0, 4),
          isLoading: false
        });

        if (dashboard) {
          setDashboardStats(dashboard);
          if (dashboard.analyticsHistory && dashboard.analyticsHistory.length > 0) {
            const mappedHistory = dashboard.analyticsHistory.map(item => ({
              month: item.date,
              sales: item.sales,
              orders: item.orders
            }));
            setChartData(mappedHistory);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'farmer') {
      const loadInsights = async () => {
        setIsInsightsLoading(true);
        try {
          const res = await aiAPI.getFarmerInsights().catch(() => null);
          setFarmerInsights(res);
        } catch (err) {
          console.error("Failed to load farmer insights:", err);
        } finally {
          setIsInsightsLoading(false);
        }
      };
      loadInsights();
    }
  }, [user]);

  const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price || 0);

  // Fallback for role protection if rendered directly
  if (user && user.role !== 'farmer') {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-white">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-500 max-w-md mb-6">This section of the platform is strictly reserved for verified agricultural sellers and farmers.</p>
          <Link to="/marketplace">
            <button className="h-11 px-6 rounded-xl bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary/95 transition-all">
              Return to Marketplace
            </button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-slate-50/50 min-h-screen pb-20">
        
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-10 shadow-sm">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-md shrink-0 border border-slate-800">
                   {user?.name?.charAt(0) || 'F'}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                     <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Farmer Sales Suite</h1>
                     <VerificationBadge status={user?.is_verified ? 'verified' : 'unverified'} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-400">
                     <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span>Live Sync Active</span>
                     </div>
                     <span className="text-slate-300">|</span>
                     <div className="flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-gray-400" />
                        <span>Producer ID: {user?.id?.toString().toUpperCase().slice(-8)}</span>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link to="/farmer/products/new">
                  <button className="h-10 px-4 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm active:scale-95 group">
                    <Plus className="w-4 h-4 text-primary group-hover:rotate-90 transition-transform duration-300" />
                    List New Product
                  </button>
                </Link>
                <Link to="/farmer/products">
                  <button className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 shadow-sm active:scale-95 flex items-center gap-1.5">
                    Manage Inventory
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Landmark, label: 'Available Balance', value: formatPrice(stats.balance), sub: 'Ready for payout', trend: '+14% this week', trendUp: true, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
              { icon: Clock, label: 'Escrow Balance', value: formatPrice(stats.pending), sub: 'Awaiting buyer confirmation', trend: 'Secure held', trendUp: null, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100' },
              { icon: FileText, label: 'Active Orders', value: stats.orders, sub: 'Fulfillment pending', trend: '+3 new', trendUp: true, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
              { icon: Database, label: 'Total Products', value: stats.products, sub: 'Active store listings', trend: 'Max stock', trendUp: null, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between">
                 <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <stat.icon className="w-16 h-16 text-slate-900" />
                 </div>
                 <div className="flex items-center justify-between mb-4">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner", stat.bg, stat.color, stat.border)}>
                       <stat.icon className="w-4.5 h-4.5" />
                    </div>
                    {stat.trendUp !== null && (
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase",
                        stat.trendUp ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-gray-50 border-gray-100 text-gray-400"
                      )}>
                        {stat.trend}
                      </span>
                    )}
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-extrabold text-gray-900 tracking-tight group-hover:text-primary transition-colors">{stat.value}</p>
                    <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100/80">
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{stat.sub}</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          {/* Analytics Area Chart Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sales Trends Chart Card */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                     <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-extrabold text-gray-900 leading-tight">Sales Analytics & Growth</h3>
                     <p className="text-xs text-gray-400 font-semibold">Real-time revenue performance charts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-gray-100 p-1 rounded-xl text-xs font-bold text-slate-500">
                  <span className="px-3 py-1 bg-white rounded-lg shadow-sm text-slate-800 cursor-pointer">Monthly</span>
                  <span className="px-3 py-1 cursor-not-allowed">Weekly</span>
                </div>
              </div>

              {/* Responsive Area Chart */}
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00A651" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#00A651" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v/1000}k`} />
                    <Tooltip 
                      formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ background: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#00A651" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 bg-gray-50/30 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                  <p className="text-base font-extrabold text-gray-900 mt-0.5">{dashboardStats?.totalRevenue || '₦0'}</p>
                  <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +24% YoY
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Average Order</p>
                  <p className="text-base font-extrabold text-gray-900 mt-0.5">
                    {stats.recentOrders.length > 0
                      ? formatPrice(stats.recentOrders.reduce((sum, o) => sum + o.total, 0) / stats.recentOrders.length)
                      : '₦0'}
                  </p>
                  <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +12% MoM
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Settlement</p>
                  <p className="text-base font-extrabold text-gray-900 mt-0.5">{dashboardStats?.pendingPayouts || '₦0'}</p>
                  <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Fully Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Sidebar */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                     <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-extrabold text-gray-900 leading-tight">Sales Distribution</h3>
                     <p className="text-xs text-gray-400 font-semibold">Store category optimization</p>
                  </div>
                </div>

                <div className="space-y-4 py-2">
                  {categoryDistribution.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                        <span className="flex items-center gap-1.5">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-blue-500" : idx === 2 ? "bg-amber-500" : "bg-purple-500"
                          )} />
                          {item.name}
                        </span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-blue-500" : idx === 2 ? "bg-amber-500" : "bg-purple-500"
                          )}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Listing Yield Coach */}
              <div className="bg-white p-5 rounded-2xl border border-primary/20 shadow-sm space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">AI Listing Yield Coach</h4>
                      <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider leading-none mt-0.5">Real-time Demand Analytics</p>
                    </div>
                  </div>
                </div>

                {isInsightsLoading ? (
                  <div className="flex items-center justify-center py-4 gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary animate-spin" />
                    Analyzing Sales Catalog...
                  </div>
                ) : farmerInsights ? (
                  <div className="space-y-3 text-[11px] font-semibold text-slate-600">
                    <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                      <p className="text-emerald-800 leading-relaxed">
                        📈 <strong>Demand Alert:</strong> {farmerInsights.demand_alert || "High demand spotted from Oyo B2B trade buyers for Cassava bulk loads this week."}
                      </p>
                    </div>

                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-slate-700 leading-relaxed">
                        💡 <strong>Pricing Strategy:</strong> {farmerInsights.pricing_strategy || "Increase Oyo target sales by 5% to capture premium corporate margins."}
                      </p>
                    </div>

                    {farmerInsights.actionable_tips && farmerInsights.actionable_tips.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Yield Booster Tips</p>
                        <ul className="space-y-1 pl-1 list-disc list-inside text-slate-500">
                          {farmerInsights.actionable_tips.map((tip, idx) => (
                            <li key={idx} className="leading-snug">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center text-xs text-slate-400 font-semibold">
                    Yield coaching active. List products to trigger local pricing tips.
                  </div>
                )}
              </div>

              {/* Direct message block */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 relative overflow-hidden border border-slate-800">
                <div className="space-y-1">
                   <span className="text-[9px] font-bold px-2 py-0.5 bg-primary text-white rounded-md tracking-wider uppercase">Verified Agro-Farmer</span>
                   <h4 className="text-base font-extrabold tracking-tight pt-1">Your farm trust score is active!</h4>
                   <p className="text-xs text-slate-400 font-medium leading-relaxed">Buyers are 4x more likely to trade with producers holding high ratings.</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-primary group cursor-pointer">
                  <span>View trust guidelines</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table & Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Active Sales Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                       <ShoppingCart className="w-4.5 h-4.5" />
                    </div>
                    <div>
                       <h3 className="font-extrabold text-gray-900 leading-tight">Incoming Buyer Orders</h3>
                       <p className="text-xs text-gray-400 font-semibold">Incoming requests and delivery releases</p>
                    </div>
                 </div>
                 <Link to="/farmer/orders" className="h-9 px-4.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 hover:bg-gray-50 shadow-sm shrink-0">
                    Fulfill Orders
                    <ChevronRight className="w-4 h-4 text-primary" />
                 </Link>
              </div>

              <div className="flex-1 overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50/40 border-b border-gray-100">
                       <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <th className="px-6 py-4">Buyer Manifest</th>
                          <th className="px-6 py-4">Total Amount</th>
                          <th className="px-6 py-4">Settlement Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                       {stats.recentOrders.length > 0 ? (
                         stats.recentOrders.map((row) => {
                           const isDelivered = row.status === 'delivered';
                           const isCancelled = row.status === 'cancelled';
                           const colorClass = isDelivered 
                             ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                             : isCancelled 
                               ? 'bg-red-50 border-red-100 text-red-700' 
                               : 'bg-amber-50 border-amber-100 text-amber-700';

                           return (
                             <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group/row">
                                <td className="px-6 py-4.5">
                                   <p className="font-bold text-gray-900 group-hover/row:text-primary transition-colors">Order #{row.id.toString().toUpperCase().slice(-8)}</p>
                                   <p className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate max-w-xs">{row.delivery_address || 'Lagos Delivery Node'}</p>
                                </td>
                                <td className="px-6 py-4.5">
                                   <p className="font-bold text-gray-900">{formatPrice(row.total)}</p>
                                </td>
                                <td className="px-6 py-4.5">
                                   <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider shadow-sm", colorClass)}>{row.status}</span>
                                </td>
                                <td className="px-6 py-4.5 text-right">
                                   <Link to="/farmer/orders">
                                      <button className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover/row:text-primary group-hover/row:border-primary/20 shadow-sm ml-auto active:scale-90">
                                         <ArrowRight className="w-3.5 h-3.5" />
                                      </button>
                                   </Link>
                                </td>
                             </tr>
                           );
                         })
                       ) : (
                          <tr>
                             <td colSpan="4" className="text-center py-16 text-gray-400 font-medium">No sales orders identified yet. Ready to trade as soon as buyers add your items!</td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
            </div>

            {/* Listed Products Sidebar */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                       <Package className="w-4.5 h-4.5" />
                    </div>
                    <div>
                       <h3 className="font-extrabold text-gray-900 leading-tight">Active Listings</h3>
                       <p className="text-xs text-gray-400 font-semibold">Your current store catalog</p>
                    </div>
                  </div>
                  <Link to="/farmer/products" className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">
                    All Catalog
                  </Link>
                </div>

                <div className="space-y-3">
                  {stats.productListings.length > 0 ? (
                    stats.productListings.map((prod) => (
                      <div key={prod.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-gray-100 transition-all group/item">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img 
                            src={prod.images?.[0] || '/placeholder.svg'} 
                            alt={prod.name} 
                            className="w-10 h-10 object-cover rounded-xl border border-gray-100 shrink-0" 
                          />
                          <div className="space-y-0.5 overflow-hidden">
                            <p className="font-bold text-xs text-gray-900 truncate group-hover/item:text-primary transition-colors">{prod.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">{prod.available} {prod.unit} available</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-xs text-gray-900">{formatPrice(prod.price)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center space-y-4 text-gray-400 font-medium text-xs">
                       <Database className="w-8 h-8 mx-auto text-slate-200" />
                       <p>You have no active store products. Create a listing to start selling!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Panel */}
              <div className="bg-slate-50 border border-gray-150 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-2.5">
                   <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span className="font-bold text-xs text-gray-800">Quick Messages</span>
                   </div>
                   <Link to="/chat" className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-0.5">
                      Open Inbox <ArrowRight className="w-3 h-3" />
                   </Link>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">Communicate with buyers directly, negotiate transactions, or synchronize delivery specs safely through AgroDirect Chat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FarmerDashboardPage;
