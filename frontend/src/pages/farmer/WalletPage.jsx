import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { walletAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, ArrowDownLeft, ArrowUpRight, ArrowLeft, Wallet, Building2, TrendingUp, ShieldCheck, Download, Filter, ChevronRight, X } from 'lucide-react';

export const WalletPage = () => {
  const [balance, setBalance] = useState({ available: 0, pending: 0 });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletData, txnData] = await Promise.all([
          walletAPI.getBalance(),
          walletAPI.getTransactions(),
        ]);
        setBalance({ available: walletData.available, pending: walletData.pending });
        setTransactions(txnData);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid withdrawal amount.',
        variant: 'destructive',
      });
      return;
    }

    if (amount > balance.available) {
      toast({
        title: 'Insufficient balance',
        description: 'You cannot withdraw more than your available balance.',
        variant: 'destructive',
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      const result = await walletAPI.requestWithdrawal(amount);
      toast({
        title: 'Withdrawal requested',
        description: result.message,
      });
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      // Refresh balance
      const walletData = await walletAPI.getBalance();
      setBalance({ available: walletData.available, pending: walletData.pending });
    } catch (error) {
      toast({
        title: 'Withdrawal failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'credit':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'debit':
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-background pb-20">
        {/* Ambient background */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 animate-fade-in">
            <div className="space-y-4">
               <Link to="/farmer/dashboard" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-black uppercase tracking-widest text-[10px] mb-4">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  Dashboard
               </Link>
               <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[0.9]">
                  My <span className="text-gradient">Wallet</span>
               </h1>
               <p className="text-xl text-muted-foreground font-medium max-w-md">
                 Manage your money and see all your transactions in one place.
               </p>
            </div>
            <div className="flex gap-4">
               <Button variant="outline" className="h-16 px-6 rounded-2xl border-border/50 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-white transition-all">
                  <Download className="w-4 h-4" />
                  Download History
               </Button>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="lg:col-span-2 glass-premium bg-primary p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-primary/20 shadow-2xl shadow-primary/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <TrendingUp className="w-48 h-48 text-white" />
               </div>
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                           <Wallet className="w-8 h-8 text-white" />
                        </div>
                        <div>
                           <p className="text-white/70 text-xs font-black uppercase tracking-widest">Available Money</p>
                           <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">{formatPrice(balance.available)}</h2>
                        </div>
                     </div>
                     <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                        Safe & Secure
                     </div>
                  </div>
                  
                  <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
                      <Button
                        className="h-16 sm:h-20 flex-1 w-full sm:w-auto rounded-[1.25rem] sm:rounded-[1.5rem] bg-white text-primary hover:bg-white/90 text-lg font-black tracking-tight"
                        onClick={() => setShowWithdrawModal(true)}
                      >
                        Withdraw Money
                      </Button>
                     <div className="flex items-center gap-3 text-white/70">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Instant Payout Enabled</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="glass-premium p-10 rounded-[3rem] border-border/50 relative overflow-hidden group flex flex-col justify-between">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <Clock className="w-32 h-32 text-primary" />
               </div>
               <div>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                     <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                   <p className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-1">Money in Waiting</p>
                   <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter">{formatPrice(balance.pending)}</h3>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-8 border-t border-border/30 pt-6 italic">
                  Waiting for the buyer to receive their order. You'll get your money 24 hours after they confirm.
                </p>
            </div>
          </div>

          {/* Transaction Suite */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
             <div className="flex items-center justify-between mb-8 px-4">
                <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
                   Money History
                </h2>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px]">
                      <Filter className="w-3 h-3 mr-2" />
                      Filter
                   </Button>
                </div>
             </div>
             
             <div className="glass-premium rounded-[2.5rem] border-border/50 overflow-hidden shadow-xl shadow-primary/5">
               {transactions.length === 0 ? (
                 <div className="p-24 text-center">
                   <div className="w-20 h-20 bg-secondary rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                     <Wallet className="w-8 h-8 text-muted-foreground opacity-30" />
                   </div>
                    <p className="text-xl font-black text-muted-foreground tracking-tight">No Money History Found</p>
                    <p className="text-sm text-muted-foreground/60 font-medium">Your transactions will show up here as you buy and sell.</p>
                 </div>
               ) : (
                 <div className="divide-y divide-border/30">
                   {transactions.map((txn) => (
                      <div key={txn.id} className="p-4 sm:p-8 flex items-center gap-4 sm:gap-8 hover:bg-primary/[0.01] transition-all group">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                          txn.type === 'credit' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                        )}>
                          {getTypeIcon(txn.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-black text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                            {txn.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">
                            {txn.date}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className={cn(
                            "text-lg sm:text-xl font-black tracking-tighter mb-1",
                            txn.type === 'credit' ? 'text-green-600' : 'text-foreground'
                          )}>
                            {txn.type === 'credit' ? '+' : '-'}{formatPrice(txn.amount)}
                          </p>
                          <div className="flex items-center gap-2 justify-end">
                             <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                                txn.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                txn.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                'bg-red-500/10 text-red-600 border-red-500/20'
                             )}>
                                {txn.status}
                             </span>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-muted-foreground/20 group-hover:translate-x-1 group-hover:text-primary/40 transition-all hidden sm:block" />
                      </div>
                   ))}
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Premium Withdrawal Interface */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-background/80 animate-fade-in">
          <div className="glass-premium p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border-primary/20 w-full max-w-lg shadow-2xl relative overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                <Download className="w-48 h-48 text-primary" />
             </div>

             <div className="flex items-center justify-between mb-10">
                 <h3 className="text-3xl font-black text-foreground tracking-tight">Withdraw Money</h3>
                <button 
                  onClick={() => setShowWithdrawModal(false)}
                  className="w-12 h-12 glass-premium rounded-2xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:scale-90"
                >
                   <X className="w-6 h-6" />
                </button>
             </div>
            
            <div className="glass-premium bg-primary/[0.03] rounded-3xl p-6 mb-10 border-primary/10">
               <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Total Money You Can Withdraw</p>
              <p className="text-4xl font-black text-gradient tracking-tighter">{formatPrice(balance.available)}</p>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                    Amount to Withdraw (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground opacity-30">₦</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full h-20 pl-14 pr-6 glass-premium bg-white/50 border-border/50 group-hover:border-primary/30 focus:border-primary/50 text-2xl font-black tracking-tight rounded-[1.5rem] transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="glass-premium bg-secondary/50 rounded-3xl p-6 border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Where your money goes</p>
                    <p className="text-sm font-black text-foreground">GTBank • Trans-Regional Terminal **** 1234</p>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground font-medium text-center px-4">
                 Your withdrawal will be processed and sent to your bank account within 24 hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <Button
                className="h-20 flex-1 rounded-[1.5rem] btn-premium text-lg font-black tracking-tight shadow-xl shadow-primary/20"
                onClick={handleWithdraw}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? (
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                      Executing...
                   </div>
                 ) : 'Confirm Withdrawal'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default WalletPage;
