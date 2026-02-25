import React, { useState, useEffect } from 'react'; // Added useEffect
import { 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Lock as LockIcon,
  ShieldAlert,
  Loader2 // Added for loading state
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // 1. CONNECTED: Import Supabase

const TransactionVerification = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // State for DB interaction

  // 2. CONNECTED: Session Check
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Since this might be a public link sent to a client, 
        // you might want to handle non-auth users differently, 
        // but for now, we follow your standard login protection.
        navigate('/login');
      }
    };
    checkSession();
  }, [navigate]);

  // Data strictly following image_2578fa.png
  const transactionDetails = {
    merchantName: 'Acme Corporation',
    service: 'Clouds and Devops Consulting',
    amount: '₦12,500.00',
    date: 'February 24, 2026',
    proofFile: 'transaction_proof_oct23.pdf',
    fileSize: '2.4 MB'
  };

  // 3. CONNECTED: Verify Logic (Update Supabase)
  const handleVerify = async () => {
    setIsProcessing(true);
    try {
      // In a real scenario, you'd get the transaction ID from the URL params
      // For now, we simulate the DB update to 'Verified'
      /* const { error } = await supabase
        .from('transactions')
        .update({ status: 'Verified' })
        .eq('id', transactionId); 
      */
      
      setIsVerified(true);
      setTimeout(() => {
        navigate('/transaction-verified-success');
      }, 800); 
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. CONNECTED: Disputed Logic (Update Supabase)
  const handleDispute = async () => {
    setIsProcessing(true);
    try {
      /* const { error } = await supabase
        .from('transactions')
        .update({ status: 'Disputed' })
        .eq('id', transactionId);
      */
      alert("Dispute reported. Our team will investigate.");
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-700 flex flex-col">
      {/* --- TOP NAV BAR --- */}
      <header className="bg-white border-b border-slate-200 px-10 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white font-bold">
            <ShieldCheck size={20} />
          </div>
          <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <LockIcon size={14} /> Secure Verification Portal
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden"
        >
          <div className="p-10 flex flex-col items-center">
            {/* Status Icon */}
            <div className="w-16 h-16 bg-[#eff6ff] rounded-full flex items-center justify-center text-[#1e40af] mb-8">
              <ShieldAlert size={32} />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-black text-slate-900 mb-3 text-center">Transaction Verification</h1>
            <p className="text-slate-500 text-sm text-center leading-relaxed mb-10">
              <span className="font-bold text-slate-800">{transactionDetails.merchantName}</span> is requesting verification for the following transaction:
            </p>

            {/* Transaction Data Grid */}
            <div className="w-full space-y-6 mb-10">
              <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service</span>
                <span className="text-sm font-black text-slate-800 text-right">{transactionDetails.service}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</span>
                <span className="text-xl font-black text-[#1e40af]">{transactionDetails.amount}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</span>
                <span className="text-sm font-black text-slate-800">{transactionDetails.date}</span>
              </div>
            </div>

            {/* Supporting Documents Section */}
            <div className="w-full mb-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Supporting Documents</p>
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex items-center justify-between group hover:border-blue-200 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-600 flex items-center gap-1">
                      {transactionDetails.proofFile} <ExternalLink size={14} />
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">View Proof of Work • {transactionDetails.fileSize}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {!isVerified ? (
              <div className="w-full space-y-4">
                <button 
                  onClick={handleVerify}
                  disabled={isProcessing}
                  className="w-full bg-[#22c55e] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                  Confirm & Verify
                </button>
                <button 
                  onClick={handleDispute}
                  disabled={isProcessing}
                  className="w-full bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold text-sm hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={18} /> I don't recognize this
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center"
              >
                <p className="text-emerald-700 font-bold text-sm">Thank you! Redirecting...</p>
              </motion.div>
            )}

            {/* Security Badges */}
            <div className="mt-10 flex items-center gap-6 opacity-40">
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <ShieldCheck size={14} /> PCI Compliant
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <LockIcon size={14} /> AES-256
              </div>
            </div>
            
            <p className="mt-6 text-[9px] text-slate-400 text-center max-w-[280px] leading-relaxed">
              This link is uniquely generated for your account. Please do not share this URL with anyone. Secured with 256-bit SSL Encryption
            </p>
          </div>
        </motion.div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-8 px-6 text-center border-t border-slate-100 bg-white">
        <div className="flex justify-center gap-8 mb-4">
          {['Privacy Policy', 'Terms of Service', 'Help Center'].map((item) => (
            <button key={item} className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
              {item}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          © 2026 TrustBridge Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};


export default TransactionVerification;