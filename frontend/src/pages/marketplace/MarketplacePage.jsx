import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { productsAPI } from '@/services/api';
import { cn } from '@/lib/utils';
import { Search as SearchIcon, SlidersHorizontal as FilterIcon, LayoutGrid as GridIcon, List as ListIcon, ChevronDown as ChevronIcon, Check as CheckIcon, MapPin as LocationIcon, Globe as GlobeIcon, ShieldCheck as VerifiedIcon, Info as InfoIcon, Database, ArrowRight, Activity, Filter, Landmark, Box, Smartphone, Monitor, LayoutGrid, SlidersHorizontal, RefreshCw, Calendar } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Commodity Classes' },
  { id: 'produce', label: 'Raw Produce & Grains' },
  { id: 'tools', label: 'Manual Farm Implements' },
  { id: 'equipment', label: 'Industrial Machinery' },
];

const locations = [
  'All Regional Hubs', 
  'Lagos Strategic Hub', 
  'Kano Industrial North', 
  'Kaduna Supply Node', 
  'Benue Grain Belt', 
  'Oyo Logistics Hub', 
  'Enugu South-East Hub'
];

export const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('All Regional Hubs');
  const [viewType, setViewType] = useState('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productsAPI.getAll({
          category: selectedCategory,
          location: selectedLocation === 'All Regional Hubs' ? '' : selectedLocation,
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
      <div className="bg-slate-50 min-h-screen pb-60">
        {/* Institutional Trade Discovery Terminal Header Registry */}
        <section className="bg-white border-b border-slate-200 pt-32 pb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none -mr-48 -mt-48 group">
             <Landmark className="w-full h-full text-slate-900 rotate-12 transition-transform duration-[3000ms] group-hover:scale-110" />
          </div>
          <div className="container mx-auto px-4 relative z-10 max-w-7xl">
            <div className="max-w-6xl space-y-20">
              <div className="space-y-12">
                <div className="inline-flex items-center gap-6 px-8 py-3 rounded-2xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.4em] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.4)] border border-slate-800">
                   <VerifiedIcon className="w-6 h-6 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                   Institutional Commodity Exchange v4.2.0-STABLE
                </div>
                <div className="space-y-6">
                   <h1 className="text-7xl md:text-9xl font-bold text-slate-900 tracking-tighter leading-[0.85] transition-all">
                     Professional <br />
                     <span className="text-primary italic">Trade Discovery.</span>
                   </h1>
                   <p className="text-2xl md:text-3xl text-slate-500 font-medium leading-relaxed max-w-5xl opacity-80">
                     Analyze and procure agricultural commodity assets with verified technical specifications and secure settlement protocols from Nigeria's largest authorized producer network hub nodes.
                   </p>
                </div>
              </div>
              
              {/* High-Fidelity Trade Command Search Console */}
              <div className="flex flex-col md:flex-row gap-8 pt-12 max-w-6xl">
                 <div className="relative flex-1 group shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-10 pointer-events-none">
                       <SearchIcon className="w-10 h-10 text-slate-300 group-focus-within:text-primary transition-all duration-700" />
                    </div>
                    <input
                      type="text"
                      placeholder="Audit assets by commodity type, producer node registry, or regional trade hub..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-24 pr-12 h-32 bg-white border border-slate-100 text-2xl font-bold placeholder:text-slate-200 placeholder:font-bold focus:ring-[25px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none tracking-tighter"
                    />
                 </div>
                 <div className="flex gap-8">
                    <button className="h-32 px-14 rounded-[2rem] bg-white border border-slate-200 text-slate-900 text-[11px] font-bold uppercase tracking-[0.4em] flex items-center gap-6 hover:bg-slate-50 transition-all shadow-2xl active:scale-95 group/param">
                       <FilterIcon className="w-8 h-8 text-primary transition-transform group-hover/param:rotate-90 duration-700" />
                       Audit Parameters
                    </button>
                    <button className="h-32 px-20 rounded-[2rem] bg-primary text-white text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-primary/90 transition-all shadow-[0_40px_100px_-20px_rgba(0,166,81,0.5)] active:scale-95 flex items-center gap-8 group/exec">
                       Execute Discovery
                       <ArrowRight className="w-8 h-8 transition-transform group-hover/exec:translate-x-4 duration-700" />
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-40 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-40">
            
            {/* Institutional Parameter Command Sidebar Hub */}
            <aside className="lg:w-[420px] shrink-0 space-y-20 hidden lg:block">
              <div className="space-y-20 sticky top-40">
                <div className="space-y-12">
                  <div className="flex items-center gap-6 border-b border-slate-100 pb-8">
                     <Database className="w-7 h-7 text-primary shadow-[0_0_10px_rgba(0,166,81,0.3)]" />
                     <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.5em]">Asset Categorization</h3>
                  </div>
                  <div className="space-y-4">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "w-full text-left px-10 py-8 rounded-[2rem] text-[15px] font-bold transition-all flex items-center justify-between group relative overflow-hidden active:scale-95",
                          selectedCategory === cat.id
                            ? "bg-slate-900 text-white shadow-[0_30px_70px_-15px_rgba(15,23,42,0.4)]"
                            : "text-slate-500 bg-white border border-slate-100 hover:border-primary/20 hover:bg-slate-50 hover:text-slate-900 shadow-xl"
                        )}
                      >
                        <span className="relative z-10 tracking-tight">{cat.label}</span>
                        {selectedCategory === cat.id ? <CheckIcon className="w-6 h-6 text-primary relative z-10" /> : <ChevronIcon className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all relative z-10 text-slate-300" />}
                        {selectedCategory === cat.id && <div className="absolute inset-0 bg-primary/10 opacity-20 pointer-events-none" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="flex items-center gap-6 border-b border-slate-100 pb-8">
                     <GlobeIcon className="w-7 h-7 text-primary shadow-[0_0_10px_rgba(0,166,81,0.3)]" />
                     <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.5em]">Regional Exchange Hubs</h3>
                  </div>
                  <div className="space-y-4">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setSelectedLocation(loc)}
                        className={cn(
                          "w-full text-left px-10 py-7 rounded-[2rem] text-[15px] font-bold transition-all flex items-center gap-8 group relative active:scale-95",
                          selectedLocation === loc
                            ? "text-primary bg-primary/5 border border-primary/20 shadow-2xl shadow-primary/5"
                            : "text-slate-500 bg-white border border-slate-100 hover:border-primary/20 hover:bg-slate-50 hover:text-slate-900 shadow-xl"
                        )}
                      >
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700", selectedLocation === loc ? "bg-primary text-white shadow-2xl shadow-primary/30 rotate-12" : "bg-slate-50 text-slate-300 group-hover:text-primary group-hover:bg-white")}>
                           <LocationIcon className="w-6 h-6" />
                        </div>
                        <span className="flex-1 tracking-tight">{loc}</span>
                        {selectedLocation === loc && <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(0,166,81,0.5)]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 p-16 rounded-[4rem] border border-slate-800 shadow-[0_60px_120px_-30px_rgba(15,23,42,0.5)] relative overflow-hidden group/intel">
                   <div className="absolute top-0 right-0 p-16 opacity-[0.03] -mr-20 -mt-20 group-hover/intel:scale-125 transition-transform duration-[2000ms]">
                      <Activity className="w-[400px] h-[400px] text-white" />
                   </div>
                   <div className="relative z-10 space-y-12">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center shadow-inner group-hover/intel:bg-primary/20 transition-all duration-700">
                            <InfoIcon className="w-8 h-8 text-primary shadow-[0_0_10px_rgba(0,166,81,0.3)]" />
                         </div>
                         <p className="text-[12px] font-bold text-white uppercase tracking-[0.4em]">Operational Intel Hub</p>
                      </div>
                      <p className="text-lg font-medium text-slate-400 leading-relaxed italic opacity-80 border-l-2 border-primary/20 pl-8">
                         "High institutional demand identified in Northern Regional Hubs for Cereal Assets. Authorized procurement cycles are increasing for Grade-AAA verified certifications."
                      </p>
                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                         <div className="flex items-center gap-4">
                            {[...Array(3)].map((_, i) => <div key={i} className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(0,166,81,0.5)]" style={{ animationDelay: `${i * 0.3}s` }} />)}
                         </div>
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.5em]">Auth Level 1 Synchronization Active</span>
                      </div>
                   </div>
                </div>
              </div>
            </aside>

            {/* Institutional Asset Ledger Discovery Matrix */}
            <div className="flex-1 min-w-0 space-y-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-16 pb-16 border-b border-slate-100">
                 <div className="space-y-4">
                    <h2 className="text-5xl font-bold text-slate-900 tracking-tighter leading-none">Commodity Inventory Manifest</h2>
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-4 bg-slate-900 px-6 py-2.5 rounded-2xl shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] border border-slate-800">
                          <Box className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(0,166,81,0.3)]" />
                          <span className="text-[11px] font-bold text-white uppercase tracking-[0.4em]">
                             {products.length} Active Asset Hub Nodes Authorized
                          </span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-10">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
                       <button 
                         onClick={() => setViewType('grid')}
                         className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-90", viewType === 'grid' ? "bg-slate-900 text-primary shadow-2xl" : "text-slate-200 hover:text-slate-900 hover:bg-slate-50")}
                       >
                          <GridIcon className="w-7 h-7" />
                       </button>
                       <button 
                         onClick={() => setViewType('list')}
                         className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-90", viewType === 'list' ? "bg-slate-900 text-primary shadow-2xl" : "text-slate-200 hover:text-slate-900 hover:bg-slate-50")}
                       >
                          <ListIcon className="w-7 h-7" />
                       </button>
                    </div>
                    <button className="h-24 px-12 rounded-3xl bg-white border border-slate-200 text-[11px] font-bold text-slate-900 uppercase tracking-[0.4em] flex items-center gap-6 hover:bg-slate-50 shadow-2xl transition-all group active:scale-95 group/audit">
                       <SlidersHorizontal className="w-7 h-7 text-primary group-hover/audit:rotate-180 transition-transform duration-1000" />
                       Audit Priority
                       <ChevronIcon className="w-7 h-7 text-slate-300 group-hover/audit:translate-y-1 transition-transform" />
                    </button>
                 </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-20">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-[4rem] h-[600px] border border-slate-200 shadow-sm" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className={cn(
                   "grid gap-20",
                   viewType === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-60 bg-white rounded-[5rem] border border-slate-200 shadow-[0_80px_200px_-50px_rgba(0,0,0,0.1)] max-w-6xl mx-auto space-y-20 relative overflow-hidden group/empty">
                  <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-[2000ms]" />
                  <div className="w-48 h-48 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner transform -rotate-12 relative z-10 transition-transform group-hover/empty:rotate-0 duration-1000">
                     <SearchIcon className="w-20 h-20 text-slate-100" />
                  </div>
                  <div className="space-y-8 relative z-10 px-24">
                     <h3 className="text-5xl font-bold text-slate-900 tracking-tighter leading-none">Zero Asset Match Identified</h3>
                     <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto opacity-80">The requested procurement audit parameters do not match any live inventory in the authorized network hubs. Please refine your discovery criteria manifest.</p>
                  </div>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedLocation('All Regional Hubs'); }}
                    className="h-24 px-16 rounded-[2rem] bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.4em] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.4)] hover:bg-slate-800 transition-all relative z-10 active:scale-95 group/reset border border-slate-800"
                  >
                    Reset Audit Parameters Matrix
                    <RefreshCw className="w-7 h-7 ml-8 inline-block group-hover/reset:rotate-180 transition-transform duration-[1000ms]" />
                  </button>
                </div>
              )}
              
              {/* Institutional Terminal Synchronization Node */}
              <div className="pt-40 flex items-center justify-center gap-20 opacity-10">
                 <Smartphone className="w-10 h-10 text-slate-900" />
                 <div className="h-px w-32 bg-slate-900" />
                 <Monitor className="w-10 h-10 text-slate-900" />
                 <div className="h-px w-32 bg-slate-900" />
                 <Landmark className="w-10 h-10 text-slate-900" />
                 <div className="h-px w-32 bg-slate-900" />
                 <LayoutGrid className="w-10 h-10 text-slate-900" />
                 <div className="h-px w-32 bg-slate-900" />
                 <Globe className="w-10 h-10 text-slate-900" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MarketplacePage;
