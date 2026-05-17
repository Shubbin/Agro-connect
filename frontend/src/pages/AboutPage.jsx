import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Shield, Award, Globe, TrendingUp, Users, Target, Landmark, ShieldCheck, Database, Building2, ChevronRight, Terminal, Smartphone, Monitor, LayoutGrid, Activity, Hash, Mail, Phone } from 'lucide-react';
import { statsAPI } from '@/services/api';

const values = [
  {
    icon: Shield,
    title: 'Fair Pricing for Farmers',
    description: 'We give local farmers direct access to buyers so they get fair prices for their produce without expensive middlemen.',
  },
  {
    icon: Award,
    title: 'Safe Transactions',
    description: 'We verify all users and hold escrow payments securely to protect both agricultural buyers and sellers.',
  },
  {
    icon: Globe,
    title: 'Strengthening Local Supply',
    description: 'We optimize domestic crop logistics and distribution to support food security and growth in Nigeria.',
  },
  {
    icon: TrendingUp,
    title: 'Simple Market Insights',
    description: 'We provide clear pricing, volume, and demand data to help farmers and buyers scale their businesses easily.',
  },
];

const team = [
  {
    name: 'Adaeze Okonkwo',
    role: 'Managing Director',
    bio: 'Agricultural economist with 15 years of experience helping local farmer cooperatives and regional trade development.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
  },
  {
    name: 'Emeka Nwosu',
    role: 'Chief of Operations',
    bio: 'Logistics specialist focused on national cold-chain transport, warehouse storage, and safe regional crop delivery.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
  },
  {
    name: 'Fatima Abdullahi',
    role: 'Stakeholder Relations Manager',
    bio: 'Dedicated manager handling direct engagement with farming unions, cooperatives, and commercial buyer groups.',
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
      <div className="bg-slate-50 min-h-screen">
        
        {/* Mandate Header */}
        <section className="bg-white border-b border-slate-200 pt-20 pb-24 md:pt-28 md:pb-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white pointer-events-none" />
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.02] pointer-events-none -mr-24 -mt-24 group">
             <Landmark className="w-full h-full text-slate-900 rotate-12" />
          </div>
          
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="max-w-4xl space-y-8">
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                  Making Farm Trade Simple <br />
                  <span className="text-primary italic">and Safe for Everyone.</span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-500 font-semibold max-w-2xl leading-relaxed">
                  Agro-Connect connects local farmers directly with business buyers across Nigeria. We provide secure payment protection and verified delivery pathways to ensure seamless transactions.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-8 pt-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                       <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Security Standard</p>
                       <p className="text-sm font-extrabold text-slate-900 mt-1">Verified Trade Integrity</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                       <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Payment Flow</p>
                       <p className="text-sm font-extrabold text-slate-900 mt-1">Secure Escrow Protection</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Architecture Matrix */}
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Helping Farmers and Buyers Succeed.</h2>
                  
                  <div className="space-y-6 text-sm text-slate-500 leading-relaxed font-semibold">
                    <p>
                      We believe in building open, trusted, and efficient farm-to-table supply chains. By helping buyers connect directly with verified local farmers, we ensure better profit margins for producers and reliable product volumes for commercial companies.
                    </p>
                    <blockquote className="border-l-4 border-primary pl-6 py-4 italic text-slate-950 font-bold text-lg bg-white shadow-sm rounded-xl relative overflow-hidden group/quote">
                      "We are building the digital tools needed to support a highly successful, self-sufficient, and transparent agricultural market in Nigeria."
                    </blockquote>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link to="/signup" className="w-full sm:w-auto">
                    <button className="w-full h-11 px-6 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-primary/95 transition-all active:scale-95 shadow-md shadow-primary/10">
                      Join as a Partner
                    </button>
                  </Link>
                  <Link to="/marketplace" className="w-full sm:w-auto">
                    <button className="w-full h-11 px-6 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                      Browse Marketplace
                    </button>
                  </Link>
                </div>
              </div>

              {/* Stats Matrix */}
              <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group/stats">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.02] -mr-12 -mt-12 group-hover/stats:scale-110 transition-transform duration-1000">
                    <TrendingUp className="w-48 h-48 text-slate-900" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 relative z-10">
                  {[
                    { value: statsData?.farmers || '2.4k', label: 'Verified Farmers', icon: Users },
                    { value: statsData?.products || '8.1k', label: 'Products Online', icon: Database },
                    { value: statsData?.states || '18', label: 'States Reached', icon: Globe },
                    { value: statsData?.volume || '₦1.2B', label: 'Total Volume', icon: Landmark },
                  ].map((stat) => (
                    <div key={stat.label} className="space-y-4 group/item">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary border border-slate-100 group-hover/item:bg-slate-950 group-hover/item:text-primary transition-all duration-300">
                         <stat.icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover/item:translate-x-1 transition-transform duration-300">{stat.value}</p>
                         <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-2.5 text-slate-400">
                      <Terminal className="w-4 h-4 text-primary" />
                      <p className="text-[9px] font-bold uppercase tracking-wider leading-none">Market Sync: Active</p>
                   </div>
                   <div className="flex items-center gap-1.5">
                      {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,166,81,0.4)]" style={{ animationDelay: `${i * 0.2}s` }} />)}
                   </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16">
               <div className="space-y-4 max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block">Our Core Values</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Built on Trust and Quality</h2>
                  <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                    We base all our actions on keeping agricultural trading secure and fair for buyers and sellers alike.
                  </p>
               </div>
               <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0 hidden lg:flex">
                  <ShieldCheck className="w-6 h-6" />
               </div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => (
                <div key={value.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:bg-white hover:shadow-sm hover:border-primary/20 transition-all duration-300 group relative overflow-hidden">
                  <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-slate-950 group-hover:text-primary transition-all duration-300 relative z-10">
                    <value.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-3 relative z-10">
                     <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors">{value.title}</h3>
                     <p className="text-xs text-slate-500 font-semibold leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16 space-y-4">
               <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Our Core Team</h3>
               <p className="text-sm text-slate-500 font-semibold max-w-2xl mx-auto leading-relaxed">
                 We are a passionate team dedicated to agricultural supply chains, digital payments, and local crop distribution support.
               </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {team.map((member, idx) => (
                <div key={member.name} className="bg-white border border-slate-200 rounded-2xl p-8 text-center group hover:shadow-sm transition-all duration-300 relative overflow-hidden group/member">
                  <div className="relative z-10 flex flex-col h-full items-center">
                     <div className="w-28 h-28 rounded-full mb-6 overflow-hidden border-4 border-slate-50 shadow-md group-hover/member:scale-105 transition-transform duration-300">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover/member:grayscale-0 transition-all duration-300" />
                     </div>
                     <div className="space-y-2 mb-4">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover/member:text-primary transition-colors">{member.name}</h3>
                        <div className="flex items-center gap-2 justify-center">
                           <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                           <p className="text-primary text-[9px] font-bold uppercase tracking-wider leading-none">{member.role}</p>
                        </div>
                     </div>
                     <p className="text-xs text-slate-500 font-semibold leading-relaxed italic">"{member.bio}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Inquiry Terminal */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="bg-slate-950 p-10 sm:p-14 rounded-2xl text-center relative overflow-hidden shadow-sm group/cta">
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              
              <div className="relative z-10 space-y-12">
                 <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Contact Us</h2>
                    <p className="text-sm sm:text-base text-slate-400 font-semibold italic max-w-2xl mx-auto leading-relaxed">
                      "For business partnerships, bulk sales, or customer support questions, reach out directly to our friendly support team."
                    </p>
                 </div>
                 
                 <div className="grid sm:grid-cols-3 gap-8 text-white max-w-4xl mx-auto border-t border-white/5 pt-8">
                   {[
                      { icon: Building2, label: 'Main Office', value: 'Victoria Island, Lagos' },
                      { icon: Phone, label: 'Call Us Directly', value: '+234 800 AGRO HUB' },
                      { icon: Mail, label: 'Email Support', value: 'trade@agroconnect.ng' }
                   ].map((item, i) => (
                      <div key={i} className="space-y-4 group/info cursor-default">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto border border-white/10 mb-4 group-hover/info:bg-primary group-hover/info:scale-105 transition-all duration-300">
                           <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 group-hover/info:text-primary transition-colors">{item.label}</p>
                           <p className="text-sm font-bold tracking-tight opacity-90">{item.value}</p>
                        </div>
                      </div>
                   ))}
                 </div>
                 
                 <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/signup" className="w-full sm:w-auto">
                      <button className="w-full h-11 px-8 rounded-lg bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-primary/95 transition-all active:scale-95 shadow-md">
                        Create Free Account
                      </button>
                    </Link>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Footer Terminal */}
        <footer className="bg-white pt-16 pb-12 border-t border-slate-200">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                 <div className="col-span-2 space-y-6">
                    <div className="space-y-4">
                       <h3 className="text-xl font-bold text-slate-900 tracking-tight">Agro-Connect</h3>
                       <p className="text-xs text-slate-500 font-semibold max-w-md leading-relaxed">
                          We connect local crop farmers with buyers across Nigeria. Safe payments, trusted deliveries, and fair prices for everyone.
                       </p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-2">Quick Links</p>
                    <div className="flex flex-col gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                       <Link to="/marketplace" className="hover:text-primary transition-colors">Browse Marketplace</Link>
                       <Link to="/signup" className="hover:text-primary transition-colors">Join as Farmer</Link>
                       <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-2">Policies</p>
                    <div className="flex flex-col gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                       <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
                       <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
                       <span className="hover:text-primary cursor-pointer transition-colors">Payment Protection</span>
                    </div>
                 </div>
              </div>
              
              <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                 <p>© 2026 AGRO-CONNECT • ALL RIGHTS RESERVED</p>
              </div>
           </div>
        </footer>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
