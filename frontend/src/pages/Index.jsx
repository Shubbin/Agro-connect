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
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 space-y-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  <Leaf className="w-4 h-4" />
                  Nigeria's Premier Agricultural Hub
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Connecting Farmers <br className="hidden lg:block" />
                  <span className="text-primary">Directly</span> with Buyers.
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                  AgroDirect makes agricultural trading easy, secure, and transparent. We connect verified local farmers directly with businesses, ensuring fair prices and reliable delivery across Nigeria.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Link to="/marketplace" className="w-full sm:w-auto">
                    <button className="w-full h-14 px-8 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-3">
                      Shop Now
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link to="/signup" className="w-full sm:w-auto">
                    <button className="w-full h-14 px-8 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
                      Join as a Farmer
                    </button>
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 w-full max-w-2xl lg:max-w-none relative">
                 <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                       src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2045&auto=format&fit=crop" 
                       alt="Farmers in the field" 
                       className="w-full aspect-video lg:aspect-square object-cover"
                    />
                 </div>
                 
                 {/* Floating badge */}
                 <div className="absolute -bottom-6 -left-6 lg:bottom-12 lg:-left-12 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-primary">
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-sm text-gray-500 font-medium">Verified by</p>
                       <p className="text-lg font-bold text-gray-900">AgroDirect</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gray-50 border-y border-gray-100">
           <div className="container mx-auto px-4 max-w-7xl">
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { label: 'Active Farmers', value: stats.farmers || '2.4k', icon: Users },
                 { label: 'Products Available', value: stats.products || '8.1k', icon: Leaf },
                 { label: 'Total Sales', value: stats.volume || '₦1.2B+', icon: TrendingUp },
                 { label: 'States Covered', value: stats.states || '18', icon: MapPin },
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                 </div>
               ))}
             </div>
           </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose AgroDirect?</h2>
              <p className="text-lg text-gray-600">
                We provide the tools and security you need to trade agricultural products with confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Secure Payments',
                  icon: ShieldCheck,
                  desc: 'Your money is safe. We hold payments securely until products are delivered and verified.',
                },
                {
                  title: 'Verified Farmers',
                  icon: Users,
                  desc: 'We verify every farmer on our platform so you always know who you are dealing with.',
                },
                {
                  title: 'Reliable Logistics',
                  icon: Truck,
                  desc: 'Track your deliveries easily. Our logistics network ensures your goods arrive on time.',
                },
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/30 transition-colors">
                  <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm mb-6">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 bg-primary relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1495107333309-f0675bc155f8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
           
           <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center space-y-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                 Ready to start trading?
              </h2>
              <p className="text-xl text-primary-foreground/90 font-medium">
                 Join thousands of farmers and buyers already using AgroDirect to grow their business.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                 <Link to="/signup">
                    <button className="w-full sm:w-auto h-14 px-10 rounded-xl bg-white text-primary font-bold text-lg hover:bg-gray-50 transition-colors">
                       Create an Account
                    </button>
                 </Link>
                 <Link to="/marketplace">
                    <button className="w-full sm:w-auto h-14 px-10 rounded-xl bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                       <Search className="w-5 h-5" /> Browse Products
                    </button>
                 </Link>
              </div>
           </div>
        </section>

        {/* Simple Footer */}
        <footer className="bg-gray-50 py-12 border-t border-gray-200">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                 <div className="col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-6 h-6 text-primary" />
                      <span className="text-xl font-bold text-gray-900">AgroDirect</span>
                    </div>
                    <p className="text-gray-500 max-w-sm">
                       Making agricultural trade easy, secure, and profitable for everyone in Nigeria.
                    </p>
                 </div>
                 
                 <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
                    <ul className="space-y-3 text-gray-500">
                       <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                       <li><Link to="/signup" className="hover:text-primary transition-colors">Register</Link></li>
                       <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
                       <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                    </ul>
                 </div>
                 
                 <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                    <ul className="space-y-3 text-gray-500">
                       <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                       <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                       <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                       <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                    </ul>
                 </div>
              </div>
              
              <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                 <p>© 2024 AgroDirect. All rights reserved.</p>
              </div>
           </div>
        </footer>
      </div>
    </MainLayout>
  );
};

export default HomePage;
