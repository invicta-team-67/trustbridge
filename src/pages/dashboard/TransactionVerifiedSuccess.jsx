import React, { useEffect, useState } from 'react'; 
import { 
  CheckCircle2, 
  ShieldCheck, 
  Lock as LockIcon,
  FileText,
  ArrowRight,
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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [verifiedData, setVerifiedData] = useState({
    merchantName: 'The Merchant',
    merchantId: '',
    amount: '',
    service: '',
    timestamp: ''
  });

  useEffect(() => {
    const fetchVerifiedDetails = async () => {
      // NOTE: We DO NOT check for a session here. This is a public page for the client!
      
      if (!transactionId) {
        setError("Invalid validation link.");
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch the transaction details using the ID from the URL
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .eq('transaction_id', transactionId)
          .maybeSingle();

        if (txError) throw txError;

        if (txData) {
          // 2. Fetch the Merchant's Business Name using the user_id from the transaction
          let fetchedMerchantName = 'Verified Merchant';
          const { data: profileData } = await supabase
            .from('profiles')
            .select('business_name')
            .eq('user_id', txData.user_id)
            .maybeSingle();
            
          if (profileData) {
            fetchedMerchantName = profileData.business_name;
          }

          setVerifiedData({
            merchantName: fetchedMerchantName,
            merchantId: `TB-${txData.user_id.substring(0, 5).toUpperCase()}-X`,
            amount: `₦${parseFloat(txData.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`,
            service: txData.service_provided || 'General Service',
            timestamp: new Date(txData.created_at).toLocaleString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })
          });
        } else {
          setError("Transaction record not found.");
        }
      } catch (err) {
        console.error("Error fetching verified details:", err);
        setError("Unable to load transaction details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifiedDetails();
  }, [transactionId]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans text-slate-900">
        <ShieldCheck size={48} className="text-slate-300 mb-4" />
        <h1 className="text-xl font-black mb-2">Verification Error</h1>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => navigate('/')} className="text-[#1e40af] font-bold text-sm hover:underline">
          Return to TrustBridge Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans text-slate-900 overflow-x-hidden">
      
      {/* Top Branding */}
      <header className="absolute top-0 left-0 w-full py-6 flex justify-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-[#1e40af] rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <span className="text-xl font-black text-[#1e3a8a] tracking-tight">TrustBridge</span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="flex flex-col items-center justify-center"
          >
            <Loader2 className="animate-spin text-blue-600 mb-4" size={36} />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Validating Ledger Entry...</p>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 max-w-lg w-full text-center relative overflow-hidden mt-12"
          >
            {/* Success Decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-[#1e40af]"></div>

            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-8 border-white"
            >
              <CheckCircle2 size={40} strokeWidth={3} />
            </motion.div>

            <h1 className="text-3xl font-black tracking-tight mb-3">Verification Complete!</h1>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Thank you. You have successfully verified this transaction. Your validation helps <span className="font-bold text-slate-800">{verifiedData.merchantName}</span> build their institutional trust score.
            </p>

            <div className="w-full bg-[#f8fafc] rounded-2xl p-6 mb-8 border border-slate-100 shadow-sm text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-500">Total Amount</span>
                <span className="text-xl font-black text-[#1e40af]">{verifiedData.amount}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-500">Service</span>
                <span className="text-sm font-black text-slate-800 truncate pl-4">{verifiedData.service}</span>
              </div>
            </div>

            {/* Logical External Guest Button */}
            <button 
              onClick={() => navigate(`/lookup/${verifiedData.merchantId}`)} 
              className="w-full bg-white text-slate-700 border-2 border-slate-200 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2 mb-8"
            >
              <FileText size={18} className="text-slate-400" /> View Public Ledger Receipt
            </button>

            {/* The Growth/Marketing Hook (Replaces "Back to Dashboard") */}
            <div 
              onClick={() => navigate('/signup')}
              className="bg-[#1e40af] rounded-2xl p-6 text-left relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl hover:shadow-blue-900/20 transition-all"
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/30 rounded-full blur-2xl group-hover:bg-blue-400/40 transition-colors"></div>
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1 relative z-10">TrustBridge For Business</p>
              <h3 className="text-white font-bold mb-2 relative z-10">Want to build your own Trust Score?</h3>
              <p className="text-blue-100/80 text-xs mb-4 relative z-10">Get access to Tier 1 capital and loans by proving your business credibility.</p>
              <div className="flex items-center text-white text-xs font-bold gap-1 relative z-10 group-hover:gap-2 transition-all">
                Create Free Account <ArrowRight size={14} />
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!isLoading && !error && (
        <div className="mt-8 text-center flex flex-col items-center gap-2">
           <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <LockIcon size={12} /> Secured by TrustBridge Protocol
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Verified on {verifiedData.timestamp}</p>
        </div>
      )}
      
    </div>
  );
};

export default TransactionVerifiedSuccess;
