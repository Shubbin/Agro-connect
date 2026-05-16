import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { productsAPI, aiAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, ArrowLeft, Lightbulb, X, Sparkles, Plus, Image as ImageIcon, MapPin, Tag, Package, HelpCircle, ChevronRight, Info, ShieldCheck, Database, FileText, Globe, Landmark, RefreshCw, Smartphone, Monitor, Database as DatabaseIcon, Layers, Target, Activity } from 'lucide-react';

const categories = [
  { value: 'produce', label: 'Fresh Produce & Grains' },
  { value: 'tools', label: 'Manual Farm Implements' },
  { value: 'equipment', label: 'Industrial Machinery' },
];

const units = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'bag', label: 'Standard Bag (50kg)' },
  { value: 'crate', label: 'Industrial Crate' },
  { value: 'ton', label: 'Metric Ton' },
  { value: 'piece', label: 'Individual Unit' },
];

const locations = [
  'Lagos Strategic Hub', 'Kano Industrial North', 'Kaduna Supply Node', 'Oyo Logistics Hub', 'Rivers Delta Node', 
  'Ogun Border Hub', 'Sokoto Grain Belt', 'Ebonyi Rice Hub', 'Imo Supply Hub',
  'Anambra Trade Hub', 'Benue Grain Hub', 'Plateau Highland Hub', 'Enugu South-East Hub', 'Delta Coastal Hub', 'Abia Trade Node'
];

