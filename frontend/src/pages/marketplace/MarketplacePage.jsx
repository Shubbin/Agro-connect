import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AITipCard } from '@/components/ai/AITipCard';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { productsAPI } from '@/services/api';
import { cn } from '@/lib/utils';
import { Search, Filter, MapPin, X, Sparkles } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'produce', label: 'Fresh Produce' },
  { id: 'tools', label: 'Farm Tools' },
  { id: 'equipment', label: 'Equipment' },
];

const locations = ['All Locations', 'Lagos', 'Kaduna', 'Kano', 'Benue', 'Oyo', 'Ekiti', 'Akwa Ibom'];

export const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productsAPI.getAll({
          category: selectedCategory,
          location: selectedLocation,
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
      <div className="relative overflow-hidden bg-background py-20 lg:py-24 border-b border-border/50">
        {/* Dynamic Background Elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[100%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[80%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Direct Sourcing</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-foreground mb-6 tracking-tight leading-[0.95]">
              Nigerian <span className="text-gradient">Agro-Market</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
              Premium quality produce, tools, and equipment sourced directly from farm gates across the federation.
            </p>

            {/* Premium Search Bar */}
            <div className="mt-12 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors z-20" />
                <input
                  type="text"
                  placeholder="What are you looking for today? (e.g. Yam, Mangoes, Tractors)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 h-18 glass-premium bg-white/80 dark:bg-card/80 border-border/50 group-focus-within:border-primary/50 text-lg rounded-2xl transition-all relative z-10"
                />
              </div>
              <Button
                variant="outline"
                size="xl"
                className="md:hidden glass-premium h-18 px-8 rounded-2xl border-border/50"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5 mr-3" />
                Quick Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* AI Recommendation */}
        <AITipCard
          title="Looking for bulk deals?"
          description="Tap 'Make Offer' on any product to negotiate directly with farmers. Bulk orders often get 10-20% discounts!"
          className="mb-6"
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <aside className={cn(
            "lg:w-72 shrink-0",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <div className="sticky top-28 space-y-8 animate-fade-in">
              {/* Categories */}
              <div className="glass-premium p-6 rounded-3xl border-border/50">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300",
                        selectedCategory === cat.id
                          ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Selector */}
              <div className="glass-premium p-6 rounded-3xl border-border/50">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Location
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-3",
                        selectedLocation === loc
                          ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        selectedLocation === loc ? "bg-white" : "bg-border"
                      )} />
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Action */}
              {(selectedCategory !== 'all' || selectedLocation !== 'All Locations' || searchQuery) && (
                <Button
                  variant="ghost"
                  className="w-full h-14 rounded-2xl text-destructive hover:bg-destructive/5 font-bold"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLocation('All Locations');
                    setSearchQuery('');
                  }}
                >
                  <X className="w-5 h-5 mr-3" />
                  Reset Discovery
                </Button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} products
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-6 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No products found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MarketplacePage;
