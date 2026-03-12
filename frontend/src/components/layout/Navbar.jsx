import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, ShoppingCart, MessageCircle, User, X, Menu, Sparkles } from 'lucide-react';
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
          { href: '/farmer/dashboard', label: 'Dashboard' },
          { href: '/farmer/products', label: 'My Products' },
          { href: '/farmer/orders', label: 'Orders' },
          { href: '/chat', label: 'Messages' },
          { href: '/ai-assistant', label: 'AI Assistant' },
        ]
      : [
          { href: '/marketplace', label: 'Marketplace' },
          { href: '/orders', label: 'My Orders' },
          { href: '/chat', label: 'Messages' },
          { href: '/ai-assistant', label: 'AI Assistant' },
        ]
    : [
        { href: '/marketplace', label: 'Marketplace' },
        { href: '/about', label: 'About' },
      ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground shrink-0">
              Agro<span className="text-primary">Direct</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'user' && (
                  <Link to="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                    <ShoppingCart className="w-5 h-5 text-foreground" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link to="/chat" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5 text-foreground" />
                </Link>
                <Link to="/ai-assistant" className="relative p-2 hover:bg-muted rounded-lg transition-colors group">
                  <Sparkles className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-border">
                  <Link to="/profile" className="flex items-center gap-2 hover:bg-muted px-3 py-2 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{user?.name?.split(' ')[0]}</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t border-border mt-2 pt-2">
                {isAuthenticated ? (
                  <>
                    {user?.role === 'user' && (
                      <Link
                        to="/cart"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Cart {itemCount > 0 && `(${itemCount})`}
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <User className="w-5 h-5" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-4">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
