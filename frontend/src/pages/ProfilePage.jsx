import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/services/api';
import {
  User, ShieldCheck, TrendingUp, Package, ShoppingBag,
  Star, AlertTriangle, Zap, CheckCircle2, X, Sun, Moon,
  BarChart3, Wallet, Clock, Award, ChevronRight, RefreshCw,
  Users, BadgeCheck, Sparkles, Activity, Mail, Phone, Settings, LogOut, Landmark, Info, Globe, Calendar, Database, FileText, ShoppingCart, MessageSquare, ArrowRight, FileCheck, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;

const severityColors = {
  success: 'border-emerald-100 bg-emerald-50/50 text-emerald-700',
  warning: 'border-amber-100 bg-amber-50/50 text-amber-700',
  error:   'border-red-100 bg-red-50/50 text-red-700',
  info:    'border-blue-100 bg-blue-50/50 text-blue-700',
};

const IconMap = { TrendingUp, AlertTriangle, Package, ShoppingBag, Zap, BadgeCheck };

const AIInsightCard = ({ insight }) => {
  const Icon = IconMap[insight.icon] || Zap;
  const color = severityColors[insight.severity] || severityColors.info;
  return (
    <div className={cn("flex gap-4 p-4 rounded-xl border transition-all hover:shadow-sm hover:bg-white cursor-default group relative overflow-hidden", color)}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-white shadow-sm border border-inherit relative z-10">
        <Icon className="w-5 h-5 animate-pulse" />
      </div>
      <div className="space-y-1 relative z-10">
        <p className="font-bold text-gray-900 text-sm">{insight.title}</p>
        <p className="text-xs text-gray-500 leading-relaxed font-semibold">{insight.detail}</p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, icon: Icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
       <Icon className="w-24 h-24 text-slate-900" />
    </div>
    <div className="relative z-10 space-y-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-primary transition-colors">{value}</p>
      </div>
    </div>
    {sub && (
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 relative z-10">
         <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{sub}</p>
      </div>
    )}
  </div>
);

const TrustScoreRing = ({ score }) => {
  const stroke = 251.2;
  const offset = stroke - (score / 100) * stroke;
  return (
    <div className="relative w-36 h-36 group">
      <svg className="w-full h-full -rotate-90 transition-transform duration-700" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="5" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke="#00A651" strokeWidth="6"
          strokeDasharray={stroke} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <div className="text-center px-4 mt-0.5">
           <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Trust Score</p>
           <p className="text-[8px] font-semibold uppercase tracking-wider text-primary">Excellent</p>
        </div>
      </div>
    </div>
  );
};

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Settings Panel State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'verification', 'role'
  const [settingsName, setSettingsName] = useState('');
  const [settingsPhone, setSettingsPhone] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [idType, setIdType] = useState('NIN');
  const [idNumber, setIdNumber] = useState('');
  const [idImageUrl, setIdImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchProfile = async () => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const data = await apiRequest(`/profile?userId=${userId}`);
      setProfile(data);
      if (data?.user) {
        setSettingsName(data.user.name || '');
        setSettingsPhone(data.user.phone || '');
      }
    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg({ text: '', type: '' });
    try {
      const updated = await apiRequest('/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: settingsName, phone: settingsPhone })
      });
      setProfile(prev => prev ? { ...prev, user: { ...prev.user, name: settingsName, phone: settingsPhone } } : prev);
      setMsg({ text: 'Profile details saved successfully!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.message || 'Failed to update profile details', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!idNumber) return setMsg({ text: 'Please enter a valid ID number', type: 'error' });
    setIsSubmitting(true);
    setMsg({ text: '', type: '' });
    try {
      const data = await apiRequest('/profile/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idType, idNumber, idImageUrl })
      });
      setProfile(prev => prev ? { 
        ...prev, 
        user: { 
          ...prev.user, 
          verification_status: 'pending', 
          is_verified: false 
        } 
      } : prev);
      setMsg({ text: 'ID submitted! Verification is now pending manual administrative review.', type: 'success' });
      setIdNumber('');
    } catch (err) {
      setMsg({ text: err.message || 'Failed to submit verification request', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpgrade = async () => {
    setIsSubmitting(true);
    setMsg({ text: '', type: '' });
    try {
      await apiRequest('/profile/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      setMsg({ text: 'Congratulations! Your account has been upgraded to Seller/Farmer role.', type: 'success' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setMsg({ text: err.message || 'Failed to upgrade role', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return (
    <MainLayout hideFooter>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
             <Landmark className="w-8 h-8 text-gray-300" />
          </div>
          <div className="space-y-2">
             <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Login Required</h2>
             <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">Please log in to your account to view your profile dashboard and manage your orders.</p>
          </div>
          <Link to="/login" className="block">
            <button className="h-12 w-full px-6 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 mx-auto">
              Log In
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );

  const displayUser = profile?.user || user;
  const isFarmer = displayUser.role === 'farmer';
  const hasPendingVerification = displayUser.verification_status === 'pending';
  const isFullyVerified = displayUser.verification_status === 'verified';

  return (
    <MainLayout hideFooter>
      <div className="min-h-screen bg-gray-50 pb-20">
        
        {/* User Profile Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                 {/* Identity Initials */}
                 <div className="relative group shrink-0">
                   <div className="w-24 h-24 rounded-2xl bg-slate-900 flex items-center justify-center text-4xl font-bold text-white shadow-sm border border-slate-800 relative overflow-hidden">
                      {displayUser.name?.[0]?.toUpperCase()}
                   </div>
                   {isFullyVerified && (
                     <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
                       <BadgeCheck className="w-5 h-5 text-primary" />
                     </div>
                   )}
                 </div>

                 {/* Identity Manifest */}
                 <div className="space-y-3">
                   <div className="flex flex-wrap items-center gap-3">
                     <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{displayUser.name}</h1>
                     
                     <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm flex items-center gap-1", 
                       isFullyVerified 
                         ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                         : hasPendingVerification 
                           ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' 
                           : 'bg-red-50 text-red-700 border-red-200'
                     )}>
                       {isFullyVerified ? (
                         <>
                           <ShieldCheck className="w-3.5 h-3.5" />
                           {isFarmer ? 'Verified Farmer' : 'Verified Buyer'}
                         </>
                       ) : hasPendingVerification ? (
                         <>
                           <Clock className="w-3.5 h-3.5" />
                           Verification Pending
                         </>
                       ) : (
                         <>
                           <AlertTriangle className="w-3.5 h-3.5" />
                           Unverified Account
                         </>
                       )}
                     </div>
                   </div>
                   
                   <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-semibold">
                     <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>{displayUser.email}</span>
                     </div>
                     {displayUser.phone && (
                        <div className="flex items-center gap-2">
                           <Phone className="w-4 h-4 text-primary" />
                           <span>{displayUser.phone}</span>
                        </div>
                     )}
                     <div className="flex items-center gap-2 text-gray-400 font-medium">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {new Date(displayUser.created_at || Date.now()).getFullYear()}</span>
                      </div>
                   </div>
                 </div>
              </div>

              {/* Actions & Settings */}
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                 <button onClick={() => setIsSettingsOpen(true)} className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 shadow-sm flex items-center gap-1.5 active:scale-95">
                    <Settings className="w-4 h-4 text-primary" />
                    Account Settings
                 </button>
                 <button onClick={logout} className="h-10 px-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-1.5 active:scale-95">
                    <LogOut className="w-4 h-4" />
                    Log Out
                 </button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="space-y-12">
            
            {/* Trust Indicator & Overview Section */}
            <div className="grid lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Performance Summary</h2>
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl h-36 animate-pulse border border-gray-200 shadow-sm" />
                      ))}
                    </div>
                  ) : profile ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {isFarmer ? (
                        <>
                          <StatCard label="Total Earnings" value={formatNaira(profile.stats?.totalRevenue)} sub="Gross revenue made" icon={TrendingUp} />
                          <StatCard label="Escrow Payments" value={formatNaira(profile.stats?.pendingRevenue)} sub="Funds held in escrow" icon={Clock} />
                          <StatCard label="Active Products" value={profile.stats?.productCount ?? 0} sub="Items listed on marketplace" icon={Database} />
                          <StatCard label="Delivery Rate" value={`${profile.stats?.deliveryRate ?? 98}%`} sub="Logistics success indicator" icon={ShieldCheck} />
                        </>
                      ) : (
                        <>
                          <StatCard label="Total Spent" value={formatNaira(profile.stats?.totalSpend)} sub="Total spent on secure orders" icon={Wallet} />
                          <StatCard label="Total Orders" value={profile.stats?.totalOrders ?? 0} sub="Orders placed by you" icon={FileText} />
                          <StatCard label="Farmers Supported" value={profile.stats?.uniqueFarmers ?? 0} sub="Farmers you bought from" icon={Users} />
                          <StatCard label="Buyer Level" value="Professional Buyer" sub="Verified direct account status" icon={Landmark} />
                        </>
                      )}
                    </div>
                  ) : null}
               </div>
               
               {profile?.aiInsights && (
                 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
                   <TrustScoreRing score={profile.aiInsights.profileScore || 96} />
                   <div className="text-center space-y-1">
                      <p className="text-sm font-bold text-gray-900">Credibility score</p>
                      <p className="text-xs text-gray-400 font-semibold">Calculated from order completion and delivery rates</p>
                   </div>
                 </div>
               )}
            </div>

            {/* AI Insights & Recent Transactions Section */}
            {profile && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Farm & Smart AI Insights Panel */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 leading-tight">AI Smart Insights</h2>
                      <p className="text-xs text-gray-400 font-semibold">Direct advice to optimize your performance</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {profile.aiInsights?.insights?.length > 0 ? (
                      <div className="space-y-3">
                        {profile.aiInsights.insights.map((insight, i) => (
                          <AIInsightCard key={i} insight={insight} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 space-y-4">
                        <Activity className="w-8 h-8 mx-auto text-gray-300 animate-pulse" />
                        <div className="space-y-1">
                           <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Syncing Insights...</p>
                           <p className="text-[11px] text-gray-400 font-semibold">Analyzing your recent marketplace activity.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity Log Panel */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 leading-tight">
                        {isFarmer ? 'Recent Sales' : 'My Orders'}
                      </h2>
                      <p className="text-xs text-gray-400 font-semibold">Track your latest transactions</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {(isFarmer ? profile.topProducts : profile.recentOrders)?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/50 hover:bg-white hover:border-gray-200 border border-transparent transition-all group/row cursor-pointer relative overflow-hidden">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm shrink-0">
                               {isFarmer ? <Package className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                            </div>
                            <div className="space-y-1 min-w-0">
                               <p className="font-bold text-gray-950 truncate text-sm">
                                  {isFarmer ? item.name : `Order #${item.id.slice(-8).toUpperCase()}`}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                   {isFarmer ? `Category: ${item.category || 'Fresh Produce'}` : `Seller: ${item.farmerName}`}
                                </p>
                            </div>
                         </div>
                         <div className="text-right space-y-1 shrink-0">
                            <p className="font-bold text-gray-950 text-sm">{formatNaira(isFarmer ? item.revenue : item.total_amount)}</p>
                            <span className={cn("inline-flex px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border", 
                              (isFarmer || item.status === 'delivered') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                            )}>
                               {isFarmer ? `${item.order_count} Sales` : item.status}
                            </span>
                         </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-center">
                     <Link to={isFarmer ? '/farmer/orders' : '/orders'} className="block">
                        <button className="h-10 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-sm flex items-center gap-1.5">
                           <span>View Full Order History</span>
                           <ChevronRight className="w-4 h-4" />
                        </button>
                     </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Access Matrix Panel */}
            <div className="space-y-6">
               <h2 className="text-xl font-bold text-gray-900 tracking-tight">Quick Actions</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                 {(isFarmer ? [
                   { label: 'My Products', to: '/farmer/products', icon: Database, sub: 'List & manage items' },
                   { label: 'My Sales', to: '/farmer/orders', icon: FileText, sub: 'Fulfill active orders' },
                   { label: 'My Wallet', to: '/farmer/wallet', icon: Wallet, sub: 'Check escrow balance' },
                   { label: 'Go to Shop', to: '/marketplace', icon: ShoppingBag, sub: 'Browse products' },
                 ] : [
                   { label: 'Browse Shop', to: '/marketplace', icon: ShoppingBag, sub: 'Buy premium produce' },
                   { label: 'My Purchases', to: '/orders', icon: FileText, sub: 'Track secure orders' },
                   { label: 'My Chats', to: '/chat', icon: MessageSquare, sub: 'Message farm sellers' },
                   { label: 'My Cart', to: '/cart', icon: ShoppingCart, sub: 'View items added' },
                 ]).map((link, i) => (
                   <Link key={i} to={link.to} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between aspect-square active:scale-95">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-slate-900 transition-all shadow-inner group-hover:rotate-6">
                         <link.icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                         <h4 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">{link.label}</h4>
                         <p className="text-xs text-gray-400 font-semibold">{link.sub}</p>
                         <div className="pt-4 flex items-center justify-between text-[10px] font-bold text-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            Go to Page
                            <ChevronRight className="w-4 h-4" />
                         </div>
                      </div>
                   </Link>
                 ))}
               </div>
            </div>

            {profile === null && !isLoading && (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center mx-auto shadow-sm">
                   <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-1 px-4">
                   <h3 className="text-lg font-bold text-gray-900">Failed to Sync Profile Data</h3>
                   <p className="text-xs text-gray-500 leading-relaxed">We had a brief connection issue while loading your profile stats. Please refresh below.</p>
                </div>
                <button onClick={fetchProfile} className="h-10 px-4 rounded-xl bg-primary text-white font-semibold text-xs shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 mx-auto">
                   <RefreshCw className="w-4 h-4" />
                   Retry Loading Profile
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Account Settings Overlay Modal (Premium Custom Glassmorphism UI with Dark Mode Toggle) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={cn(
            "w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 relative",
            isDarkMode 
              ? "bg-slate-950 text-gray-100 border-slate-800" 
              : "bg-white text-gray-800 border-gray-100"
          )}>
            
            {/* Modal Header */}
            <div className={cn(
              "p-6 flex items-center justify-between border-b",
              isDarkMode ? "border-slate-800" : "border-gray-100"
            )}>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary animate-spin" />
                <h3 className="font-bold text-lg tracking-tight">Account Configurations</h3>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)} 
                  className={cn(
                    "p-2 rounded-xl border transition-all active:scale-90",
                    isDarkMode 
                      ? "bg-slate-900 text-yellow-400 border-slate-800 hover:bg-slate-800" 
                      : "bg-gray-50 text-slate-700 border-gray-200 hover:bg-gray-100"
                  )}
                  title="Toggle Settings Dark Theme"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => { setIsSettingsOpen(false); setMsg({ text: '', type: '' }); }}
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    isDarkMode ? "hover:bg-slate-900 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-4 min-h-[400px]">
              
              {/* Sidebar Tabs */}
              <div className={cn(
                "col-span-1 p-4 border-r flex flex-col gap-1.5",
                isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-gray-50/50 border-gray-100"
              )}>
                <button 
                  onClick={() => { setActiveTab('profile'); setMsg({ text: '', type: '' }); }}
                  className={cn(
                    "w-full flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-bold transition-all",
                    activeTab === 'profile' 
                      ? "bg-primary text-white shadow-sm" 
                      : isDarkMode 
                        ? "text-gray-400 hover:bg-slate-900" 
                        : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                
                <button 
                  onClick={() => { setActiveTab('verification'); setMsg({ text: '', type: '' }); }}
                  className={cn(
                    "w-full flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-bold transition-all",
                    activeTab === 'verification' 
                      ? "bg-primary text-white shadow-sm" 
                      : isDarkMode 
                        ? "text-gray-400 hover:bg-slate-900" 
                        : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verification
                </button>

                {!isFarmer && (
                  <button 
                    onClick={() => { setActiveTab('role'); setMsg({ text: '', type: '' }); }}
                    className={cn(
                      "w-full flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-bold transition-all",
                      activeTab === 'role' 
                        ? "bg-primary text-white shadow-sm" 
                        : isDarkMode 
                          ? "text-gray-400 hover:bg-slate-900" 
                          : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Sparkles className="w-4 h-4" />
                    Become Seller
                  </button>
                )}
              </div>

              {/* Main Tab Panel */}
              <div className="col-span-3 p-6 overflow-y-auto max-h-[450px] space-y-6">
                
                {msg.text && (
                  <div className={cn(
                    "p-3 rounded-xl border text-xs font-bold flex items-center gap-2 animate-bounce",
                    msg.type === 'success' 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                      : "bg-red-50 border-red-200 text-red-700"
                  )}>
                    {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>{msg.text}</span>
                  </div>
                )}

                {/* TAB 1: PROFILE EDIT */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">Personal Profile Parameters</h4>
                      <p className="text-[10px] text-gray-400">Update your primary identity settings synced with the transactional nodes.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Full Legal Name</label>
                        <input 
                          type="text" 
                          value={settingsName} 
                          onChange={(e) => setSettingsName(e.target.value)}
                          className={cn(
                            "w-full h-11 px-3 rounded-xl border text-sm font-semibold outline-none focus:border-primary transition-all",
                            isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-gray-200 text-gray-900"
                          )}
                          required 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Linked Phone Number</label>
                        <input 
                          type="tel" 
                          value={settingsPhone} 
                          onChange={(e) => setSettingsPhone(e.target.value)}
                          className={cn(
                            "w-full h-11 px-3 rounded-xl border text-sm font-semibold outline-none focus:border-primary transition-all",
                            isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-gray-200 text-gray-900"
                          )}
                          required 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address (Immutable)</label>
                        <input 
                          type="email" 
                          value={displayUser.email} 
                          disabled
                          className={cn(
                            "w-full h-11 px-3 rounded-xl border text-sm font-semibold outline-none opacity-50 cursor-not-allowed",
                            isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-gray-100 border-gray-200 text-gray-500"
                          )}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="h-11 w-full bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/95 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Save Profile Parameters
                    </button>
                  </form>
                )}

                {/* TAB 2: VERIFICATION PROCESS */}
                {activeTab === 'verification' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">KYC Trust Registry</h4>
                      <p className="text-[10px] text-gray-400">Provide official identity artifacts to unlock verified badge trust indices.</p>
                    </div>

                    {isFullyVerified ? (
                      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-emerald-800 text-sm">Identity Fully Verified</h5>
                          <p className="text-[10px] text-emerald-600 max-w-xs font-semibold">Your account has satisfied the highest compliance standards. Trust credentials active.</p>
                        </div>
                      </div>
                    ) : hasPendingVerification ? (
                      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-sm animate-pulse">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-amber-800 text-sm">KYC Compliance Review Pending</h5>
                          <p className="text-[10px] text-amber-600 max-w-xs font-semibold">Our compliance team is auditing your ID document. Approvals usually resolve within 1–2 hours.</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleVerify} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Select Document Type</label>
                            <select 
                              value={idType} 
                              onChange={(e) => setIdType(e.target.value)}
                              className={cn(
                                "w-full h-11 px-3 rounded-xl border text-sm font-semibold outline-none focus:border-primary transition-all",
                                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-gray-200 text-gray-900"
                              )}
                            >
                              <option value="NIN">National ID (NIN)</option>
                              <option value="International Passport">International Passport</option>
                              <option value="Drivers License">Driver's License</option>
                              <option value="Voters Card">Voter's Card</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Document Number / ID</label>
                            <input 
                              type="text" 
                              value={idNumber} 
                              onChange={(e) => setIdNumber(e.target.value)}
                              placeholder="e.g. 12345678901"
                              className={cn(
                                "w-full h-11 px-3 rounded-xl border text-sm font-semibold outline-none focus:border-primary transition-all",
                                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-gray-200 text-gray-900"
                              )}
                              required 
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">ID Image / Document URL (Optional)</label>
                          <input 
                            type="url" 
                            value={idImageUrl} 
                            onChange={(e) => setIdImageUrl(e.target.value)}
                            placeholder="https://example.com/id-image.jpg"
                            className={cn(
                              "w-full h-11 px-3 rounded-xl border text-sm font-semibold outline-none focus:border-primary transition-all",
                              isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-gray-200 text-gray-900"
                            )}
                          />
                        </div>

                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="h-11 w-full bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/95 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                        >
                          {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                          Submit ID for Audit Review
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* TAB 3: UPGRADE TO SELLER */}
                {activeTab === 'role' && !isFarmer && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">Grow Your Agri-Business</h4>
                      <p className="text-[10px] text-gray-400">Become an active Agro-Connect Seller to list products, receive secure payments, and trade enterprise stock.</p>
                    </div>

                    <div className={cn(
                      "p-6 rounded-2xl border text-center space-y-4",
                      isDarkMode ? "bg-slate-900 border-slate-800" : "bg-gray-50 border-gray-100"
                    )}>
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="space-y-1 max-w-sm mx-auto">
                        <h5 className="font-bold text-sm">Become a Merchant/Farmer</h5>
                        <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">Instantly unlock the farmer inventory suite, ledger invoicing, Paystack escrow systems, and AI smart advisors.</p>
                      </div>

                      <button 
                        onClick={handleUpgrade}
                        disabled={isSubmitting}
                        className="h-11 px-6 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/95 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5 mx-auto"
                      >
                        {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                        Become an Active Seller
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

    </MainLayout>
  );
};

export default ProfilePage;
