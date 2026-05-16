import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowRight, MapPin, Phone, Mail, Shield, Zap, TrendingUp, Users, Target, Globe, Award, ShieldCheck, Database, Landmark, Building2, ChevronRight, BarChart3, Terminal, Smartphone, Monitor, LayoutGrid, FileText, Activity, Hash } from 'lucide-react';

import { statsAPI } from '@/services/api';

const values = [
  {
    icon: Shield,
    title: 'Producer Sovereignty',
    description: 'Empowering smallholder and commercial producers with direct market access and fair pricing mechanisms for high-grade commodity assets.',
  },
  {
    icon: Award,
    title: 'Institutional Trust',
    description: 'Maintaining a rigorous verification protocol for all market participants to ensure secure settlement and procurement fidelity.',
  },
  {
    icon: Globe,
    title: 'National Resilience',
    description: 'Strengthening Nigeria’s food security by optimizing the domestic agricultural supply chain through regional hub synchronization.',
  },
  {
    icon: TrendingUp,
    title: 'Trade Intelligence',
    description: 'Leveraging real-time trade analytics to help producers scale their operations and improve institutional procurement efficiency.',
  },
];

const team = [
  {
    name: 'Adaeze Okonkwo',
    role: 'Managing Director & CEO',
    bio: 'Former agricultural economist with 15 years of experience in regional trade policy and agrarian development cycles.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
  },
  {
    name: 'Emeka Nwosu',
    role: 'Chief of Operations',
    bio: 'Logistics veteran specializing in cold-chain management and national distribution network optimization.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
  },
  {
    name: 'Fatima Abdullahi',
    role: 'Director of Stakeholder Relations',
    bio: 'Strategic lead for farmer cooperatives and institutional procurement desk engagement programs.',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1974&auto=format&fit=crop',
  },
];

