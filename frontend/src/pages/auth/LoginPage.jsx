import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff, Mail, Lock, Check, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('remembered_email') ? true : false);
  const [formData, setFormData] = useState({
    email: localStorage.getItem('remembered_email') || '',
    password: '',
  });

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('remembered_email', formData.email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      await login(formData.email, formData.password);
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back to AgroDirect!',
      });

      const storedUser = localStorage.getItem('agro_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        navigate(user.role === 'farmer' ? '/farmer/dashboard' : '/marketplace');
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password. Please try again.',
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
           src="https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=2072&auto=format&fit=crop" 
           alt="Agriculture" 
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
         
         <div className="absolute bottom-0 left-0 p-16 text-white">
            <h2 className="text-4xl font-bold mb-4">
               Welcome back to AgroDirect.
            </h2>
            <p className="text-lg text-white/80 max-w-md">
               Access your account to manage your farm products, track orders, and connect with buyers.
            </p>
         </div>
      </div>

      {/* 
        Login Form Side
      */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-16 bg-gray-50">
         <div className="w-full max-w-md space-y-10">
            
            {/* Logo Mobile Only */}
            <Link to="/" className="flex lg:hidden items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-primary" />
               </div>
               <span className="text-xl font-bold text-gray-900">AgroDirect</span>
            </Link>

            <div className="space-y-3">
               <h1 className="text-3xl font-bold text-gray-900">Login</h1>
               <p className="text-gray-500">
                  Enter your email and password to access your account.
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                     Email Address
                  </label>
                  <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                        placeholder="you@example.com"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                     <label className="text-sm font-semibold text-gray-700">
                        Password
                     </label>
                     <Link to="/forgot-password" title="Forgot Password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        Forgot Password?
                     </Link>
                  </div>
                  <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full h-14 pl-12 pr-12 bg-white border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                        placeholder="••••••••"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                     >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                     </button>
                  </div>
               </div>

               <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <div className="relative flex items-center justify-center">
                        <input
                           type="checkbox"
                           checked={rememberMe}
                           onChange={(e) => setRememberMe(e.target.checked)}
                           className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-primary/20 focus:ring-2 checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                        />
                        <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                     </div>
                     <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors select-none">
                        Remember Me
                     </span>
                  </label>
               </div>

               <div className="pt-2">
                  <button
                     type="submit"
                     disabled={isLoading}
                     className="w-full h-14 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                  >
                     {isLoading ? (
                        <>
                           <Loader2 className="w-5 h-5 animate-spin" />
                           Logging in...
                        </>
                     ) : (
                        <>
                           Login
                           <ArrowRight className="w-5 h-5" />
                        </>
                     )}
                  </button>
               </div>
            </form>

            <div className="text-center pt-6">
               <p className="text-gray-600">
                  Don't have an account yet?{' '}
                  <Link to="/signup" className="text-primary font-semibold hover:underline">
                     Sign Up
                  </Link>
               </p>
            </div>
         </div>
      </div>
   </div>
  );
};

export default LoginPage;
