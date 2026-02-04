import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, ShoppingCart, Wallet, Plus, MessageCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { AITipCard } from '@/components/ai/AITipCard';
import { walletAPI, ordersAPI, productsAPI } from '@/services/api';

export const FarmerDashboardPage = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, balance: 0, pending: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const [wallet, orders, products] = await Promise.all([
        walletAPI.getBalance(),
        ordersAPI.getFarmerOrders(),
        productsAPI.getByFarmer('farmer_demo'),
      ]);
      setStats({
        products: products.length,
        orders: orders.length,
        balance: wallet.available,
        pending: wallet.pending,
      });
    };
    fetchData();
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your farm overview.</p>
          </div>
          <Link to="/farmer/products/new">
            <Button><Plus className="w-4 h-4 mr-2" />Add Product</Button>
          </Link>
        </div>

        <AITipCard title="Boost Your Sales" description="Add high-quality photos to your products. Listings with 3+ photos sell 40% faster!" className="mb-6" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: 'Products', value: stats.products, color: 'bg-blue-100 text-blue-600' },
            { icon: ShoppingCart, label: 'Orders', value: stats.orders, color: 'bg-green-100 text-green-600' },
            { icon: Wallet, label: 'Balance', value: formatPrice(stats.balance), color: 'bg-purple-100 text-purple-600' },
            { icon: TrendingUp, label: 'Pending', value: formatPrice(stats.pending), color: 'bg-amber-100 text-amber-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Link to="/farmer/orders" className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
            <h3 className="font-semibold text-foreground mb-2">Recent Orders</h3>
            <p className="text-muted-foreground text-sm">View and manage incoming orders</p>
          </Link>
          <Link to="/chat" className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Messages
            </h3>
            <p className="text-muted-foreground text-sm">Chat with your buyers</p>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default FarmerDashboardPage;
