import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { Leaf, ArrowRight, Sparkles, CheckCircle, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

import { productsAPI, statsAPI } from '@/services/api';

const StatCounter = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = React.useState(0);

  const displaySuffix = suffix || (typeof end === 'string' ? end.replace(/[0-9.₦,]/g, '') : '');
  const displayPrefix = prefix || (typeof end === 'string' ? (end.startsWith('₦') ? '₦' : '') : '');

  React.useEffect(() => {
    let start = 0;
    const endValue = typeof end === 'string' 
      ? parseFloat(end.replace(/[^0-9.]/g, '')) 
      : end;
    
    const increment = endValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  if (count >= parseFloat(String(end).replace(/[^0-9.]/g, ''))) {
    return <span>{end}</span>;
  }

  return (
    <span>
      {displayPrefix}
      {count.toLocaleString()}
      {displaySuffix}
    </span>
  );
};

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
      {/* Professional Hero Section - Split Grid */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-6">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Nigeria's Verified Agricultural Network</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-6">
                Trade Fresh Produce <br />
                <span className="text-primary">Directly from the Source</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect with trusted local farmers, bargain in real-time, and secure your trades with our integrated escrow system. Simple, professional, and secure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/marketplace">
                  <Button size="lg" className="h-14 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
                    Explore Marketplace <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="lg" className="h-14 px-8 rounded-xl font-bold border-2">
                    Become a Seller
                  </Button>
                </Link>
              </div>
              
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t border-border pt-8">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {!loading && <StatCounter end={statsData?.farmers || '1.2k+'} />}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Farmers</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {!loading && <StatCounter end={statsData?.volume || '₦10M+'} />}
                  </p>
                  <p className="text-sm text-muted-foreground">Trade Volume</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-2xl lg:max-w-none mx-auto">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-border bg-card">
                <img 
                  src="/hero-farming.png" 
                  alt="Quality Nigerian Produce" 
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute top-4 right-4 glass-premium px-4 py-2 rounded-xl flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-xs font-bold text-foreground">Live Prices</span>
                </div>
              </div>
              {/* Subtle background decoration - no blobs */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Direct Sourcing', desc: 'Eliminate middlemen and buy directly from confirmed local farmers at fair market prices.' },
              { icon: MessageSquare, title: 'Real-time Negotiation', desc: 'Securely chat with sellers to negotiate prices, discuss delivery, and see live produce media.' },
              { icon: ShieldCheck, title: 'Escrow Security', desc: 'Your payments are held securely until you confirm receipt of quality produce as described.' },
            ].map((f, i) => (
              <div key={i} className="card-premium p-8 bg-background">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Marketplace Sneak Peek */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Recently Posted Produce</h2>
              <p className="text-muted-foreground">Fresh items from our verified sellers across Nigeria.</p>
            </div>
            <Link to="/marketplace">
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5">
                View Full Market <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse card-premium overflow-hidden">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-6 bg-muted rounded-lg w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              products.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>
      </section>

      {/* Concise AI Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-foreground rounded-[2rem] p-8 lg:p-16 relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-3/5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-6">
                  <Sparkles className="w-4 h-4" />
                  AGROBOT AI ASSISTANT
                </div>
                <h3 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Your Smart Companion for <br />
                  Market Intelligence
                </h3>
                <p className="text-white/70 text-base lg:text-lg mb-10 max-w-xl">
                  Get real-time price predictions, crop management tips, and negotiation assistance powered by Llama-3.3 intelligence.
                </p>
                <Link to="/chat">
                  <Button className="h-14 px-8 bg-white text-foreground hover:bg-white/90 rounded-xl font-bold">
                    Start Chatting with AgroBot
                  </Button>
                </Link>
              </div>
              <div className="lg:w-2/5 w-full">
                <div className="glass-premium border-white/10 bg-white/5 p-6 rounded-2xl">
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                      <Sparkles className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">AgroBot</p>
                      <p className="text-primary text-[10px] font-bold uppercase">Price Helper</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/5 p-3 rounded-xl rounded-tl-none border border-white/5">
                      <p className="text-white/80 text-xs italic">"Market analysis shows tomato prices in Ibadan are trending upwards. Best time to sell would be tomorrow morning."</p>
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
