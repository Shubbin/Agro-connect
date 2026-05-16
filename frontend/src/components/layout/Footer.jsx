import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram, MapPin, Phone, Mail, Linkedin, ArrowRight, ShieldCheck, Globe, Database, Smartphone, Monitor, Activity, Landmark, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-40 pb-24 relative overflow-hidden group/footer">
       <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-4 gap-24 mb-40">
             {/* Institutional Brand Registry */}
             <div className="col-span-2 space-y-16">
                <div className="space-y-10">
                   <Link to="/" className="flex items-center gap-6 group/logo">
                      <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-[0_30px_70px_-15px_rgba(15,23,42,0.4)] border border-slate-800 transition-all duration-700 group-hover/logo:scale-110 group-hover/logo:rotate-12">
                         <Leaf className="w-9 h-9 text-primary shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none transition-colors duration-1000 group-hover/footer:text-primary">AgroDirect Hub.</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] leading-none mt-2">Authorized Exchange Hub Node</span>
                      </div>
                   </Link>
                   <p className="text-2xl text-slate-500 font-medium max-w-xl leading-relaxed opacity-80 border-l-2 border-slate-100 pl-10">
                      Nigeria's authorized agricultural exchange platform for high-velocity institutional procurement and verified producer node networks across 18 regional hubs.
                   </p>
                </div>
                <div className="flex items-center gap-12 text-slate-200">
                   {[
                      { icon: Facebook, href: '#' },
                      { icon: Twitter, href: '#' },
                      { icon: Linkedin, href: '#' },
                      { icon: Instagram, href: '#' }
                   ].map((social, i) => (
                      <a key={i} href={social.href} className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-primary hover:border-slate-800 hover:shadow-2xl hover:rotate-12 transition-all duration-700 group/social">
                         <social.icon className="w-6 h-6 transition-transform duration-700 group-hover/social:scale-110" />
                      </a>
                   ))}
                </div>
             </div>

             {/* Platform Architecture Navigation */}
             <div className="space-y-12">
                <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.4em] leading-none">Exchange Terminal</p>
                <div className="flex flex-col gap-8 text-[13px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                   {[
                      { label: 'Commodity Assets', href: '/marketplace' },
                      { label: 'Producer Onboarding', href: '/signup' },
                      { label: 'Institutional Login', href: '/login' },
                      { label: 'Protocol Specs v4.2', href: '/about' }
                   ].map((link) => (
                      <Link key={link.label} to={link.href} className="hover:text-primary transition-all duration-700 hover:translate-x-4 flex items-center gap-4 group/link">
                         {link.label}
                         <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-700" />
                      </Link>
                   ))}
                </div>
             </div>

             {/* Strategic Asset Classification */}
             <div className="space-y-12">
                <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.4em] leading-none">Commodity Manifests</p>
                <div className="flex flex-col gap-8 text-[13px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                   {[
                      { label: 'Premium Produce', query: 'produce' },
                      { label: 'Industrial Grains', query: 'grains' },
                      { label: 'Precision Tools', query: 'tools' },
                      { label: 'Heavy Machinery', query: 'equipment' }
                   ].map((link) => (
                      <Link key={link.label} to={`/marketplace?category=${link.query}`} className="hover:text-primary transition-all duration-700 hover:translate-x-4 flex items-center gap-4 group/link">
                         {link.label}
                         <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-700" />
                      </Link>
                   ))}
                </div>
             </div>

             {/* Institutional Hub HQ */}
             <div className="space-y-12">
                <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.4em] leading-none">HQ Node Terminal</p>
                <div className="flex flex-col gap-10">
                   <div className="flex items-start gap-6 group/loc">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-primary shrink-0 transition-all group-hover/loc:bg-slate-900 group-hover/loc:rotate-12 duration-700">
                         <MapPin className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                         <p className="text-[13px] font-bold text-slate-900 uppercase tracking-[0.1em] leading-none">Victoria Island Hub</p>
                         <p className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.2em] leading-relaxed">Lagos Node, Nigeria</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 group/phone">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-primary shrink-0 transition-all group-hover/phone:bg-slate-900 group-hover/phone:rotate-12 duration-700">
                         <Phone className="w-6 h-6" />
                      </div>
                      <p className="text-[13px] font-bold text-slate-900 uppercase tracking-[0.2em] leading-none">+234 (0) 800 AGRO DIRECT</p>
                   </div>
                   <div className="flex items-center gap-6 group/mail">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-primary shrink-0 transition-all group-hover/mail:bg-slate-900 group-hover/mail:rotate-12 duration-700">
                         <Mail className="w-6 h-6" />
                      </div>
                      <p className="text-[13px] font-bold text-slate-900 uppercase tracking-[0.2em] leading-none">trade@agrodirect.ng</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-24 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-16">
             <div className="flex items-center gap-10">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-2xl border border-slate-800 transition-all duration-700 hover:rotate-12">
                   <Zap className="w-7 h-7 shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                </div>
                <div className="space-y-1">
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none">© 2024 AGRODIRECT EXCHANGE HUB • AUTHORIZED ACCESS ONLY</p>
                   <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] leading-none mt-2">SEC-Compliant Institutional Trading Platform Node v4.2.0</p>
                </div>
             </div>
             <div className="flex items-center gap-12 text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                <span className="hover:text-slate-900 cursor-pointer transition-colors duration-700">Protocol Terms</span>
                <span className="hover:text-slate-900 cursor-pointer transition-colors duration-700">Data Manifest Hub</span>
                <span className="hover:text-slate-900 cursor-pointer transition-colors duration-700">Node Compliance Audit</span>
             </div>
          </div>
       </div>
       
       {/* Institutional Decoration Sync Nodes Registry */}
       <div className="absolute bottom-0 left-0 p-24 opacity-[0.02] flex flex-col gap-12 pointer-events-none group-hover/footer:opacity-[0.05] transition-opacity duration-[2000ms]">
          <div className="flex gap-12">
             <Database className="w-16 h-16" />
             <Globe className="w-16 h-16" />
          </div>
          <div className="flex gap-12 ml-8">
             <Monitor className="w-16 h-16" />
             <Smartphone className="w-16 h-16" />
          </div>
       </div>
    </footer>
  );
};

export default Footer;
