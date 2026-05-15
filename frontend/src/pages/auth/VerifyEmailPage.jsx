import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Leaf, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/services/api';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Feature disabled - Redirecting to home
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
        <p className="text-muted-foreground font-medium">Redirecting to platform...</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
