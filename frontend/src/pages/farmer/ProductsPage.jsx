import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ArrowLeft, Package, Edit2, Trash2, Leaf, Sparkles, AlertTriangle, ExternalLink, MoreVertical, MapPin } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { productsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { useAuth } from '@/contexts/AuthContext';

export const ProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getByFarmer(user.id);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsAPI.delete(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: 'Product deleted',
        description: 'The product has been removed from your listings.',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Could not delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredProducts = products.filter(p => {
    const name = p.name || '';
    const category = p.category || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || category === filter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-background pb-20">
        {/* Ambient background */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 animate-fade-in">
            <div className="space-y-4">
               <Link to="/farmer/dashboard" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-black uppercase tracking-widest text-[10px] mb-4">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  Control Center
               </Link>
               <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.9]">
                  Inventory <span className="text-gradient">Vault</span>
               </h1>
               <p className="text-xl text-muted-foreground font-medium max-w-md">
                 Management of your listed harvests and stock availability.
               </p>
            </div>
            <Link to="/farmer/products/new">
               <Button size="xl" className="rounded-2xl btn-premium h-16 px-8 text-lg font-black tracking-tight">
                  <Plus className="w-6 h-6 mr-3" />
                  List New Harvest
               </Button>
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="relative flex-1 group">
               <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors z-20" />
               <input
                 type="text"
                 placeholder="Locate specific inventory item..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full h-16 pl-14 pr-6 glass-premium bg-white/50 border-border/50 group-focus-within:border-primary/50 text-lg rounded-2xl transition-all relative z-10"
               />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {['all', 'produce', 'tools', 'equipment'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap border border-border/50",
                    filter === cat
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.05]"
                      : "glass-premium hover:bg-white text-muted-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="glass-premium rounded-[3rem] p-20 text-center animate-fade-in-up border-border/50" style={{ animationDelay: '200ms' }}>
               <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Package className="w-10 h-10 text-primary" />
               </div>
               <h3 className="text-3xl font-black text-foreground tracking-tight mb-4">No Inventory Detected</h3>
               <p className="text-xl text-muted-foreground font-medium mb-10 max-w-md mx-auto">
                 {searchTerm ? 'Your search query yielded no results within current filters.' : 'Your vault is currently empty. Initialize your first listing to start trading.'}
               </p>
               <Link to="/farmer/products/new">
                  <Button size="xl" variant="outline" className="rounded-2xl border-primary/20 hover:bg-primary/5 font-black tracking-tight">
                    <Plus className="w-5 h-5 mr-3" />
                    Initialize Listing
                  </Button>
               </Link>
            </div>
          ) : (
            <div className="glass-premium rounded-[2.5rem] border-border/50 overflow-hidden shadow-2xl shadow-primary/5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary/[0.02] border-b border-border/50">
                      <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Specification</th>
                      <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classification</th>
                      <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Valuation</th>
                      <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Allocation</th>
                      <th className="text-right px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-primary/[0.01] transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 glass-premium rounded-2xl overflow-hidden shrink-0 border border-border/50 p-1 group-hover:scale-105 transition-transform duration-500">
                               <div className="w-full h-full rounded-xl overflow-hidden bg-muted">
                                  <img
                                    src={product.images?.[0] || '/placeholder.svg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                               </div>
                            </div>
                            <div className="min-w-0">
                               <p className="text-lg font-black text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
                               <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                                  <MapPin className="w-3 h-3 text-primary" />
                                  {product.location}
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="glass-premium bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/20">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-lg font-black text-foreground tracking-tight">{formatPrice(product.price)}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">per {product.unit}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2">
                                <span className={cn(
                                  "text-lg font-black tracking-tight",
                                  (product.available || 0) < 20 ? "text-destructive" : "text-foreground"
                                )}>
                                  {product.available || 0} {product.unit}
                                </span>
                                {(product.available || 0) < 20 && (
                                   <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
                                )}
                             </div>
                             <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div 
                                   className={cn("h-full rounded-full transition-all duration-1000", (product.available || 0) < 20 ? "bg-destructive" : "bg-primary")} 
                                   style={{ width: `${Math.min(100, (product.available / 100) * 100)}%` }} 
                                />
                             </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/farmer/products/${product.id}/edit`}>
                              <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl border-border/50 hover:bg-white active:scale-95 transition-all">
                                <Edit2 className="w-5 h-5 text-primary" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(product.id)}
                              className="w-12 h-12 rounded-xl border-border/50 hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                            <Link to={`/product/${product.id}`}>
                               <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl border-border/50 hover:bg-white active:scale-95 transition-all">
                                 <ExternalLink className="w-5 h-5 text-muted-foreground" />
                               </Button>
                            </Link>
                          </div>
                          {/* Mobile Action Trigger */}
                          <div className="flex lg:hidden items-center justify-end">
                             <MoreVertical className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
