import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '@/services/api';



const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = async () => {
    try {
      const cartItems = await cartAPI.get();
      setItems(cartItems);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
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
