import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { walletAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, ArrowDownLeft, ArrowUpRight, ArrowLeft, Wallet, Building2, TrendingUp, ShieldCheck, Download, Filter, ChevronRight, X, CreditCard, Landmark, DollarSign, RefreshCw, Landmark as BankIcon, History, Info, Smartphone, Monitor, Database, ArrowRight, Activity, FileText, Hash } from 'lucide-react';

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
        description: 'Please specify a valid monetary magnitude for withdrawal.',
        variant: 'destructive',
      });
      return;
    }

    if (amount > balance.available) {
      toast({
        title: 'Settlement Threshold Exceeded',
        description: 'The requested magnitude exceeds your authorized liquid capital.',
        variant: 'destructive',
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      await walletAPI.requestWithdrawal(amount);
      toast({
        title: 'Withdrawal Authorized',
        description: 'Electronic transfer has been queued for immediate processing through the institutional hub terminal.',
      });
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      const walletData = await walletAPI.getBalance();
      setBalance({ available: walletData.available, pending: walletData.pending });
    } catch (error) {
      toast({
        title: 'Processing Error',
        description: 'Critical system error encountered during settlement authorization synchronization.',
        variant: 'destructive',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'credit':
        return <ArrowDownLeft className="w-8 h-8 text-emerald-600" />;
      case 'debit':
      case 'withdrawal':
        return <ArrowUpRight className="w-8 h-8 text-red-600" />;
      default:
        return <RefreshCw className="w-8 h-8 text-slate-400" />;
    }
  };

  if (isLoading) {
    return (
      <MainLayout hideFooter hideAI>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
           <div className="flex flex-col items-center gap-12">
              <div className="w-20 h-20 border-4 border-slate-200 border-t-primary rounded-full animate-spin shadow-2xl" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Synchronizing Institutional Financial Registry...</p>
           </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideFooter hideAI>
      <div className="bg-slate-50 min-h-screen pb-60">
        {/* Institutional Financial Console Registry Header */}
        <section className="bg-white border-b border-slate-200 pt-32 pb-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
           <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-16">
                 <div className="space-y-8">
                    <div className="inline-flex items-center gap-4 px-6 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(15,23,42,0.4)]">
                       <ShieldCheck className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                       Corporate Settlement Terminal
                    </div>
                    <div className="space-y-4">
                       <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-none">Trade Capital Matrix</h1>
                       <p className="text-xl font-medium text-slate-500 max-w-2xl leading-relaxed opacity-80">
                          Monitor institutional trade settlements, manage liquid operational capital, and audit historical capital flow manifests through the global registry.
                       </p>
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-6">
                    <button className="h-20 px-12 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-slate-50 transition-all flex items-center gap-6 shadow-2xl active:scale-95 group/export">
                       <Download className="w-6 h-6 text-primary group-hover/export:-translate-y-1 transition-transform" />
                       Export Financial Manifest
                    </button>
                    <button 
                      onClick={() => setShowWithdrawModal(true)}
                      className="h-20 px-12 rounded-2xl bg-primary text-white font-bold text-[11px] uppercase tracking-[0.3em] shadow-[0_30px_70px_-15px_rgba(0,166,81,0.4)] hover:bg-primary/90 transition-all flex items-center gap-6 active:scale-95 group/sync"
                    >
                       <RefreshCw className="w-6 h-6 group-hover/sync:rotate-180 transition-transform duration-[1000ms]" />
                       Initialize Settlement Sync
                    </button>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-4 py-32 max-w-7xl">
          {/* Capital & Settlement Matrix Grid */}
          <div className="grid lg:grid-cols-3 gap-16 mb-40">
            <div className="lg:col-span-2 bg-slate-900 p-20 rounded-[4rem] border border-slate-800 shadow-[0_60px_150px_-30px_rgba(15,23,42,0.4)] relative overflow-hidden group/main">
               <div className="absolute top-0 right-0 p-20 opacity-[0.03] -mr-32 -mt-32 group-hover/main:scale-125 transition-transform duration-[2000ms]">
                  <TrendingUp className="w-[600px] h-[600px] text-white" />
               </div>
               <div className="relative z-10 flex flex-col h-full justify-between gap-24">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-16">
                     <div className="flex items-center gap-12">
                        <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center shadow-inner border border-white/10 group-hover/main:bg-primary group-hover/main:border-primary/20 transition-all duration-1000">
                           <Wallet className="w-14 h-14 text-white" />
                        </div>
                        <div className="space-y-3">
                           <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.4em]">Available Operational Capital</p>
                           <h2 className="text-7xl md:text-8xl font-bold text-white tracking-tighter group-hover/main:text-primary transition-colors duration-700">{formatPrice(balance.available)}</h2>
                        </div>
                     </div>
                     <div className="px-6 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400 self-start shadow-2xl shadow-emerald-500/5">
                        Status: Authorized Liquid Asset
                     </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-12 border-t border-white/5 pt-16">
                      <button
                        className="h-24 flex-1 w-full sm:w-auto rounded-[1.5rem] bg-white text-slate-900 hover:bg-slate-50 text-xl font-bold uppercase tracking-[0.3em] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] transition-all active:scale-95 flex items-center justify-center gap-8 group/btn"
                        onClick={() => setShowWithdrawModal(true)}
                      >
                        <RefreshCw className="w-8 h-8 text-primary group-hover/btn:rotate-180 transition-transform duration-1000" />
                        Authorize Disbursement
                      </button>
                     <div className="flex items-center gap-6 text-slate-500">
                        <ShieldCheck className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-60">Institutional Protocol v4.2.0-STABLE</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-20 rounded-[4rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] relative overflow-hidden group/escrow flex flex-col justify-between hover:border-primary/40 hover:shadow-[0_80px_200px_-40px_rgba(0,0,0,0.15)] transition-all duration-1000">
               <div className="absolute top-0 right-0 p-16 opacity-[0.03] -mr-24 -mt-24 group-hover/escrow:scale-125 transition-transform duration-[2000ms]">
                  <Clock className="w-[450px] h-[450px] text-slate-900" />
               </div>
               <div className="space-y-12 relative z-10">
                  <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 shadow-2xl group-hover/escrow:scale-110 transition-transform duration-700">
                     <Clock className="w-10 h-10 text-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.3)]" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em]">Escrow Asset Lock Node</p>
                    <h3 className="text-6xl font-bold text-slate-900 tracking-tighter group-hover/escrow:text-amber-600 transition-colors duration-700">{formatPrice(balance.pending)}</h3>
                  </div>
                </div>
                <div className="pt-16 border-t border-slate-50 relative z-10 space-y-8">
                   <div className="flex items-center gap-5">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary shadow-inner">
                         <Info className="w-5 h-5" />
                      </div>
                      <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.3em]">Escrow Narrative Hub</p>
                   </div>
                   <p className="text-base text-slate-500 font-medium leading-relaxed italic opacity-80">
                     "Trade capital localized in secure clearing accounts. Released post-fulfillment verification cycle (24-48 business hours) through regional hub node."
                   </p>
                </div>
            </div>
          </div>

          {/* Historical Financial Manifest Registry Ledger */}
          <div className="space-y-16">
             <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(15,23,42,0.5)]">
                      <History className="w-8 h-8 text-primary shadow-[0_0_10px_rgba(0,166,81,0.5)]" />
                   </div>
                   <div className="space-y-1">
                      <h2 className="text-4xl font-bold text-slate-900 tracking-tighter">Financial Manifest Registry</h2>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-none">Historical Trade Audit Ledger</p>
                   </div>
                </div>
                <div className="flex items-center gap-10">
                   <button className="flex items-center gap-4 text-[11px] font-bold text-slate-400 hover:text-primary transition-all uppercase tracking-[0.4em] group/filter">
                      <Filter className="w-5 h-5 group-hover/filter:scale-125 transition-transform" />
                      Auditorial Filter Matrix
                   </button>
                </div>
             </div>
             
             <div className="bg-white rounded-[4rem] border border-slate-200 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] overflow-hidden group/registry">
               {transactions.length === 0 ? (
                 <div className="p-60 text-center flex flex-col items-center space-y-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover/registry:opacity-100 transition-opacity duration-[2000ms]" />
                    <div className="w-36 h-36 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner relative z-10 transform -rotate-12 group-hover/registry:rotate-0 transition-transform duration-1000">
                      <FileText className="w-16 h-16 text-slate-100" />
                    </div>
                    <div className="space-y-6 relative z-10">
                       <p className="text-4xl font-bold text-slate-900 tracking-tighter leading-none">Zero Manifests Archive</p>
                       <p className="text-xl text-slate-500 font-medium max-w-md mx-auto leading-relaxed opacity-80">Historical capital flows will be recorded here upon institutional trade initialization and verified settlement cycle.</p>
                    </div>
                    <button className="h-16 px-10 rounded-2xl bg-white border border-slate-200 text-slate-900 text-[11px] font-bold uppercase tracking-[0.3em] shadow-2xl relative z-10 active:scale-95 transition-all">
                       Initialize Sync Logic
                    </button>
                 </div>
               ) : (
                 <div className="divide-y divide-slate-50">
                    {transactions.map((txn) => (
                       <div key={txn.id} className="p-16 flex items-center gap-16 hover:bg-slate-50/50 transition-all duration-700 group/row cursor-pointer relative overflow-hidden">
                         <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-700 pointer-events-none" />
                         <div className={cn(
                           "w-20 h-20 rounded-[1.5rem] flex items-center justify-center shrink-0 border shadow-2xl transition-all duration-700 group-hover/row:scale-110 group-hover/row:rotate-6 relative z-10",
                           txn.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5' : 'bg-red-50 text-red-600 border-red-100 shadow-red-500/5'
                         )}>
                           {getTypeIcon(txn.type)}
                         </div>
                         
                         <div className="flex-1 min-w-0 space-y-3 relative z-10">
                           <p className="text-2xl font-bold text-slate-900 truncate group-hover/row:text-primary transition-colors tracking-tighter">
                             {txn.description}
                           </p>
                           <div className="flex flex-wrap items-center gap-10 text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                              <span className="flex items-center gap-3"><Hash className="w-4 h-4 text-primary" /> NODE: #{txn.id.toString().toUpperCase().slice(-8)}</span>
                              <span className="text-slate-100 opacity-20">|</span>
                              <span className="flex items-center gap-3"><Clock className="w-4 h-4" /> {txn.date}</span>
                              <span className="text-slate-100 opacity-20">|</span>
                              <span className="flex items-center gap-3"><Landmark className="w-4 h-4" /> Hub Authorization: Lagos</span>
                           </div>
                         </div>
                         
                         <div className="text-right flex flex-col items-end gap-6 relative z-10">
                           <p className={cn(
                             "text-4xl font-bold tracking-tighter leading-none",
                             txn.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                           )}>
                             {txn.type === 'credit' ? '+' : '-'}{formatPrice(txn.amount)}
                           </p>
                           <span className={cn(
                              "text-[10px] font-bold uppercase tracking-[0.3em] px-5 py-2 rounded-xl shadow-2xl border",
                              txn.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-500/5' :
                              txn.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/5' :
                              'bg-red-50 text-red-600 border-red-100'
                           )}>
                              {txn.status}
                           </span>
                         </div>
                         
                         <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-200 group-hover/row:text-primary group-hover/row:border-primary/20 shadow-2xl transition-all group-hover/row:translate-x-3 relative z-10 active:scale-90">
                            <ChevronRight className="w-7 h-7" />
                         </div>
                       </div>
                    ))}
                 </div>
               )}
             </div>
          </div>
          
          {/* Institutional Dashboard Sync Node Hub */}
          <div className="pt-32 flex items-center justify-center gap-20 opacity-10">
             <Smartphone className="w-10 h-10 text-slate-900" />
             <Monitor className="w-10 h-10 text-slate-900" />
             <Landmark className="w-10 h-10 text-slate-900" />
             <LayoutGrid className="w-10 h-10 text-slate-900" />
             <Activity className="w-10 h-10 text-slate-900" />
             <Database className="w-10 h-10 text-slate-900" />
          </div>
        </div>
      </div>

      {/* Corporate Settlement Authorization Modal Terminal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-2xl animate-fade-in">
          <div className="bg-white p-20 rounded-[4rem] border border-slate-200 w-full max-w-3xl shadow-[0_100px_200px_-50px_rgba(0,0,0,0.6)] relative overflow-hidden animate-fade-up">
             <div className="absolute top-0 right-0 p-24 opacity-[0.03] -mr-32 -mt-32 pointer-events-none group-hover:scale-125 transition-transform duration-[2000ms]">
                <RefreshCw className="w-[800px] h-[800px] text-slate-900" />
             </div>
             
             <div className="flex items-center justify-between mb-20 relative z-10">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-slate-900 rounded-[1.75rem] flex items-center justify-center text-primary shadow-[0_30px_60px_-15px_rgba(15,23,42,0.5)]">
                      <RefreshCw className="w-10 h-10 shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-4xl font-bold text-slate-900 tracking-tighter">Settlement Authorization</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Execute Institutional Corporate Disbursement</p>
                   </div>
                </div>
                <button 
                  onClick={() => setShowWithdrawModal(false)}
                  className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all active:scale-90 shadow-inner border border-slate-100"
                >
                   <X className="w-8 h-8" />
                </button>
             </div>
            
            <div className="bg-slate-900 p-16 rounded-[3rem] mb-20 relative overflow-hidden border border-slate-800 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.5)] group/balance">
               <div className="absolute top-0 right-0 p-16 opacity-10 -mr-16 -mt-16 group-hover/balance:scale-125 transition-transform duration-[2000ms]">
                  <DollarSign className="w-64 h-64 text-white" />
               </div>
               <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.4em] mb-4 relative z-10 opacity-60">Authorized Liquid Capital Magnitude</p>
               <p className="text-6xl md:text-7xl font-bold text-white tracking-tighter relative z-10 group-hover/balance:text-primary transition-colors duration-700">{formatPrice(balance.available)}</p>
            </div>

            <div className="space-y-16 relative z-10">
              <div className="space-y-6">
                <label className="block text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-2">
                    Settlement Disbursement Magnitude (NGN)
                </label>
                <div className="relative group/input">
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-4xl font-bold text-slate-200 group-focus-within/input:text-primary transition-colors duration-700">₦</div>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full h-24 pl-24 pr-10 bg-slate-50 border border-slate-200 text-5xl font-bold text-slate-900 tracking-tighter rounded-[2.5rem] focus:ring-[20px] focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all outline-none shadow-inner"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 space-y-8 shadow-inner group/bank">
                <div className="flex items-center justify-between border-b border-slate-200/50 pb-8 relative overflow-hidden">
                   <div className="flex items-center gap-5 relative z-10">
                      <BankIcon className="w-6 h-6 text-primary" />
                      <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.4em]">Institutional Disbursement Terminal Hub</p>
                   </div>
                   <div className="w-8 h-8 bg-primary/10 rounded-full animate-ping opacity-20" />
                </div>
                <div className="flex items-center gap-10">
                  <div className="w-20 h-20 bg-white rounded-[1.75rem] border border-slate-200 flex items-center justify-center text-slate-300 shadow-2xl group-hover/bank:scale-110 group-hover/bank:bg-slate-900 group-hover/bank:text-primary transition-all duration-1000">
                    <Building2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-slate-900 tracking-tighter">Main Operations Terminal Account</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                       <Smartphone className="w-4 h-4 text-primary" />
                       Protocol: Electronic Ledger Registry • **** 7821
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-6 px-6 opacity-80">
                 <ShieldCheck className="w-7 h-7 text-emerald-500 shrink-0 mt-1 shadow-[0_0_10px_rgba(0,166,81,0.3)]" />
                 <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.3em] leading-relaxed">
                    "Electronic disbursement authorized and synchronized within 24 business hours to the verified institutional terminal specified above. All transactions recorded in blockchain audit ledger registry v4.0."
                 </p>
              </div>
            </div>

            <div className="mt-20">
              <button
                className="h-24 w-full rounded-[2rem] bg-primary text-white font-bold text-xl uppercase tracking-[0.3em] shadow-[0_40px_100px_-20px_rgba(0,166,81,0.5)] hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-8 group/final"
                onClick={handleWithdraw}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? (
                   <>
                      <RefreshCw className="w-10 h-10 animate-spin" />
                      Synchronizing Registry Hub...
                   </>
                 ) : (
                    <>
                       Authorize Institutional Disbursement
                       <ArrowRight className="w-7 h-7 group-hover/final:translate-x-4 transition-transform duration-700" />
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
