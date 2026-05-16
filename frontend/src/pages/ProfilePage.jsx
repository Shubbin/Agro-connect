import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/services/api';
import {
  User, ShieldCheck, TrendingUp, Package, ShoppingBag,
  Star, AlertTriangle, Zap, CheckCircle2,
  BarChart3, Wallet, Clock, Award, ChevronRight, RefreshCw,
  Users, BadgeCheck, Sparkles, Activity, Mail, Phone, Settings, LogOut, Landmark, Info, Globe, Calendar, Terminal, Hash, Target, Database, FileText, Monitor, LayoutGrid, Box
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
    <div className={cn("flex gap-8 p-10 rounded-[2rem] border transition-all hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] hover:bg-white cursor-default group relative overflow-hidden", color)}>
      <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-white shadow-xl border border-inherit group-hover:scale-110 transition-transform relative z-10">
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-3 relative z-10">
        <p className="font-bold text-xl text-slate-900 tracking-tighter leading-tight">{insight.title}</p>
        <p className="text-base text-slate-600 leading-relaxed font-medium opacity-80">{insight.detail}</p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, icon: Icon }) => (
  <div className="bg-white p-14 rounded-[3rem] border border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-12 opacity-[0.03] -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-1000">
       <Icon className="w-64 h-64 text-slate-900" />
    </div>
    <div className="relative z-10 space-y-10">
      <div className="w-20 h-20 rounded-[1.75rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-primary transition-all duration-700 shadow-inner">
        <Icon className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mb-4">{label}</p>
        <p className="text-5xl font-bold text-slate-900 tracking-tighter group-hover:text-primary transition-colors">{value}</p>
      </div>
    </div>
    {sub && (
      <div className="flex items-center gap-4 mt-12 pt-10 border-t border-slate-50 relative z-10">
         <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,166,81,0.5)]" />
         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">{sub}</p>
      </div>
    )}
  </div>
);

const TrustScoreRing = ({ score }) => {
  const stroke = 251.2;
  const offset = stroke - (score / 100) * stroke;
  return (
    <div className="relative w-52 h-52 group">
      <svg className="w-full h-full -rotate-90 group-hover:scale-110 transition-transform duration-1000" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#F8FAFC" strokeWidth="5" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke="#022c22" strokeWidth="7"
          strokeDasharray={stroke} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-[2000ms]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-slate-900 tracking-tighter">{score}</span>
        <div className="space-y-1 text-center px-8">
           <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-900">RELIABILITY</p>
           <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">NETWORK INDEX</p>
        </div>
      </div>
    </div>
  );
};