export const ProductFormPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiTips, setShowAiTips] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'produce',
    price: '',
    unit: 'kg',
    minOrder: '',
    available: '',
    location: 'Lagos Strategic Hub',
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'],
  });

  useEffect(() => {
    if (isEditing && id) {
      const fetchProduct = async () => {
        try {
          const product = await productsAPI.getById(id);
          if (product) {
            setFormData({
              name: product.name,
              description: product.description,
              category: product.category,
              price: product.price.toString(),
              unit: product.unit,
              minOrder: product.minOrder.toString(),
              available: product.available.toString(),
              location: product.location,
              images: product.images || [formData.images[0]],
            });
          }
        } catch (error) {
          toast({
            title: 'Retrieval Failure',
            description: 'The requested asset record could not be localized within the network.',
            variant: 'destructive',
          });
          navigate('/farmer/products');
        } finally {
          setIsFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing, navigate, toast]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.name && formData.category) {
        try {
          const result = await aiAPI.getProductSuggestions({
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price) || 0,
          });
          setAiSuggestions(result.suggestions || []);
        } catch (error) {
          // AI suggestions silences errors
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData.name, formData.category, formData.price]);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images.filter(img => !img.includes('placeholder')), ...newImages],
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.available) {
      toast({
        title: 'Validation Error',
        description: 'Mandatory technical specifications are missing from the manifest.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        minOrder: parseInt(formData.minOrder) || 1,
        available: parseInt(formData.available),
        farmerId: user?.id,
      };

      if (isEditing && id) {
        await productsAPI.update(id, productData);
        toast({
          title: 'Ledger Updated',
          description: 'Marketplace asset specifications successfully synchronized.',
        });
      } else {
        await productsAPI.create(productData);
        toast({
          title: 'Asset Initialized',
          description: 'New commodity assigned to the institutional discovery hub.',
        });
      }

      navigate('/farmer/products');
    } catch (error) {
      toast({
        title: 'Synchronization Error',
        description: 'Critical system failure: Could not commit asset to the registry.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
           <div className="flex flex-col items-center gap-8">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin shadow-2xl" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Synchronizing Asset Data...</p>
           </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen pb-40">
        {/* Institutional Record Header */}
        <section className="bg-white border-b border-slate-200 pt-24 pb-20 relative overflow-hidden">
           <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
           <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                 <div className="space-y-6">
                    <button
                      onClick={() => navigate('/farmer/products')}
                      className="flex items-center gap-3 text-[10px] font-bold text-slate-400 hover:text-primary transition-all uppercase tracking-[0.2em] group"
                    >
                       <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1" />
                       Inventory Registry
                    </button>
                    <div className="space-y-3">
                       <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter">
                          {isEditing ? 'Asset Modification' : 'Asset Initialization'}
                       </h1>
                       <p className="text-lg font-medium text-slate-500 max-w-xl leading-relaxed">
                          {isEditing ? 'Adjust technical specifications and procurement settlement terms for this verified asset node.' : 'Initialize a new commodity position for institutional trade discovery and supply chain optimization.'}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-20">
            {/* High-Density Specification Console */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-16">
              
              {/* Technical Specifications Matrix */}
              <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] -mr-12 -mt-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                   <FileText className="w-64 h-64 text-slate-900" />
                </div>
                
                <div className="flex items-center gap-5 border-b border-slate-50 pb-10 relative z-10">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-2xl">
                    <DatabaseIcon className="w-7 h-7" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Technical Data Manifest</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-2">Core Asset Parameters</p>
                  </div>
                </div>

                <div className="space-y-12 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">Asset Nomenclature</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-18 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 placeholder:text-slate-300 focus:ring-8 focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner"
                      placeholder="e.g. Industrial Grade White Maize (Moisture: 13%)"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">Technical Specification Narrative</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full min-h-[240px] p-8 bg-slate-50 border border-slate-200 rounded-2xl text-base font-medium text-slate-700 leading-relaxed focus:ring-8 focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none resize-none shadow-inner"
                      placeholder="Provide exhaustive analysis of quality metrics, nutrient profiles, harvest synchronization logs, and logistics compliance..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">Commodity Classification</label>
                      <div className="relative group">
                         <select
                           value={formData.category}
                           onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                           className="w-full h-18 pl-6 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary/40 transition-all appearance-none cursor-pointer shadow-inner"
                         >
                           {categories.map((cat) => (
                             <option key={cat.value} value={cat.value}>{cat.label}</option>
                           ))}
                         </select>
                         <Layers className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">Logistics Hub Node</label>
                      <div className="relative group">
                         <select
                           value={formData.location}
                           onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                           className="w-full h-18 pl-6 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary/40 transition-all appearance-none cursor-pointer shadow-inner"
                         >
                           {locations.map((loc) => (
                             <option key={loc} value={loc}>{loc}</option>
                           ))}
                         </select>
                         <Globe className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trade Settlement Parameters */}
              <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-12 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] -mr-12 -mt-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                   <Landmark className="w-64 h-64 text-slate-900" />
                </div>
                
                <div className="flex items-center gap-5 border-b border-slate-50 pb-10 relative z-10">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <Target className="w-7 h-7" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Settlement & Economic Data</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-2">Trade Logic Configuration</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">Unit Settlement Rate (₦)</label>
                    <div className="relative group">
                       <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-300 group-focus-within:text-primary transition-colors">₦</div>
                       <input
                         type="number"
                         required
                         value={formData.price}
                         onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                         className="w-full h-18 pl-16 pr-6 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-bold text-slate-900 tracking-tighter focus:ring-8 focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner"
                         placeholder="0.00"
                       />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">Asset Magnitude Class</label>
                    <div className="relative group">
                       <select
                         value={formData.unit}
                         onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                         className="w-full h-18 pl-6 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary/40 transition-all appearance-none cursor-pointer shadow-inner"
                       >
                         {units.map((u) => (
                           <option key={u.value} value={u.value}>{u.label}</option>
                         ))}
                       </select>
                       <RefreshCw className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">Procurement Floor (Min. Batch)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.minOrder}
                      onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                      className="w-full h-18 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:ring-8 focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-1">Total Available Magnitude</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                      className="w-full h-18 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:ring-8 focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Manifest Hub */}
              <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-12 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] -mr-12 -mt-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <ImageIcon className="w-64 h-64 text-slate-900" />
                 </div>
                 
                 <div className="flex items-center gap-5 border-b border-slate-50 pb-10 relative z-10">
                   <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                     <Monitor className="w-7 h-7" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Visual Manifest Hub</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-2">Institutional Proof of Specification</p>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 relative z-10">
                   {formData.images.map((img, index) => (
                     <div key={index} className="relative aspect-square rounded-3xl border border-slate-200 p-2 group/img overflow-hidden bg-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500">
                        <img src={img} className="w-full h-full object-cover rounded-2xl grayscale group-hover/img:grayscale-0 transition-all duration-1000" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-4 right-4 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all hover:bg-red-500 shadow-2xl"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900/60 backdrop-blur-md opacity-0 group-hover/img:opacity-100 transition-opacity">
                           <p className="text-[8px] font-bold text-white uppercase tracking-[0.2em] text-center">{index === 0 ? 'Primary Node' : `Ref: ${index + 1}`}</p>
                        </div>
                     </div>
                   ))}
                   
                   {formData.images.length < 5 && (
                     <label className="aspect-square border-4 border-dashed border-slate-200 hover:border-primary/40 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-primary/5 group/upload shadow-inner">
                        <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300 group-hover/upload:text-primary group-hover/upload:bg-slate-900 group-hover/upload:border-slate-800 transition-all duration-500 shadow-xl">
                           <Upload className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-6">Upload Asset</span>
                       <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                     </label>
                   )}
                 </div>
                 <div className="flex items-center gap-4 text-slate-400 pt-6 border-t border-slate-50">
                    <Info className="w-5 h-5 text-primary" />
                    <p className="text-xs font-medium text-slate-500">Maximum Magnitude: 5 assets. Primary manifest determines terminal discovery thumbnail.</p>
                 </div>
              </div>

              {/* Terminal Execution Deck */}
              <div className="flex items-center gap-8 pt-16 border-t border-slate-200">
                 <button
                    type="submit"
                    disabled={isLoading}
                    className="h-20 flex-1 bg-primary text-white rounded-2xl font-bold text-lg uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-6 group"
                 >
                    {isLoading ? (
                       <RefreshCw className="w-8 h-8 animate-spin" />
                    ) : (
                       <>
                          {isEditing ? 'Authorize Specification Update' : 'Initialize Asset Node'}
                          <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                       </>
                    )}
                 </button>
                 <button
                   type="button"
                   onClick={() => navigate('/farmer/products')}
                   className="h-20 px-12 border-2 border-slate-200 bg-white text-slate-400 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                 >
                   Discard Manifest
                 </button>
              </div>
            </form>

            {/* Strategic Information Sidebar */}
            <div className="space-y-12">
               {showAiTips && aiSuggestions.length > 0 && (
                 <div className="bg-slate-900 p-12 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 opacity-10 -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-1000">
                      <Sparkles className="w-48 h-48 text-white" />
                   </div>
                   
                   <div className="flex items-center justify-between mb-12 relative z-10">
                     <div className="flex items-center gap-4 text-white">
                        <Sparkles className="w-7 h-7 text-primary" />
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Trade Optimization Report</h3>
                     </div>
                     <button onClick={() => setShowAiTips(false)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all">
                        <X className="w-5 h-5" />
                     </button>
                   </div>
  
                   <div className="space-y-8 relative z-10">
                     {aiSuggestions.map((suggestion, index) => (
                       <div key={index} className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-4 group/tip hover:bg-white/10 transition-all border-l-4 border-l-primary shadow-inner">
                         <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">{suggestion.field} Strategy</p>
                         <p className="text-sm text-slate-300 font-medium italic leading-relaxed">"{suggestion.suggestion}"</p>
                       </div>
                     ))}
                   </div>
                   
                   <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-center gap-4 opacity-30">
                      <ShieldCheck className="w-6 h-6 text-white" />
                      <p className="text-[9px] font-bold text-white uppercase tracking-[0.3em]">Institutional Compliance Checked</p>
                   </div>
                 </div>
               )}

               <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-12 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                  <div className="flex items-center gap-4 text-slate-900 border-b border-slate-50 pb-8 relative z-10">
                     <HelpCircle className="w-7 h-7 text-primary" />
                     <h4 className="text-[10px] font-bold uppercase tracking-[0.3em]">Protocol Requirements</h4>
                  </div>
                  <ul className="space-y-10 relative z-10">
                     {[
                       'Utilize high-fidelity institutional photography only.',
                       'Quantify specific technical specifications (Moisture, Grade).',
                       'Align unit settlement magnitude with regional hub liquidity.',
                       'Synchronize inventory levels post-fulfillment cycle completion.'
                     ].map((tip, i) => (
                       <li key={i} className="flex items-start gap-6 group cursor-default">
                          <div className="w-2 h-2 bg-primary rounded-full mt-3 shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                          <span className="text-sm text-slate-500 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">{tip}</span>
                       </li>
                     ))}
                  </ul>
                  <div className="pt-10 border-t border-slate-50 relative z-10">
                     <div className="flex items-center gap-5 text-slate-400">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Verified Listing Status</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Authorized Producer Terminal</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-900 p-12 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-1000">
                     <Activity className="w-48 h-48 text-white" />
                  </div>
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-4">
                        <Monitor className="w-6 h-6 text-primary" />
                        <p className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">System Sync</p>
                     </div>
                     <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                        All asset modifications are recorded in the institutional blockchain ledger for audit transparency and trade settlement verification.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductFormPage;
