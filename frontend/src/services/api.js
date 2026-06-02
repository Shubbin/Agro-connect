/**
 * AgroDirect API Service
 * 
 * This file contains all API endpoints implementations.
 * It uses fetch to communicate with the PHP backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('agro_token');
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🚀 TRACE [API]: Requesting ${endpoint}`);
  console.log(`🔍 TRACE [API]: Current LocalStorage Token:`, token ? token.substring(0, 10) + "..." : "MISSING");

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
  
  if (response.status === 401) {
    console.error(`❌ TRACE [API]: 401 Unauthorized for ${endpoint}`);
    // Clear stale session if unauthorized
    const currentToken = localStorage.getItem('agro_token');
    if (currentToken) {
      console.warn('Unauthorized request. Clearing stale session.');
      localStorage.removeItem('agro_token');
      localStorage.removeItem('agro_user');
      // Optional: window.location.href = '/login'; 
    }
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API error' }));
    throw new Error(error.message || 'API error');
  }
  
  return response.json();
};

// ============ AUTH API ============

export const authAPI = {
  register: async (data) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      localStorage.setItem('agro_token', res.token);
      localStorage.setItem('agro_user', JSON.stringify(res.user));
    }
    return res;
  },

  login: async (data) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      localStorage.setItem('agro_token', res.token);
      localStorage.setItem('agro_user', JSON.stringify(res.user));
    }
    return res;
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

  requestOtp: async (email) => {
    return apiRequest('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyOtp: async (email, token) => {
    return apiRequest('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, token }),
    });
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

  confirmDelivery: async (orderId, otp) => {
    return apiRequest('/orders/confirm-delivery', {
      method: 'POST',
      body: JSON.stringify({ orderId, otp }),
    });
  },

  requestDeliveryCode: async (orderId) => {
    return apiRequest('/orders/request-delivery-code', {
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
  chat: async (message, sessionId = null) => {
    return apiRequest('/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    });
  },

  getSessions: async () => {
    return apiRequest('/ai/sessions');
  },

  getHistory: async (sessionId) => {
    return apiRequest(`/ai/history?sessionId=${sessionId}`);
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
    
    const token = localStorage.getItem('agro_token');
    
    // We use a separate fetch here instead of apiRequest because apiRequest 
    // forces JSON headers which breaks multipart/form-data
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
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
  getFarmerDashboard: async () => {
    return apiRequest('/stats/farmer');
  },
};

// ============ B2B API ============

export const b2bAPI = {
  generateKey: async (name) => {
    return apiRequest('/b2b/keys', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
  getKeys: async () => {
    return apiRequest('/b2b/keys');
  },
  getStats: async () => {
    return apiRequest('/b2b/stats');
  },
};

// ============ DISPUTE API ============

export const disputeAPI = {
  getAll: async () => {
    return apiRequest('/disputes');
  },
  create: async (data) => {
    return apiRequest('/disputes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getResolution: async (id) => {
    return apiRequest(`/disputes/${id}/resolve`);
  },
};
