import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '@/services/api';
import { supabase } from '@/lib/supabase';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const refreshCart = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log("🔍 TRACE: AUTH READY:", !loadingAuth);
      console.log("🔍 TRACE: SESSION EXISTS:", !!session);
      console.log("🔍 TRACE: ACCESS TOKEN EXISTS:", !!session?.access_token);
      
      if (!session?.access_token) {
        console.warn("⚠️ TRACE: No access token found. Skipping cart fetch.");
        setItems([]);
        setIsLoading(false);
        return;
      }

      console.log("🚀 TRACE: FETCHING CART WITH TOKEN:", session.access_token.substring(0, 10) + "...");
      
      const cartItems = await cartAPI.get();
      setItems(Array.isArray(cartItems) ? cartItems : []);
    } catch (error) {
      console.error('❌ TRACE: Cart fetch failed:', error.message);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("✅ TRACE: Initial Auth Check Complete. Session:", !!session);
      setLoadingAuth(false);
      if (session) {
        refreshCart();
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("🔄 TRACE: Auth State Changed. Session:", !!session);
      if (session) {
        refreshCart();
      } else {
        setItems([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const addItem = async (productId, quantity) => {
    const newItem = await cartAPI.add(productId, quantity);
    setItems(prev => [...prev, newItem]);
  };

  const updateQuantity = async (itemId, quantity) => {
    await cartAPI.update(itemId, quantity);
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = async (itemId) => {
    await cartAPI.remove(itemId);
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setItems([]);
  };

  const makeOffer = async (itemId, offeredPrice) => {
    const updatedItem = await cartAPI.makeOffer(itemId, offeredPrice);
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? updatedItem : item
      )
    );
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const total = items.reduce((sum, item) => {
    const price = item.offeredPrice && item.offerStatus === 'accepted' 
      ? item.offeredPrice 
      : (item.product?.price || 0);
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        itemCount,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        makeOffer,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
