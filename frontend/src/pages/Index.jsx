import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { Leaf, ArrowRight, Sparkles, CheckCircle, MessageSquare, ShieldCheck, Zap, Globe, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { productsAPI, statsAPI } from '@/services/api';

const StatItem = ({ value, label, icon: Icon }) => (
  <div className="flex flex-col items-center lg:items-start group">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-3xl font-black tracking-tighter text-foreground">{value}</span>
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-13">{label}</span>
  </div>
);

export const HomePage = () => {
  const [products, setProducts] = React.useState([]);
  const [statsData, setStatsData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, statsRes] = await Promise.all([
          productsAPI.getAll(),
          statsAPI.getSummary()
        ]);
        setProducts(productsRes.slice(0, 4));
        setStatsData(statsRes);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      {/* 
        PHASE 1: CINEMATIC HERO 
        Designed with high-density typography and massive scale.
      */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Deep ambient backgrounds */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[70%] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-accent-gold/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-center lg:text-left reveal-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary border border-primary/10 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <ShieldCheck className="w-4 h-4" />
                <span>Standard of Nigerian Excellence</span>
              </div>
              
              <h1 className="heading-hero mb-8">
                Trade <span className="text-gradient">Nature</span> <br />
                With <span className="relative inline-block">
                  Intelligence
                  <div className="absolute -bottom-2 left-0 w-full h-2 bg-accent-gold/40 -z-10 blur-sm" />
                </span>
              </h1>

              <p className="subheading mb-12 max-w-2xl mx-auto lg:mx-0">
                AgroDirect is the premium portal for verified Nigerian agriculture. 
                Sourcing fresh produce directly from farmers with the world's most 
                advanced escrow and negotiation intelligence.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-16">
                <Link to="/marketplace">
                  <button className="btn-premium h-16 px-10 text-sm">
                    Enter Marketplace <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="h-16 px-10 rounded-2xl border-2 border-border/50 font-black uppercase tracking-widest text-[10px] hover:bg-muted transition-all active:scale-95">
                    Register as Producer
                  </button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 pt-12 border-t border-border/50">
                <StatItem icon={Users} value={statsData?.farmers || '1.2k+'} label="Verified Farmers" />
                <StatItem icon={TrendingUp} value={statsData?.volume || '₦25M+'} label="Trade Volume" />
                <div className="hidden md:block">
                   <StatItem icon={Globe} value="36" label="States Covered" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative w-full group reveal-up" style={{ animationDelay: '200ms' }}>
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 glass-card">
                <img 
                  src="/hero_farming_nigeria_1778880045945.png" 
                  alt="High-end Nigerian Agriculture" 
                  className="w-full aspect-[4/5] md:aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-60" />
                
                {/* Floating UI Elements */}
                <div className="absolute top-8 right-8 glass-premium px-6 py-3 rounded-2xl flex items-center gap-3 border-white/20 animate-float">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Market Live</span>
                </div>

                <div className="absolute bottom-8 left-8 right-8 glass-premium p-6 rounded-[2rem] border-white/30 backdrop-blur-3xl">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-gold flex items-center justify-center text-accent-gold-foreground">
                         <Zap className="w-6 h-6 fill-current" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Latest Trade</p>
                         <p className="text-sm font-black text-foreground">50 Tons of Yam delivered to Lagos</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Decorative Geometric Shapes */}
              <div className="absolute -top-12 -right-12 w-48 h-48 border-[20px] border-primary/5 rounded-full -z-10 animate-float" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-accent-gold/10 rounded-[2rem] -z-10 animate-float" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* 
        PHASE 2: FEATURES - THE PILLARS OF EXCELLENCE 
      */}
      <section className="py-32 bg-secondary/50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-24 reveal-up">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Our Infrastructure</h2>
            <h3 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none mb-8">
              Engineered for <span className="text-gradient">Trust</span>
            </h3>
            <p className="subheading">
              We've combined local insights with global technology standards to create Nigeria's most robust agricultural trading engine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Leaf, title: 'Confirmed Origin', desc: 'Every product is geotagged and verified at the source, ensuring you get exactly what you see.' },
              { icon: MessageSquare, title: 'Smart Negotiation', desc: 'Bargain with farmers in real-time using our proprietary trade communication protocol.' },
              { icon: ShieldCheck, title: 'Escrow Protocol', desc: 'Funds are held in high-security vaults until both parties confirm a successful delivery.' },
            ].map((f, i) => (
              <div key={i} className="glass-card p-10 bg-white/40 border-white/50 group reveal-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-xl flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform group-hover:rotate-6">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">{f.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
                <div className="mt-8 w-12 h-1.5 bg-primary/20 rounded-full group-hover:w-24 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        PHASE 3: MARKETPLACE SNEAK PEEK 
      */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 reveal-up">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Discovery</h2>
              <h3 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none">
                Fresh From the <span className="text-gradient">Soil</span>
              </h3>
            </div>
            <Link to="/marketplace">
              <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] group">
                <span className="group-hover:text-primary transition-colors">Explore All Listings</span>
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 reveal-up">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-muted/20 rounded-[2.5rem] h-[400px]" />
              ))
            ) : (
              products.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>
      </section>

      {/* 
        PHASE 4: AGROBOT AI INTEGRATION 
        Cinematic Dark Section
      */}
      <section className="py-32 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="bg-foreground rounded-[4rem] p-12 lg:p-24 relative overflow-hidden group shadow-2xl">
            {/* Dark mode background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,0,0.2),transparent)] opacity-40" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-3/5 text-center lg:text-left reveal-up">
                <div className="inline-flex items-center gap-3 bg-white/10 text-white/90 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 backdrop-blur-md border border-white/5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AGROBOT CORE V2.0
                </div>
                <h3 className="text-5xl lg:text-8xl font-black text-white mb-10 tracking-tighter uppercase leading-[0.85]">
                  AI Powered <br />
                  <span className="text-primary">Farming</span>
                </h3>
                <p className="text-white/60 text-lg lg:text-xl mb-12 max-w-xl font-medium leading-relaxed">
                  Leverage our proprietary Llama-based intelligence for price forecasting, 
                  negotiation strategy, and multi-state crop trend analysis.
                </p>
                <Link to="/ai-assistant">
                  <button className="btn-premium h-16 px-12 bg-white text-foreground hover:scale-105 active:scale-95">
                    Access Intelligence Deck
                  </button>
                </Link>
              </div>
              
              <div className="lg:w-2/5 w-full reveal-up" style={{ animationDelay: '300ms' }}>
                <div className="glass-card border-white/10 bg-white/5 p-10 rounded-[3rem] backdrop-blur-3xl relative">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[60px]" />
                  
                  <div className="flex gap-5 mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40 animate-pulse">
                      <Sparkles className="text-white w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-white font-black uppercase text-sm tracking-tight">AgroBot</p>
                      <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">Intelligence Protocol Active</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 p-6 rounded-3xl rounded-tl-none border border-white/5">
                      <p className="text-white/80 text-sm font-medium leading-relaxed italic">
                        "Market volatility detected in Lagos yam prices. I suggest increasing stock levels now before the expected 15% price surge next week."
                      </p>
                    </div>
                    <div className="flex justify-end">
                       <div className="bg-primary/20 text-primary-light px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20">
                          Data verified from 42 hubs
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
