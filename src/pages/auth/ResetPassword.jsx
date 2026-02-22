import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/logo';
import { supabase } from '../../lib/supabase'; // <-- CONNECTED TO DB

// --- INLINE ICONS ---
const EyeIcon = ({ show, onClick }) => (
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-[#1a56db] transition-colors cursor-pointer absolute right-4 top-1/2 -translate-y-1/2">
    {show ? (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
        <line x1="2" x2="22" y1="2" y2="22"/>
      </>
    ) : (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    )}
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-inherit">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const EmptyCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-inherit">
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

// --- MAIN COMPONENT ---
const ResetPassword = () => {
  const navigate = useNavigate();

  // 1. Core State Management
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // 2. Error & Loading State Management
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 3. Robust Regex Checks (Evaluates in real-time as user types)
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  // Calculate score (0 to 4) for the progress bar
  const strengthScore = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  let strengthLabel = 'Weak';
  if (strengthScore === 3) strengthLabel = 'Good';
  if (strengthScore === 4) strengthLabel = 'Strong';

  // Submit Handler & Supabase Integration
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Strict Validation Gate
    if (strengthScore < 4) {
      setError('Please meet all password requirements before continuing.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Send the new password to Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        //Instantly redirect to the dedicated success page
        navigate('/reset-success');
      }
    } catch (err) {
      setError('An unexpected error occurred. Your reset link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f5f8fc] font-sans text-[#0f172a]">
      
      {/* Top Navigation Bar */}
      <header className="bg-white px-8 py-4 flex items-center shadow-sm w-full">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-[#0f172a] font-extrabold text-xl tracking-tight">TrustBridge</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white w-full max-w-[420px] rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100 flex flex-col items-center"
        >
          
          {/* Header Texts */}
          <div className="w-full text-left mb-6">
            <h2 className="text-2xl font-bold mb-2 tracking-tight">Set New Password</h2>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">
              Please enter your new password below to secure your account.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex items-center gap-2 bg-white border border-red-300 text-gray-700 px-4 py-3 rounded-lg mb-6 text-sm shadow-sm text-left"
            >
              <InfoIcon />
              <span className="font-medium text-red-600 text-[11px] leading-tight">{error}</span>
            </motion.div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 text-sm shadow-sm text-left"
            >
              <div className="text-green-600"><CheckCircleIcon /></div>
              <span className="font-bold text-xs">Password reset successfully! Redirecting to login...</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleResetSubmit} className="w-full flex flex-col gap-5">
            
            {/* New Password Input */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">New Password</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-4 pr-11 py-3 bg-white border rounded-lg text-sm outline-none transition-all font-medium tracking-widest text-gray-800 focus:ring-1 focus:ring-[#1a56db] ${
                    error ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#1a56db]'
                  }`}
                />
                <EyeIcon show={showNewPassword} onClick={() => setShowNewPassword(!showNewPassword)} />
              </div>
            </div>

            {/* Password Strength Section (DYNAMIC) */}
            <div className="w-full my-1">
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <span className="text-gray-500 font-medium">Password Strength</span>
                <span className={`font-bold tracking-wide transition-colors ${strengthScore === 4 ? 'text-green-500' : strengthScore === 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
                  {strengthLabel}
                </span>
              </div>
              
              {/* Dynamic Strength Bar */}
              <div className="w-full flex gap-1 h-1.5 mb-3">
                <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 1 ? (strengthScore === 4 ? 'bg-green-500' : 'bg-yellow-400') : 'bg-gray-200'}`}></div>
                <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 2 ? (strengthScore === 4 ? 'bg-green-500' : 'bg-yellow-400') : 'bg-gray-200'}`}></div>
                <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 3 ? (strengthScore === 4 ? 'bg-green-500' : 'bg-yellow-400') : 'bg-gray-200'}`}></div>
                <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 4 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              </div>

              {/* Dynamic Requirements Checklist */}
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[11px] font-medium transition-colors">
                <div className={`flex items-center gap-1.5 ${hasLength ? 'text-green-500' : 'text-gray-400'}`}>
                  {hasLength ? <CheckCircleIcon /> : <EmptyCircleIcon />} 8+ characters
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-green-500' : 'text-gray-400'}`}>
                  {hasUpper ? <CheckCircleIcon /> : <EmptyCircleIcon />} One uppercase
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                  {hasNumber ? <CheckCircleIcon /> : <EmptyCircleIcon />} One number
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-green-500' : 'text-gray-400'}`}>
                  {hasSpecial ? <CheckCircleIcon /> : <EmptyCircleIcon />} One special char
                </div>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-4 pr-11 py-3 bg-white border rounded-lg text-sm outline-none transition-all font-medium tracking-widest text-gray-800 focus:ring-1 focus:ring-[#1a56db] ${
                    error.includes('match') ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#1a56db]'
                  }`}
                />
                <EyeIcon show={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>
            </div>

            {/* Reset Password Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full bg-[#1a56db] flex justify-center items-center gap-2 text-white py-3.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <motion.svg animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-70">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </motion.svg>
              )}
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </motion.button>

            {/* Secondary Text Link */}
            <div className="text-center mt-2">
              <a href="/login" className="text-sm font-bold text-[#1a56db] hover:underline underline-offset-2">
                Cancel and return to log in
              </a>
            </div>

          </form>
        </motion.div>

        {/* Footer Help Text */}
        <p className="mt-8 text-xs font-medium text-gray-500 text-center">
          Need help? Contact our <a href="#support" className="text-[#1a56db] hover:underline">Support Team</a> or visit the <a href="#help" className="text-[#1a56db] hover:underline">Help Center</a>.
        </p>

      </main>
    </div>
  );
};

export default ResetPassword;