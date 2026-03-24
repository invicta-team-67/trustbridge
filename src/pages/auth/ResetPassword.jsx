import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../components/logo';
import { supabase } from '../../lib/supabase'; // <-- CONNECTED TO DB

// --- INLINE ICONS ---
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = ({ show, onClick }) => (
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 hover:text-[#1a56db] transition-colors cursor-pointer">
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
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0">
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
        // Redirect to login after successful reset
        setIsSuccess(true);
        setTimeout(() => {
            navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Your reset link may have expired.');
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
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white w-full max-w-[440px] rounded-[24px] md:rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-blue-900/5 border border-slate-100 flex flex-col items-center"
        >
          
          {/* Header Texts */}
          <div className="w-full text-center md:text-left mb-8">
            <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight text-slate-900">Set New Password</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Please enter your new password below to secure your account.
            </p>
          </div>

          {/* Animated Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                className="w-full flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl mb-8 shadow-sm text-left overflow-hidden"
              >
                <InfoIcon />
                <span className="font-bold text-xs leading-snug mt-0.5">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Success Banner */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                className="w-full flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-xl mb-8 shadow-sm text-left overflow-hidden"
              >
                <div className="mt-0.5 text-emerald-600"><CheckCircleIcon /></div>
                <span className="font-bold text-xs leading-relaxed">Password reset successfully! Redirecting to login...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleResetSubmit} className="w-full flex flex-col gap-6">
            
            {/* New Password Input */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-[#f8fafc] border rounded-xl text-sm outline-none transition-all font-bold tracking-widest text-slate-800 placeholder:tracking-normal placeholder-slate-400 ${
                    error ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/50' : 'border-slate-200 focus:border-[#1a56db] focus:ring-2 focus:ring-blue-500/20 hover:bg-white'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <EyeIcon show={showNewPassword} onClick={() => setShowNewPassword(!showNewPassword)} />
                </div>
              </div>
            </div>

            {/* Password Strength Section (DYNAMIC) */}
            <div className="w-full my-1">
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Password Strength</span>
                <span className={`font-black tracking-wide transition-colors uppercase text-[10px] ${strengthScore === 4 ? 'text-emerald-500' : strengthScore === 3 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {strengthLabel}
                </span>
              </div>
              
              {/* Dynamic Strength Bar */}
              <div className="w-full flex gap-1.5 h-1.5 mb-4">
                <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 1 ? (strengthScore === 4 ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-slate-200'}`}></div>
                <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 2 ? (strengthScore === 4 ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-slate-200'}`}></div>
                <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 3 ? (strengthScore === 4 ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-slate-200'}`}></div>
                <div className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
              </div>

              {/* Dynamic Requirements Checklist */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[11px] font-bold transition-colors">
                <div className={`flex items-center gap-1.5 ${hasLength ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {hasLength ? <CheckCircleIcon /> : <EmptyCircleIcon />} 8+ characters
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {hasUpper ? <CheckCircleIcon /> : <EmptyCircleIcon />} One uppercase
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {hasNumber ? <CheckCircleIcon /> : <EmptyCircleIcon />} One number
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {hasSpecial ? <CheckCircleIcon /> : <EmptyCircleIcon />} One symbol
                </div>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-[#f8fafc] border rounded-xl text-sm outline-none transition-all font-bold tracking-widest text-slate-800 placeholder:tracking-normal placeholder-slate-400 ${
                    error.includes('match') ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-50/50' : 'border-slate-200 focus:border-[#1a56db] focus:ring-2 focus:ring-blue-500/20 hover:bg-white'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <EyeIcon show={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                </div>
              </div>
            </div>

            {/* Reset Password Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full bg-[#1a56db] flex justify-center items-center gap-2 text-white py-4 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-800 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <motion.svg animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </motion.svg>
                  Resetting...
                </>
              ) : 'Reset Password'}
            </motion.button>

            {/* Secondary Text Link (FIXED ROUTING) */}
            <div className="text-center mt-2">
              <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-[#1a56db] transition-colors flex items-center justify-center gap-1.5 group">
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Cancel and return to log in
              </Link>
            </div>

          </form>
        </motion.div>

        {/* Footer Help Text */}
        <p className="mt-8 text-xs font-medium text-slate-500 text-center">
          Need help? Contact our <Link to="#" className="text-[#1a56db] font-bold hover:underline">Support Team</Link> or visit the <Link to="#" className="text-[#1a56db] font-bold hover:underline">Help Center</Link>.
        </p>

      </main>
    </div>
  );
};

export default ResetPassword;
