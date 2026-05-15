import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/services/api';
import {
  User, Leaf, ShieldCheck, TrendingUp, Package, ShoppingBag,
  Star, AlertTriangle, Zap, Layers, PackageX, CheckCircle2,
  BarChart3, Wallet, Clock, Award, ChevronRight, RefreshCw,
  ArrowUpRight, Users, BadgeCheck, Sparkles, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className={cn("flex gap-5 p-6 rounded-[2rem] border bg-white/40 backdrop-blur-xl transition-all hover:scale-[1.02]", color)}>
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="font-black text-base text-foreground uppercase tracking-tight">{insight.title}</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">{insight.detail}</p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, icon: Icon, color = 'primary' }) => (
  <div className="glass-card p-8 rounded-[2.5rem] bg-white/40 border-white/60 group hover:shadow-2xl transition-all duration-500">
    <div className={cn("w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500", `text-${color}`)}>
      <Icon className="w-7 h-7" />
    </div>
    <div>
      <p className="text-3xl font-black text-foreground tracking-tighter mb-1">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      {sub && <p className="text-[8px] font-black uppercase tracking-widest text-primary mt-2">{sub}</p>}
    </div>
  </div>
);

const ProfileScoreRing = ({ score }) => {
  const stroke = 251.2; // 2πr where r=40
  const offset = stroke - (score / 100) * stroke;
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-secondary/50" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke="currentColor" strokeWidth="10"
          strokeDasharray={stroke} strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 shadow-glow"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-foreground tracking-tighter">{score}</span>
        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Score</span>
      </div>
    </div>
  );
};

