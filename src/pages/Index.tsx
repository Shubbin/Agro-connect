import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Users, ShieldCheck, TrendingUp, MessageCircle, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { dummyProducts } from '@/services/api';

export const HomePage = () => {
  const featuredProducts = dummyProducts.slice(0, 4);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-background to-background py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Nigeria's #1 Agricultural Marketplace
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Fresh Produce,<br />
              <span className="text-primary">Direct from Farmers</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect directly with verified farmers across Nigeria. Buy fresh produce in bulk at fair prices, or sell your farm products to thousands of buyers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button size="lg" className="h-14 px-8 text-lg">
                  Start Shopping <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Direct Trade', description: 'Buy directly from farmers. No middlemen, fair prices for everyone.' },
              { icon: ShieldCheck, title: 'Verified Sellers', description: 'All farmers are verified for quality and reliability.' },
              { icon: MessageCircle, title: 'Easy Negotiation', description: 'Chat and negotiate prices directly with sellers.' },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Featured Products</h2>
            <Link to="/marketplace" className="text-primary font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Promo */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 lg:p-12 text-primary-foreground">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-primary-foreground/20 rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles className="w-10 h-10" />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl font-bold mb-2">AI-Powered Assistant</h3>
                <p className="text-primary-foreground/80">Get instant help with orders, product recommendations, and business advice. Available 24/7 in the corner of your screen.</p>
              </div>
              <Link to="/signup">
                <Button variant="secondary" size="lg">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '10,000+', label: 'Farmers' },
              { value: '50,000+', label: 'Products' },
              { value: '36', label: 'States Covered' },
              { value: '₦500M+', label: 'Trade Volume' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl lg:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
