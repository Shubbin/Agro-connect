import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, ShoppingCart, MessageCircle, User, X, Menu, LogOut, Settings, LayoutDashboard, Database, ShieldCheck, Globe, ChevronDown, Bell, Search, FileText } from 'lucide-react';
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
          { href: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/farmer/products', label: 'Products', icon: Database },
          { href: '/farmer/orders', label: 'Orders', icon: FileText },
          { href: '/chat', label: 'Chat', icon: MessageCircle },
        ]
      : [
          { href: '/marketplace', label: 'Marketplace', icon: Globe },
          { href: '/orders', label: 'Orders', icon: FileText },
          { href: '/chat', label: 'Chat', icon: MessageCircle },
        ]
    : [
        { href: '/marketplace', label: 'Marketplace', icon: Search },
        { href: '/about', label: 'About Us', icon: ShieldCheck },
      ];

  return (
    <header className={cn(
      "sticky top-0 z-[100] transition-all duration-300 py-4",
      scrolled 
        ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-md shadow-slate-100/50" 
        : "bg-white border-b border-gray-100"
    )}>
      <nav className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
             <span className="text-xl font-bold text-gray-900 leading-tight">
               Agro-Connect
             </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                isActive(link.href)
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {link.icon && <link.icon className={cn("w-4 h-4", isActive(link.href) ? "text-primary" : "text-gray-400")} />}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
                  {user?.role === 'user' && (
                    <Link to="/cart" className="relative p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                      {itemCount > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                          {itemCount}
                        </span>
                      )}
                    </Link>
                  )}
                  <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                  </button>
              </div>
              
              <div className="group relative">
                <Link to="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block">
                        <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{user?.name?.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </Link>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-t-xl transition-colors">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition-colors text-left">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle & Actions */}
        <div className="flex lg:hidden items-center gap-2">
          {isAuthenticated && user?.role === 'user' && (
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors mr-1">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-extrabold rounded-full flex items-center justify-center translate-x-0.5 -translate-y-0.5 shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
          
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={cn(
        "fixed inset-0 z-[100] lg:hidden transition-opacity duration-300",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}>
         <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
         
         <div className={cn(
           "absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white p-6 shadow-2xl transition-transform duration-300 ease-out",
           isOpen ? "translate-x-0" : "translate-x-full"
         )}>
            <div className="flex items-center justify-between mb-8">
               <span className="text-xl font-bold text-gray-900">Menu</span>
               <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <link.icon className={cn("w-5 h-5", isActive(link.href) ? "text-primary" : "text-gray-400")} />
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4">
                       <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                          {user?.name?.charAt(0).toUpperCase()}
                       </div>
                       <div>
                          <p className="font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                       </div>
                    </div>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                       <Settings className="w-5 h-5 text-gray-400" />
                       <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                       <LogOut className="w-5 h-5 text-red-400" />
                       <span className="text-sm font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="block">
                      <button className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-sm transition-colors hover:bg-primary/90">Sign Up</button>
                    </Link>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                      <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">Login</button>
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

export default Navbar;
