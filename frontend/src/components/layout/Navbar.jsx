import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, ShoppingCart, MessageCircle, User, X, Menu, Sparkles, LogOut, Settings, LayoutDashboard, Database, ShieldCheck, Globe, Activity, Smartphone, Monitor, ChevronDown, Bell, Search, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = isAuthenticated
    ? user?.role === 'farmer'
      ? [
          { href: '/farmer/dashboard', label: 'Console Hub', icon: LayoutDashboard },
          { href: '/farmer/products', label: 'Asset Ledger', icon: Database },
          { href: '/farmer/orders', label: 'Trade Manifests', icon: FileText },
          { href: '/chat', label: 'Sync Terminal', icon: MessageCircle },
        ]
      : [
          { href: '/marketplace', label: 'Asset Exchange', icon: Globe },
          { href: '/orders', label: 'Procurement Ledger', icon: FileText },
          { href: '/chat', label: 'Sync Terminal', icon: MessageCircle },
        ]
    : [
        { href: '/marketplace', label: 'Discovery Hub', icon: Search },
        { href: '/about', label: 'Protocol Specs', icon: ShieldCheck },
      ];

  return (
    <header className={cn(
      "sticky top-0 z-[100] transition-all duration-700",
      scrolled 
        ? "bg-white/95 backdrop-blur-3xl border-b border-slate-200/60 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] py-4" 
        : "bg-white border-b border-slate-100 py-6"
    )}>
      <nav className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        {/* Institutional Logo Registry */}
        <Link to="/" className="flex items-center gap-4 group/logo">
          <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] border border-slate-800 transition-all duration-700 group-hover/logo:scale-110 group-hover/logo:rotate-12">
            <Leaf className="w-7 h-7 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
          </div>
          <div className="flex flex-col">
             <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
               Agro<span className="text-primary italic">Direct</span>
             </span>
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none mt-1">Authorized Exchange Hub</span>
          </div>
        </Link>

        {/* High-Fidelity Desktop Navigation Matrix */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3 relative group/navlink",
                isActive(link.href)
                  ? "text-primary bg-primary/5 shadow-inner"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {link.icon && <link.icon className={cn("w-4 h-4 transition-transform duration-500 group-hover/navlink:scale-110", isActive(link.href) ? "text-primary" : "text-slate-300")} />}
              {link.label}
              {isActive(link.href) && (
                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
              )}
            </Link>
          ))}
        </div>

        {/* Institutional Action Hub Group */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-100 shadow-inner group/actionhub">
                <div className="flex items-center gap-1 pr-4 border-r border-slate-200">
                   {user?.role === 'user' && (
                     <Link to="/cart" className="relative w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded-2xl transition-all duration-500 shadow-sm active:scale-90 group/cart">
                       <ShoppingCart className="w-5 h-5 group-hover/cart:scale-110 transition-transform" />
                       {itemCount > 0 && (
                         <span className="absolute -top-1 -right-1 min-w-[1.5rem] h-6 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center px-2 border-4 border-white shadow-2xl animate-pulse">
                           {itemCount}
                         </span>
                       )}
                     </Link>
                   )}
                   <Link to="/ai-assistant" className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded-2xl transition-all duration-500 shadow-sm active:scale-90 group/ai">
                     <Sparkles className="w-5 h-5 group-hover/ai:scale-110 group-hover/ai:rotate-12 transition-transform" />
                   </Link>
                   <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded-2xl transition-all duration-500 shadow-sm active:scale-90 group/notify">
                     <Bell className="w-5 h-5 group-hover/notify:scale-110 transition-transform" />
                   </button>
                </div>
                
                <Link to="/profile" className="flex items-center gap-4 pl-2 pr-6 py-2 rounded-[1.5rem] hover:bg-white transition-all duration-700 border border-transparent hover:border-slate-100 group/profilenode hover:shadow-2xl active:scale-95">
                    <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-primary font-black text-xs border border-slate-800 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.5)] group-hover/profilenode:rotate-12 transition-all duration-700">
                       {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                       <p className="text-[11px] font-black text-slate-900 leading-none mb-1.5 uppercase tracking-tighter">{user?.name?.split(' ')[0]}</p>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">{user?.role} NODE</p>
                       </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-200 group-hover/profilenode:text-slate-400 transition-colors" />
                </Link>
                
                <button onClick={logout} className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-red-500 transition-all duration-700 hover:bg-red-50 rounded-2xl active:scale-90 group/logout">
                    <LogOut className="w-4 h-4 group-hover/logout:translate-x-1 transition-transform" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/login" className="text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-all uppercase tracking-[0.4em] group/signin">
                Sign In Terminal
                <div className="h-0.5 w-0 group-hover/signin:w-full bg-primary transition-all duration-700 mt-1" />
              </Link>
              <Link to="/signup">
                <button className="h-16 px-10 rounded-2xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-[0_20px_50px_-10px_rgba(15,23,42,0.4)] border border-slate-800 active:scale-95 group/getstarted">
                  Initialize Onboarding Hub
                  <ArrowUpRight className="w-5 h-5 ml-4 inline-block group-hover/getstarted:translate-x-2 group-hover/getstarted:translate-y-[-2px] transition-transform duration-700 text-primary" />
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Institutional Mobile Terminal Toggle */}
        <button
          className="lg:hidden w-14 h-14 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 shadow-inner active:scale-90 transition-transform duration-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </nav>

      {/* Institutional Mobile Command Drawer */}
      <div className={cn(
        "fixed inset-0 z-[1000] lg:hidden transition-all duration-1000",
        isOpen ? "visible" : "invisible pointer-events-none"
      )}>
         <div className={cn(
           "absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-1000",
           isOpen ? "opacity-100" : "opacity-0"
         )} onClick={() => setIsOpen(false)} />
         
         <div className={cn(
           "absolute right-0 top-0 h-full w-[320px] bg-white p-10 shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] transition-transform duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
           isOpen ? "translate-x-0" : "translate-x-full"
         )}>
            <div className="flex items-center justify-between mb-16">
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Hub Terminal</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none mt-2">Node Sync Status: Active</span>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-14 h-14 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl shadow-inner transition-all hover:bg-white active:scale-90">
                  <X className="w-6 h-6 text-slate-400" />
               </button>
            </div>

            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-8 py-5 rounded-[1.5rem] text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-700 flex items-center gap-6 group/mobilelink",
                    isActive(link.href)
                      ? "bg-slate-900 text-white shadow-2xl"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <link.icon className={cn("w-6 h-6 transition-transform duration-700 group-hover/mobilelink:scale-125", isActive(link.href) ? "text-primary" : "text-slate-200")} />
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-16 pt-16 border-t border-slate-100 space-y-8">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner group/mobprofilenode relative overflow-hidden">
                       <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/mobprofilenode:opacity-100 transition-opacity duration-1000" />
                       <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-slate-800 text-primary font-black relative z-10 group-hover/mobprofilenode:rotate-12 transition-transform duration-1000">
                          {user?.name?.charAt(0).toUpperCase()}
                       </div>
                       <div className="relative z-10">
                          <p className="font-black text-lg text-slate-900 tracking-tighter leading-none mb-2">{user?.name}</p>
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">{user?.role} NODE</p>
                          </div>
                       </div>
                    </div>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-6 px-8 py-5 rounded-[1.5rem] text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-700">
                       <Settings className="w-6 h-6 opacity-30" />
                       <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Account Settings</span>
                    </Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center gap-6 px-8 py-5 rounded-[1.5rem] text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-700">
                       <LogOut className="w-6 h-6 opacity-30" />
                       <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Sign Out Node</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-6">
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="block">
                      <button className="w-full h-20 bg-primary text-white rounded-[1.5rem] font-bold text-lg uppercase tracking-[0.2em] shadow-[0_20px_50px_-10px_rgba(0,166,81,0.4)]">Join AgroDirect Hub</button>
                    </Link>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                      <button className="w-full h-20 bg-white border border-slate-200 text-slate-900 rounded-[1.5rem] font-bold text-lg uppercase tracking-[0.2em] shadow-xl">Sign In Terminal</button>
                    </Link>
                  </div>
                )}
                
                {/* Mobile Sync Status Widget */}
                <div className="pt-16 flex items-center justify-between opacity-10">
                   <Smartphone className="w-6 h-6" />
                   <Monitor className="w-6 h-6" />
                   <Globe className="w-6 h-6" />
                   <Activity className="w-6 h-6" />
                </div>
              </div>
            </div>
         </div>
      </div>
    </header>
  );
};

export default Navbar;