export const AboutPage = () => {
  const [statsData, setStatsData] = React.useState(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsAPI.getSummary();
        setStatsData(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <MainLayout>
      <div className="bg-white min-h-screen">
        {/* Institutional Mandate Header */}
        <section className="bg-white border-b border-slate-200 pt-32 pb-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none -mr-48 -mt-48 group">
             <Landmark className="w-full h-full text-slate-900 rotate-12 transition-transform duration-1000 group-hover:scale-110" />
          </div>
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="max-w-5xl space-y-16">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-4 px-6 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(15,23,42,0.3)]">
                  <Target className="w-5 h-5 text-primary" />
                  Institutional Trade Mandate v4.2
                </div>
                <h1 className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tighter leading-[0.9] transition-all">
                  Engineering Nigeria's <br />
                  <span className="text-primary italic">Agrarian Future.</span>
                </h1>
                <p className="text-2xl md:text-3xl text-slate-500 font-medium max-w-3xl leading-relaxed opacity-80">
                  AgroDirect is a high-authority exchange architecting secure trade settlement between verified producers and industrial procurement networks across 18 regional hubs.
                </p>
              </div>
              <div className="flex flex-wrap gap-12 pt-4">
                 <div className="flex items-center gap-4 group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-2xl border border-slate-100 group-hover:scale-110 transition-transform">
                       <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none">Supply Chain Protocol</p>
                       <p className="text-lg font-bold text-slate-900 tracking-tight">Verified Trade Integrity</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-2xl border border-slate-100 group-hover:scale-110 transition-transform">
                       <Landmark className="w-7 h-7" />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none">Financial Settlement</p>
                       <p className="text-lg font-bold text-slate-900 tracking-tight">Secure Escrow Nodes</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Architecture Matrix */}
        <section className="py-52 bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-32 items-center">
              <div className="space-y-16">
                <div className="space-y-10">
                  <div className="inline-flex items-center gap-4 text-[11px] font-bold text-primary uppercase tracking-[0.3em] bg-primary/5 px-4 py-1.5 rounded-lg border border-primary/10 shadow-xl shadow-primary/5">
                     <BarChart3 className="w-5 h-5" />
                     Operational Narrative
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-tight">Catalyzing Economic <br/>Transformation.</h2>
                  <div className="space-y-10 text-slate-500 text-xl leading-relaxed font-medium opacity-80">
                    <p>
                      Our operations are governed by a commitment to direct market synchronization. By eliminating fragmented intermediary layers, we maximize capital retention for producers and ensure procurement fidelity for industrial buyers.
                    </p>
                    <blockquote className="border-l-[6px] border-primary pl-10 py-6 italic text-slate-900 font-bold text-2xl bg-white shadow-2xl rounded-3xl relative overflow-hidden group/quote">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/quote:opacity-100 transition-opacity duration-1000" />
                      <span className="relative z-10">"We are building the digital infrastructure necessary for a globally competitive and self-sufficient Nigerian agrarian economy."</span>
                    </blockquote>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-8">
                  <Link to="/signup">
                    <button className="h-20 px-12 rounded-2xl bg-primary text-white font-bold text-lg uppercase tracking-[0.2em] shadow-[0_30px_60px_-15px_rgba(0,166,81,0.4)] hover:bg-primary/90 transition-all flex items-center justify-center gap-6 active:scale-95 group">
                      Onboard as Partner
                      <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </button>
                  </Link>
                  <Link to="/marketplace">
                    <button className="h-20 px-12 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-lg uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-2xl active:scale-95">
                      Market Discovery
                    </button>
                  </Link>
                </div>
              </div>

              {/* Data Audit Matrix */}
              <div className="bg-white p-20 rounded-[4rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] relative overflow-hidden group/stats">
                 <div className="absolute top-0 right-0 p-20 opacity-[0.03] -mr-24 -mt-24 group-hover/stats:scale-110 transition-transform duration-1000">
                    <TrendingUp className="w-96 h-96 text-slate-900" />
                 </div>
                 <div className="grid grid-cols-2 gap-16 relative z-10">
                  {[
                    { value: statsData?.farmers || '2.4k', label: 'Verified Hub Nodes', icon: Users },
                    { value: statsData?.products || '8.1k', label: 'Authorized Assets', icon: Database },
                    { value: statsData?.states || '18', label: 'Regional Logistics', icon: Globe },
                    { value: statsData?.volume || '₦1.2B', label: 'Gross Settlement', icon: Landmark },
                  ].map((stat) => (
                    <div key={stat.label} className="space-y-6 group/item">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-slate-100 group-hover/item:bg-slate-900 group-hover/item:text-primary transition-all duration-500">
                         <stat.icon className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                         <p className="text-5xl font-bold text-slate-900 tracking-tighter group-hover/item:translate-x-2 transition-transform duration-500">{stat.value}</p>
                         <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 leading-none group-hover/item:text-slate-600 transition-colors">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-20 pt-10 border-t border-slate-50 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-4 text-slate-400">
                      <Terminal className="w-5 h-5 text-primary" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] leading-none">Registry Synchronized: Q2 2026 CYCLE</p>
                   </div>
                   <div className="flex items-center gap-2">
                      {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,166,81,0.5)]" style={{ animationDelay: `${i * 0.2}s` }} />)}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Operational Principles */}
        <section className="py-60 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-16 mb-40">
               <div className="space-y-10 max-w-4xl text-center lg:text-left mx-auto lg:mx-0">
                  <h2 className="text-[11px] font-bold text-primary uppercase tracking-[0.4em] mb-4">Trade Ethics & Principles</h2>
                  <h3 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-tight">Governing Trade Ethics.</h3>
                  <p className="text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed opacity-80">
                    Our operational framework is built on institutional transparency and the optimization of domestic agricultural capital manifests.
                  </p>
               </div>
               <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-primary shadow-2xl shrink-0 hidden lg:flex">
                  <ShieldCheck className="w-10 h-10" />
               </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {values.map((value, idx) => (
                <div key={value.title} className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-12 hover:bg-white hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)] hover:border-primary/20 transition-all duration-1000 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                  <div className="w-20 h-20 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-12 shadow-xl group-hover:bg-slate-900 group-hover:text-primary transition-all duration-700 relative z-10">
                    <value.icon className="w-10 h-10" />
                  </div>
                  <div className="space-y-6 relative z-10">
                     <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors">{value.title}</h3>
                     <p className="text-lg text-slate-500 font-medium leading-relaxed opacity-80">{value.description}</p>
                  </div>
                  <div className="pt-10 flex items-center justify-between relative z-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                     <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Protocol Specs</span>
                     <ChevronRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Leadership Registry */}
        <section className="py-60 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-40 space-y-10">
               <div className="inline-flex items-center gap-4 px-6 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-2xl">
                  <Users className="w-5 h-5 text-primary" />
                  Leadership Portfolio
               </div>
               <h3 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-tight">Board of Governance.</h3>
               <p className="text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed opacity-80">
                 AgroDirect is led by a multi-disciplinary team with expertise across agricultural economics, global logistics hubs, and national trade policy.
               </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-16 max-w-7xl mx-auto">
              {team.map((member, idx) => (
                <div key={member.name} className="bg-white border border-slate-200 rounded-[3rem] p-14 text-center group hover:shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] transition-all duration-1000 relative overflow-hidden group/member">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/member:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full items-center">
                     <div className="w-48 h-48 rounded-[2.5rem] mb-12 overflow-hidden border-[12px] border-slate-50 shadow-2xl group-hover/member:scale-110 group-hover/member:rotate-3 transition-all duration-1000">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover/member:grayscale-0 transition-all duration-1000" />
                     </div>
                     <div className="space-y-3 mb-8">
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tighter group-hover/member:text-primary transition-colors">{member.name}</h3>
                        <div className="flex items-center gap-3 justify-center">
                           <div className="w-2 h-2 bg-primary rounded-full" />
                           <p className="text-primary text-[11px] font-bold uppercase tracking-[0.3em] leading-none">{member.role}</p>
                        </div>
                     </div>
                     <p className="text-base text-slate-500 font-medium leading-relaxed opacity-80 italic">"{member.bio}"</p>
                     <div className="mt-12 flex items-center gap-6 opacity-0 group-hover/member:opacity-100 translate-y-6 group-hover/member:translate-y-0 transition-all duration-1000">
                        <Hash className="w-6 h-6 text-slate-200" />
                        <Activity className="w-6 h-6 text-slate-200" />
                        <ShieldCheck className="w-6 h-6 text-slate-200" />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Institutional Inquiry Terminal */}
        <section className="py-60 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="bg-slate-900 p-32 rounded-[4rem] text-center relative overflow-hidden shadow-[0_60px_150px_-30px_rgba(15,23,42,0.5)] group/cta">
              <div className="absolute inset-0 bg-primary/5 pointer-events-none group-hover/cta:bg-primary/10 transition-colors duration-1000" />
              <div className="absolute top-0 right-0 p-32 opacity-[0.03] rotate-12 -mr-48 -mt-48 pointer-events-none group-hover/cta:scale-110 transition-transform duration-[2000ms]">
                 <Globe className="w-[800px] h-[800px] text-white" />
              </div>
              
              <div className="relative z-10 space-y-24">
                 <div className="space-y-8">
                    <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-none">Institutional Inquiries.</h2>
                    <p className="text-2xl text-slate-400 font-medium italic max-w-3xl mx-auto leading-relaxed opacity-80">
                      "For corporate partnerships, bulk procurement manifests, or regional stakeholder engagement, please synchronize with our institutional trade desk."
                    </p>
                 </div>
                 
                 <div className="grid sm:grid-cols-3 gap-16 text-white max-w-5xl mx-auto">
                   {[
                      { icon: Building2, label: 'Corporate HQ Hub', value: 'Victoria Island, Lagos' },
                      { icon: Phone, label: 'Global Trade Terminal', value: '+234 800 AGRO HUB' },
                      { icon: Mail, label: 'Direct Synchronization', value: 'trade@agrodirect.ng' }
                   ].map((item, i) => (
                      <div key={i} className="space-y-6 group/info cursor-default">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 mb-8 group-hover/info:bg-primary group-hover/info:scale-110 transition-all duration-700 shadow-2xl">
                           <item.icon className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-2">
                           <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500 group-hover/info:text-primary transition-colors">{item.label}</p>
                           <p className="text-xl font-bold tracking-tight opacity-90">{item.value}</p>
                        </div>
                      </div>
                   ))}
                 </div>
                 
                 <div className="pt-16 flex flex-col sm:flex-row gap-8 justify-center">
                    <Link to="/signup">
                      <button className="h-24 px-16 rounded-2xl bg-primary text-white font-bold text-xl uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-6 mx-auto sm:mx-0 group/final">
                        Initialize Onboarding Hub
                        <ArrowRight className="w-8 h-8 transition-transform group-hover/final:translate-x-3" />
                      </button>
                    </Link>
                    <button className="h-24 px-16 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all shadow-2xl backdrop-blur-xl">
                       Request Corporate Portfolio Brief
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Footer Terminal */}
        <footer className="bg-white pt-40 pb-24 border-t border-slate-100">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid md:grid-cols-4 gap-32 mb-40">
                 <div className="col-span-2 space-y-16">
                    <div className="space-y-8">
                       <h3 className="text-4xl font-bold text-slate-900 tracking-tighter">AgroDirect Hub</h3>
                       <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed opacity-80">
                          Nigeria's authorized agricultural exchange platform for institutional procurement and verified producer networks. Architecting the future of agrarian trade.
                       </p>
                    </div>
                    <div className="flex items-center gap-12 text-slate-400">
                       <Monitor className="w-8 h-8 hover:text-primary cursor-pointer transition-colors" />
                       <Smartphone className="w-8 h-8 hover:text-primary cursor-pointer transition-colors" />
                       <Globe className="w-8 h-8 hover:text-primary cursor-pointer transition-colors" />
                       <LayoutGrid className="w-8 h-8 hover:text-primary cursor-pointer transition-colors" />
                    </div>
                 </div>
                 <div className="space-y-10">
                    <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.4em] border-b border-slate-50 pb-6">Trade Terminal</p>
                    <div className="flex flex-col gap-6 text-[13px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                       <Link to="/marketplace" className="hover:text-primary transition-colors">Commodity Hubs</Link>
                       <Link to="/signup" className="hover:text-primary transition-colors">Onboarding Node</Link>
                       <Link to="/login" className="hover:text-primary transition-colors">Secure Hub Access</Link>
                       <Link to="/about" className="hover:text-primary transition-colors">Mandate Specs</Link>
                    </div>
                 </div>
                 <div className="space-y-10">
                    <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.4em] border-b border-slate-50 pb-6">Support Terminal</p>
                    <div className="flex flex-col gap-6 text-[13px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                       <span className="hover:text-primary cursor-pointer transition-colors">Fulfillment Desk</span>
                       <span className="hover:text-primary cursor-pointer transition-colors">Settlement Logic</span>
                       <span className="hover:text-primary cursor-pointer transition-colors">Logistics Hub API</span>
                       <span className="hover:text-primary cursor-pointer transition-colors">Security Audit Node</span>
                    </div>
                 </div>
              </div>
              <div className="pt-24 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-16">
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em]">© 2024 AGRODIRECT EXCHANGE HUB • ALL AUTHORIZED RIGHTS RESERVED</p>
                 <div className="flex items-center gap-16 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Protocol Terms</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Data Manifest</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Compliance Nodes</span>
                 </div>
              </div>
           </div>
        </footer>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
