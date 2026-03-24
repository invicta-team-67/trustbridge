import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // IMPORT THE SUPABASE
import Logo from '../../components/logo';

// --- INLINE ICONS ---
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const ResetPasswordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a56db]">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M12 12v3"/>
    <circle cx="12" cy="10" r="1"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 shrink-0">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

// --- THE MAIN COMPONENT ---
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  
  // state management
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 

  const handleSendLink = async () => {
    setError('');
    setIsSuccess(false);

    // Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    } else if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setIsLoading(true);

    try {
      // Supabase Call
      // Supabase will automatically send an email to this address with a secure link
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        // The URL link uses window.location.origin to work dynamically on Localhost AND Netlify
        redirectTo: `${window.location.origin}/reset-password`, 
      });

      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        // Show success state
        setIsSuccess(true); 
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f8fafc] font-sans text-slate-900">
      
      {/* Top Navigation Bar */}
      <header className="bg-white px-6 md:px-10 py-5 flex items-center shadow-sm w-full sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <Logo />
          <span className="font-bold text-xl md:text-2xl text-slate-900 tracking-tight">TrustBridge</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white w-full max-w-[440px] rounded-[24px] md:rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-blue-900/5 border border-slate-100 flex flex-col items-center text-center"
        >
          
          {/* Header Icon */}
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-100">
            <ResetPasswordIcon />
          </div>

          <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight text-slate-900">Reset Password</h2>
          <p className="text-slate-500 text-sm font-medium px-2 leading-relaxed mb-8">
            Enter your registered email address and we'll send you a secure link to reset your password.
          </p>

          {/* Animated Success Banner */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                className="w-full flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-xl mb-8 shadow-sm text-left"
              >
                <CheckCircleIcon />
                <span className="font-bold text-xs leading-relaxed mt-0.5">
                  If an account exists for that email, we have sent a password reset link. Please check your inbox!
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                className="w-full flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl mb-8 shadow-sm text-left"
              >
                <InfoIcon />
                <span className="font-bold text-xs leading-snug mt-0.5">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="w-full flex flex-col gap-6">
            
            {/* Email Input */}
            <div className="text-left">
              <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(''); 
                    setIsSuccess(false); 
                  }}
                  placeholder="name@company.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-[#f8fafc] border rounded-xl text-sm outline-none transition-all font-bold text-slate-800 placeholder-slate-400 ${
                    error ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/50' : 'border-slate-200 focus:border-[#1a56db] focus:ring-2 focus:ring-blue-500/20 hover:bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={isLoading || isSuccess}
              onClick={handleSendLink} 
              className="w-full bg-[#1a56db] flex justify-center items-center gap-2 text-white py-4 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-800 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <motion.svg 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </motion.svg>
                  Sending Link...
                </>
              ) : 'Send Reset Link'}
            </motion.button>

          </form>

          {/* Back to Login link (FIXED ROUTING) */}
          <div className="mt-8">
            <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-[#1a56db] transition-colors flex items-center justify-center gap-1.5 group">
              <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to log in
            </Link>
          </div>

        </motion.div>
      </main>
    </div>
  );
};

export default ForgotPassword;
