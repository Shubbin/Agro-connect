import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ArrowLeft, Package, Edit2, Trash2, Leaf, Sparkles, AlertTriangle, ExternalLink, MoreVertical, MapPin, ChevronRight, Filter, ShieldCheck, Database, RefreshCw, Landmark, Activity, Archive, LayoutGrid, List, Hash, Globe, Smartphone, Monitor } from 'lucide-react';
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
  const [viewType, setViewType] = useState('table');
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
    if (!confirm('Authorized Action Required: Are you certain you wish to terminate this market listing from the institutional exchange?')) return;
    
    try {
      await productsAPI.delete(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: 'Listing Terminated',
        description: 'The commodity asset has been successfully removed from institutional discovery.',
      });
    } catch (error) {
      toast({
        title: 'Action Failed',
        description: 'Critical system error: Could not terminate listing manifest. Please contact regional support.',
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

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-slate-50 min-h-screen pb-60">
        {/* Institutional Inventory Registry Header */}
        <section className="bg-white border-b border-slate-200 pt-32 pb-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
           <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-16">
                 <div className="space-y-8">
                    <div className="inline-flex items-center gap-4 px-6 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(15,23,42,0.4)]">
                       <Database className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                       Asset Management Ledger Registry
                    </div>
                    <div className="space-y-4">
                       <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-none">Commodity Inventory</h1>
                       <p className="text-xl font-medium text-slate-500 max-w-2xl leading-relaxed opacity-80">
                          Monitor active market positions, adjust technical specifications, and synchronize aggregate inventory manifestations with institutional trade hub nodes.
                       </p>
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-6">
                    <Link to="/farmer/products/new">
                       <button className="h-20 px-12 rounded-2xl bg-primary text-white font-bold text-[11px] uppercase tracking-[0.3em] shadow-[0_30px_70px_-15px_rgba(0,166,81,0.4)] hover:bg-primary/90 transition-all flex items-center gap-6 active:scale-95 group/init">
                          <Plus className="w-6 h-6 group-hover/init:rotate-90 transition-transform duration-700" />
                          Initialize Listing Manifest
                       </button>
                    </Link>
                    <button className="h-20 px-12 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-slate-50 transition-all shadow-2xl active:scale-95 flex items-center gap-6 group/sync">
                       <RefreshCw className="w-6 h-6 text-primary group-hover/sync:rotate-180 transition-transform duration-1000" />
                       Sync Hub Registry
                    </button>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-32 max-w-7xl">
          {/* Inventory Controls Terminal Command Matrix */}
          <div className="flex flex-col lg:flex-row gap-12 mb-20 items-center justify-between">
            <div className="relative flex-1 w-full max-w-2xl group shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
               <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300 group-focus-within:text-primary transition-all duration-700" />
               <input
                 type="text"
                 placeholder="Audit asset registry by ID, Name, or technical specification..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full h-24 pl-20 pr-10 bg-white border border-slate-200 rounded-[2.5rem] text-xl font-bold placeholder:text-slate-200 focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:shadow-2xl transition-all outline-none tracking-tighter"
               />
            </div>
            
            <div className="flex items-center gap-10">
               <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xl">
                  <button 
                    onClick={() => setViewType('table')}
                    className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-sm", viewType === 'table' ? "bg-slate-900 text-primary shadow-xl" : "text-slate-200 hover:text-slate-400")}
                  >
                     <List className="w-7 h-7" />
                  </button>
                  <button 
                    onClick={() => setViewType('grid')}
                    className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-sm", viewType === 'grid' ? "bg-slate-900 text-primary shadow-xl" : "text-slate-200 hover:text-slate-400")}
                  >
                     <LayoutGrid className="w-7 h-7" />
                  </button>
               </div>
               
               <div className="h-14 w-px bg-slate-200 hidden lg:block" />
               
               <div className="flex items-center gap-6 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 scrollbar-hide">
                 <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mr-6">
                    <Filter className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(0,166,81,0.3)]" />
                    Classification Matrix
                 </div>
                 {['all', 'produce', 'tools', 'equipment'].map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setFilter(cat)}
                     className={cn(
                       "px-10 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] transition-all whitespace-nowrap border shadow-2xl active:scale-95 group/cat",
                       filter === cat
                         ? "bg-slate-900 text-white border-slate-800 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.3)]"
                         : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-900"
                     )}
                   >
                     {cat === 'all' ? 'Universal Node' : cat}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-12">
               {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[3rem] h-32 animate-pulse border border-slate-200 shadow-sm" />
               ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-[4rem] p-40 text-center border border-slate-200 shadow-[0_80px_200px_-50px_rgba(0,0,0,0.15)] max-w-5xl mx-auto space-y-16 relative overflow-hidden group/empty">
               <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-[2000ms]" />
               <div className="w-36 h-36 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner relative z-10 transform -rotate-12 group-hover/empty:rotate-0 transition-transform duration-1000">
                  <Archive className="w-16 h-16 text-slate-100" />
               </div>
               <div className="space-y-6 relative z-10 px-20">
                  <h3 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-none">Zero Assets Identified</h3>
                  <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed opacity-80">
                    {searchTerm ? 'The provided audit criteria do not match any commodity positions in the current institutional registry.' : 'Your institutional inventory manifest is currently inactive. Initialize your first asset node to begin trade synchronization.'}
                  </p>
               </div>
               {!searchTerm && (
                 <Link to="/farmer/products/new" className="inline-block relative z-10">
                    <button className="h-20 px-16 rounded-2xl bg-primary text-white font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-primary/90 shadow-[0_30px_70px_-15px_rgba(0,166,81,0.4)] transition-all flex items-center gap-6 mx-auto active:scale-95 group/btn">
                      <Plus className="w-7 h-7 group-hover/btn:rotate-90 transition-transform duration-700" />
                      Initialize Asset Node
                    </button>
                 </Link>
               )}
            </div>
          ) : (
            <div className="bg-white rounded-[4rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.08)] overflow-hidden group/registry">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="text-left px-16 py-10 text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400">Commodity Asset Manifest</th>
                      <th className="text-left px-12 py-10 text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400">Classification</th>
                      <th className="text-left px-12 py-10 text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400">Unit Settlement</th>
                      <th className="text-left px-12 py-10 text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400">Availability Matrix</th>
                      <th className="text-right px-16 py-10 text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400">Node Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/30 transition-all duration-700 group/row cursor-pointer relative overflow-hidden">
                        <td className="px-16 py-12 relative overflow-hidden">
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-700 pointer-events-none" />
                          <div className="flex items-center gap-10 relative z-10">
                            <div className="w-24 h-24 bg-white rounded-[2rem] overflow-hidden shrink-0 border border-slate-100 shadow-2xl group-hover/row:scale-110 group-hover/row:rotate-6 transition-all duration-[1000ms]">
                               <img
                                 src={product.images?.[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                                 alt={product.name}
                                 className="w-full h-full object-cover grayscale group-hover/row:grayscale-0 transition-all duration-[2000ms]"
                               />
                            </div>
                            <div className="min-w-0 space-y-3">
                               <p className="text-2xl font-bold text-slate-900 truncate tracking-tighter group-hover/row:text-primary transition-colors">{product.name}</p>
                               <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  Regional Hub Node: {product.location}
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-12 relative z-10">
                          <span className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] px-6 py-2.5 rounded-xl shadow-2xl shadow-slate-900/10 border border-slate-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-12 py-12 relative z-10">
                          <div className="space-y-2">
                             <p className="text-2xl font-bold text-slate-900 tracking-tighter">{formatPrice(product.price)}</p>
                             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em] leading-none opacity-60">Settlement Node / {product.unit}</p>
                          </div>
                        </td>
                        <td className="px-12 py-12 relative z-10">
                          <div className="flex flex-col gap-6 max-w-[200px]">
                             <div className="flex items-center justify-between">
                                <span className={cn(
                                  "text-[11px] font-bold uppercase tracking-[0.3em]",
                                  (product.available || 0) < 20 ? "text-red-500" : "text-slate-900"
                                )}>
                                  {product.available || 0} {product.unit} MAGNITUDE
                                </span>
                                {(product.available || 0) < 20 && (
                                   <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                                )}
                             </div>
                             <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner p-0.5">
                                <div 
                                   className={cn("h-full rounded-full transition-all duration-[2000ms]", (product.available || 0) < 20 ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-primary shadow-[0_0_15px_rgba(0,166,81,0.5)]")} 
                                   style={{ width: `${Math.min(100, (product.available / 100) * 100)}%` }} 
                                />
                             </div>
                          </div>
                        </td>
                        <td className="px-16 py-12 relative z-10">
                          <div className="flex items-center justify-end gap-6">
                            <Link to={`/farmer/products/${product.id}/edit`}>
                              <button className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:text-primary hover:border-primary/20 hover:bg-slate-50 transition-all shadow-2xl active:scale-90 group/edit">
                                <Edit2 className="w-6 h-6 group-hover/edit:rotate-12 transition-transform" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-2xl active:scale-90 group/del"
                            >
                              <Trash2 className="w-6 h-6 group-hover/del:scale-110 transition-transform" />
                            </button>
                            <Link to={`/product/${product.id}`}>
                               <button className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 transition-all shadow-2xl border border-slate-800 group/ext active:scale-90">
                                 <ExternalLink className="w-6 h-6 text-primary group-hover/ext:scale-110 group-hover/ext:-translate-y-1 transition-all" />
                               </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Institutional Asset Discovery Hub Node Sync */}
          <div className="pt-40 flex items-center justify-center gap-20 opacity-10">
             <Smartphone className="w-10 h-10 text-slate-900" />
             <Monitor className="w-10 h-10 text-slate-900" />
             <Landmark className="w-10 h-10 text-slate-900" />
             <LayoutGrid className="w-10 h-10 text-slate-900" />
             <Activity className="w-10 h-10 text-slate-900" />
             <Database className="w-10 h-10 text-slate-900" />
             <Globe className="w-10 h-10 text-slate-900" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
