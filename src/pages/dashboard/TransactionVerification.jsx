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
    Menu // Imported for consistency if needed later
  } from 'lucide-react';
  import { motion } from 'framer-motion';
  import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
  import { supabase } from '../../lib/supabase'; // 1. CONNECTED: Import Supabase

  const TransactionVerification = () => {
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); 
    
    // State for dynamic data
    const [transactionId, setTransactionId] = useState(null);
    const [transactionDetails, setTransactionDetails] = useState({
      merchantName: 'Loading...',
      service: 'Loading...',
      amount: '₦0.00',
      date: 'Loading...',
      proofFile: 'Loading...',
      fileSize: '---'
    });

    // 2. CONNECTED: Fetch Data & Session Check
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlId = queryParams.get('id'); // Get the ID from ?id=...

  useEffect(() => {
    const fetchTransactionData = async () => {
      // Only fetch if we have an ID from the URL
      if (!urlId) return;

      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('transaction_id', urlId) // Use the ID from the URL link
          .single();

        if (error) throw error;

        if (data) {
          setTransactionId(data.transaction_id); // Set the internal state so the button works
          setTransactionDetails({
            merchantName: data.client_name || 'Verified Merchant',
            service: data.service_provided,
            amount: `₦${parseFloat(data.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}`,
            date: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            proofFile: data.proof_files_urls ? 'OPay_Receipt.pdf' : 'No document',
            fileSize: '2.4 MB'
          });
        }
      } catch (err) {
        console.error("Verification fetch error:", err);
      }
    };

    fetchTransactionData();
  }, [urlId]);

    // 3. CONNECTED: Verify Logic (Update Supabase)
  // Inside TransactionVerification.jsx
  const handleVerify = async () => {
    if (!transactionId) return;
    setIsProcessing(true);
    
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'Verified' })
        .eq('transaction_id', urlId) // Ensure this is 'transaction_id', not 'id'
      
      if (error) throw error;

      setIsVerified(true);
      
      // REDIRECT UPDATE: Send the user to the new Success Screen
      setTimeout(() => {
        navigate('/verification-success'); // Match this to your App.js route
      }, 1500); 
      
    } catch (error) {
      alert("Verification failed: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

    // 4. CONNECTED: Disputed Logic (Update Supabase)
    const handleDispute = async () => {
      if (!transactionId) return;
      setIsProcessing(true);
      
      try {
        const { error } = await supabase
          .from('transactions')
          .update({ status: 'Disputed' })
          .eq('id', transactionId);

        if (error) throw error;

        alert("Dispute reported. Our compliance team has been notified.");
        navigate('/dashboard');
      } catch (error) {
        alert("Error reporting dispute: " + error.message);
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-700 flex flex-col overflow-x-hidden">
        {/* --- TOP NAV BAR --- */}
        <header className="bg-white border-b border-slate-200 px-6 md:px-10 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white font-bold">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <LockIcon size={14} /> Secure Verification Portal
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-white rounded-[24px] md:rounded-[32px] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden"
          >
            <div className="p-6 md:p-10 flex flex-col items-center">
              {/* Status Icon */}
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#eff6ff] rounded-full flex items-center justify-center text-[#1e40af] mb-6 md:mb-8">
                <ShieldAlert size={32} />
              </div>

              {/* Heading */}
              <h1 className="text-xl md:text-2xl font-black text-slate-900 mb-3 text-center leading-tight">Transaction Verification</h1>
              <p className="text-slate-500 text-sm text-center leading-relaxed mb-8 md:mb-10">
                <span className="font-bold text-slate-800">{transactionDetails.merchantName}</span> is requesting verification for the following transaction:
              </p>

              {/* Transaction Data Grid */}
              <div className="w-full space-y-4 md:space-y-6 mb-8 md:mb-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 pb-4 gap-1">
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Service</span>
                  <span className="text-sm font-black text-slate-800 text-left sm:text-right">{transactionDetails.service}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 pb-4 gap-1">
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</span>
                  <span className="text-lg md:text-xl font-black text-[#1e40af]">{transactionDetails.amount}</span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 pb-4 gap-1">
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Date</span>
                  <span className="text-sm font-black text-slate-800">{transactionDetails.date}</span>
                </div>
              </div>

              {/* Supporting Documents Section */}
              <div className="w-full mb-8 md:mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Supporting Documents</p>
                <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex items-center justify-between group hover:border-blue-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-blue-600 flex items-center gap-1 truncate">
                        {transactionDetails.proofFile} <ExternalLink size={14} className="shrink-0" />
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 whitespace-nowrap">View Proof • {transactionDetails.fileSize}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!isVerified ? (
                <div className="w-full space-y-3 md:space-y-4">
                  <button 
                    onClick={handleVerify}
                    disabled={isProcessing}
                    className="w-full bg-[#22c55e] text-white py-3.5 md:py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                    Confirm & Verify
                  </button>
                  <button 
                    onClick={handleDispute}
                    disabled={isProcessing}
                    className="w-full bg-white border border-slate-200 text-slate-600 py-3.5 md:py-4 rounded-2xl font-bold text-sm hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
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
                  <p className="text-emerald-700 font-bold text-sm">Verified Successfully! Redirecting...</p>
                </motion.div>
              )}

              {/* Security Badges */}
              <div className="mt-8 md:mt-10 flex items-center gap-4 md:gap-6 opacity-40">
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
        <footer className="py-6 md:py-8 px-4 md:px-6 text-center border-t border-slate-100 bg-white">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-4">
            {['Privacy Policy', 'Terms of Service', 'Help Center'].map((item) => (
              <button key={item} className="text-[10px] md:text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
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