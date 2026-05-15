import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, ShoppingCart, MessageCircle, User, X, Menu, Sparkles, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = isAuthenticated
    ? user?.role === 'farmer'
      ? [
          { href: '/farmer/dashboard', label: 'Command Deck' },
          { href: '/farmer/products', label: 'Inventory' },
          { href: '/farmer/orders', label: 'Contracts' },
          { href: '/chat', label: 'Terminal' },
        ]
      : [
          { href: '/marketplace', label: 'Marketplace' },
          { href: '/orders', label: 'History' },
          { href: '/chat', label: 'Terminal' },
        ]
    : [
        { href: '/marketplace', label: 'Discovery' },
        { href: '/about', label: 'Foundation' },
      ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <nav className="container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
        {/* Cinematic Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:rotate-6 transition-transform">
            <Leaf className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <span className="text-xl md:text-2xl font-black text-foreground tracking-tighter uppercase">
            Agro<span className="text-primary">Direct</span>
          </span>
        </Link>

        {/* Desktop Navigation Terminal */}
        <div className="hidden lg:flex items-center gap-2 bg-secondary/50 p-1.5 rounded-2xl border border-border/50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                isActive(link.href)
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Group */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3">
                {user?.role === 'user' && (
                  <Link to="/cart" className="relative w-12 h-12 flex items-center justify-center bg-secondary/50 hover:bg-white rounded-xl border border-border/50 transition-all group">
                    <ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center px-1 border-2 border-background">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link to="/ai-assistant" className="w-12 h-12 flex items-center justify-center bg-secondary/50 hover:bg-white rounded-xl border border-border/50 transition-all group">
                  <Sparkles className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </div>

              <div className="w-px h-8 bg-border/50 mx-2" />

              <div className="flex items-center gap-4">
                 <Link to="/profile" className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-secondary/50 transition-all">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/10">
                       {user?.name?.charAt(0)}
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-foreground leading-none mb-1">{user?.name?.split(' ')[0]}</p>
                       <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary leading-none">{user?.role}</p>
                    </div>
                 </Link>
                 <button onClick={logout} className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                    <LogOut className="w-5 h-5" />
                 </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors px-4">
                Sign In
              </Link>
              <Link to="/signup">
                <button className="btn-premium h-14 px-8 text-[10px]">
                  Join Hub
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Controller */}
        <button
          className="md:hidden w-12 h-12 flex items-center justify-center bg-secondary/50 rounded-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Cinematic Mobile Terminal */}
      <div className={cn(
        "fixed inset-0 z-[100] md:hidden transition-all duration-500",
        isOpen ? "visible" : "invisible pointer-events-none"
      )}>
         <div className={cn(
           "absolute inset-0 bg-foreground/60 backdrop-blur-md transition-opacity duration-700",
           isOpen ? "opacity-100" : "opacity-0"
         )} onClick={() => setIsOpen(false)} />
         
         <div className={cn(
           "absolute right-0 top-0 h-full w-4/5 max-w-sm bg-background p-10 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.3,1)]",
           isOpen ? "translate-x-0" : "translate-x-full"
         )}>
            <div className="flex items-center justify-between mb-16">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                     <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-black uppercase tracking-tighter">Terminal</span>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-muted rounded-xl transition-all">
                  <X className="w-6 h-6" />
               </button>
            </div>

            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-8 py-5 rounded-[1.5rem] text-xl font-black uppercase tracking-tighter transition-all",
                    isActive(link.href)
                      ? "bg-primary text-white shadow-2xl shadow-primary/20 scale-105"
                      : "text-muted-foreground hover:bg-secondary/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-12 pt-12 border-t border-border/50 space-y-6">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-6 p-6 bg-secondary/30 rounded-[2rem] border border-border/50">
                       <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                          <User className="w-8 h-8 text-white" />
                       </div>
                       <div>
                          <p className="font-black uppercase text-base tracking-tighter">{user?.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{user?.role} Access</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <Link to="/profile" onClick={() => setIsOpen(false)} className="flex flex-col items-center justify-center p-6 bg-white border border-border/50 rounded-[2rem] gap-3">
                          <Settings className="w-6 h-6 text-muted-foreground" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
                       </Link>
                       <button onClick={() => { logout(); setIsOpen(false); }} className="flex flex-col items-center justify-center p-6 bg-white border border-border/50 rounded-[2rem] gap-3">
                          <LogOut className="w-6 h-6 text-destructive" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-destructive">Logout</span>
                       </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <button className="btn-premium w-full h-18 text-base">Initialize Hub Access</button>
                    </Link>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <button className="w-full h-18 bg-white border-2 border-border/50 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px]">Operator Sign In</button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
         </div>
      </div>
    </header>
  );
};
