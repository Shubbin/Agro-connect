import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ArrowRight, ShieldCheck, TrendingUp, Truck, Leaf, Users, MapPin, Search } from 'lucide-react';
import { statsAPI } from '@/services/api';

export const HomePage = () => {
  const [stats, setStats] = useState({ farmers: 0, products: 0, states: 0, volume: '₦0' });

  useEffect(() => {
    statsAPI.getSummary().then(setStats).catch(console.error);
  }, []);

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-slate-50 min-h-screen">
        {/* B2B Hero Section */}
        <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden bg-white border-b border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  Institutional Trade Registry
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                  Direct Agricultural <br />
                  <span className="text-primary">Commodity Exchange</span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Bypass speculative intermediaries. Access verified local agricultural producer nodes, secure cold-chain distribution networks, and audited trade escrow settlement protocols across Nigeria.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link to="/marketplace" className="w-full sm:w-auto">
                    <button className="w-full h-12 px-6 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/95 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95">
                      Enter Sourcing Hub
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link to="/signup" className="w-full sm:w-auto">
                    <button className="w-full h-12 px-6 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm">
                      Onboard Producer Node
                    </button>
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
                 <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                    <img 
                       src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2045&auto=format&fit=crop" 
                       alt="Agricultural commodities" 
                       className="w-full aspect-video lg:aspect-[4/3] object-cover"
                    />
                 </div>
                 
                 {/* Premium Trust Badge */}
                 <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                       <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Settlement Protocol</p>
                       <p className="text-sm font-extrabold text-slate-900">Escrow Audited</p>
                    </div>
                 </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* High-Density Stats Matrix */}
        <section className="py-12 bg-white border-b border-slate-200">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Verified Hub Nodes', value: stats.farmers || '2.4k', icon: Users },
                  { label: 'Authorized Assets', value: stats.products || '8.1k', icon: Leaf },
                  { label: 'Audited Trade Volume', value: stats.volume || '₦1.2B+', icon: TrendingUp },
                  { label: 'States Synchronized', value: stats.states || '18', icon: MapPin },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:bg-slate-900 hover:text-white transition-all group duration-300">
                     <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                       <stat.icon className="w-5 h-5" />
                     </div>
                     <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-300">{stat.label}</p>
                        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 group-hover:text-white">{stat.value}</p>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* Institutional Core Modules */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">Sourcing Standards</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Institutional Trading Safeguards</h2>
              <p className="text-sm text-slate-500 leading-relaxed font-semibold">
                Agro-Connect deploys three core sovereign layers to secure decentralized commodity exchange.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Secure Settlement Escrow',
                  icon: ShieldCheck,
                  desc: 'All trade payments remain fully locked in monitored bank-level escrow accounts until procurement delivery manifests are verified by buyers.',
                },
                {
                  title: 'Verified Producer Registry',
                  icon: Users,
                  desc: 'Every farmer node is rigorously audited via physical and biometric verification protocols, guaranteeing trace authenticity and grade standard specifications.',
                },
                {
                  title: 'Synchronized Regional Logistics',
                  icon: Truck,
                  desc: 'Integrated with verified logistics partners to ensure cold-chain and dry transport dispatch is tracked from the farming node directly to your warehouse.',
                },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-xl bg-white border border-slate-200 hover:border-primary/20 transition-all duration-300 shadow-sm flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      {feature.desc}
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <span className="text-[9px] font-bold uppercase text-primary tracking-wider">Protocol Active</span>
                     <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Professional Call to Action */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.03] bg-[url('https://images.unsplash.com/photo-1495107333309-f0675bc155f8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay pointer-events-none" />
           
           <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center space-y-8">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Trade Operations Gateway</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                 Access the Trade Registry
              </h2>
              <p className="text-sm sm:text-base text-slate-400 font-semibold max-w-2xl mx-auto leading-relaxed">
                 Initialize corporate onboarding or browse active agricultural commodity listings in our verified central registry today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                 <Link to="/signup" className="w-full sm:w-auto">
                    <button className="w-full h-11 px-6 rounded-lg bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-primary/95 transition-all active:scale-95 shadow-lg shadow-primary/10">
                       Create Escrow Account
                    </button>
                 </Link>
                 <Link to="/marketplace" className="w-full sm:w-auto">
                    <button className="w-full h-11 px-6 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2 active:scale-95">
                       <Search className="w-4 h-4 text-primary" /> Browse Registry
                    </button>
                 </Link>
              </div>
           </div>
        </section>

        {/* Global Footer */}
        <footer className="bg-white py-12 border-t border-slate-200">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                 <div className="col-span-2 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                         <Leaf className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-bold text-slate-900">Agro-Connect</span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold max-w-xs leading-relaxed">
                       Sovereign B2B procurement network for verified agricultural producers, cold-chain distribution pipelines, and escrow-guaranteed financial settlements.
                    </p>
                 </div>
                 
                 <div>
                    <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">Commodities Registry</h4>
                    <ul className="space-y-2 text-xs text-slate-500 font-semibold">
                       <li><Link to="/marketplace" className="hover:text-primary transition-colors">Direct Sourcing</Link></li>
                       <li><Link to="/signup" className="hover:text-primary transition-colors">Onboard Node</Link></li>
                       <li><Link to="/login" className="hover:text-primary transition-colors">Secure Authentication</Link></li>
                    </ul>
                 </div>
                 
                 <div>
                    <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">Support Desk</h4>
                    <ul className="space-y-2 text-xs text-slate-500 font-semibold">
                       <li><a href="#" className="hover:text-primary transition-colors">Fulfillment Support</a></li>
                       <li><a href="#" className="hover:text-primary transition-colors">Escrow Protocols</a></li>
                       <li><a href="#" className="hover:text-primary transition-colors">Regional Hub Logistics</a></li>
                    </ul>
                 </div>
              </div>
              
              <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                 <p>© 2026 Agro-Connect Exchange Hub. All authorized rights reserved.</p>
                 <div className="flex gap-4">
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Registry Protocols</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Data Privacy</span>
                 </div>
              </div>
           </div>
        </footer>
      </div>
    </MainLayout>
  );
};

export default HomePage;
