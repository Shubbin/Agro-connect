import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { walletAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, ArrowDownLeft, ArrowUpRight, ArrowLeft, Wallet, Building2, TrendingUp, ShieldCheck, Download, Filter, ChevronRight, X, CreditCard, Landmark, DollarSign, RefreshCw, History, Info, Smartphone, Monitor, Database, ArrowRight, Activity, FileText, Hash } from 'lucide-react';

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
    }).format(price || 0);
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid amount to withdraw.',
        variant: 'destructive',
      });
      return;
    }

    if (amount > balance.available) {
      toast({
        title: 'Insufficient Balance',
        description: 'You cannot withdraw more than your available balance.',
        variant: 'destructive',
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      await walletAPI.requestWithdrawal(amount);
      toast({
        title: 'Withdrawal Requested',
        description: 'Your payout request has been submitted and is being processed to your bank account.',
      });
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      const walletData = await walletAPI.getBalance();
      setBalance({ available: walletData.available, pending: walletData.pending });
    } catch (error) {
      toast({
        title: 'Processing Error',
        description: 'Failed to request withdrawal. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'credit':
        return <ArrowDownLeft className="w-5 h-5 text-emerald-600" />;
      case 'debit':
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />;
    }
  };

  if (isLoading) {
    return (
      <MainLayout hideFooter hideAI>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
           <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-semibold text-gray-500">Loading Wallet & Payout Details...</p>
           </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-12">
           <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                       <ShieldCheck className="w-4 h-4" />
                       Farming Wallet Terminal
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Earnings & Wallet</h1>
                    <p className="text-gray-600">
                       View your account balance, withdraw earnings to your bank account, and track your payout history.
                    </p>
                 </div>
                 <div className="flex gap-3">
                    <button className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-xs flex items-center gap-2 hover:bg-gray-50 shadow-sm active:scale-95 group">
                       <Download className="w-4 h-4 text-primary" />
                       Export Transactions
                    </button>
                    <button 
                      onClick={() => setShowWithdrawModal(true)}
                      className="h-10 px-4 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm active:scale-95 group"
                    >
                       <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                       Request Withdrawal
                    </button>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Balance Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            
            {/* Available Balance */}
            <div className="lg:col-span-2 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <TrendingUp className="w-40 h-40 text-white" />
               </div>
               <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                           <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Available Balance</p>
                           <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{formatPrice(balance.available)}</h2>
                        </div>
                     </div>
                     <div className="px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider text-emerald-400 self-start shadow-sm shrink-0">
                        Ready for Payout
                     </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-white/5 pt-6">
                      <button
                        className="h-11 flex-grow w-full sm:w-auto rounded-xl bg-white text-slate-900 hover:bg-slate-50 text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                        onClick={() => setShowWithdrawModal(true)}
                      >
                        <RefreshCw className="w-4 h-4 text-primary" />
                        Withdraw to Bank
                      </button>
                     <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span>Escrow Protected & Secure</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Escrow Balance */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Clock className="w-32 h-32 text-slate-900" />
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shadow-sm shrink-0">
                     <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Escrow Balance</p>
                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{formatPrice(balance.pending)}</h3>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 relative z-10 space-y-3">
                   <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-primary" />
                      <p className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">About Escrow Payments</p>
                   </div>
                   <p className="text-xs text-gray-500 font-semibold leading-relaxed italic">
                     Funds paid by buyers are held securely in escrow. Escrow funds are automatically released to your available balance 24-48 hours after delivery is confirmed.
                   </p>
                </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                      <History className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                      <h2 className="font-bold text-gray-900 text-lg leading-tight">Transaction History</h2>
                      <p className="text-xs text-gray-400 font-semibold">Your sales payouts and withdrawals</p>
                   </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-primary transition-colors">
                   <Filter className="w-4 h-4" />
                   Filter History
                </button>
             </div>
             
             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               {transactions.length === 0 ? (
                 <div className="py-20 text-center flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                      <FileText className="w-8 h-8 text-gray-300" />
                    </div>
                    <div className="space-y-1">
                       <p className="font-bold text-gray-900 text-lg">No Transactions Yet</p>
                       <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">Your payout and transaction history will show up here once you start selling products.</p>
                    </div>
                 </div>
               ) : (
                 <div className="divide-y divide-gray-100 text-sm">
                    {transactions.map((txn) => (
                       <div key={txn.id} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors group/row cursor-pointer">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-sm relative z-10",
                            txn.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                          )}>
                            {getTypeIcon(txn.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0 space-y-1 pl-2">
                            <p className="font-bold text-gray-900 group-hover/row:text-primary transition-colors truncate text-sm">
                              {txn.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                              <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5 text-primary" /> ID: #{txn.id.toString().toUpperCase().slice(-8)}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {txn.date}</span>
                            </div>
                          </div>
                          
                          <div className="text-right flex flex-col items-end gap-1.5 pr-2 shrink-0">
                            <p className={cn(
                              "font-bold text-base",
                              txn.type === 'credit' ? 'text-emerald-600' : 'text-gray-950'
                            )}>
                              {txn.type === 'credit' ? '+' : '-'}{formatPrice(txn.amount)}
                            </p>
                            <span className={cn(
                               "text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shadow-sm",
                               txn.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                               txn.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                               'bg-red-50 text-red-700 border-red-100'
                            )}>
                               {txn.status}
                            </span>
                          </div>
                       </div>
                    ))}
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 w-full max-w-md shadow-lg relative overflow-hidden">
             
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                      <RefreshCw className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900 leading-tight">Request Withdrawal</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Withdraw funds to bank</p>
                   </div>
                </div>
                <button 
                  onClick={() => setShowWithdrawModal(false)}
                  className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors border border-gray-100 shadow-inner"
                >
                   <X className="w-4 h-4" />
                </button>
             </div>
            
             <div className="bg-slate-900 p-6 rounded-xl mb-6 relative overflow-hidden border border-slate-800 shadow-inner">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 relative z-10">Available Balance</p>
                <p className="text-3xl font-bold text-white tracking-tight relative z-10">{formatPrice(balance.available)}</p>
             </div>

             <div className="space-y-6">
               <div className="space-y-2">
                 <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">
                     Amount to Withdraw (NGN)
                 </label>
                 <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-300">₦</div>
                   <input
                     type="number"
                     value={withdrawAmount}
                     onChange={(e) => setWithdrawAmount(e.target.value)}
                     className="w-full h-14 pl-10 pr-4 bg-gray-50 border border-gray-200 text-3xl font-bold text-gray-900 tracking-tight rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none"
                     placeholder="0.00"
                   />
                 </div>
               </div>

               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4 shadow-inner">
                 <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                    <div className="flex items-center gap-2">
                       <Landmark className="w-4 h-4 text-primary animate-pulse" />
                       <p className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Primary Payout Bank Account</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                     <Building2 className="w-5 h-5" />
                   </div>
                   <div className="space-y-1 min-w-0">
                     <p className="font-bold text-gray-900 truncate text-sm">Farming Settlement Account</p>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-primary" />
                        <span>Standard Bank Transfer • **** 7821</span>
                     </p>
                   </div>
                 </div>
               </div>

               <div className="flex items-start gap-3 px-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                     Payouts are securely processed and transferred to your bank account within 24 business hours.
                  </p>
               </div>
             </div>

             <div className="mt-6">
               <button
                 className="h-12 w-full rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                 onClick={handleWithdraw}
                 disabled={isWithdrawing}
               >
                 {isWithdrawing ? (
                    <>
                       <RefreshCw className="w-4 h-4 animate-spin" />
                       <span>Processing Payout...</span>
                    </>
                  ) : (
                    <>
                       <span>Request Payout</span>
                       <ArrowRight className="w-4 h-4" />
                    </>
                  )}
               </button>
             </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default WalletPage;
