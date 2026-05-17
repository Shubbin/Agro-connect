import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram, MapPin, Phone, Mail, Linkedin, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-slate-900">Agro-Connect</span>
            </Link>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed max-w-sm">
              We connect local farmers directly with business buyers across Nigeria. Get secure payments, trusted deliveries, and fair prices for everyone.
            </p>
            <div className="flex items-center gap-4 text-slate-400 pt-2">
              {[Facebook, Twitter, Linkedin, Instagram].map((SocialIcon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                  <SocialIcon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-2">Quick Links</h4>
            <div className="flex flex-col gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Link to="/marketplace" className="hover:text-primary transition-colors">Browse Marketplace</Link>
              <Link to="/signup" className="hover:text-primary transition-colors">Join as Farmer</Link>
              <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
              <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-2">Our Offices</h4>
            <div className="space-y-4 text-xs font-semibold text-slate-500 leading-normal">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Victoria Island, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+234 800 AGRO HUB</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@agroconnect.ng</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <p>© 2026 AGRO-CONNECT • ALL RIGHTS RESERVED</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Payment Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
