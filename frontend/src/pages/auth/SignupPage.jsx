import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Check, User, Mail, Lock, Phone, ArrowLeft, ArrowRight, Loader2, ShoppingBag, Eye, EyeOff } from 'lucide-react';

export const SignupPage = () => {
  const [step, setStep] = useState('role');
  const [role, setRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep('details');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match. Please verify and try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        ...formData,
        role
      });
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created. Please log in.',
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'An error occurred during account creation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* 
        Image Side
      */}
      <div className="hidden lg:block lg:w-1/2 relative">
         <img 
           src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2045&auto=format&fit=crop" 
           alt="Agricultural trading" 
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
         
         <div className="absolute bottom-0 left-0 p-16 text-white space-y-6">
            <h2 className="text-4xl font-bold">
               Join Nigeria's Premier Agricultural Hub.
            </h2>
            <p className="text-lg text-white/80 max-w-md">
               Join over 2,400 farmers and buyers trading with peace of mind.
            </p>
            
            <div className="space-y-4">
              {[
                 'Direct contact between farmers and buyers',
                 'Secure payments held until delivery is verified',
                 'Easy shipment tracking and logistics support'
              ].map((benefit) => (
                 <div key={benefit} className="flex items-center gap-3 text-white/90">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                       <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{benefit}</span>
                 </div>
              ))}
            </div>
         </div>
      </div>

      {/* 
        Form Side
      */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-16 bg-gray-50 overflow-y-auto">
         <div className="w-full max-w-md space-y-10">
            
            {/* Logo Mobile Only */}
            <Link to="/" className="flex lg:hidden items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-primary" />
               </div>
               <span className="text-xl font-bold text-gray-900">AgroDirect</span>
            </Link>

            {step === 'role' ? (
              <div className="space-y-8">
                <div className="space-y-3">
                   <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
                   <p className="text-gray-500">Select how you want to use the platform.</p>
                </div>

                <div className="grid gap-4">
                  {[
                    { id: 'user', icon: ShoppingBag, title: 'I want to Buy', desc: 'I want to source and purchase agricultural products.' },
                    { id: 'farmer', icon: Leaf, title: 'I want to Sell', desc: 'I am a farmer looking to list and sell my harvest.' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleRoleSelect(option.id)}
                      className="flex items-center gap-4 p-6 rounded-2xl border border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5 transition-all text-left group shadow-sm active:scale-98"
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shadow-inner">
                        <option.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">{option.title}</h3>
                        <p className="text-sm text-gray-500 leading-normal">{option.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-2" />
                    </button>
                  ))}
                </div>

                <div className="text-center pt-6 border-t border-gray-200">
                   <p className="text-gray-600">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary font-semibold hover:underline">
                         Login
                      </Link>
                   </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                   <button type="button" onClick={() => setStep('role')} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors active:scale-95 group">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Go Back
                   </button>
                   <div className="space-y-2">
                      <h1 className="text-3xl font-bold text-gray-900">Your Details</h1>
                      <p className="text-gray-500">
                         Create your profile as a <span className="text-primary font-semibold capitalize">{role === 'farmer' ? 'Farmer' : 'Buyer'}</span>.
                      </p>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                       <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" placeholder="e.g. John Doe / Farm Enterprise" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                       <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" placeholder="e.g. trade@example.ng" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                       <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" placeholder="e.g. 08012345678" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full h-14 pl-12 pr-12 bg-white border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                       <input type={showPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" placeholder="Confirm your password..." />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                   <button type="submit" disabled={isLoading} className="w-full h-14 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm">
                      {isLoading ? (
                         <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Registering...
                         </>
                      ) : (
                         <>
                            Create Account
                            <ArrowRight className="w-5 h-5" />
                         </>
                      )}
                   </button>
                </div>
              </form>
            )}
         </div>
      </div>
    </div>
  );
};

export default SignupPage;
