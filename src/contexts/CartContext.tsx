import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, cartAPI } from '@/services/api';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  itemCount: number;
  total: number;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  makeOffer: (itemId: string, offeredPrice: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
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

  const addItem = async (productId: string, quantity: number) => {
    const newItem = await cartAPI.add(productId, quantity);
    setItems(prev => [...prev, newItem]);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await cartAPI.update(itemId, quantity);
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = async (itemId: string) => {
    await cartAPI.remove(itemId);
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setItems([]);
  };

  const makeOffer = async (itemId: string, offeredPrice: number) => {
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
      : item.product.price;
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
