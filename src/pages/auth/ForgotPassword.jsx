import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; //IMPORT THE SUPABASE

// --- INLINE ICONS ---
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const ResetPasswordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M12 12v3"/>
    <circle cx="12" cy="10" r="1"/>
  </svg>
);

const TrustBridgeLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 100 100">
    <polygon points="50,10 90,85 10,85" fill="none" stroke="#1a56db" strokeWidth="8" strokeLinejoin="round"/>
    <text x="50" y="70" fontFamily="sans-serif" fontSize="48" fontWeight="bold" fill="#1a56db" textAnchor="middle">T</text>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// ---THE MAIN COMPONENT ---
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  
  // state management
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 

  const handleSendLink = async () => {
    setError('');
    setIsSuccess(false);

    // Regex Validation (for password kini ad email)
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
      //Supabase Call
      // Supabase will automatically send an email to this address with a secure link
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        // The URL  link will be changed to the live site once deployed
        redirectTo: 'http://localhost:5173/reset-password', 
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
    <div className="min-h-screen w-full flex flex-col bg-[#f5f8fc] font-sans text-[#0f172a]">
      
      {/* Top Navigation Bar */}
      <header className="bg-white px-8 py-4 flex items-center shadow-sm w-full">
        <div className="flex items-center gap-2">
          <TrustBridgeLogo />
          <span className="text-[#0f172a] font-extrabold text-xl tracking-tight">TrustBridge</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white w-full max-w-[420px] rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100 flex flex-col items-center text-center"
        >
          
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-5">
            <ResetPasswordIcon />
          </div>

          <h2 className="text-2xl font-bold mb-2 tracking-tight">Forgot Password?</h2>
          <p className="text-gray-500 text-xs font-medium px-2 leading-relaxed mb-6">
            Enter your email and we'll send you a link to reset your password.
          </p>

          {/* Success Banner */}
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex items-start gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 text-sm shadow-sm text-left"
            >
              <div className="mt-0.5"><CheckCircleIcon /></div>
              <span className="font-medium text-xs leading-relaxed">
                If an account exists for that email, we have sent a password reset link. Please check your inbox!
              </span>
            </motion.div>
          )}

          <form className="w-full flex flex-col gap-5">
            
            {/* Email Input */}
            <div className="text-left">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(''); 
                    setIsSuccess(false); 
                  }}
                  placeholder="name@company.com"
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg text-sm outline-none transition-all font-medium text-gray-800 placeholder-gray-400 ${
                    error ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'
                  }`}
                />
              </div>
              {/* Error Message */}
              {error && <p className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">{error}</p>}
            </div>

            {/* Submit Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={isLoading}
              onClick={handleSendLink} 
              className="w-full bg-[#1a56db] flex justify-center items-center gap-2 text-white py-3.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <motion.svg 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-70"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </motion.svg>
              )}
              {isLoading ? 'Sending Link...' : 'Send the reset link'}
            </motion.button>

          </form>

          {/* Back to Login link */}
          <div className="mt-6">
            <a href="/login" className="text-xs font-bold text-gray-500 hover:text-[#1a56db] transition-colors flex items-center gap-1">
              <span>&larr;</span> Back to log in
            </a>
          </div>

        </motion.div>
      </main>
    </div>
  );
};

export default ForgotPassword;