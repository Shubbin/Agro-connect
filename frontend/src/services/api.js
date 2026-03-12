/**
 * AgroDirect API Service
 * 
 * This file contains all API endpoints implementations.
 * It uses fetch to communicate with the PHP backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API error' }));
    throw new Error(error.message || 'API error');
  }
  
  return response.json();
};

// ============ AUTH API ============

export const authAPI = {
  register: async (data) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyEmail: async (token) => {
    return apiRequest(`/auth/verify-email?token=${token}`);
  },

  logout: async () => {
    return apiRequest('/auth/logout', { method: 'POST' });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },
};

// ============ PRODUCTS API ============

export const productsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(`/products/all?${params}`);
  },

  getById: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  getByFarmer: async (farmerId) => {
    return apiRequest(`/farmer/products?farmerId=${farmerId}`);
  },

  create: async (data) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/products/${id}`, { method: 'DELETE' });
  },
};

// ============ CART API ============

export const cartAPI = {
  get: async () => {
    return apiRequest('/cart');
  },

  add: async (productId, quantity) => {
    return apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  update: async (itemId, quantity) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  remove: async (itemId) => {
    return apiRequest(`/cart/${itemId}`, { method: 'DELETE' });
  },

  clear: async () => {
    return apiRequest('/cart', { method: 'DELETE' });
  },

  makeOffer: async (itemId, offeredPrice) => {
    return apiRequest(`/cart/${itemId}/offer`, {
      method: 'POST',
      body: JSON.stringify({ offeredPrice }),
    });
  },
};

// ============ ORDERS API ============

export const ordersAPI = {
  getAll: async () => {
    return apiRequest('/orders');
  },

  getById: async (id) => {
    return apiRequest(`/orders/${id}`);
  },

  create: async (data) => {
    return apiRequest('/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getFarmerOrders: async () => {
    return apiRequest('/farmer/orders');
  },

  respondToOffer: async (orderId, itemId, response) => {
    return apiRequest('/farmer/offer/respond', {
      method: 'POST',
      body: JSON.stringify({ orderId, itemId, ...response }),
    });
  },

  updateTracking: async (orderId, trackingNumber, estimatedDelivery) => {
    return apiRequest('/orders/update-tracking', {
      method: 'POST',
      body: JSON.stringify({ orderId, trackingNumber, estimatedDelivery }),
    });
  },

  confirmDelivery: async (orderId) => {
    return apiRequest('/orders/confirm-delivery', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },
};

// ============ CHAT API ============

export const chatAPI = {
  getMessages: async (conversationId) => {
    return apiRequest(`/chat/messages?conversationId=${conversationId}`);
  },

  sendMessage: async (data) => {
    return apiRequest('/chat/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getConversations: async (userId) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiRequest(`/chat/conversations${query}`);
  },

  getUsers: async () => {
    return apiRequest('/chat/users');
  },
};

// ============ AI API ============

export const aiAPI = {
  chat: async (message) => {
    return apiRequest('/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  getOnboardingTips: async (role) => {
    return apiRequest(`/ai/onboarding-tips?role=${role}`);
  },

  getProductSuggestions: async (partialData) => {
    return apiRequest('/ai/product-suggestions', {
      method: 'POST',
      body: JSON.stringify(partialData),
    });
  },

  getPricingInsights: async (productId) => {
    return apiRequest(`/ai/pricing-insights?productId=${productId}`);
  },

  getRecommendations: async () => {
    return apiRequest('/ai/recommendations');
  },

  getCartInsights: async (items) => {
    return apiRequest('/ai/cart-insights', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  getOrderHealth: async (orderId) => {
    return apiRequest(`/ai/order-health?orderId=${orderId}`);
  },

  getFarmerInsights: async () => {
    return apiRequest('/ai/farmer-insights');
  },
};

// ============ WALLET API (Farmer) ============

export const walletAPI = {
  getBalance: async () => {
    return apiRequest('/wallet/balance');
  },

  getTransactions: async () => {
    return apiRequest('/wallet/transactions');
  },

  requestWithdrawal: async (amount) => {
    return apiRequest('/farmer/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },
};

// ============ UPLOAD API ============

export const uploadAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // We use a separate fetch here instead of apiRequest because apiRequest 
    // forces JSON headers which breaks multipart/form-data
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      // No Content-Type header - browser will set it with boundary
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    return response.json();
  }
};

// ============ STATS API ============

export const statsAPI = {
  getSummary: async () => {
    return apiRequest('/stats');
  },
};
