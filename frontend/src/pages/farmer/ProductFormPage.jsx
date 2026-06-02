import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { productsAPI, aiAPI, uploadAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, ArrowLeft, Lightbulb, X, Sparkles, Plus, Image as ImageIcon, MapPin, Tag, Package, HelpCircle, ChevronRight, Info, ShieldCheck, Database, FileText, Globe, Landmark, RefreshCw, Smartphone, Monitor } from 'lucide-react';

const categories = [
  { value: 'produce', label: 'Fresh Produce & Grains' },
  { value: 'tools', label: 'Manual Farm Implements' },
  { value: 'equipment', label: 'Industrial Machinery' },
];

const units = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'bag', label: 'Standard Bag (50kg)' },
  { value: 'crate', label: 'Crate' },
  { value: 'ton', label: 'Metric Ton' },
  { value: 'piece', label: 'Individual Unit' },
];

const locations = [
  'Lagos Regional Hub', 'Kano Grain Node', 'Kaduna Supply Center', 'Oyo Farm Hub', 'Rivers Delta Node', 
  'Ogun Hub', 'Sokoto Grain Belt', 'Ebonyi Rice Hub', 'Imo Supply Hub',
  'Anambra Trade Hub', 'Benue Crop Hub', 'Plateau Highland Hub', 'Enugu Trade Center', 'Delta Coastal Hub', 'Abia Trade Node'
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
    minOrder: '1',
    available: '',
    location: 'Lagos Regional Hub',
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d019cb5?q=80&w=2080&auto=format&fit=crop'],
    coverImage: '',
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
              minOrder: (product.min_order || product.minOrder || 1).toString(),
              available: product.available.toString(),
              location: product.location,
              images: product.images || [formData.images[0]],
              coverImage: product.cover_image || product.coverImage || '',
            });
          }
        } catch (error) {
          toast({
            title: 'Failed to Load Product',
            description: 'The requested product listing could not be found.',
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

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check limit of 10 images
    if (formData.images.length + files.length > 10) {
      toast({
        title: 'Upload Limit Exceeded',
        description: 'You can upload a maximum of 10 product images.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of Array.from(files)) {
        toast({
          title: 'Uploading Photo',
          description: `Uploading ${file.name} to cloud storage...`,
        });
        const result = await uploadAPI.uploadFile(file);
        if (result && result.url) {
          uploadedUrls.push(result.url);
        }
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images.filter(img => img.includes('unsplash.com') || img.startsWith('http')), ...uploadedUrls],
      }));

      toast({
        title: 'Upload Successful',
        description: `Successfully uploaded ${uploadedUrls.length} image(s).`,
      });
    } catch (error) {
      console.error('Image upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      toast({
        title: 'Uploading Cover Banner',
        description: `Uploading ${file.name} to cloud storage...`,
      });
      const result = await uploadAPI.uploadFile(file);
      if (result && result.url) {
        setFormData(prev => ({
          ...prev,
          coverImage: result.url,
        }));
        toast({
          title: 'Cover Uploaded',
          description: 'Successfully uploaded your cover banner!',
        });
      }
    } catch (error) {
      console.error('Cover upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload cover banner. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingCover(false);
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
        title: 'Form Error',
        description: 'Please fill in all required fields (Product Name, Price, and Stock Quantity).',
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
        min_order: parseInt(formData.minOrder) || 1,
        available: parseInt(formData.available),
        cover_image: formData.coverImage,
        coverImage: formData.coverImage,
        farmerId: user?.id,
      };

      if (isEditing && id) {
        await productsAPI.update(id, productData);
        toast({
          title: 'Product Updated',
          description: 'Your product changes have been successfully saved.',
        });
      } else {
        await productsAPI.create(productData);
        toast({
          title: 'Product Listed',
          description: 'Your new product has been successfully added to the marketplace!',
        });
      }

      navigate('/farmer/products');
    } catch (error) {
      toast({
        title: 'Save Error',
        description: 'Failed to save product details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <MainLayout hideFooter hideAI>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
           <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin shadow-sm" />
              <p className="text-sm font-semibold text-gray-500">Loading Product Details...</p>
           </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-12">
           <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="space-y-3">
                    <button
                      onClick={() => navigate('/farmer/products')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-primary transition-colors uppercase tracking-wider group"
                    >
                       <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                       Back to Products List
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                       {isEditing ? 'Edit Product Listing' : 'List New Product'}
                    </h1>
                    <p className="text-gray-600">
                       {isEditing ? 'Update your product listing details, stock, pricing, and description below.' : 'List a new product on the marketplace to start receiving direct orders from buyers.'}
                    </p>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Form Column */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
              
              {/* Product Cover Image Block */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 relative overflow-hidden group">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="font-bold text-gray-900 leading-tight">Product Cover Banner</h2>
                     <p className="text-xs text-gray-400 font-semibold">Upload a beautiful cover banner for your listing</p>
                  </div>
                </div>

                <div className="relative w-full h-48 rounded-2xl border-2 border-dashed border-gray-205 overflow-hidden bg-gray-50 flex items-center justify-center group/cover shadow-inner">
                  {formData.coverImage ? (
                    <>
                      <img src={formData.coverImage} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="h-10 px-4 bg-white/95 text-slate-900 font-semibold rounded-lg text-xs hover:bg-white cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform">
                          <Upload className="w-3.5 h-3.5" />
                          Change Cover
                          <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                          className="h-10 px-4 bg-red-600 text-white font-semibold rounded-lg text-xs hover:bg-red-500 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                        >
                          <X className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                      {isUploadingCover ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin" />
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider animate-pulse">Uploading cover...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-xl border border-gray-150 flex items-center justify-center text-gray-400 shadow-sm group-hover/cover:text-primary transition-colors">
                            <Upload className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-3 group-hover/cover:text-primary transition-colors">Upload High-Res Cover Banner</span>
                          <span className="text-[10px] text-gray-400 font-semibold mt-1">Recommended: 1200 x 400px (JPG/PNG)</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" disabled={isUploadingCover} />
                    </label>
                  )}
                </div>
              </div>
              
              {/* Product Info Block */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 relative overflow-hidden group">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="font-bold text-gray-900 leading-tight">Product Details</h2>
                     <p className="text-xs text-gray-400 font-semibold">Tell buyers about what you are listing</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
                      placeholder="e.g. Fresh Sweet Yam, Premium White Maize, Organic Tomatoes"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Description & Quality details</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full min-h-[160px] p-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium text-gray-700 leading-relaxed focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none resize-none"
                      placeholder="Describe your produce or tool, including quality details, freshness, harvesting details, size, and organic status..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Product Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Pickup / Delivery Location</label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                      >
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Stock Block */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 relative group overflow-hidden">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="font-bold text-gray-900 leading-tight">Price & Stock Settings</h2>
                     <p className="text-xs text-gray-400 font-semibold">Set pricing details and stock quantities</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Price per unit (₦)</label>
                    <div className="relative group">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-300">₦</div>
                       <input
                         type="number"
                         required
                         value={formData.price}
                         onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                         className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
                         placeholder="0.00"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Unit of Measurement</label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                    >
                      {units.map((u) => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Minimum Order Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.minOrder}
                      onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Total Stock Quantity Available</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

               {/* Product Images Block */}
               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                       <h2 className="font-bold text-gray-900 leading-tight">Product Photos</h2>
                       <p className="text-xs text-gray-400 font-semibold">Upload photos of your product</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-xl border border-gray-200 p-1 group/img overflow-hidden bg-gray-50 shadow-sm">
                         <img src={img} className="w-full h-full object-cover rounded-lg" />
                         <button
                           type="button"
                           onClick={() => removeImage(index)}
                           className="absolute top-2 right-2 w-7 h-7 bg-slate-900/80 hover:bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all shadow-sm"
                         >
                           <X className="w-4 h-4" />
                         </button>
                         <div className="absolute bottom-0 left-0 right-0 p-1 bg-slate-900/70 text-[8px] font-bold text-white uppercase tracking-wider text-center">
                            {index === 0 ? 'Primary Photo' : `Photo ${index + 1}`}
                         </div>
                      </div>
                    ))}
                    
                    {formData.images.length < 10 && (
                      <label className="aspect-square border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group/upload shadow-inner">
                         {isUploading ? (
                           <div className="flex flex-col items-center gap-2">
                             <div className="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-450 animate-pulse">Uploading...</span>
                           </div>
                         ) : (
                           <>
                             <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 group-hover/upload:text-primary transition-colors shadow-sm">
                                <Upload className="w-5 h-5" />
                             </div>
                             <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2">Upload Photo</span>
                           </>
                         )}
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                      </label>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 pt-4 border-t border-gray-100">
                     <Info className="w-4 h-4 text-primary shrink-0" />
                     <p className="text-xs text-gray-500 font-semibold">Maximum of 10 images. The first image will be used as the primary photo in the shop.</p>
                  </div>
               </div>

              {/* Action Buttons Block */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                 <button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 flex-grow bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                 >
                    {isLoading ? (
                       <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                       <>
                          <span>{isEditing ? 'Save Changes' : 'List Product'}</span>
                          <ChevronRight className="w-4 h-4" />
                       </>
                    )}
                 </button>
                 <button
                   type="button"
                   onClick={() => navigate('/farmer/products')}
                   className="h-12 px-6 border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors active:scale-95 shadow-sm"
                 >
                   Cancel
                 </button>
              </div>
            </form>

            {/* Sidebar Column */}
            <div className="space-y-6">
               {showAiTips && aiSuggestions.length > 0 && (
                 <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group text-white">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                       <Sparkles className="w-24 h-24 text-white" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5 relative z-10">
                      <div className="flex items-center gap-2 text-white">
                         <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                         <h3 className="text-[10px] font-bold uppercase tracking-wider">Farm AI smart advice</h3>
                      </div>
                      <button onClick={() => setShowAiTips(false)} className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                         <X className="w-4 h-4" />
                      </button>
                    </div>
   
                    <div className="space-y-4 relative z-10">
                      {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1 group/tip hover:bg-white/10 transition-all border-l-4 border-l-primary shadow-inner">
                          <p className="text-[9px] font-bold text-primary uppercase tracking-wider">{suggestion.field} Strategy</p>
                          <p className="text-xs text-slate-300 font-semibold italic leading-relaxed">"{suggestion.suggestion}"</p>
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 relative overflow-hidden group">
                  <div className="flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-3">
                     <HelpCircle className="w-5 h-5 text-primary" />
                     <h4 className="font-bold text-sm">Listing Guidelines</h4>
                  </div>
                  <ul className="space-y-4 text-xs text-gray-500 font-semibold leading-relaxed">
                     {[
                       'Use clear, well-lit photos showing your actual product.',
                       'Provide detailed information about freshness, size, or grade.',
                       'Set reasonable prices that match current market rates.',
                       'Keep your stock quantities up to date to avoid cancelling orders.'
                     ].map((tip, i) => (
                       <li key={i} className="flex gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                          <span>{tip}</span>
                       </li>
                      ))}
                  </ul>
               </div>

               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4 relative overflow-hidden text-white">
                  <div className="flex items-center gap-2">
                     <ShieldCheck className="w-5 h-5 text-primary" />
                     <p className="text-[10px] font-bold text-white uppercase tracking-wider">Secure Escrow System</p>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed italic">
                     All listed products go through our buyer escrow system. You get paid directly to your bank account as soon as the buyer confirms delivery.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductFormPage;
