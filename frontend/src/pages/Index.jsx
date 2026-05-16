import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, TrendingUp, BarChart3, Truck, Leaf, Target, Globe, Award, Shield, Database, Landmark, Building2, UserCheck, ChevronRight, PlayCircle, Activity, Smartphone, Monitor, LayoutGrid, FileText, CheckCircle2, Search, ArrowUpRight, Zap, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { statsAPI } from '@/services/api';

export const HomePage = () => {
  const [stats, setStats] = useState({ farmers: 0, products: 0, states: 0, volume: '₦0' });

  useEffect(() => {
    statsAPI.getSummary().then(setStats).catch(console.error);
  }, []);

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-white min-h-screen">
        {/* Institutional Hero Terminal Command Registry */}
        <section className="relative pt-32 lg:pt-52 pb-48 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none -mr-64 -mt-64 group">
             <Landmark className="w-full h-full text-slate-900 rotate-12 transition-transform duration-[3000ms] group-hover:scale-110" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-32">
              <div className="flex-1 space-y-20">
                <div className="space-y-12">
                  <div className="inline-flex items-center gap-6 px-8 py-3 rounded-2xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.4em] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.4)] border border-slate-800">
                    <ShieldCheck className="w-6 h-6 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                    Institutional Trade Protocol v4.2.0
                  </div>
                  <div className="space-y-6">
                     <h1 className="text-7xl md:text-8xl lg:text-[9.5rem] font-bold text-slate-900 tracking-tighter leading-[0.8] transition-all">
                       Nigeria's <br />
                       <span className="text-primary italic">Industrial Hub.</span>
                     </h1>
                  </div>
                  <p className="text-2xl md:text-3xl text-slate-500 max-w-4xl leading-relaxed font-medium opacity-80 border-l-4 border-primary/20 pl-10">
                    AgroDirect architecting high-integrity trade between verified producers and industrial procurement networks. Secure settlement, unified logistics, and real-time trade intelligence for Nigeria's future.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-8">
                  <Link to="/marketplace">
                    <button className="h-28 px-20 rounded-[2rem] bg-primary text-white font-bold text-2xl uppercase tracking-[0.3em] shadow-[0_40px_100px_-20px_rgba(0,166,81,0.5)] hover:bg-primary/90 transition-all flex items-center justify-center gap-8 active:scale-95 group/explore">
                      Explore Commodities
                      <ArrowRight className="w-10 h-10 transition-transform group-hover/explore:translate-x-4 duration-700" />
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="h-28 px-16 rounded-[2rem] bg-white border border-slate-200 text-slate-900 font-bold text-xl uppercase tracking-[0.3em] hover:bg-slate-50 transition-all shadow-2xl active:scale-95 flex items-center gap-8 group/onboarding">
                      <UserCheck className="w-8 h-8 text-primary shadow-[0_0_10px_rgba(0,166,81,0.2)]" />
                      Partner Onboarding
                    </button>
                  </Link>
                </div>
                
                <div className="pt-24 flex flex-wrap items-center gap-x-20 gap-y-12">
                   <div className="w-full mb-4 flex items-center gap-6">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] shrink-0">Strategic Institutional Partners</p>
                      <div className="flex-1 h-px bg-slate-100" />
                   </div>
                   {[
                      { icon: Globe, name: 'AFEX' },
                      { icon: Award, name: 'NIRSAL' },
                      { icon: Shield, name: 'BOA' },
                      { icon: Building2, name: 'CBN' }
                   ].map((partner) => (
                      <div key={partner.name} className="flex items-center gap-6 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000 cursor-default group/partner">
                         <partner.icon className="w-10 h-10 text-slate-900 group-hover/partner:text-primary transition-colors duration-700" />
                         <span className="text-xl font-black text-slate-900 uppercase tracking-[0.3em]">{partner.name}</span>
                      </div>
                   ))}
                </div>
              </div>

              {/* High-Fidelity Visual Stage Hub */}
              <div className="flex-1 relative w-full max-w-5xl">
                 <div className="relative rounded-[5rem] overflow-hidden shadow-[0_100px_250px_-50px_rgba(0,0,0,0.2)] border-[24px] border-white bg-slate-100 transform rotate-3 hover:rotate-0 transition-all duration-[2000ms] group/visual">
                    <img 
                       src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2045&auto=format&fit=crop" 
                       alt="Institutional Agriculture Nigeria" 
                       className="w-full aspect-[4/5.8] object-cover grayscale group-hover/visual:grayscale-0 transition-all duration-[2000ms] group-hover/visual:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80 group-hover/visual:opacity-40 transition-opacity duration-1000" />
                    
                    {/* Real-Time Trade Manifest Dynamic Overlay */}
                    <div className="absolute bottom-16 left-16 right-16 bg-white/95 backdrop-blur-3xl p-16 rounded-[4rem] border border-white/50 shadow-2xl space-y-10 transform translate-y-12 group-hover/visual:translate-y-0 transition-all duration-[1500ms] group-hover/visual:shadow-[0_60px_150px_-30px_rgba(0,166,81,0.3)]">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-8">
                             <div className="w-20 h-20 bg-primary rounded-[1.75rem] flex items-center justify-center text-white shadow-[0_30px_70px_-15px_rgba(0,166,81,0.5)] group-hover/visual:rotate-12 transition-transform duration-1000">
                                <TrendingUp className="w-10 h-10" />
                             </div>
                             <div className="space-y-2">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none opacity-60">Network Market Status</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Active Trade Sync Hub</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-2xl">
                             <Activity className="w-6 h-6 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                             <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Operational Live</span>
                          </div>
                       </div>
                       <p className="text-2xl font-medium text-slate-500 leading-relaxed italic opacity-80 border-l-4 border-primary/20 pl-8">
                          "Institutional procurement for Grade-AAA Commodity Assets localized across Northern Logistics Nodes increased by <span className="text-primary font-black">14.2%</span> this authorization cycle manifest."
                       </p>
                       <div className="pt-6 flex items-center gap-4">
                          {[...Array(4)].map((_, i) => <div key={i} className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(0,166,81,0.5)]" style={{ animationDelay: `${i * 0.3}s` }} />)}
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em] ml-4">Syncing Regional Nodes...</span>
                       </div>
                    </div>
                 </div>
                 
                 {/* Structural Background Depth Effects */}
                 <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse" />
                 <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-slate-900/5 rounded-full blur-[180px] -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* High-Fidelity Network Matrix Performance Hub */}
        <section className="py-52 bg-slate-50 border-y border-slate-100 relative overflow-hidden group/stats">
           <div className="absolute inset-0 bg-white/50 opacity-0 group-hover/stats:opacity-100 transition-opacity duration-[2000ms] pointer-events-none" />
           <div className="container mx-auto px-4 max-w-7xl relative z-10">
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-24 xl:gap-40">
               {[
                 { label: 'Verified Nodes', value: stats.farmers || '2.4k', sub: 'Institutional Partners', icon: UserCheck },
                 { label: 'Trade Assets', value: stats.products || '8.1k', sub: 'Operational Inventory', icon: Database },
                 { label: 'Gross Settlement', value: stats.volume || '₦1.2B+', sub: 'Aggregate Value Manifest', icon: Landmark },
                 { label: 'Hub Coverage', value: stats.states || '18', sub: 'Regional Logistics Hubs', icon: Globe },
               ].map((stat, i) => (
                 <div key={i} className="space-y-10 group/stat cursor-default">
                   <div className="flex items-center gap-6 border-b border-slate-200 pb-8 group-hover/stat:border-primary transition-colors duration-700">
                      <stat.icon className="w-8 h-8 text-primary group-hover/stat:scale-125 transition-transform duration-1000" />
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.5em] leading-none">{stat.label}</p>
                   </div>
                   <div className="space-y-4">
                      <p className="text-8xl md:text-9xl font-black text-slate-900 tracking-tighter group-hover/stat:text-primary transition-all duration-1000 group-hover/stat:translate-x-4 leading-none">{stat.value}</p>
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em] border-l-4 border-primary/20 pl-8 ml-1 group-hover/stat:border-primary transition-all duration-700 opacity-60 group-hover/stat:opacity-100">{stat.sub}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </section>

        {/* Core Operational Framework Manifest */}
        <section className="py-60 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-24 mb-48">
               <div className="space-y-12 max-w-5xl">
                  <div className="inline-flex items-center gap-6 px-8 py-3 rounded-2xl bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-[0.4em] border border-primary/10 shadow-2xl shadow-primary/5">
                     Trade Infrastructure Architecture Manifest
                  </div>
                  <h2 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85]">Direct Trade Infrastructure.</h2>
               </div>
               <div className="space-y-8 max-w-md">
                  <p className="text-2xl text-slate-500 font-medium leading-relaxed opacity-80 border-l-2 border-slate-100 pl-8">
                     Providing the high-fidelity digital backbone for industrial-scale agricultural procurement and national supply chain synchronization.
                  </p>
                  <div className="flex gap-4">
                     {[...Array(3)].map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-slate-100 group-hover:bg-primary transition-colors duration-700" />)}
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-3 gap-24">
              {[
                {
                  title: 'Secure Settlement',
                  icon: ShieldCheck,
                  desc: 'Authorized capital flows through a verified escrow protocol, released only upon institutional delivery hub verification.',
                  color: 'bg-emerald-50 text-emerald-600',
                  border: 'border-emerald-100',
                  accent: 'emerald'
                },
                {
                  title: 'Trade Intelligence',
                  icon: BarChart3,
                  desc: 'Real-time trade data and predictive commodity analytics powered by institutional-grade AI for high-velocity exchange.',
                  color: 'bg-primary/5 text-primary',
                  border: 'border-primary/10',
                  accent: 'primary'
                },
                {
                  title: 'Logistics Matrix',
                  icon: Truck,
                  desc: 'Unified supply chain visibility with end-to-end transit tracking and multi-factor regional logistics hub synchronization.',
                  color: 'bg-amber-50 text-amber-600',
                  border: 'border-amber-100',
                  accent: 'amber'
                },
              ].map((feature, i) => (
                <div key={i} className="p-24 rounded-[4.5rem] bg-white border border-slate-100 space-y-16 hover:shadow-[0_100px_200px_-50px_rgba(0,0,0,0.15)] hover:border-primary/40 transition-all duration-[1500ms] group relative overflow-hidden">
                  <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none", feature.color.split(' ')[0])} />
                  <div className={cn("w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl border relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000", feature.color, feature.border)}>
                    <feature.icon className="w-12 h-12 shadow-[0_0_15px_rgba(0,166,81,0.2)]" />
                  </div>
                  <div className="space-y-10 relative z-10">
                     <h3 className="text-5xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors duration-700 leading-none">{feature.title}</h3>
                     <p className="text-2xl text-slate-500 leading-relaxed font-medium opacity-80">
                       {feature.desc}
                     </p>
                  </div>
                  <div className="pt-16 border-t border-slate-50 flex items-center justify-between relative z-10">
                     <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-slate-400 group-hover:text-primary transition-colors duration-700">Protocol Manifest Hub</span>
                     <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_30px_70px_-15px_rgba(0,166,81,0.5)] transition-all duration-[1000ms]">
                        <ChevronRight className="w-10 h-10" />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Institutional Onboarding Hub Node Terminal */}
        <section className="py-64 bg-slate-900 relative overflow-hidden group/cta">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495107333309-f0675bc155f8?q=80&w=2070&auto=format&fit=crop')] opacity-[0.08] bg-cover bg-center grayscale scale-110 group-hover/cta:scale-100 transition-transform duration-[3000ms]" />
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/30 via-transparent to-transparent pointer-events-none" />
           
           <div className="container mx-auto px-4 relative z-10 max-w-7xl">
              <div className="flex flex-col lg:flex-row items-center gap-48">
                 <div className="flex-1 space-y-24 text-center lg:text-left">
                    <div className="space-y-12">
                       <h2 className="text-8xl md:text-9xl lg:text-[10rem] font-black text-white tracking-tighter leading-[0.8] transition-all">
                          Onboard Your <br />
                          <span className="text-primary italic">Enterprise.</span>
                       </h2>
                       <p className="text-3xl md:text-4xl text-slate-400 max-w-4xl font-medium leading-relaxed opacity-80 border-l-4 border-primary/40 pl-12 mx-auto lg:mx-0">
                          Join Nigeria's most secure agricultural exchange registry. Authorized procurement networks trading Grade-AAA commodity assets across 18 regional hub nodes.
                       </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-10 justify-center lg:justify-start">
                       <Link to="/signup">
                          <button className="h-28 px-24 rounded-[2rem] bg-primary text-white font-bold text-2xl uppercase tracking-[0.4em] shadow-[0_50px_100px_-20px_rgba(0,166,81,0.6)] hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-10 group/cta-btn">
                             Initialize Account Hub
                             <ArrowRight className="w-10 h-10 group-hover/cta-btn:translate-x-6 transition-transform duration-1000" />
                          </button>
                       </Link>
                       <Link to="/marketplace">
                          <button className="h-28 px-20 rounded-[2rem] bg-white/5 border border-white/10 text-white font-bold text-2xl uppercase tracking-[0.3em] hover:bg-white/10 transition-all active:scale-95 shadow-2xl backdrop-blur-3xl group/discovery">
                             Market Discovery Hub
                             <Search className="w-8 h-8 ml-6 inline-block group-hover/discovery:scale-125 transition-transform duration-700" />
                          </button>
                       </Link>
                    </div>
                 </div>
                 
                 <div className="lg:w-[550px] shrink-0 bg-white/5 border border-white/10 p-20 rounded-[5rem] backdrop-blur-[100px] space-y-20 shadow-[0_100px_250px_-50px_rgba(0,0,0,0.6)] relative overflow-hidden group/ctacard">
                    <div className="absolute top-0 right-0 p-20 opacity-[0.05] -mr-24 -mt-24 group-hover/ctacard:scale-125 transition-transform duration-[2000ms] pointer-events-none">
                       <ShieldCheck className="w-[400px] h-[400px] text-white" />
                    </div>
                    <div className="space-y-6 relative z-10">
                       <p className="text-[12px] font-bold text-primary uppercase tracking-[0.5em] leading-none mb-2">Network Authority Hub Manifest</p>
                       <p className="text-5xl font-black text-white tracking-tighter leading-none">Trust Registry Matrix</p>
                    </div>
                    <div className="space-y-12 relative z-10">
                       {[
                          { label: 'Settlement Node Security', value: 'Grade-AAA' },
                          { label: 'Authorized Sync Speed', value: '< 18 Hours' },
                          { label: 'Identity Verification', value: '100% Audit' }
                       ].map((item) => (
                          <div key={item.label} className="flex justify-between items-center pb-10 border-b border-white/5 group/manifest-row">
                             <span className="text-base font-bold text-slate-500 uppercase tracking-[0.2em] group-hover/manifest-row:text-primary transition-colors duration-700 leading-none">{item.label}</span>
                             <span className="text-2xl font-black text-white uppercase tracking-[0.2em] leading-none">{item.value}</span>
                          </div>
                       ))}
                    </div>
                    <div className="pt-10 flex items-center gap-8 text-primary relative z-10 group/video-trigger cursor-pointer">
                       <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 group-hover/video-trigger:bg-primary group-hover/video-trigger:text-white group-hover/video-trigger:shadow-[0_0_50px_rgba(0,166,81,0.5)] transition-all duration-[1000ms]">
                          <PlayCircle className="w-10 h-10" />
                       </div>
                       <div className="space-y-1">
                          <span className="text-[12px] font-bold uppercase tracking-[0.4em] leading-none block">Authorized Protocol Overview</span>
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">Encrypted Stream Active</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Global Hub Footer Terminal Registry */}
        <footer className="bg-white pt-40 pb-24 border-t border-slate-100 relative overflow-hidden group/footer">
           <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <div className="grid md:grid-cols-4 gap-24 mb-40">
                 <div className="col-span-2 space-y-16">
                    <div className="space-y-8">
                       <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none group-hover/footer:text-primary transition-colors duration-1000">AgroDirect Hub.</h3>
                       <p className="text-2xl text-slate-500 font-medium max-w-xl leading-relaxed opacity-80 border-l-2 border-slate-100 pl-10">
                          Nigeria's authorized agricultural exchange platform for high-velocity institutional procurement and verified producer node networks.
                       </p>
                    </div>
                    <div className="flex items-center gap-12 text-slate-200">
                       <Monitor className="w-8 h-8 hover:text-primary cursor-pointer transition-all duration-700 hover:scale-125" />
                       <Smartphone className="w-8 h-8 hover:text-primary cursor-pointer transition-all duration-700 hover:scale-125" />
                       <Globe className="w-8 h-8 hover:text-primary cursor-pointer transition-all duration-700 hover:scale-125" />
                       <LayoutGrid className="w-8 h-8 hover:text-primary cursor-pointer transition-all duration-700 hover:scale-125" />
                       <Activity className="w-8 h-8 hover:text-primary cursor-pointer transition-all duration-700 hover:scale-125" />
                    </div>
                 </div>
                 <div className="space-y-12">
                    <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.4em] leading-none">Trade Terminal Hub</p>
                    <div className="flex flex-col gap-8 text-[13px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                       <Link to="/marketplace" className="hover:text-primary transition-all duration-700 hover:translate-x-4">Commodity Assets</Link>
                       <Link to="/signup" className="hover:text-primary transition-all duration-700 hover:translate-x-4">Onboarding Hub Node</Link>
                       <Link to="/login" className="hover:text-primary transition-all duration-700 hover:translate-x-4">Secure Authorization</Link>
                       <Link to="/about" className="hover:text-primary transition-all duration-700 hover:translate-x-4">Protocol Specs v4.2</Link>
                    </div>
                 </div>
                 <div className="space-y-12">
                    <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.4em] leading-none">Support Hub Node</p>
                    <div className="flex flex-col gap-8 text-[13px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                       <span className="hover:text-primary cursor-pointer transition-all duration-700 hover:translate-x-4">Fulfillment Hub Desk</span>
                       <span className="hover:text-primary cursor-pointer transition-all duration-700 hover:translate-x-4">Settlement Support Hub</span>
                       <span className="hover:text-primary cursor-pointer transition-all duration-700 hover:translate-x-4">Logistics Matrix API</span>
                       <span className="hover:text-primary cursor-pointer transition-all duration-700 hover:translate-x-4">Security Audit Ledger</span>
                    </div>
                 </div>
              </div>
              <div className="pt-24 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-16">
                 <div className="flex items-center gap-10">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-2xl">
                       <Zap className="w-6 h-6 shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em]">© 2024 AGRODIRECT EXCHANGE HUB • AUTHORIZED INSTITUTIONAL ACCESS ONLY</p>
                 </div>
                 <div className="flex items-center gap-16 text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                    <span className="hover:text-slate-900 cursor-pointer transition-colors duration-700">Protocol Terms</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors duration-700">Data Manifest Hub</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors duration-700">Node Compliance Audit</span>
                 </div>
              </div>
           </div>
           
           {/* Final Institutional Decoration Sync Nodes */}
           <div className="absolute bottom-0 right-0 p-24 opacity-[0.02] flex gap-12 pointer-events-none">
              <Database className="w-16 h-16" />
              <Globe className="w-16 h-16" />
              <Monitor className="w-16 h-16" />
           </div>
        </footer>
      </div>
    </MainLayout>
  );
};

export default HomePage;
