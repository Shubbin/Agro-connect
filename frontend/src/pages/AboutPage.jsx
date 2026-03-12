import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowRight, MapPin, Phone, Mail, Shield, Zap, TrendingUp, Users } from 'lucide-react';

import { statsAPI } from '@/services/api';

const values = [
  {
    icon: Shield,
    title: 'Farmer First',
    description: 'We put farmers at the heart of everything we do, ensuring they get fair prices and direct access to buyers.',
  },
  {
    icon: Zap,
    title: 'Trust & Transparency',
    description: 'Every farmer is verified, every transaction is secure, and every price is transparent.',
  },
  {
    icon: TrendingUp,
    title: 'Local Impact',
    description: 'By connecting local farmers with local buyers, we strengthen Nigerian agriculture and communities.',
  },
  {
    icon: Users,
    title: 'Growth Together',
    description: 'We help farmers grow their businesses with AI-powered insights and business tools.',
  },
];

const team = [
  {
    name: 'Adaeze Okonkwo',
    role: 'Founder & CEO',
    bio: 'Former agricultural economist with 10 years of experience in Nigerian farming communities.',
    image: '/placeholder.svg',
  },
  {
    name: 'Emeka Nwosu',
    role: 'Head of Operations',
    bio: 'Supply chain expert who has worked with major food distributors across West Africa.',
    image: '/placeholder.svg',
  },
  {
    name: 'Fatima Abdullahi',
    role: 'Head of Farmer Relations',
    bio: 'Born into a farming family, Fatima brings deep understanding of farmer needs.',
    image: '/placeholder.svg',
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
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        {/* Ambient background effect */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-premium border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-xl shadow-primary/5">
                <Leaf className="w-3.5 h-3.5" />
                Our Mission
              </div>
              <h1 className="text-6xl lg:text-9xl font-black text-foreground tracking-tighter leading-[0.85] uppercase">
                Direct <span className="text-gradient">Agricultural</span> Synchronization
              </h1>
              <p className="text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                Architecting the future of Nigerian agro-trade through direct farmer-to-market connectivity and transparent capital cycles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Logic */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div>
                <h2 className="text-5xl font-black text-foreground tracking-tighter mb-8 uppercase">The Mission</h2>
                <p className="text-2xl text-foreground font-bold leading-snug mb-8">
                  Helping Nigerian farmers by removing middlemen and giving them direct access to the market.
                </p>
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed font-medium italic border-l-4 border-primary/20 pl-8">
                  <p>
                    We believe architectural transparency is the catalyst for agricultural evolution. By enabling direct trade pipelines, we are optimizing value distribution and securing the food supply chain.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/signup">
                  <Button size="xl" className="rounded-2xl btn-premium px-10 h-16 text-lg font-black tracking-tight">
                    Join Us
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline" size="xl" className="rounded-2xl border-border/50 h-16 px-10 text-lg font-black tracking-tight hover:bg-white transition-all">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>

            <div className="glass-premium p-12 rounded-[4rem] border-primary/10 relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '200ms' }}>
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <TrendingUp className="w-64 h-64 text-primary" />
               </div>
               <div className="grid grid-cols-2 gap-12 relative z-10">
                {[
                  { value: statsData?.farmers || '0', label: 'Farmers' },
                  { value: statsData?.products || '0', label: 'Products' },
                  { value: statsData?.states || '0', label: 'Locations' },
                  { value: statsData?.volume || '₦0', label: 'Total Sales' },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <p className="text-4xl lg:text-5xl font-black text-gradient tracking-tighter">{stat.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophies */}
      <section className="py-32 bg-secondary/20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase mb-6">Our Values</h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              The rules we live by to help farmers and buyers succeed.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={value.title} className="glass-premium border-border/50 rounded-[2.5rem] p-10 group hover:border-primary/50 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight mb-4 uppercase">{value.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border/20 -z-10 hidden md:block" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-24 animate-fade-in">
            <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase mb-6">How it Works</h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              How it works for everyone.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-16 relative">
            {[
              {
                step: '01',
                title: 'Sign Up',
                description: 'Create your account as either a Farmer or a Buyer.',
              },
              {
                step: '02',
                title: 'Browse & Order',
                description: 'Find products you need, place your order, and chat with the farmer.',
              },
              {
                step: '03',
                title: 'Payment & Delivery',
                description: 'Pay securely and get your farm products delivered to you.',
              },
            ].map((item, idx) => (
              <div key={item.step} className="text-center group animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="w-20 h-20 glass-premium bg-white border-primary/20 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-2xl font-black shadow-2xl shadow-primary/10 group-hover:scale-110 transition-all">
                  {item.step}
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight mb-4 uppercase">{item.title}</h3>
                <p className="text-muted-foreground font-medium text-lg px-4">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Administrative Visionaries */}
      <section className="py-32 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase mb-6">Our Team</h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              The people building the future of Nigerian farming.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {team.map((member, idx) => (
              <div key={member.name} className="glass-premium border-border/50 rounded-[3rem] p-10 text-center group hover:border-primary/50 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="w-32 h-32 bg-secondary/50 rounded-[2.5rem] mx-auto mb-8 overflow-hidden p-1">
                   <div className="w-full h-full rounded-[2.2rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                      />
                   </div>
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tighter mb-1">{member.name}</h3>
                <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-6">{member.role}</p>
                <p className="text-muted-foreground font-medium leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal Communication */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto glass-premium p-16 rounded-[4rem] border-primary/20 text-center relative overflow-hidden shadow-2xl shadow-primary/5 animate-fade-in-up">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            
            <h2 className="text-5xl font-black text-foreground tracking-tighter mb-6 uppercase">Contact Us</h2>
            <p className="text-xl text-muted-foreground font-medium mb-16 italic">
              Get in touch with us for any questions or partnerships.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-12 mb-16">
              <div className="flex flex-col items-center gap-4 group">
                <div className="w-16 h-16 glass-premium bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-lg">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Global HQ</p>
                   <p className="text-lg font-bold text-foreground">Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 group">
                <div className="w-16 h-16 glass-premium bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-lg">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Voice Uplink</p>
                   <p className="text-lg font-bold text-foreground">+234 800 123 4567</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 group">
                <div className="w-16 h-16 glass-premium bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-lg">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Secure Mail</p>
                   <p className="text-lg font-bold text-foreground">hello@agrodirect.ng</p>
                </div>
              </div>
            </div>
            
            <Link to="/signup">
              <Button size="xl" className="rounded-2xl btn-premium h-20 px-12 text-xl font-black tracking-tight shadow-xl shadow-primary/20">
                Join the Platform
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
