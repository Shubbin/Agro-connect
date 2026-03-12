import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { Leaf, ArrowRight, Sparkles, CheckCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

import { productsAPI, statsAPI } from '@/services/api';

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
      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background py-20 lg:py-0">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-gentle" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px] animate-pulse-gentle" />
          <div className="absolute top-[20%] left-[10%] w-24 h-24 bg-primary/10 rounded-3xl rotate-12 animate-float-gentle blur-sm" />
          <div className="absolute bottom-[20%] right-[10%] w-32 h-32 bg-accent/10 rounded-full animate-float-gentle delay-700 blur-sm" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 glass-premium px-4 py-2 rounded-full text-sm font-bold text-primary mb-8 animate-bounce-gentle">
                <Sparkles className="w-4 h-4" />
                <span>Nigeria's Most Trusted Agri-Network</span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-foreground tracking-tight leading-[0.95] mb-8">
                Harvest the<br />
                <span className="text-gradient drop-shadow-sm">Future Premium</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Direct trade between farmers and consumers. Verified quality, fair pricing, and seamless logistics across Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link to="/marketplace">
                  <Button size="xl" className="btn-premium h-16 px-12 text-lg rounded-2xl bg-primary hover:bg-primary/90">
                    Explore Marketplace <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="xl" className="h-16 px-12 text-lg rounded-2xl border-2 hover:bg-secondary/50 backdrop-blur-sm">
                    Start Selling
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 relative hidden lg:block animate-fade-in">
              <div className="relative z-10 card-premium p-4 rotate-3 hover:rotate-0 transition-all duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1595841696677-5231766a5e12?q=80&w=800" 
                  alt="Fresh farming" 
                  className="rounded-xl w-full h-[500px] object-cover"
                />
                <div className="absolute -bottom-8 -left-8 glass-premium p-6 rounded-2xl animate-float-gentle">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Verified Farmers</p>
                      <p className="text-sm text-muted-foreground">100% Quality Assurance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features Grid */}
      <section className="py-32 bg-secondary/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-6">Built for Efficiency</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Leaf, title: 'Direct Source', desc: 'Cut out middlemen and buy fresh directly from Nigerian farm gates.', color: 'bg-green-500' },
              { icon: Sparkles, title: 'AI Matching', desc: 'Our smart algorithm connects you with the best producers for your needs.', color: 'bg-blue-500' },
              { icon: MessageSquare, title: 'Live Negotation', desc: 'Securely chat and finalize deals within minutes on our platform.', color: 'bg-amber-500' },
            ].map((f, i) => (
              <div key={i} className="group card-premium p-10 text-center hover:bg-white dark:hover:bg-card">
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform", f.color + "/10")}>
                  <f.icon className={cn("w-10 h-10", "text-" + f.color.split('-')[1] + "-600")} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Marketplace Sneak Peek */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-6">Today's Top Crops</h2>
              <p className="text-lg text-muted-foreground font-medium">Freshly listed products from verified seasonal farmers across the country.</p>
            </div>
            <Link to="/marketplace">
              <Button variant="ghost" className="text-primary font-black hover:bg-primary/5 text-lg group px-0">
                Browse Full Catalog <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse card-premium overflow-hidden">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-8 bg-muted rounded-xl w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              products.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>
      </section>

      {/* AI Assistant - The Wow Factor */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[3rem] overflow-hidden bg-foreground p-12 lg:p-24 shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/20 blur-[150px] -rotate-12" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-primary-foreground font-bold mb-8">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  AI Power Active
                </div>
                <h3 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
                  Meet Your New<br />
                  <span className="text-primary">Business Partner</span>
                </h3>
                <p className="text-white/70 text-xl font-medium leading-relaxed mb-12">
                  Our advanced AI assistant analyzes market trends, suggests optimal pricing, and helps you negotiate better deals. It's like having a top-tier consultant in your pocket 24/7.
                </p>
                <Link to="/chat">
                  <Button className="btn-premium h-16 px-12 text-lg bg-white text-foreground hover:bg-white/90 rounded-2xl">
                    Try AI Assistant Now
                  </Button>
                </Link>
              </div>
              
              <div className="lg:w-1/2 h-full flex justify-center">
                <div className="relative glass-premium p-8 rounded-[2.5rem] w-full max-w-md animate-float-gentle border-white/10 bg-white/5">
                  <div className="flex gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Agro Bot</p>
                      <p className="text-primary text-xs font-black uppercase tracking-widest">Pricing Specialist</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/5">
                      <p className="text-white/90 text-sm italic">"Analyzing current tomato prices in Lagos... Market trend suggests a 15% increase next week. Ready to negotiate?"</p>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-primary/20 p-4 rounded-2xl rounded-tr-none border border-primary/20">
                        <p className="text-primary-foreground text-sm font-bold">Yes, let's optimize my listing!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-32 bg-background border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
            {[
              { val: statsData?.farmers || '1.2K+', lab: 'Active Farmers' },
              { val: statsData?.products || '500+', lab: 'Quality Crops' },
              { val: statsData?.states || '36', lab: 'States Reached' },
              { val: statsData?.volume || '₦85M+', lab: 'Total Trade' },
            ].map((s, i) => (
              <div key={i} className="group">
                <div className="text-5xl lg:text-7xl font-black text-foreground mb-4 group-hover:scale-110 transition-transform duration-500">{s.val}</div>
                <div className="text-primary font-black uppercase tracking-widest text-sm">{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;


