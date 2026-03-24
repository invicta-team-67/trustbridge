import React, { useEffect, useState } from 'react'; 
import { 
  CheckCircle2, 
  ShieldCheck, 
  Lock as LockIcon,
  FileCheck2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; 

const TransactionVerifiedSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('id');

  // NEW: Professional loading state
  const [isLoading, setIsLoading] = useState(true);

  const [verifiedData, setVerifiedData] = useState({
    businessName: '',
    amount: '',
    service: '',
    timestamp: ''
  });

  useEffect(() => {
    const fetchVerifiedDetails = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }

      try {
        let query = supabase.from('transactions').select('*');

        if (transactionId && transactionId !== 'undefined') {
          query = query.eq('transaction_id', transactionId);
        } else {
          query = query
            .eq('user_id', session.user.id)
            // .eq('status', 'Verified') // <-- Kept your comment intact
            .order('created_at', { ascending: false })
            .limit(1);
        }

        const { data, error } = await query.maybeSingle();

        if (error) throw error;
        
        if (data) {
          setVerifiedData({
            businessName: data.client_name || 'Business Partner',
            amount: `₦${parseFloat(data.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`,
            service: data.service_provided || 'General Service',
            timestamp: new Date(data.created_at).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          });
        }
      } catch (err) {
        console.error("Error fetching verified details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifiedDetails();
  }, [transactionId, navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-700 flex flex-col items-center px-4 md:px-6 overflow-x-hidden">
      
      {/* Top Branding */}
      <header className="py-8 md:py-12 w-full flex justify-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#1e40af] rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShieldCheck size={24} />
          </div>
          <span className="text-2xl font-black text-[#1e3a8a] tracking-tight">TrustBridge</span>
        </div>
      </header>

      {/* Main Success Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-xl bg-white rounded-[24px] md:rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[400px] flex flex-col"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="flex-1 flex flex-col items-center justify-center p-12 my-auto"
            >
              <Loader2 className="animate-spin text-blue-600 mb-4" size={36} />
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Ledger...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="p-8 md:p-12 flex flex-col items-center"
            >
              {/* Animated Success Icon */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 md:mb-8 ring-4 ring-emerald-50/50 shadow-sm"
              >
                <CheckCircle2 size={40} className="md:w-12 md:h-12" strokeWidth={3} />
              </motion.div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight text-center leading-tight">
                Verified Successfully!
              </h1>
              
              <p className="text-slate-500 text-sm leading-relaxed text-center max-w-sm mb-8 md:mb-10 px-2">
                The transaction for <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md">{verifiedData.businessName}</span> has been confirmed. This record is now securely stored on the trust ledger.
              </p>

              {/* Transaction Info Box */}
              <div className="w-full bg-[#f8fafc] rounded-2xl p-6 md:p-8 mb-8 md:mb-10 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                    <FileCheck2 size={16} className="shrink-0" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Ledger Summary
                  </span>
                </div>
                
                <div className="space-y-4 md:space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4">
                    <span className="text-xs font-bold text-slate-500">Business Name</span>
                    <span className="text-sm font-black text-slate-800 text-left sm:text-right break-words w-full sm:w-auto">
                      {verifiedData.businessName}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4">
                    <span className="text-xs font-bold text-slate-500">Service</span>
                    <span className="text-sm font-black text-slate-800 text-left sm:text-right break-words w-full sm:w-auto leading-tight">
                      {verifiedData.service}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4 pt-4 border-t border-slate-200 border-dashed">
                    <span className="text-xs font-bold text-slate-500">Total Amount</span>
                    <span className="text-xl md:text-2xl font-black text-[#1e40af]">{verifiedData.amount}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Polished Layout */}
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <button 
                  onClick={() => navigate('/transaction-dashboard')} 
                  className="flex-1 bg-white border border-slate-200 text-slate-600 py-3.5 md:py-4 rounded-xl font-bold text-xs md:text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                  View Ledger <ExternalLink size={16} />
                </button>
                
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="flex-1 bg-[#1e40af] text-white py-3.5 md:py-4 rounded-xl font-black text-xs md:text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-95"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Footer inside the card */}
        <div className="bg-slate-50 py-4 md:py-5 border-t border-slate-100 flex justify-center items-center gap-2 px-4 mt-auto">
          <LockIcon size={12} className="text-slate-400 shrink-0" />
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            Secured by TrustBridge Ledger Protocol
          </span>
        </div>
      </motion.div>

      {/* Timestamp */}
      {!isLoading && (
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-6 md:mt-8 mb-12 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center"
        >
          Verified on {verifiedData.timestamp}
        </motion.p>
      )}
      
    </div>
  );
};

export default TransactionVerifiedSuccess;
