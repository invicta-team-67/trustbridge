  import React, { useEffect, useState } from 'react'; 
  import { 
    CheckCircle2, 
    ShieldCheck, 
    Lock as LockIcon,
    FileCheck2,
    ExternalLink
  } from 'lucide-react';
  import { motion } from 'framer-motion';
  import { useNavigate, useLocation } from 'react-router-dom';
  import { supabase } from '../../lib/supabase'; 

  const TransactionVerifiedSuccess = () => {
    const navigate = useNavigate();
    // Add these to get the ID from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('id');

    const [verifiedData, setVerifiedData] = useState({
      businessName: 'Loading...',
      amount: '₦0.00',
      service: 'Loading...',
      timestamp: '---'
    });


  useEffect(() => {
    const fetchVerifiedDetails = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }

  // Inside TransactionVerifiedSuccess.jsx
  try {
    let query = supabase.from('transactions').select('*');

    if (transactionId && transactionId !== 'undefined') {
      query = query.eq('transaction_id', transactionId);
    } else {
      query = query
        .eq('user_id', session.user.id)
        // .eq('status', 'Verified') // <-- COMMENT THIS OUT TEMPORARILY
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
      }
    };

    fetchVerifiedDetails();
  }, [transactionId, navigate]);

    return (
      <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-700 flex flex-col items-center px-4 md:px-6 overflow-x-hidden">
        {/* Top Branding */}
        <div className="py-8 md:py-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white shrink-0">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl md:text-2xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
          </div>
        </div>

        {/* Main Success Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-xl bg-white rounded-[24px] md:rounded-[32px] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden"
        >
          <div className="p-6 md:p-12 flex flex-col items-center">
            {/* Animated Success Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 md:mb-8"
            >
              <CheckCircle2 size={40} className="md:w-12 md:h-12" strokeWidth={2.5} />
            </motion.div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight text-center leading-tight">
              Transaction Verified Successfully!
            </h1>
            
            <p className="text-slate-500 text-sm leading-relaxed text-center max-w-sm mb-8 md:mb-10 px-2">
              You have confirmed the delivery for <span className="font-bold text-slate-800">{verifiedData.businessName}</span>. This transaction has been recorded securely in the trust ledger.
            </p>

            {/* Transaction Info Box */}
            <div className="w-full bg-[#f8fafc] rounded-2xl p-6 md:p-8 mb-8 md:mb-10 border border-slate-100">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
                <FileCheck2 size={16} className="text-blue-500 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Transaction Summary
                </span>
              </div>
              
              <div className="space-y-4 md:space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4">
                  <span className="text-xs font-bold text-slate-400">Business Name</span>
                  <span className="text-sm font-black text-slate-800 text-left sm:text-right break-words w-full sm:w-auto">{verifiedData.businessName}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4">
                  <span className="text-xs font-bold text-slate-400">Amount</span>
                  <span className="text-base md:text-lg font-black text-slate-900">{verifiedData.amount}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4">
                  <span className="text-xs font-bold text-slate-400">Service</span>
                  <span className="text-sm font-black text-slate-800 text-left sm:text-right break-words w-full sm:w-auto">{verifiedData.service}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3">
              <button 
                onClick={() => navigate('/dashboard')} // Connected to Dashboard
                className="w-full bg-[#1e40af] text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-sm shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
              >
                Back to Dashboard
              </button>
              
              <button 
                onClick={() => navigate('/transaction-dashboard')} // Connected to Transactions List
                className="w-full md:w-auto mx-auto mt-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5"
              >
                View Ledger Record <ExternalLink size={14} />
              </button>
            </div>
          </div>

          {/* Security Footer */}
          <div className="bg-slate-50/50 py-4 md:py-5 border-t border-slate-100 flex justify-center items-center gap-2 px-4">
            <LockIcon size={12} className="text-slate-400 shrink-0" />
            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter text-center">
              Secured by TrustBridge Ledger Protocol
            </span>
          </div>
        </motion.div>

        {/* Timestamp */}
        <p className="mt-6 md:mt-8 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
          Verified on {verifiedData.timestamp}
        </p>
        
        {/* Page Padding Bottom for mobile */}
        <div className="h-10 md:hidden" />
      </div>
    );
  };


  export default TransactionVerifiedSuccess;