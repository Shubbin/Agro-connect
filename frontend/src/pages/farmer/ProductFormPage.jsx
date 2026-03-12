import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { productsAPI, aiAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, ArrowLeft, Lightbulb, X, Sparkles, Plus, Image as ImageIcon, MapPin, Tag, Package, HelpCircle } from 'lucide-react';

const categories = [
  { value: 'produce', label: 'Fresh Produce' },
  { value: 'tools', label: 'Farm Tools' },
  { value: 'equipment', label: 'Equipment' },
];

const units = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'bag', label: 'Bag' },
  { value: 'crate', label: 'Crate' },
  { value: 'ton', label: 'Ton' },
  { value: 'piece', label: 'Piece' },
];

const locations = [
  'Lagos', 'Kano', 'Kaduna', 'Oyo', 'Rivers', 'Ogun', 'Sokoto', 'Ebonyi', 'Imo',
  'Anambra', 'Benue', 'Plateau', 'Enugu', 'Delta', 'Abia'
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
    location: 'Lagos',
    images: ['/placeholder.svg'],
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
              images: product.images || ['/placeholder.svg'],
            });
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Could not load product details.',
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

  // Fetch AI suggestions when product data changes
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
          // Silently fail for AI suggestions
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData.name, formData.category, formData.price]);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload to a server and get URLs back
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images.filter(img => img !== '/placeholder.svg'), ...newImages],
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
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        unit: formData.unit,
        minOrder: parseInt(formData.minOrder) || 1,
        available: parseInt(formData.available),
        location: formData.location,
        farmerId: user?.id,
        images: formData.images.length > 0 ? formData.images : ['/placeholder.svg'],
      };

      if (isEditing && id) {
        await productsAPI.update(id, productData);
        toast({
          title: 'Product updated',
          description: 'Your product has been updated successfully.',
        });
      } else {
        await productsAPI.create(productData);
        toast({
          title: 'Product created',
          description: 'Your product has been listed on the marketplace.',
        });
      }

      navigate('/farmer/products');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not save product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 animate-fade-in">
             <div className="space-y-4">
                <Link to="/farmer/products" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-black uppercase tracking-widest text-[10px] mb-4">
                   <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                   My Products
                </Link>
                <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.9]">
                   {isEditing ? 'Edit' : 'Post New'} <span className="text-gradient">Product</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-md">
                   {isEditing ? 'Update your product details to help more buyers find it.' : 'Fill in the details below to put your product up for sale.'}
                </p>
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-10 animate-fade-in-up">
              {/* Product Specifications Section */}
              <div className="glass-premium p-10 rounded-[3rem] border-border/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <Tag className="w-32 h-32 text-primary" />
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Tag className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Specifications</h2>
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="sm:col-span-2 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                        What are you selling?
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-16 px-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-2xl transition-all"
                        placeholder="e.g., Organic Vine-Ripened Tomatoes"
                      />
                    </div>

                    <div className="sm:col-span-2 group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                        Describe your product
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full min-h-[160px] p-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-3xl transition-all resize-none"
                        placeholder="Provide details about your product..."
                      />
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-16 px-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-2xl transition-all appearance-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                        Where is it located?
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full h-16 px-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-2xl transition-all appearance-none"
                      >
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Economic & Logistics Configuration */}
              <div className="glass-premium p-10 rounded-[3rem] border-border/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <Package className="w-32 h-32 text-primary" />
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Package className="w-6 h-6" />
                  </div>
                   <h2 className="text-2xl font-black text-foreground tracking-tight">Price & Shipping</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-8 relative z-10">
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                       Price per unit (₦)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full h-16 px-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-2xl transition-all"
                      placeholder="650"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                       How do you sell it? (Kg, Bag, etc.)
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full h-16 px-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-2xl transition-all appearance-none"
                    >
                      {units.map((u) => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                       Minimum you can sell
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.minOrder}
                      onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                      className="w-full h-16 px-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-2xl transition-all"
                      placeholder="10"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                       How much do you have?
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                      className="w-full h-16 px-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 rounded-2xl transition-all"
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Assets Allocation */}
              <div className="glass-premium p-10 rounded-[3rem] border-border/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <ImageIcon className="w-32 h-32 text-primary" />
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                   <h2 className="text-2xl font-black text-foreground tracking-tight">Product Photos</h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 relative z-10">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative aspect-square glass-premium rounded-2xl border-border/50 p-1.5 group/img overflow-hidden">
                       <div className="w-full h-full rounded-xl overflow-hidden bg-muted">
                          <img
                            src={img}
                            alt={`Asset ${index + 1}`}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                          />
                       </div>
                       <button
                         type="button"
                         onClick={() => removeImage(index)}
                         className="absolute top-3 right-3 w-8 h-8 glass-premium bg-destructive text-white border-destructive/20 rounded-xl flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all hover:scale-110"
                       >
                         <X className="w-4 h-4" />
                       </button>
                    </div>
                  ))}
                  
                  {formData.images.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-border/50 hover:border-primary/40 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-primary/[0.02] group/upload">
                      <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-3 group-hover/upload:scale-110 transition-transform">
                         <Upload className="w-6 h-6 text-muted-foreground group-hover/upload:text-primary transition-colors" />
                      </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest px-1">
                    Limit: 05 Photos. First photo will be shown on the main page.
                </p>
              </div>

              {/* Action Suite */}
              <div className="flex items-center gap-6 pt-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                 <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-20 flex-1 rounded-[1.5rem] btn-premium text-xl font-black tracking-tight"
                 >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                         <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                         Synchronizing...
                      </div>
                    ) : (
                      isEditing ? 'Save Changes' : 'Post Product'
                    )}
                 </Button>
                 <Button
                   type="button"
                   variant="outline"
                   onClick={() => navigate('/farmer/products')}
                   className="h-20 px-8 rounded-[1.5rem] border-border/50 font-black tracking-tight hover:bg-white text-muted-foreground"
                 >
                   Discard
                 </Button>
              </div>
            </form>

            {/* Intelligent Assistance Sidebar */}
            <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
               <div className="sticky top-28 space-y-8">
                  {showAiTips && aiSuggestions.length > 0 && (
                    <div className="glass-premium p-10 rounded-[3rem] border-primary/20 bg-primary/[0.01] relative overflow-hidden group shadow-xl shadow-primary/5">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                         <Sparkles className="w-32 h-32 text-primary" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Lightbulb className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl font-black text-foreground tracking-tight">AI Audit</h3>
                        </div>
                        <button
                          onClick={() => setShowAiTips(false)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-6 relative z-10">
                        {aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="glass-premium bg-white/40 p-5 rounded-2xl border-border/30 group/tip hover:border-primary/30 transition-all">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                               <Sparkles className="w-3 h-3" />
                               {suggestion.field} Optimization
                            </p>
                            <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">
                               "{suggestion.suggestion}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="glass-premium p-10 rounded-[3rem] border-border/50 relative overflow-hidden">
                     <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        Best Practices
                     </h4>
                     <ul className="space-y-4">
                        {[
                          'Ensure images use natural lighting',
                          'Define precise harvest dates in description',
                          'Verify current market rates via AI assistant',
                          'Maintain stock buffer for offline orders'
                        ].map((tip, i) => (
                          <li key={i} className="flex items-start gap-3 group">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-1.5 group-hover:scale-150 transition-transform group-hover:bg-primary" />
                             <span className="text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors">{tip}</span>
                          </li>
                        ))}
                     </ul>
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
