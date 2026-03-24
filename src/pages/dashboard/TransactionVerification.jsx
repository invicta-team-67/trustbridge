import React, { useState, useEffect } from 'react'; 
import { 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Lock as LockIcon,
  ShieldAlert,
  Loader2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { supabase } from '../../lib/supabase'; 

const TransactionVerification = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  
  // NEW: Refined loading states
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [processingType, setProcessingType] = useState(null); // 'verify' or 'dispute'
  
  // State for dynamic data
  const [transactionId, setTransactionId] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState({
    merchantName: '',
    service: '',
    amount: '',
    date: '',
    proofFile: '',
    fileSize: '',
    fileUrl: null // Added to store the actual file link
  });

  // CONNECTED: Fetch Data & Session Check
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlId = queryParams.get('id'); 

  useEffect(() => {
    const fetchTransactionData = async () => {
      if (!urlId) {
        setFetchError("Invalid or missing verification link.");
        setIsLoadingData(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('transaction_id', urlId) 
          .single();

        if (error) throw error;

        if (data) {
          setTransactionId(data.transaction_id); 
          
          const hasFile = !!data.proof_files_urls;

          setTransactionDetails({
            merchantName: data.client_name || 'Verified Merchant',
            service: data.service_provided || 'General Service',
            amount: `₦${parseFloat(data.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`,
            date: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            proofFile: hasFile ? 'Supporting_Document' : 'No document attached',
            fileSize: hasFile ? 'Encrypted' : '---',
            fileUrl: data.proof_files_urls // Store the URL for the button
          });
        }
      } catch (err) {
        console.error("Verification fetch error:", err);
        setFetchError("Unable to load transaction details. The link may have expired or is invalid.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchTransactionData();
  }, [urlId]);

  // CONNECTED: Verify Logic (Update Supabase)
  const handleVerify = async () => {
    if (!transactionId) return;
    setProcessingType('verify');
    
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'Verified' })
        .eq('transaction_id', urlId);
      
      if (error) throw error;

      setIsVerified(true);
      
      // REDIRECT UPDATE: Send the user to the new Success Screen
      setTimeout(() => {
        navigate('/verification-success'); 
      }, 1500); 
      
    } catch (error) {
      alert("Verification failed: " + error.message);
    } finally {
      if (!isVerified) setProcessingType(null);
    }
  };

  // CONNECTED: Disputed Logic (Update Supabase)
  const handleDispute = async () => {
    if (!transactionId) return;
    setProcessingType('dispute');
    
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'Disputed' })
        .eq('transaction_id', urlId); // FIXED: Updated 'id' to 'transaction_id' to match your schema

      if (error) throw error;

      alert("Dispute reported. Our compliance team has been notified.");
      navigate('/dashboard');
    } catch (error) {
      alert("Error reporting dispute: " + error.message);
    } finally {
      setProcessingType(null);
    }
  };

  // UI helper for opening the document
  const handleViewProof = () => {
    if (transactionDetails.fileUrl) {
      window.open(transactionDetails.fileUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-700 flex flex-col overflow-x-hidden">
      {/* --- TOP NAV BAR --- */}
      <header className="bg-white border-b border-slate-200 px-6 md:px-10 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white font-bold">
            <ShieldCheck size={20} />
          </div>
          <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <LockIcon size={14} /> <span className="hidden sm:inline">Secure Verification Portal</span>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 pb-20">
        <AnimatePresence mode="wait">
          
          {/* LOADING STATE */}
          {isLoadingData && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center p-10">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Securing Connection...</p>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {!isLoadingData && fetchError && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white rounded-[24px] p-8 md:p-10 shadow-xl shadow-slate-200 border border-slate-100 text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
                <XCircle size={32} />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-3">Link Unavailable</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{fetchError}</p>
              <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-slate-800 transition-colors">
                Refresh Page
              </button>
            </motion.div>
          )}

          {/* SUCCESS/MAIN STATE */}
          {!isLoadingData && !fetchError && (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg bg-white rounded-[24px] md:rounded-[32px] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden"
            >
              <div className="p-6 md:p-10 flex flex-col items-center">
                {/* Status Icon */}
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#eff6ff] rounded-full flex items-center justify-center text-[#1e40af] mb-6 md:mb-8 ring-4 ring-blue-50/50">
                  <ShieldAlert size={32} />
                </div>

                {/* Heading */}
                <h1 className="text-xl md:text-2xl font-black text-slate-900 mb-3 text-center leading-tight">Transaction Verification</h1>
                <p className="text-slate-500 text-sm text-center leading-relaxed mb-8 md:mb-10">
                  <span className="font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-md">{transactionDetails.merchantName}</span> is requesting verification for the following transaction:
                </p>

                {/* Transaction Data Grid */}
                <div className="w-full space-y-4 md:space-y-6 mb-8 md:mb-10 bg-[#f8fafc] p-6 rounded-2xl border border-slate-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-1">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Service</span>
                    <span className="text-sm font-black text-slate-800 text-left sm:text-right">{transactionDetails.service}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-1">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</span>
                    <span className="text-lg md:text-xl font-black text-[#1e40af]">{transactionDetails.amount}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Date</span>
                    <span className="text-sm font-black text-slate-800">{transactionDetails.date}</span>
                  </div>
                </div>

                {/* Supporting Documents Section */}
                <div className="w-full mb-8 md:mb-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Supporting Documents</p>
                  <div 
                    onClick={handleViewProof}
                    className={`bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between group transition-all shadow-sm ${transactionDetails.fileUrl ? 'hover:border-blue-300 hover:shadow-md cursor-pointer hover:bg-blue-50/30' : 'opacity-70 cursor-not-allowed'}`}
                  >
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0 transition-colors ${transactionDetails.fileUrl ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-slate-50 text-slate-400'}`}>
                        <FileText size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className={`text-sm font-bold flex items-center gap-1.5 truncate ${transactionDetails.fileUrl ? 'text-slate-800 group-hover:text-blue-700' : 'text-slate-500'}`}>
                          {transactionDetails.proofFile} {transactionDetails.fileUrl && <ExternalLink size={14} className="shrink-0 text-slate-400" />}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 whitespace-nowrap">
                          {transactionDetails.fileUrl ? `View Document • ${transactionDetails.fileSize}` : 'No document provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!isVerified ? (
                  <div className="w-full space-y-3 md:space-y-4">
                    <button 
                      onClick={handleVerify}
                      disabled={processingType !== null}
                      className="w-full bg-[#22c55e] text-white py-3.5 md:py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                    >
                      {processingType === 'verify' ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                      {processingType === 'verify' ? 'Securing Ledger...' : 'Confirm & Verify'}
                    </button>
                    <button 
                      onClick={handleDispute}
                      disabled={processingType !== null}
                      className="w-full bg-white border border-slate-200 text-slate-600 py-3.5 md:py-4 rounded-2xl font-bold text-sm hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                    >
                      {processingType === 'dispute' ? <Loader2 className="animate-spin text-rose-500" size={18} /> : <AlertTriangle size={18} />}
                      {processingType === 'dispute' ? 'Reporting...' : "I don't recognize this"}
                    </button>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-center shadow-inner"
                  >
                    <CheckCircle size={24} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-emerald-700 font-bold text-sm">Verified Successfully!</p>
                    <p className="text-emerald-600/70 text-xs mt-1 font-medium">Redirecting to confirmation screen...</p>
                  </motion.div>
                )}

                {/* Security Badges */}
                <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center w-full gap-6 opacity-50">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck size={14} /> PCI Compliant
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                    <LockIcon size={14} /> AES-256
                  </div>
                </div>
                
                <p className="mt-5 text-[9px] text-slate-400 text-center max-w-[280px] leading-relaxed font-medium">
                  This link is uniquely generated for your account. Please do not share this URL with anyone. Secured with 256-bit SSL Encryption.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-6 md:py-8 px-4 md:px-6 text-center border-t border-slate-200 bg-white">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-4">
          {['Privacy Policy', 'Terms of Service', 'Help Center'].map((item) => (
            <button key={item} className="text-[10px] md:text-[11px] font-bold text-slate-400 hover:text-[#1e40af] transition-colors uppercase tracking-widest">
              {item}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-loose">
          © 2026 TrustBridge Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default TransactionVerification;