export const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const data = await apiRequest(`/profile?userId=${userId}`);
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
      <div className="min-h-screen-dvh flex items-center justify-center">
        <div className="text-center space-y-8 reveal-up">
          <div className="w-24 h-24 bg-muted rounded-[2rem] flex items-center justify-center mx-auto opacity-20">
             <User className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter">Terminal Restricted</h2>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Please initialize session to access profile</p>
          <Link to="/login">
            <button className="btn-premium px-12 h-16">Initialize Login</button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );

  const isFarmer = user.role === 'farmer';

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-32">
        {/* Cinematic Backdrop */}
        <div className="absolute top-0 right-0 w-full h-[50vh] bg-[radial-gradient(circle_at_80%_20%,rgba(0,100,0,0.06),transparent)] pointer-events-none" />

        <div className="container mx-auto pt-32 pb-20 px-4 reveal-up">
          <div className="max-w-6xl mx-auto space-y-12">

            {/* ── IDENTITY TERMINAL ─────────────────────────────── */}
            <div className="glass-card rounded-[3.5rem] p-10 lg:p-16 flex flex-col md:flex-row gap-12 items-start md:items-center bg-white/40 border-white/60 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              
              {/* Avatar Stage */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-primary/30 group-hover:scale-105 transition-transform duration-700">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                {user.is_verified == 1 && (
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-accent-gold rounded-[1.25rem] flex items-center justify-center border-4 border-white shadow-xl shadow-accent-gold/20">
                    <BadgeCheck className="w-6 h-6 text-accent-gold-foreground" />
                  </div>
                )}
              </div>

              {/* Identity Details */}
              <div className="flex-1 space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter uppercase leading-none">{user.name}</h1>
                  <div className="flex gap-2">
                     <span className={cn("px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border", 
                       isFarmer ? 'bg-primary/10 text-primary border-primary/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                     )}>
                       {isFarmer ? 'Producer Hub' : 'Trade Operator'}
                     </span>
                     {user.is_verified == 1 && (
                       <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-2">
                         <ShieldCheck className="w-4 h-4" /> Verified
                       </span>
                     )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                  <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> {user.email}</span>
                  {user.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {user.phone}</span>}
                  {user.created_at && <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Joined {new Date(user.created_at).getFullYear()}</span>}
                </div>
              </div>

              {/* Score Visualization */}
              {profile?.aiInsights && (
                <div className="flex flex-col items-center gap-4 bg-secondary/30 p-6 rounded-[2.5rem] border border-white/50">
                  <ProfileScoreRing score={profile.aiInsights.profileScore} />
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Trust Score</p>
                </div>
              )}

              <button onClick={fetchProfile} className="absolute top-8 right-8 w-12 h-12 glass-card bg-white/50 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary transition-all active:rotate-180 duration-500">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-card rounded-[2.5rem] h-48 animate-pulse bg-secondary/30" />
                ))}
              </div>
            ) : profile ? (
              <>
                {/* ── KPI TERMINAL ─────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {isFarmer ? (
                    <>
                      <StatCard label="Total Revenue" value={formatNaira(profile.stats?.totalRevenue)} icon={TrendingUp} />
                      <StatCard label="Settlement Pending" value={formatNaira(profile.stats?.pendingRevenue)} icon={Clock} color="amber-500" />
                      <StatCard label="Asset Valuation" value={formatNaira(profile.inventoryValue)} icon={Package} />
                      <StatCard label="Success Ratio" value={`${profile.stats?.deliveryRate ?? 0}%`} icon={BarChart3} color="blue-500" />
                    </>
                  ) : (
                    <>
                      <StatCard label="Total Acquisition" value={formatNaira(profile.stats?.totalSpend)} icon={Wallet} />
                      <StatCard label="Contract History" value={profile.stats?.totalOrders ?? 0} icon={ShoppingBag} />
                      <StatCard label="Supplier Network" value={profile.stats?.uniqueFarmers ?? 0} icon={Users} color="emerald-500" />
                      <StatCard label="Trust Level" value="Advanced" icon={BadgeCheck} color="blue-500" />
                    </>
                  )}
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  {/* ── INTELLIGENCE DECK ───────────────────────────── */}
                  <div className="glass-card rounded-[3.5rem] p-10 bg-white/40 border-white/60 space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase">Agro Intelligence</h2>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Core Llama-3.3 Synthesis</p>
                      </div>
                    </div>
                    {profile.aiInsights?.insights?.length > 0 ? (
                      <div className="space-y-4">
                        {profile.aiInsights.insights.map((insight, i) => (
                          <AIInsightCard key={i} insight={insight} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-[2.5rem]">
                        <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">Synthesizing data...</p>
                      </div>
                    )}
                  </div>

                  {/* ── PERFORMANCE METRICS ──────────── */}
                  <div className="glass-card rounded-[3.5rem] p-10 bg-white/40 border-white/60 space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase">{isFarmer ? 'Asset Performance' : 'Recent Contracts'}</h2>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">{isFarmer ? 'By Revenue contribution' : 'Terminal activity'}</p>
                      </div>
                    </div>
                    
                    {isFarmer ? (
                      <div className="space-y-4">
                        {profile.topProducts?.length > 0 ? (
                          profile.topProducts.map((p, i) => (
                            <div key={i} className="flex items-center gap-6 p-5 rounded-[2rem] bg-secondary/30 border border-white/50 hover:bg-white transition-all group">
                              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/10">
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-base text-foreground tracking-tight uppercase line-clamp-1">{p.name}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{p.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-base font-black text-primary tracking-tighter">{formatNaira(p.revenue)}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{p.order_count} Units</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                             <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
                             <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">Inventory dormant</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {profile.recentOrders?.length > 0 ? (
                          profile.recentOrders.map((o, i) => (
                            <div key={i} className="flex items-center justify-between p-5 rounded-[2rem] bg-secondary/30 border border-white/50 hover:bg-white transition-all group">
                              <div>
                                <p className="text-base font-black text-foreground tracking-tight uppercase">Contract #{o.id.slice(0,6)}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">HUB: {o.farmerName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-base font-black text-primary tracking-tighter mb-1">{formatNaira(o.total_amount)}</p>
                                <span className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border", 
                                  o.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                  o.status === 'shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                  'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                )}>{o.status}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                             <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
                             <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">Terminal inactive</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── SYSTEM SHORTCUTS ─────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
                  {(isFarmer ? [
                    { label: 'Inventory Hub', to: '/farmer/products', icon: Package },
                    { label: 'Contract Deck', to: '/farmer/orders', icon: ShoppingBag },
                    { label: 'Financials', to: '/farmer/wallet', icon: Wallet },
                    { label: 'Market Feed', to: '/marketplace', icon: Leaf },
                  ] : [
                    { label: 'Discovery Hub', to: '/marketplace', icon: Leaf },
                    { label: 'Contract List', to: '/orders', icon: ShoppingBag },
                    { label: 'Trade Terminal', to: '/chat', icon: Users },
                    { label: 'Active Basket', to: '/cart', icon: ShoppingBag },
                  ]).map((link, i) => (
                    <Link key={i} to={link.to}
                      className="glass-card rounded-[2rem] p-6 flex items-center gap-5 hover:bg-white transition-all group border-white/60 bg-white/40 active:scale-95">
                      <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                        <link.icon className="w-6 h-6" />
                      </div>
                      <span className="font-black text-[10px] uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{link.label}</span>
                      <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-32 glass-card rounded-[4rem] border-dashed border-border/50">
                <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-muted-foreground/20" />
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Synchronization Error</h3>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Failed to retrieve terminal profile data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
