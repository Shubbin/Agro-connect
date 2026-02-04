import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Leaf, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/services/api';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        await authAPI.verifyEmail(token);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Agro<span className="text-primary">Direct</span>
            </span>
          </Link>
        </div>

        {/* Status Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
          {status === 'loading' && (
            <div className="py-8">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground">Verifying your email...</h2>
              <p className="text-muted-foreground mt-2">
                Please wait while we confirm your email address.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Email Verified!</h2>
              <p className="text-muted-foreground mt-2">
                Your email has been successfully verified. You can now access all features.
              </p>
              <Link to="/login">
                <Button className="mt-6">Continue to Login</Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Verification Failed</h2>
              <p className="text-muted-foreground mt-2">
                The verification link is invalid or has expired. Please request a new one.
              </p>
              <Link to="/login">
                <Button variant="outline" className="mt-6">Back to Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
