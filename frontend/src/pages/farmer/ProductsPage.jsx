import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ArrowLeft, Package, Edit2, Trash2, ExternalLink, MapPin, ChevronRight, Filter, ShieldCheck, Database, RefreshCw, Inbox, AlertTriangle } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { MainLayout } from '@/components/layout/MainLayout';
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
    if (!confirm('Are you sure you want to delete this product listing? This action cannot be undone.')) return;
    
    try {
      await productsAPI.delete(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: 'Listing Removed',
        description: 'The product listing has been successfully removed from the marketplace.',
      });
    } catch (error) {
      toast({
        title: 'Action Failed',
        description: 'Could not delete this product listing. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredProducts = products.filter(p => {
    const name = p.name || '';
    const category = p.category || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || category.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-12">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                       <Database className="w-4 h-4" />
                       Inventory Registry
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Products</h1>
                    <p className="text-gray-600">
                       Add new products to the marketplace, manage your current listings, update prices, and track remaining stock quantities.
                    </p>
                 </div>
                 <div className="flex gap-3">
                    <Link to="/farmer/products/new">
                       <button className="h-10 px-4 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm active:scale-95 group">
                          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                          Add New Product
                       </button>
                    </Link>
                    <button className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2 shadow-sm">
                       <RefreshCw className="w-4 h-4 text-primary" />
                       Refresh
                    </button>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
               <input
                 type="text"
                 placeholder="Search products by name..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-base font-semibold placeholder:text-gray-300 focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
               />
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 shrink-0">
                 <Filter className="w-4 h-4 text-primary" />
                 Category Filter
              </div>
              {['all', 'produce', 'tools', 'equipment'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border shadow-sm capitalize shrink-0",
                    filter === cat
                      ? "bg-slate-900 text-white border-slate-800"
                      : "bg-white border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-300"
                  )}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
               {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-200 shadow-sm" />
               ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-sm max-w-xl mx-auto space-y-6">
               <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Inbox className="w-10 h-10 text-gray-300" />
               </div>
               <div className="space-y-2 px-4">
                  <h3 className="text-2xl font-bold text-gray-900">No Products Found</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {searchTerm ? 'No products match your search. Try adjusting your search term or category filters.' : 'You haven\'t listed any products on the marketplace yet. Add your first product to start selling!'}
                  </p>
               </div>
               {!searchTerm && (
                 <Link to="/farmer/products/new" className="inline-block">
                    <button className="h-12 px-6 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm inline-flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add First Product
                    </button>
                 </Link>
               )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                      <th className="px-6 py-4">Product Details</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock Level</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/30 transition-colors group/row">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                               <img
                                 src={product.images?.[0] || 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'}
                                 alt={product.name}
                                 className="w-full h-full object-cover"
                               />
                            </div>
                            <div className="min-w-0 space-y-1">
                               <p className="font-bold text-gray-900 group-hover/row:text-primary transition-colors text-base leading-snug">{product.name}</p>
                               <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                                  <MapPin className="w-3.5 h-3.5 text-primary" />
                                  <span>Location: {product.location}</span>
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border border-slate-800">
                            {product.category || 'Produce'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                             <p className="font-bold text-gray-900 text-base">{formatPrice(product.price)}</p>
                             <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-none">per {product.unit}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 max-w-[150px]">
                             <div className="flex items-center justify-between text-xs font-semibold">
                                <span className={cn(
                                  (product.available || 0) < 20 ? "text-red-500 font-bold" : "text-gray-700 font-bold"
                                )}>
                                  {product.available || 0} {product.unit} left
                                </span>
                                {(product.available || 0) < 20 && (
                                   <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse shrink-0" />
                                )}
                             </div>
                             <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-50 shadow-inner p-0.5">
                                <div 
                                   className={cn("h-full rounded-full transition-all duration-1000", (product.available || 0) < 20 ? "bg-red-500" : "bg-primary")} 
                                   style={{ width: `${Math.min(100, (product.available / 100) * 100)}%` }} 
                                />
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/farmer/products/${product.id}/edit`}>
                              <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/20 hover:bg-gray-50 transition-colors shadow-sm group/edit">
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-colors shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <Link to={`/product/${product.id}`}>
                               <button className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 transition-colors shadow-sm">
                                 <ExternalLink className="w-4 h-4 text-primary" />
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
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
