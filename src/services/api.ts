/**
 * AgroDirect API Service
 * 
 * This file contains all API endpoints as dummy implementations.
 * When integrating with Laravel backend, replace the dummy responses
 * with actual fetch/axios calls to your API.
 * 
 * Base URL should be configured via environment variable:
 * VITE_API_BASE_URL=https://your-api.com/api
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'user';
  phone?: string;
  avatar?: string;
  verified: boolean;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerAvatar?: string;
  name: string;
  description: string;
  category: 'produce' | 'tools' | 'equipment';
  price: number;
  unit: 'kg' | 'bag' | 'crate' | 'ton' | 'piece';
  minOrder: number;
  available: number;
  images: string[];
  location: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  offeredPrice?: number;
  offerStatus?: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterPrice?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  deliveryAddress: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'farmer' | 'user';
  content: string;
  timestamp: string;
  productId?: string;
  orderId?: string;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  escalated?: boolean;
}

// ============ AUTH API ============

export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
    role: 'farmer' | 'user';
    phone?: string;
  }): Promise<{ user: User; token: string }> => {
    await delay(800);
    // POST /api/auth/register
    return {
      user: {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email: data.email,
        name: data.name,
        role: data.role,
        phone: data.phone,
        verified: false,
      },
      token: 'dummy_jwt_token_' + Date.now(),
    };
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    await delay(600);
    // POST /api/auth/login
    return {
      user: {
        id: 'usr_demo123',
        email: data.email,
        name: 'Demo User',
        role: data.email.includes('farmer') ? 'farmer' : 'user',
        verified: true,
      },
      token: 'dummy_jwt_token_' + Date.now(),
    };
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    await delay(500);
    // POST /api/auth/forgot-password
    return { message: 'Password reset link sent to your email' };
  },

  verifyEmail: async (token: string): Promise<{ verified: boolean }> => {
    await delay(500);
    // POST /api/auth/verify-email
    return { verified: true };
  },

  logout: async (): Promise<void> => {
    await delay(200);
    // POST /api/auth/logout
  },

  getProfile: async (): Promise<User> => {
    await delay(300);
    // GET /api/auth/profile
    const stored = localStorage.getItem('agro_user');
    if (stored) return JSON.parse(stored);
    throw new Error('Not authenticated');
  },
};

// ============ PRODUCTS API ============

export const productsAPI = {
  getAll: async (filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }): Promise<Product[]> => {
    await delay(400);
    // GET /api/products
    return dummyProducts;
  },

  getById: async (id: string): Promise<Product | null> => {
    await delay(300);
    // GET /api/products/:id
    return dummyProducts.find(p => p.id === id) || null;
  },

  getByFarmer: async (farmerId: string): Promise<Product[]> => {
    await delay(300);
    // GET /api/farmer/products
    return dummyProducts.filter(p => p.farmerId === farmerId);
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    await delay(500);
    // POST /api/farmer/products
    return {
      id: 'prod_' + Math.random().toString(36).substr(2, 9),
      farmerId: 'farmer_demo',
      farmerName: 'Demo Farmer',
      name: data.name || '',
      description: data.description || '',
      category: data.category || 'produce',
      price: data.price || 0,
      unit: data.unit || 'kg',
      minOrder: data.minOrder || 1,
      available: data.available || 0,
      images: data.images || ['/placeholder.svg'],
      location: data.location || 'Lagos',
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    await delay(400);
    // PUT /api/farmer/products/:id
    const existing = dummyProducts.find(p => p.id === id);
    return { ...existing, ...data } as Product;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    // DELETE /api/farmer/products/:id
  },
};

// ============ CART API ============

export const cartAPI = {
  get: async (): Promise<CartItem[]> => {
    await delay(200);
    // GET /api/cart
    const stored = localStorage.getItem('agro_cart');
    return stored ? JSON.parse(stored) : [];
  },

  add: async (productId: string, quantity: number): Promise<CartItem> => {
    await delay(300);
    // POST /api/cart/add
    const product = dummyProducts.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    
    const item: CartItem = {
      id: 'cart_' + Math.random().toString(36).substr(2, 9),
      product,
      quantity,
    };
    
    const cart = JSON.parse(localStorage.getItem('agro_cart') || '[]');
    cart.push(item);
    localStorage.setItem('agro_cart', JSON.stringify(cart));
    
    return item;
  },

  update: async (itemId: string, quantity: number): Promise<CartItem> => {
    await delay(200);
    // PUT /api/cart/:itemId
    const cart = JSON.parse(localStorage.getItem('agro_cart') || '[]');
    const item = cart.find((i: CartItem) => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('agro_cart', JSON.stringify(cart));
    }
    return item;
  },

  remove: async (itemId: string): Promise<void> => {
    await delay(200);
    // DELETE /api/cart/:itemId
    const cart = JSON.parse(localStorage.getItem('agro_cart') || '[]');
    const filtered = cart.filter((i: CartItem) => i.id !== itemId);
    localStorage.setItem('agro_cart', JSON.stringify(filtered));
  },

  clear: async (): Promise<void> => {
    await delay(200);
    // DELETE /api/cart
    localStorage.removeItem('agro_cart');
  },

  makeOffer: async (itemId: string, offeredPrice: number): Promise<CartItem> => {
    await delay(400);
    // POST /api/cart/:itemId/offer
    const cart = JSON.parse(localStorage.getItem('agro_cart') || '[]');
    const item = cart.find((i: CartItem) => i.id === itemId);
    if (item) {
      item.offeredPrice = offeredPrice;
      item.offerStatus = 'pending';
      localStorage.setItem('agro_cart', JSON.stringify(cart));
    }
    return item;
  },
};

// ============ ORDERS API ============

export const ordersAPI = {
  getAll: async (): Promise<Order[]> => {
    await delay(400);
    // GET /api/orders
    return dummyOrders;
  },

  getById: async (id: string): Promise<Order | null> => {
    await delay(300);
    // GET /api/orders/:id
    return dummyOrders.find(o => o.id === id) || null;
  },

  create: async (data: {
    items: CartItem[];
    deliveryAddress: string;
    paymentMethod: string;
  }): Promise<Order> => {
    await delay(600);
    // POST /api/checkout
    return {
      id: 'ord_' + Math.random().toString(36).substr(2, 9),
      items: data.items,
      status: 'pending',
      total: data.items.reduce((sum, item) => 
        sum + (item.offeredPrice || item.product.price) * item.quantity, 0),
      createdAt: new Date().toISOString(),
      deliveryAddress: data.deliveryAddress,
      paymentStatus: 'pending',
    };
  },

  // Farmer endpoints
  getFarmerOrders: async (): Promise<Order[]> => {
    await delay(400);
    // GET /api/farmer/orders
    return dummyOrders;
  },

  respondToOffer: async (orderId: string, itemId: string, response: {
    action: 'accept' | 'reject' | 'counter';
    counterPrice?: number;
  }): Promise<CartItem> => {
    await delay(400);
    // POST /api/farmer/offer/respond
    return {
      id: itemId,
      product: dummyProducts[0],
      quantity: 10,
      offerStatus: response.action === 'accept' ? 'accepted' : 
                   response.action === 'reject' ? 'rejected' : 'countered',
      counterPrice: response.counterPrice,
    };
  },
};

// ============ CHAT API ============

export const chatAPI = {
  getMessages: async (conversationId: string): Promise<ChatMessage[]> => {
    await delay(300);
    // GET /api/chat/messages
    return dummyChatMessages;
  },

  sendMessage: async (data: {
    recipientId: string;
    content: string;
    productId?: string;
    orderId?: string;
  }): Promise<ChatMessage> => {
    await delay(200);
    // POST /api/chat/send
    return {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      senderId: 'current_user',
      senderName: 'You',
      senderRole: 'user',
      content: data.content,
      timestamp: new Date().toISOString(),
      productId: data.productId,
      orderId: data.orderId,
    };
  },

  getConversations: async (): Promise<{
    id: string;
    participantName: string;
    participantRole: 'farmer' | 'user';
    lastMessage: string;
    unread: number;
    productName?: string;
  }[]> => {
    await delay(300);
    // GET /api/chat/conversations
    return [
      {
        id: 'conv_1',
        participantName: 'Adamu Musa',
        participantRole: 'farmer',
        lastMessage: 'The tomatoes are ready for delivery',
        unread: 2,
        productName: 'Fresh Tomatoes',
      },
      {
        id: 'conv_2',
        participantName: 'Chioma Okafor',
        participantRole: 'farmer',
        lastMessage: 'I can offer you 15% discount on bulk',
        unread: 0,
        productName: 'Organic Rice',
      },
    ];
  },
};

// ============ AI API ============

export const aiAPI = {
  chat: async (message: string): Promise<AIResponse> => {
    await delay(800);
    // POST /api/ai/assistant
    const responses: Record<string, AIResponse> = {
      default: {
        message: "I'm here to help you with your agricultural marketplace needs. You can ask me about products, orders, or how to use the platform.",
        suggestions: ['How do I place an order?', 'Find farmers near me', 'How does bulk buying work?'],
      },
    };
    return responses.default;
  },

  getOnboardingTips: async (role: 'farmer' | 'user'): Promise<{
    tips: { id: string; title: string; description: string; dismissed: boolean }[];
  }> => {
    await delay(300);
    // GET /api/ai/onboarding-tips
    if (role === 'farmer') {
      return {
        tips: [
          { id: '1', title: 'Complete Your Profile', description: 'Add your farm location and photos to build trust with buyers.', dismissed: false },
          { id: '2', title: 'List Your Products', description: 'Start by listing 3-5 of your best products with clear photos.', dismissed: false },
          { id: '3', title: 'Set Competitive Prices', description: 'Check similar products to price competitively.', dismissed: false },
        ],
      };
    }
    return {
      tips: [
        { id: '1', title: 'Browse Products', description: 'Explore fresh produce from verified farmers across Nigeria.', dismissed: false },
        { id: '2', title: 'Negotiate Prices', description: 'You can make offers on bulk purchases for better deals.', dismissed: false },
        { id: '3', title: 'Chat with Farmers', description: 'Message farmers directly to ask questions about products.', dismissed: false },
      ],
    };
  },

  getProductSuggestions: async (partialData: Partial<Product>): Promise<{
    suggestions: { field: string; suggestion: string }[];
  }> => {
    await delay(400);
    // POST /api/ai/product-suggestions
    return {
      suggestions: [
        { field: 'price', suggestion: 'Based on similar products, consider pricing between ₦500-₦800 per kg.' },
        { field: 'description', suggestion: 'Add harvest date and storage conditions for better sales.' },
      ],
    };
  },

  getPricingInsights: async (productId: string): Promise<{
    averagePrice: number;
    priceRange: { min: number; max: number };
    recommendation: string;
  }> => {
    await delay(400);
    // GET /api/ai/pricing-insights
    return {
      averagePrice: 650,
      priceRange: { min: 450, max: 850 },
      recommendation: 'Your price is competitive. Consider offering a 10% bulk discount.',
    };
  },

  getRecommendations: async (): Promise<Product[]> => {
    await delay(400);
    // GET /api/ai/recommendations
    return dummyProducts.slice(0, 4);
  },

  getCartInsights: async (items: CartItem[]): Promise<{
    savings: number;
    suggestions: string[];
  }> => {
    await delay(300);
    // POST /api/ai/cart-insights
    return {
      savings: 2500,
      suggestions: [
        'Buy 5 more kg of tomatoes to get 10% bulk discount',
        'This farmer offers free delivery for orders above ₦50,000',
      ],
    };
  },

  getOrderHealth: async (orderId: string): Promise<{
    status: 'healthy' | 'warning' | 'issue';
    message: string;
  }> => {
    await delay(300);
    // GET /api/ai/order-health
    return {
      status: 'healthy',
      message: 'Your order is on track for delivery.',
    };
  },

  getFarmerInsights: async (): Promise<{
    totalSales: number;
    topProducts: string[];
    improvementTips: string[];
  }> => {
    await delay(400);
    // GET /api/ai/farmer-insights
    return {
      totalSales: 450000,
      topProducts: ['Fresh Tomatoes', 'Organic Rice'],
      improvementTips: [
        'Add more product photos to increase sales by 30%',
        'Respond to messages within 2 hours for better ratings',
        'Consider offering bulk discounts on slow-moving items',
      ],
    };
  },
};

// ============ WALLET API (Farmer) ============

export const walletAPI = {
  getBalance: async (): Promise<{
    available: number;
    pending: number;
    currency: string;
  }> => {
    await delay(300);
    // GET /api/farmer/wallet
    return {
      available: 125000,
      pending: 45000,
      currency: 'NGN',
    };
  },

  getTransactions: async (): Promise<{
    id: string;
    type: 'credit' | 'debit' | 'withdrawal';
    amount: number;
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
  }[]> => {
    await delay(400);
    // GET /api/farmer/wallet/transactions
    return [
      { id: 'txn_1', type: 'credit', amount: 25000, description: 'Order #ORD001 payment', date: '2024-01-15', status: 'completed' },
      { id: 'txn_2', type: 'withdrawal', amount: 50000, description: 'Bank withdrawal', date: '2024-01-14', status: 'completed' },
      { id: 'txn_3', type: 'credit', amount: 18500, description: 'Order #ORD002 payment', date: '2024-01-13', status: 'pending' },
    ];
  },

  requestWithdrawal: async (amount: number): Promise<{
    success: boolean;
    message: string;
  }> => {
    await delay(500);
    // POST /api/farmer/wallet/withdraw
    return {
      success: true,
      message: 'Withdrawal request submitted. You will receive your funds within 24 hours.',
    };
  },
};

// ============ DUMMY DATA ============

const dummyProducts: Product[] = [
  {
    id: 'prod_001',
    farmerId: 'farmer_001',
    farmerName: 'Adamu Musa',
    name: 'Fresh Tomatoes',
    description: 'Freshly harvested tomatoes from our organic farm in Kaduna. Perfect for restaurants and bulk buyers.',
    category: 'produce',
    price: 650,
    unit: 'kg',
    minOrder: 10,
    available: 500,
    images: ['/placeholder.svg'],
    location: 'Kaduna',
    rating: 4.8,
    reviewCount: 124,
    createdAt: '2024-01-10',
  },
  {
    id: 'prod_002',
    farmerId: 'farmer_002',
    farmerName: 'Chioma Okafor',
    name: 'Organic Rice (50kg Bag)',
    description: 'Premium quality Nigerian rice, locally grown and processed. No chemicals used.',
    category: 'produce',
    price: 42000,
    unit: 'bag',
    minOrder: 1,
    available: 200,
    images: ['/placeholder.svg'],
    location: 'Ebonyi',
    rating: 4.9,
    reviewCount: 89,
    createdAt: '2024-01-08',
  },
  {
    id: 'prod_003',
    farmerId: 'farmer_003',
    farmerName: 'Ibrahim Danladi',
    name: 'Fresh Onions',
    description: 'Large, quality onions from Sokoto farms. Available in bulk quantities.',
    category: 'produce',
    price: 450,
    unit: 'kg',
    minOrder: 20,
    available: 1000,
    images: ['/placeholder.svg'],
    location: 'Sokoto',
    rating: 4.6,
    reviewCount: 67,
    createdAt: '2024-01-12',
  },
  {
    id: 'prod_004',
    farmerId: 'farmer_001',
    farmerName: 'Adamu Musa',
    name: 'Red Peppers (Tatashe)',
    description: 'Fresh red bell peppers, perfect for cooking. Harvested within the last 24 hours.',
    category: 'produce',
    price: 800,
    unit: 'kg',
    minOrder: 5,
    available: 150,
    images: ['/placeholder.svg'],
    location: 'Kaduna',
    rating: 4.7,
    reviewCount: 45,
    createdAt: '2024-01-11',
  },
  {
    id: 'prod_005',
    farmerId: 'farmer_004',
    farmerName: 'Blessing Eze',
    name: 'Palm Oil (25 Litres)',
    description: 'Pure, unadulterated palm oil from the heart of Imo State.',
    category: 'produce',
    price: 28000,
    unit: 'crate',
    minOrder: 1,
    available: 50,
    images: ['/placeholder.svg'],
    location: 'Imo',
    rating: 4.9,
    reviewCount: 156,
    createdAt: '2024-01-05',
  },
  {
    id: 'prod_006',
    farmerId: 'farmer_005',
    farmerName: 'Musa Aliyu',
    name: 'Maize/Corn (Per Ton)',
    description: 'High quality maize suitable for feed mills and food processing.',
    category: 'produce',
    price: 380000,
    unit: 'ton',
    minOrder: 1,
    available: 25,
    images: ['/placeholder.svg'],
    location: 'Kano',
    rating: 4.5,
    reviewCount: 34,
    createdAt: '2024-01-09',
  },
  {
    id: 'prod_007',
    farmerId: 'farmer_002',
    farmerName: 'Chioma Okafor',
    name: 'Irrigation Sprinkler System',
    description: 'Complete drip irrigation kit for 1 acre. Easy to install.',
    category: 'equipment',
    price: 85000,
    unit: 'piece',
    minOrder: 1,
    available: 15,
    images: ['/placeholder.svg'],
    location: 'Ebonyi',
    rating: 4.4,
    reviewCount: 12,
    createdAt: '2024-01-07',
  },
  {
    id: 'prod_008',
    farmerId: 'farmer_003',
    farmerName: 'Ibrahim Danladi',
    name: 'Hand Tractor',
    description: 'Compact hand tractor for small to medium farms. Fuel efficient.',
    category: 'equipment',
    price: 450000,
    unit: 'piece',
    minOrder: 1,
    available: 5,
    images: ['/placeholder.svg'],
    location: 'Sokoto',
    rating: 4.8,
    reviewCount: 8,
    createdAt: '2024-01-06',
  },
];

const dummyOrders: Order[] = [
  {
    id: 'ord_001',
    items: [
      { id: 'cart_1', product: dummyProducts[0], quantity: 50 },
      { id: 'cart_2', product: dummyProducts[2], quantity: 30 },
    ],
    status: 'confirmed',
    total: 46000,
    createdAt: '2024-01-14',
    deliveryAddress: '12 Marina Road, Lagos Island, Lagos',
    paymentStatus: 'paid',
  },
  {
    id: 'ord_002',
    items: [
      { id: 'cart_3', product: dummyProducts[1], quantity: 5 },
    ],
    status: 'pending',
    total: 210000,
    createdAt: '2024-01-15',
    deliveryAddress: '45 Adeola Odeku, Victoria Island, Lagos',
    paymentStatus: 'pending',
  },
];

const dummyChatMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'farmer_001',
    senderName: 'Adamu Musa',
    senderRole: 'farmer',
    content: 'Hello! Thank you for your interest in my tomatoes.',
    timestamp: '2024-01-15T10:30:00Z',
    productId: 'prod_001',
  },
  {
    id: 'msg_2',
    senderId: 'user_001',
    senderName: 'You',
    senderRole: 'user',
    content: 'Hi! Can you do 50kg at ₦600 per kg?',
    timestamp: '2024-01-15T10:32:00Z',
    productId: 'prod_001',
  },
  {
    id: 'msg_3',
    senderId: 'farmer_001',
    senderName: 'Adamu Musa',
    senderRole: 'farmer',
    content: 'For 50kg, I can offer ₦620 per kg. That\'s my best price for this quantity.',
    timestamp: '2024-01-15T10:35:00Z',
    productId: 'prod_001',
  },
];

export { dummyProducts, dummyOrders, dummyChatMessages };
