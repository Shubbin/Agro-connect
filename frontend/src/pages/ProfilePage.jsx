import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/services/api';
import {
  User, Leaf, ShieldCheck, TrendingUp, Package, ShoppingBag,
  Star, AlertTriangle, Zap, Layers, PackageX, CheckCircle2,
  BarChart3, Wallet, Clock, Award, ChevronRight, RefreshCw,
  ArrowUpRight, Users, BadgeCheck
} from 'lucide-react';

const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;

const severityColors = {
  success: 'border-primary/20 bg-primary/5 text-primary',
  warning: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-600',
  error:   'border-red-500/20 bg-red-500/5 text-red-500',
  info:    'border-blue-500/20 bg-blue-500/5 text-blue-600',
};

const IconMap = { TrendingUp, AlertTriangle, PackageX, Layers, ShoppingBag, Zap, BadgeCheck };

const AIInsightCard = ({ insight }) => {
  const Icon = IconMap[insight.icon] || Zap;
  const color = severityColors[insight.severity] || severityColors.info;
  return (
    <div className={`flex gap-4 p-4 rounded-2xl border ${color} animate-fade-in`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-black text-sm text-foreground">{insight.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{insight.detail}</p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, icon: Icon, color = 'primary' }) => (
  <div className="glass-premium p-6 rounded-2xl space-y-3 hover:scale-[1.02] transition-transform">
    <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center`}>
      <Icon className={`w-6 h-6 text-${color}`} />
    </div>
    <div>
      <p className="text-2xl font-black text-foreground tracking-tight">{value}</p>
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  </div>
);

const ProfileScoreRing = ({ score }) => {
  const stroke = 251.2; // 2πr where r=40
  const offset = stroke - (score / 100) * stroke;
  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke="currentColor" strokeWidth="8"
          strokeDasharray={stroke} strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-foreground">{score}</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Score</span>
      </div>
    </div>
  );
};

export const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await apiRequest(`/profile?userId=${user.id}`);
      setProfile(data);
    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [user]);

  if (!user) return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <User className="w-16 h-16 text-muted-foreground mx-auto" />
          <p className="font-black text-xl">Please log in to view your profile</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm">
            Login <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </MainLayout>
  );

  const isFarmer = user.role === 'farmer';

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">

          {/* ── Identity Card ─────────────────────────────── */}
          <div className="glass-premium rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 items-start md:items-center border border-border/30">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center text-4xl font-black text-primary border-2 border-primary/20">
                {user.name?.[0]?.toUpperCase()}
              </div>
              {user.is_verified == 1 && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-foreground tracking-tight">{user.name}</h1>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  isFarmer ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {isFarmer ? '🌾 Farmer' : '🛒 Buyer'}
                </span>
                {user.is_verified == 1 && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {user.email}</span>
                {user.phone && <span>📞 {user.phone}</span>}
                {user.created_at && <span>📅 Joined {new Date(user.created_at).getFullYear()}</span>}
              </div>
            </div>

            {/* Profile Score */}
            {profile?.aiInsights && (
              <div className="flex flex-col items-center gap-2">
                <ProfileScoreRing score={profile.aiInsights.profileScore} />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Profile Score</p>
              </div>
            )}

            <button onClick={fetchProfile} className="md:self-start w-10 h-10 glass-premium rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-premium rounded-2xl p-6 h-32 animate-pulse bg-secondary/30" />
              ))}
            </div>
          ) : profile ? (
            <>
              {/* ── Stats Grid ─────────────────────────────── */}
              {isFarmer ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Earnings" value={formatNaira(profile.stats?.totalRevenue)} icon={TrendingUp} />
                  <StatCard label="Escrow Pending" value={formatNaira(profile.stats?.pendingRevenue)} icon={Clock} color="yellow-500" />
                  <StatCard label="Inventory Value" value={formatNaira(profile.inventoryValue)} icon={Package} />
                  <StatCard label="Active Products" value={profile.stats?.productCount ?? 0} icon={Layers} />
                  <StatCard label="Total Orders" value={profile.stats?.totalOrders ?? 0} icon={ShoppingBag} />
                  <StatCard label="Delivered" value={profile.stats?.deliveredOrders ?? 0} icon={CheckCircle2} color="emerald-500" />
                  <StatCard label="Delivery Rate" value={`${profile.stats?.deliveryRate ?? 0}%`} icon={BarChart3} />
                  <StatCard label="Repeat Buyers" value="—" icon={Users} color="blue-500" sub="Coming soon" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatCard label="Total Spend" value={formatNaira(profile.stats?.totalSpend)} icon={Wallet} />
                  <StatCard label="Total Orders" value={profile.stats?.totalOrders ?? 0} icon={ShoppingBag} />
                  <StatCard label="Farmers Worked With" value={profile.stats?.uniqueFarmers ?? 0} icon={Users} color="emerald-500" />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* ── AI Insights ───────────────────────────── */}
                <div className="glass-premium rounded-[2rem] p-6 space-y-4 border border-border/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-black text-foreground">AI Insights</h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Powered by AgroAI</p>
                    </div>
                  </div>
                  {profile.aiInsights?.insights?.length > 0 ? (
                    <div className="space-y-3">
                      {profile.aiInsights.insights.map((insight, i) => (
                        <AIInsightCard key={i} insight={insight} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Star className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-medium">No insights yet — start trading!</p>
                    </div>
                  )}
                </div>

                {/* ── Top Products / Recent Orders ──────────── */}
                {isFarmer ? (
                  <div className="glass-premium rounded-[2rem] p-6 space-y-4 border border-border/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-black text-foreground">Top Products</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">By revenue</p>
                      </div>
                    </div>
                    {profile.topProducts?.length > 0 ? (
                      <div className="space-y-3">
                        {profile.topProducts.map((p, i) => (
                          <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/40 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-sm text-foreground truncate">{p.name}</p>
                              <p className="text-[10px] text-muted-foreground capitalize">{p.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-primary">{formatNaira(p.revenue)}</p>
                              <p className="text-[10px] text-muted-foreground">{p.order_count} orders</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No completed orders yet</p>
                        <Link to="/farmer/products" className="text-primary text-xs font-black hover:underline mt-2 inline-flex items-center gap-1">
                          Manage Products <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="glass-premium rounded-[2rem] p-6 space-y-4 border border-border/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-black text-foreground">Recent Orders</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your history</p>
                      </div>
                    </div>
                    {profile.recentOrders?.length > 0 ? (
                      <div className="space-y-3">
                        {profile.recentOrders.map((o, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/40 transition-colors">
                            <div>
                              <p className="text-sm font-black text-foreground">Order #{o.id}</p>
                              <p className="text-[10px] text-muted-foreground">From: {o.farmerName || 'Farmer'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-primary">{formatNaira(o.total_amount)}</p>
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                o.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' :
                                o.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-yellow-500/10 text-yellow-600'
                              }`}>{o.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No orders placed yet</p>
                        <Link to="/marketplace" className="text-primary text-xs font-black hover:underline mt-2 inline-flex items-center gap-1">
                          Browse Marketplace <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Quick Links ─────────────────────────────── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(isFarmer ? [
                  { label: 'My Products', to: '/farmer/products', icon: Package },
                  { label: 'My Orders', to: '/farmer/orders', icon: ShoppingBag },
                  { label: 'Wallet', to: '/farmer/wallet', icon: Wallet },
                  { label: 'Marketplace', to: '/marketplace', icon: Leaf },
                ] : [
                  { label: 'Marketplace', to: '/marketplace', icon: Leaf },
                  { label: 'My Orders', to: '/orders', icon: ShoppingBag },
                  { label: 'Chat', to: '/chat', icon: Users },
                  { label: 'Cart', to: '/cart', icon: ShoppingBag },
                ]).map((link, i) => (
                  <Link key={i} to={link.to}
                    className="glass-premium rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 hover:bg-primary/5 transition-all group border border-border/30">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <link.icon className="w-5 h-5 text-primary group-hover:text-white" />
                    </div>
                    <span className="font-black text-sm text-foreground">{link.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p>Could not load profile. Make sure you are logged in.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
