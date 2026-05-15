import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AITipCard } from '@/components/ai/AITipCard';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { productsAPI } from '@/services/api';
import { cn } from '@/lib/utils';
import { Search, Filter, MapPin, X, Sparkles, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Inventory' },
  { id: 'produce', label: 'Fresh Produce' },
  { id: 'tools', label: 'Farm Tools' },
  { id: 'equipment', label: 'Heavy Equipment' },
];

const locations = ['All Nigeria', 'Lagos Hub', 'Kaduna North', 'Kano Central', 'Benue South', 'Oyo West', 'Ekiti East', 'Akwa Ibom South'];

export const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('All Nigeria');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productsAPI.getAll({
          category: selectedCategory,
          location: selectedLocation === 'All Nigeria' ? '' : selectedLocation,
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
    <MainLayout>
      {/* 
        DISCOVERY HEADER 
        Massive scale and cinematic depth.
      */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-border/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl reveal-up">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Real-time Global Inventory</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter uppercase leading-[0.85] mb-10">
              The <span className="text-gradient">Discovery</span> <br />
              <span className="relative">
                Terminal
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-accent-gold/30 -z-10 blur-sm" />
              </span>
            </h1>

            {/* Premium Command Center Search */}
            <div className="flex flex-col md:flex-row gap-6 mt-12">
               <div className="relative flex-1 group">
                  <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors z-20" />
                  <input
                    type="text"
                    placeholder="Search by crop, farmer, or region..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 h-18 bg-white/50 backdrop-blur-xl border border-border/50 rounded-3xl text-lg font-bold group-focus-within:border-primary/40 group-focus-within:bg-white transition-all outline-none relative z-10"
                  />
               </div>
               <button 
                 onClick={() => setShowFilters(!showFilters)}
                 className={cn(
                   "h-18 px-10 rounded-3xl border font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 transition-all active:scale-95",
                   showFilters ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-white border-border/50 text-foreground hover:bg-muted"
                 )}
               >
                 <SlidersHorizontal className="w-5 h-5" />
                 {showFilters ? 'Hide Filters' : 'Filter Deck'}
               </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 
            FLOATING FILTER DECK 
          */}
          <aside className={cn(
            "lg:w-80 shrink-0 space-y-10 transition-all duration-500",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <div className="sticky top-32 space-y-10 reveal-up">
              
              {/* Category Matrix */}
              <div className="glass-card p-8 bg-secondary/30 border-white/50 rounded-[2.5rem]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                   Sector
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "w-full text-left px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-tight transition-all duration-300",
                        selectedCategory === cat.id
                          ? "bg-primary text-white shadow-xl shadow-primary/20 translate-x-2"
                          : "text-muted-foreground hover:bg-white hover:text-foreground"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Hubs */}
              <div className="glass-card p-8 bg-secondary/30 border-white/50 rounded-[2.5rem]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                   Regional Hub
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={cn(
                        "w-full text-left px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group",
                        selectedLocation === loc
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span>{loc}</span>
                      <MapPin className={cn(
                        "w-3.5 h-3.5 transition-all",
                        selectedLocation === loc ? "text-primary opacity-100" : "opacity-0 group-hover:opacity-40"
                      )} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Intelligence Tip */}
              <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                 <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">AgroTip</span>
                 </div>
                 <p className="text-xs font-bold text-muted-foreground leading-relaxed italic">
                    "Bulk purchasing during the morning session (8AM - 11AM) typically results in 5-8% lower negotiation margins."
                 </p>
              </div>
            </div>
          </aside>

          {/* 
            PRODUCT TERMINAL GRID 
          */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-10 reveal-up">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-1">Results</h4>
                  <p className="text-sm font-black text-foreground">Showing {products.length} Verified Listings</p>
               </div>
               <div className="flex items-center gap-4 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
                  <button className="p-2.5 bg-white shadow-sm rounded-xl text-primary"><LayoutGrid className="w-4 h-4" /></button>
                  <button className="p-2.5 text-muted-foreground hover:text-foreground"><List className="w-4 h-4" /></button>
               </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-muted/20 rounded-[2.5rem] h-[450px]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 reveal-up">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 glass-card bg-secondary/10 rounded-[3rem] border-dashed border-border/50">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter mb-4">No Inventory Found</h3>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-10">
                  The current parameters yielded no active trades. Try expanding your regional hub or searching for broader crop terms.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedLocation('All Nigeria'); }}
                  className="px-8 py-4 bg-foreground text-white rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all"
                >
                  Reset Discovery Deck
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MarketplacePage;
