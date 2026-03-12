import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <MainLayout hideFooter>
      <div className="flex flex-1 items-center justify-center bg-muted/30">
        <div className="text-center p-8 bg-background rounded-2xl shadow-soft-lg border border-border animate-scale-in">
          <h1 className="mb-4 text-6xl font-black text-primary">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-4">Oops! Page not found</h2>
          <p className="mb-8 text-muted-foreground max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button size="lg" className="rounded-xl px-8">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
