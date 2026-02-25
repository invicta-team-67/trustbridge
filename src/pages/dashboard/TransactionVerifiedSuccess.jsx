import React, { useEffect } from 'react'; // Added useEffect
import { 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Lock as LockIcon,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // 1. CONNECTED: Import Supabase

const TransactionVerifiedSuccess = () => {
  const navigate = useNavigate();

  // 2. CONNECTED: Auth Guard - Ensures only authenticated users see the success state
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkUser();
  }, [navigate]);

  // Mock data matching the verification success image
  const verifiedData = {
    businessName: 'Acme Dynamics Ltd.',
    amount: '₦12,500.00',
    service: 'Software License Renewal',
    timestamp: 'Feb 25, 2026 • 12:45 PM'
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-700 flex flex-col items-center">
      {/* Top Branding */}
      <div className="py-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
        </div>
      </div>

      {/* Main Success Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden"
      >
        <div className="p-12 flex flex-col items-center">
          {/* Animated Success Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-8"
          >
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </motion.div>

          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight text-center">
            Transaction Verified Successfully!
          </h1>
          
          <p className="text-slate-500 text-sm leading-relaxed text-center max-w-sm mb-10">
            You have confirmed the delivery for <span className="font-bold text-slate-800">{verifiedData.businessName}</span>. This transaction has been recorded securely in the trust ledger.
          </p>

          {/* Transaction Info Box */}
          <div className="w-full bg-[#f8fafc] rounded-2xl p-8 mb-10 border border-slate-100">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
              <FileCheck2 size={16} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Transaction Summary
              </span>
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Business Name</span>
                <span className="text-sm font-black text-slate-800">{verifiedData.businessName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Amount</span>
                <span className="text-lg font-black text-slate-900">{verifiedData.amount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Service</span>
                <span className="text-sm font-black text-slate-800">{verifiedData.service}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <button 
            onClick={() => navigate('/dashboard')} // Connected to Dashboard
            className="w-full bg-[#1e40af] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
          >
            Back to Dashboard
          </button>
          
          <button 
            onClick={() => navigate('/transaction-dashboard')} // Connected to Transactions List
            className="mt-4 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5"
          >
            View Ledger Record <ExternalLink size={14} />
          </button>
        </div>

        {/* Security Footer */}
        <div className="bg-slate-50/50 py-5 border-t border-slate-100 flex justify-center items-center gap-2">
          <LockIcon size={12} className="text-slate-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
            Secured by TrustBridge Ledger Protocol
          </span>
        </div>
      </motion.div>

      {/* Timestamp */}
      <p className="mt-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        Verified on {verifiedData.timestamp}
      </p>
    </div>
  );
};


export default TransactionVerifiedSuccess;