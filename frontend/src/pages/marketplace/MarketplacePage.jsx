import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { productsAPI } from '@/services/api';
import { cn } from '@/lib/utils';
import { Search, SlidersHorizontal, LayoutGrid, List, ChevronDown, Check, MapPin, ShieldCheck, Database, ArrowRight, Info, Inbox, RefreshCw } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'produce', label: 'Produce & Grains' },
  { id: 'tools', label: 'Farm Tools' },
  { id: 'equipment', label: 'Machinery' },
];

const locations = [
  'All Locations', 
  'Lagos Hub', 
  'Kano North', 
  'Kaduna Node', 
  'Benue Belt', 
  'Oyo Hub', 
  'Enugu Hub'
];

export const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [viewType, setViewType] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productsAPI.getAll({
          category: selectedCategory,
          location: selectedLocation === 'All Locations' ? '' : selectedLocation,
          search: searchQuery
        });
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedLocation, searchQuery]);

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Marketplace Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Explore the Marketplace
              </h1>
              <p className="text-lg text-gray-600">
                Buy fresh crops, farming tools, and machinery directly from local farmers in Nigeria. Get secure payments and safe delivery with every order.
              </p>
              
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                 <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by product, farmer, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all shadow-sm"
                    />
                 </div>
                 <button 
                   onClick={() => setShowMobileFilters(!showMobileFilters)} 
                   className="lg:hidden h-12 px-5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 shadow-sm"
                 >
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    Filters
                 </button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Desktop Filters Sidebar */}
            <aside className="lg:w-80 shrink-0 space-y-8 hidden lg:block">
              {/* Category Filter */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                   <Database className="w-5 h-5 text-primary" />
                   <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Categories</h3>
                </div>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between group",
                        selectedCategory === cat.id
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span>{cat.label}</span>
                      {selectedCategory === cat.id && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                   <MapPin className="w-5 h-5 text-primary" />
                   <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Locations</h3>
                </div>
                <div className="space-y-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between group",
                        selectedLocation === loc
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span>{loc}</span>
                      {selectedLocation === loc && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Widget */}
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-4">
                 <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Market Info</span>
                 </div>
                 <p className="text-sm text-gray-600 leading-relaxed">
                    Need bulk purchasing or specialized logistics? Start a chat with one of our verified agricultural hubs for tailored corporate procurement solutions.
                 </p>
              </div>
            </aside>

            {/* Mobile Filters Drawer */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
                <div className="relative w-80 h-full bg-white p-6 overflow-y-auto space-y-8 shadow-2xl">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="font-bold text-lg text-gray-900">Filters</span>
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">Close</button>
                  </div>
                  
                  {/* Category Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Categories</h3>
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCategory(cat.id); setShowMobileFilters(false); }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between",
                            selectedCategory === cat.id ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          <span>{cat.label}</span>
                          {selectedCategory === cat.id && <Check className="w-4 h-4 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Locations</h3>
                    <div className="space-y-1">
                      {locations.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => { setSelectedLocation(loc); setShowMobileFilters(false); }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between",
                            selectedLocation === loc ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          <span>{loc}</span>
                          {selectedLocation === loc && <Check className="w-4 h-4 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Main View */}
            <div className="flex-1 min-w-0 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                 <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                       {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
                    </span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                       <button 
                         onClick={() => setViewType('grid')}
                         className={cn("p-1.5 rounded-md transition-all active:scale-95", viewType === 'grid' ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-50")}
                       >
                          <LayoutGrid className="w-5 h-5" />
                       </button>
                       <button 
                         onClick={() => setViewType('list')}
                         className={cn("p-1.5 rounded-md transition-all active:scale-95", viewType === 'list' ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-50")}
                       >
                          <List className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-[380px] border border-gray-200 shadow-sm" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className={cn(
                   "grid gap-6",
                   viewType === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto space-y-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                     <Inbox className="w-10 h-10 text-gray-300" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-bold text-gray-900">No products found</h3>
                     <p className="text-gray-500 max-w-md mx-auto">We couldn't find any products matching your search query or selected filters. Try broadening your criteria.</p>
                  </div>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedLocation('All Locations'); }}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm inline-flex items-center gap-2"
                  >
                    Reset Filters
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MarketplacePage;