export const ProfilePage = () => {
  const { user, logout } = useAuth();
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-3xl w-full bg-white p-32 rounded-[4rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.2)] text-center space-y-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-50" />
          <div className="w-36 h-36 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner transform -rotate-12 transition-transform hover:rotate-0 duration-1000">
             <Landmark className="w-16 h-16 text-slate-100" />
          </div>
          <div className="space-y-8">
             <h2 className="text-5xl font-bold text-slate-900 tracking-tighter leading-none">Institutional Authorization</h2>
             <p className="text-slate-500 font-medium text-xl max-w-md mx-auto leading-relaxed opacity-80">Please authenticate through the secure protocol hub to synchronize your professional trade manifests and operational matrices.</p>
          </div>
          <Link to="/login" className="block">
            <button className="h-24 px-20 rounded-2xl bg-primary text-white font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-primary/90 shadow-[0_30px_70px_-15px_rgba(0,166,81,0.4)] transition-all active:scale-95 flex items-center justify-center gap-8 mx-auto group">
              Authorize Connection
              <ArrowRight className="w-7 h-7 group-hover:translate-x-3 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );

  const isFarmer = user.role === 'farmer';

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pb-60">
        {/* Institutional Profile Registry Terminal Header */}
        <section className="bg-white border-b border-slate-200 pt-32 pb-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row gap-32 items-start lg:items-center">
              
              {/* Central Identity Module */}
              <div className="relative shrink-0 group">
                <div className="w-64 h-64 rounded-[4rem] bg-slate-900 flex items-center justify-center text-9xl font-bold text-white shadow-[0_60px_120px_-20px_rgba(0,0,0,0.3)] border-[16px] border-white transition-all duration-1000 group-hover:scale-105 group-hover:rotate-6 relative overflow-hidden">
                   <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity" />
                   {user.name?.[0]?.toUpperCase()}
                </div>
                {user.is_verified == 1 && (
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center border border-slate-200 shadow-2xl transition-all group-hover:scale-110 group-hover:-rotate-12 duration-700">
                    <BadgeCheck className="w-14 h-14 text-primary" />
                  </div>
                )}
              </div>

              {/* Identity Manifest Ledger */}
              <div className="flex-1 space-y-20">
                <div className="space-y-12">
                  <div className="flex flex-wrap items-center gap-10">
                    <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-none">{user.name}</h1>
                    <div className={cn("px-10 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[0.4em] border shadow-2xl", 
                      isFarmer ? 'bg-primary/5 text-primary border-primary/20 shadow-primary/5' : 'bg-slate-900 text-white border-slate-800 shadow-slate-900/10'
                    )}>
                      {isFarmer ? 'Verified Principal Producer' : 'Strategic Procurement Principal'}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-20 gap-y-10">
                    <div className="flex items-center gap-6 group cursor-pointer">
                       <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-primary group-hover:bg-slate-900 group-hover:text-white transition-all duration-700 shadow-inner border border-slate-100">
                          <Mail className="w-7 h-7" />
                       </div>
                       <div className="space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none">Authorization Hub</p>
                          <p className="text-xl font-bold text-slate-900 tracking-tighter group-hover:text-primary transition-colors">{user.email}</p>
                       </div>
                    </div>
                    {user.phone && (
                       <div className="flex items-center gap-6 group cursor-pointer">
                          <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-primary group-hover:bg-slate-900 group-hover:text-white transition-all duration-700 shadow-inner border border-slate-100">
                             <Phone className="w-7 h-7" />
                          </div>
                          <div className="space-y-1.5">
                             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none">Operational Link</p>
                             <p className="text-xl font-bold text-slate-900 tracking-tighter group-hover:text-primary transition-colors">{user.phone}</p>
                          </div>
                       </div>
                    )}
                    <div className="flex items-center gap-6 group cursor-default">
                       <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-slate-300 shadow-inner border border-slate-100">
                          <Calendar className="w-7 h-7" />
                       </div>
                       <div className="space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none">Registry Cycle</p>
                          <p className="text-xl font-bold text-slate-900 tracking-tighter">{new Date(user.created_at || Date.now()).getFullYear()} Node Node</p>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-8">
                   <button className="h-20 px-14 rounded-2xl bg-white border border-slate-200 text-slate-900 text-[12px] font-bold uppercase tracking-[0.4em] hover:bg-slate-50 shadow-2xl transition-all flex items-center gap-6 active:scale-95 group/settings">
                      <Settings className="w-6 h-6 text-primary group-hover/settings:rotate-180 transition-transform duration-1000" />
                      Configure Parameters
                   </button>
                   <button onClick={logout} className="h-20 px-14 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[12px] font-bold uppercase tracking-[0.4em] hover:bg-red-100 transition-all flex items-center gap-6 active:scale-95 group/exit">
                      <LogOut className="w-6 h-6 group-hover/exit:-translate-x-2 transition-transform" />
                      Authorize Exit
                   </button>
                </div>
              </div>

              {/* Reliability Index Analysis Matrix */}
              {profile?.aiInsights && (
                <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.15)] flex flex-col items-center gap-12 relative overflow-hidden group/reliability">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/reliability:opacity-100 transition-opacity duration-1000" />
                  <TrustScoreRing score={profile.aiInsights.profileScore} />
                  <div className="relative z-10 text-center space-y-3">
                     <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-slate-900">Network Credibility Index</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] opacity-60">Institutional Aggregate Analysis</p>
                  </div>
                  <div className="relative z-10 pt-6 border-t border-slate-50 w-full flex items-center justify-center gap-3">
                     {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,166,81,0.5)]" style={{ animationDelay: `${i * 0.2}s` }} />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-32 max-w-7xl">
          <div className="space-y-40">
            
            {/* High-Fidelity Performance Analysis Matrix */}
            <div className="space-y-16">
               <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-2xl">
                     <Activity className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                     <h2 className="text-4xl font-bold text-slate-900 tracking-tighter">Operational Performance Matrix</h2>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Real-Time Asset Synchronization</p>
                  </div>
                  <div className="flex-1 h-px bg-slate-100" />
               </div>
               {isLoading ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
                   {[...Array(4)].map((_, i) => (
                     <div key={i} className="bg-white rounded-[3rem] h-64 animate-pulse border border-slate-200 shadow-sm" />
                   ))}
                 </div>
               ) : profile ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
                   {isFarmer ? (
                     <>
                       <StatCard label="Total Capital Flow" value={formatNaira(profile.stats?.totalRevenue)} sub="Gross Trade Magnitude" icon={TrendingUp} />
                       <StatCard label="Escrow Capital Node" value={formatNaira(profile.stats?.pendingRevenue)} sub="Locked Settlement Status" icon={Clock} />
                       <StatCard label="Inventory Appraisal" value={formatNaira(profile.inventoryValue)} sub="Asset Magnitude Valuation" icon={Database} />
                       <StatCard label="Fulfillment Integrity" value={`${profile.stats?.deliveryRate ?? 98}%`} sub="Logistics Network Sync" icon={ShieldCheck} />
                     </>
                   ) : (
                     <>
                       <StatCard label="Procurement Magnitude" value={formatNaira(profile.stats?.totalSpend)} sub="Allocated Trade Capital" icon={Wallet} />
                       <StatCard label="Contract Density" value={profile.stats?.totalOrders ?? 0} sub="Authorized Trade Cycles" icon={FileText} />
                       <StatCard label="Authorized Hubs" value={profile.stats?.uniqueFarmers ?? 0} sub="Verified Source Network" icon={Users} />
                       <StatCard label="Institutional Class" value="Tier 1 Enterprise" sub="Authorized Trading Principal" icon={Landmark} />
                     </>
                   )}
                 </div>
               ) : null}
            </div>

            {/* Strategic Analysis & Operational Journal Terminal */}
            {profile && (
              <div className="grid lg:grid-cols-2 gap-32">
                {/* Algorithmic Intelligence Analysis Hub */}
                <div className="bg-white rounded-[4rem] p-20 md:p-24 border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] space-y-20 relative overflow-hidden group/intel">
                  <div className="absolute top-0 right-0 p-20 opacity-[0.03] -mr-32 -mt-32 pointer-events-none group-hover/intel:scale-125 transition-transform duration-1000">
                     <Sparkles className="w-[600px] h-[600px] text-slate-900" />
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-16 relative z-10">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-slate-900 rounded-[1.75rem] flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(15,23,42,0.5)] group-hover/intel:scale-110 transition-transform duration-700">
                        <Sparkles className="w-10 h-10 text-primary shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tighter">Strategic Intelligence Hub</h2>
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mt-2">Algorithmic Trade Optimization Hub</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 space-y-10">
                    {profile.aiInsights?.insights?.length > 0 ? (
                      <div className="space-y-10">
                        {profile.aiInsights.insights.map((insight, i) => (
                          <AIInsightCard key={i} insight={insight} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-52 bg-slate-50/30 rounded-[3rem] border-2 border-dashed border-slate-100 space-y-10">
                        <Monitor className="w-24 h-24 mx-auto text-slate-100 animate-pulse" />
                        <div className="space-y-3">
                           <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.4em]">Synchronizing Algorithmic Matrix Hub...</p>
                           <p className="text-base text-slate-400 font-medium opacity-60">Analyzing regional hub metadata and trade flows.</p>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                           {[...Array(3)].map((_, i) => <div key={i} className="w-2 h-2 bg-primary/20 rounded-full animate-ping" style={{ animationDelay: `${i * 0.3}s` }} />)}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative z-10 pt-16 border-t border-slate-50 flex items-center justify-between">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-relaxed italic opacity-60">Generated via Institutional Protocol v4.2.0-STABLE</p>
                     <div className="flex items-center gap-3 px-6 py-2 bg-slate-50 rounded-xl border border-slate-100 shadow-xl">
                        <Activity className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">LIVE AUDIT SYNC</span>
                     </div>
                  </div>
                </div>

                {/* Live Operational Trade Journal */}
                <div className="bg-white rounded-[4rem] p-20 md:p-24 border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] space-y-20 relative overflow-hidden group/journal">
                  <div className="absolute top-0 right-0 p-20 opacity-[0.03] -mr-32 -mt-32 pointer-events-none group-hover/journal:scale-125 transition-transform duration-1000">
                     <FileText className="w-[600px] h-[600px] text-slate-900" />
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-16 relative z-10">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[1.75rem] flex items-center justify-center text-slate-200 shadow-inner group-hover/journal:scale-110 transition-transform duration-700">
                        <Activity className="w-10 h-10 group-hover/journal:text-primary transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tighter">
                          {isFarmer ? 'High-Velocity Assets' : 'Authorized Manifest Logs'}
                        </h2>
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mt-2">Live Trade Synchronization Journal Hub</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-8 relative z-10">
                    {(isFarmer ? profile.topProducts : profile.recentOrders)?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-10 rounded-[2.5rem] bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-transparent transition-all duration-700 group/row cursor-pointer relative overflow-hidden">
                         <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                         <div className="flex items-center gap-10 relative z-10">
                            <div className="w-18 h-18 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-200 shadow-xl group-hover/row:text-primary group-hover/row:scale-110 transition-all duration-700 group-hover/row:rotate-6">
                               {isFarmer ? <Package className="w-8 h-8" /> : <ShoppingBag className="w-8 h-8" />}
                            </div>
                            <div className="space-y-2">
                               <p className="text-2xl font-bold text-slate-900 group-hover/row:text-primary transition-colors tracking-tighter">
                                  {isFarmer ? item.name : `Manifest #${item.id.slice(-8).toUpperCase()}`}
                                </p>
                                <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                                   <Hash className="w-4 h-4 text-primary" />
                                   {isFarmer ? `Category: ${item.category}` : `AUTHORIZED: ${item.farmerName}`}
                                </div>
                            </div>
                         </div>
                         <div className="text-right space-y-4 relative z-10">
                            <p className="text-3xl font-bold text-slate-900 tracking-tighter">{formatNaira(isFarmer ? item.revenue : item.total_amount)}</p>
                            <span className={cn("inline-flex items-center px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] border shadow-2xl", 
                              (isFarmer || item.status === 'delivered') ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-500/5' : 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-500/5'
                            )}>
                               {isFarmer ? `${item.order_count} Fulfillment Cycles` : item.status}
                            </span>
                         </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="relative z-10 pt-16 border-t border-slate-50 flex items-center justify-center">
                     <button className="h-20 px-14 rounded-2xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 shadow-2xl transition-all flex items-center gap-6 group/more active:scale-95">
                        Visualize Full Operational Manifest Hub
                        <ChevronRight className="w-6 h-6 group-hover/more:translate-x-3 transition-transform duration-500" />
                     </button>
                  </div>
                </div>
              </div>
            )}

            {/* Strategic Command Terminal Shortcuts Matrix */}
            <div className="space-y-16">
               <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-2xl">
                     <LayoutGrid className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                     <h2 className="text-4xl font-bold text-slate-900 tracking-tighter">Command Terminal Matrix</h2>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Direct Operational Node Access</p>
                  </div>
                  <div className="flex-1 h-px bg-slate-100" />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                 {(isFarmer ? [
                   { label: 'Asset Control', to: '/farmer/products', icon: Database, sub: 'Inventory Lifecycle Node' },
                   { label: 'Contract Terminal', to: '/farmer/orders', icon: FileText, sub: 'Fulfillment Logic Sync' },
                   { label: 'Treasury Node', to: '/farmer/wallet', icon: Landmark, sub: 'Capital Settlement Hub' },
                   { label: 'Discovery Hub', to: '/marketplace', icon: Activity, sub: 'Network Monitoring Node' },
                 ] : [
                   { label: 'Asset Discovery', to: '/marketplace', icon: Activity, sub: 'Institutional Supply Hub' },
                   { label: 'Trade Manifests', to: '/orders', icon: ShoppingBag, sub: 'Cycle History Registry' },
                   { label: 'Trade Terminal', to: '/chat', icon: Users, sub: 'Direct Connection Link' },
                   { label: 'Basket Registry', to: '/cart', icon: LayoutGrid, sub: 'Procurement Queue Manifest' },
                 ]).map((link, i) => (
                   <Link key={i} to={link.to} className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] hover:border-primary/40 hover:shadow-[0_60px_150px_-30px_rgba(0,0,0,0.15)] transition-all group relative overflow-hidden flex flex-col justify-between aspect-square active:scale-95">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03] -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-[2000ms]">
                         <link.icon className="w-[400px] h-[400px] text-slate-900" />
                      </div>
                      <div className="w-20 h-20 rounded-[1.75rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 group-hover:text-primary group-hover:bg-slate-900 group-hover:border-slate-800 transition-all duration-700 shadow-inner relative z-10 group-hover:rotate-12 group-hover:scale-110">
                         <link.icon className="w-10 h-10" />
                      </div>
                      <div className="space-y-4 relative z-10">
                         <h4 className="text-2xl font-bold text-slate-900 tracking-tighter group-hover:text-primary transition-colors">{link.label}</h4>
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none opacity-80">{link.sub}</p>
                         <div className="pt-8 flex items-center justify-between text-[10px] font-bold text-primary uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-1000">
                            Initialize Operational Node
                            <ChevronRight className="w-5 h-5" />
                         </div>
                      </div>
                   </Link>
                 ))}
               </div>
            </div>

            {profile === null && !isLoading && (
              <div className="text-center py-60 bg-white rounded-[4rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.2)] max-w-5xl mx-auto space-y-20 relative overflow-hidden group/error">
                <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover/error:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                <div className="w-40 h-40 bg-amber-50 border-[10px] border-white rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl relative z-10 transform rotate-12 transition-transform group-hover/error:rotate-0 duration-1000">
                   <AlertTriangle className="w-16 h-16 text-amber-500" />
                </div>
                <div className="space-y-8 relative z-10 px-20">
                   <h3 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-tight">Network Synchronization Delay</h3>
                   <p className="text-2xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed opacity-80">The institutional trade terminal encountered a verification delay within the global node network. Re-initialize the secure connection link to synchronize operational manifests.</p>
                </div>
                <button onClick={fetchProfile} className="h-24 px-20 rounded-[1.5rem] bg-primary text-white font-bold text-[11px] uppercase tracking-[0.4em] shadow-[0_30px_70px_-15px_rgba(0,166,81,0.4)] hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-8 mx-auto relative z-10 group/retry">
                  <RefreshCw className="w-8 h-8 group-hover/retry:rotate-180 transition-transform duration-1000" />
                  Re-Initialize Secure Link Terminal
                </button>
              </div>
            )}
            
            {/* Global Institutional Support Node Hub */}
            <div className="pt-20 flex items-center justify-center gap-16 opacity-10">
               <Smartphone className="w-10 h-10 text-slate-900" />
               <Monitor className="w-10 h-10 text-slate-900" />
               <Landmark className="w-10 h-10 text-slate-900" />
               <LayoutGrid className="w-10 h-10 text-slate-900" />
               <Activity className="w-10 h-10 text-slate-900" />
               <Globe className="w-10 h-10 text-slate-900" />
               <Database className="w-10 h-10 text-slate-900" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
