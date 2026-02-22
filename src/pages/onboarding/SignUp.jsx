import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; 

// --- INLINE ICONS ---
const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/>
    <path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M12 10h.01"/>
    <path d="M8 14h.01"/><path d="M16 14h.01"/><path d="M12 14h.01"/>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = ({ show }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-[#1a56db] transition-colors cursor-pointer">
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

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-inherit">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// --- MAIN COMPONENT ---
const SignUp = () => {
  const navigate = useNavigate();

  // Core State Management
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sectorType, setSectorType] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Status State
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState(''); // For Supabase errors

  // NEW: Field-Specific Error State
  const [fieldErrors, setFieldErrors] = useState({});

  // Dynamic Password Regex Checks
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const strengthScore = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  let strengthLabel = 'Weak';
  if (strengthScore === 3) strengthLabel = 'Medium';
  if (strengthScore === 4) strengthLabel = 'Strong';

  // NEW: Clear error function for when user types
  const clearFieldError = (fieldName) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    setServerError('');
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setIsSuccess(false);

    // 1. Run Validation
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!businessName.trim()) errors.businessName = 'Business Name is required';
    if (!email.trim() || !emailRegex.test(email)) errors.email = 'Valid work email is required';
    if (strengthScore < 4) errors.password = 'Password must meet all requirements';
    if (!sectorType) errors.sectorType = 'Sector is required';
    if (!businessType) errors.businessType = 'Business Type is required';
    if (!termsAccepted) errors.terms = 'You must accept the terms';

    // 2. If errors exist, update state and stop submission
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return; 
    }

    // 3. If no errors, proceed with Supabase!
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            business_name: businessName,
            industry: sectorType, 
            business_type: businessType,
          }
        }
      });

      if (signUpError) {
        setServerError(signUpError.message);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/onboarding');
        }, 1500); 
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-[#0f172a]">
      
      {/* Left Column: Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-20 h-screen sticky top-0">
        <img src="/auth-images/img-container.png" alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 mt-16">
          <h1 className="text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight drop-shadow-sm">Create Your <br/> Business Profile</h1>
          <p className="text-blue-50 text-lg xl:text-xl font-medium max-w-md leading-relaxed drop-shadow-sm">Start building your verified business history in minutes</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="relative z-10 flex items-center gap-2 drop-shadow-sm">
          <LogoIcon />
          <span className="text-white font-bold text-2xl tracking-tight">TrustBridge</span>
        </motion.div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 xl:p-16 h-screen overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-[440px] my-auto mx-auto py-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-[#0f172a]">Join TrustBridge</h2>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">Securely manage your institutional fintech operation with industry-grade compliance</p>
          </div>

          {/* General Server Error Banner */}
          {serverError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-white border border-red-300 text-gray-700 px-4 py-3 rounded-lg mb-6 text-sm shadow-sm">
              <InfoIcon />
              <span className="font-medium text-red-600 leading-tight text-[12px]">{serverError}</span>
            </motion.div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 text-sm shadow-sm text-left">
              <div className="text-green-600 mt-0.5"><CheckCircleIcon /></div>
              <span className="font-medium text-xs leading-relaxed">Account created successfully! Preparing your profile setup...</span>
            </motion.div>
          )}

          <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-5">
            
            {/* Business Name */}
            <div>
              <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${fieldErrors.businessName ? 'text-red-500' : 'text-[#0f172a]'}`}>Business Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <BuildingIcon />
                </div>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    clearFieldError('businessName');
                  }}
                  placeholder="Acme Corporation" 
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg text-sm outline-none transition-all shadow-sm font-medium ${fieldErrors.businessName ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] placeholder-gray-400'}`}
                />
              </div>
              <AnimatePresence>
                {fieldErrors.businessName && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">{fieldErrors.businessName}</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Work Email */}
            <div>
              <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${fieldErrors.email ? 'text-red-500' : 'text-[#0f172a]'}`}>Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  placeholder="name@company.com" 
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg text-sm outline-none transition-all shadow-sm font-medium ${fieldErrors.email ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] placeholder-gray-400'}`}
                />
              </div>
              <AnimatePresence>
                {fieldErrors.email && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">{fieldErrors.email}</motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${fieldErrors.password ? 'text-red-500' : 'text-[#0f172a]'}`}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError('password');
                  }}
                  placeholder="••••••••" 
                  className={`w-full pl-11 pr-11 py-3 bg-white border rounded-lg text-sm outline-none transition-all shadow-sm font-medium tracking-widest ${fieldErrors.password ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] placeholder-gray-400'}`}
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  <EyeIcon show={showPassword} />
                </div>
              </div>
              <AnimatePresence>
                {fieldErrors.password && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">{fieldErrors.password}</motion.p>
                )}
              </AnimatePresence>
              
              {/* Dynamic Password Strength Indicator */}
              <div className="mt-3">
                <div className="flex gap-1.5 mb-1.5">
                  <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 1 ? (strengthScore === 4 ? 'bg-green-500' : 'bg-[#1a56db]') : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 2 ? (strengthScore === 4 ? 'bg-green-500' : 'bg-[#1a56db]') : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 3 ? (strengthScore === 4 ? 'bg-green-500' : 'bg-[#1a56db]') : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strengthScore >= 4 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium">
                  <div className="flex items-center gap-1">
                    {strengthScore === 4 ? <span className="text-green-500"><CheckCircleIcon /></span> : <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>}
                    At least 8 characters with numbers, upper, and symbols
                  </div>
                  <span className={`font-bold tracking-wider uppercase ${strengthScore === 4 ? 'text-green-500' : 'text-[#1a56db]'}`}>{strengthLabel}</span>
                </div>
              </div>
            </div>

            {/* Split Row: Sector & Business Type */}
            <div className="flex flex-col sm:flex-row gap-5 mt-1">
              {/* Sector Type Dropdown */}
              <div className="flex-1 relative">
                <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${fieldErrors.sectorType ? 'text-red-500' : 'text-[#0f172a]'}`}>Sector Type</label>
                <div className="relative">
                  <select 
                    value={sectorType}
                    onChange={(e) => {
                      setSectorType(e.target.value);
                      clearFieldError('sectorType');
                    }}
                    className={`w-full pl-4 pr-10 py-3 bg-white border rounded-lg text-sm outline-none transition-all shadow-sm appearance-none font-medium cursor-pointer ${fieldErrors.sectorType ? 'border-red-400 focus:ring-1 focus:ring-red-400 text-gray-800' : (sectorType ? 'text-gray-800 border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]' : 'text-gray-400 border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]')}`}
                  >
                    <option value="" disabled>Select type</option>
                    <option value="agro" className="text-gray-800">Agro Business</option>
                    <option value="trade_retail" className="text-gray-800">Trade and Retail</option>
                    <option value="services" className="text-gray-800">Services</option>
                    <option value="others" className="text-gray-800">Others (Specify)</option>
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

              {/* Business Type Dropdown */}
              <div className="flex-1 relative">
                <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${fieldErrors.businessType ? 'text-red-500' : 'text-[#0f172a]'}`}>Business Type</label>
                <div className="relative">
                  <select 
                    value={businessType}
                    onChange={(e) => {
                      setBusinessType(e.target.value);
                      clearFieldError('businessType');
                    }}
                    className={`w-full pl-4 pr-10 py-3 bg-white border rounded-lg text-sm outline-none transition-all shadow-sm appearance-none font-medium cursor-pointer ${fieldErrors.businessType ? 'border-red-400 focus:ring-1 focus:ring-red-400 text-gray-800' : (businessType ? 'text-gray-800 border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]' : 'text-gray-400 border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]')}`}
                  >
                    <option value="" disabled>Business type</option>
                    <option value="sole_proprietor" className="text-gray-800">Sole Proprietorship</option>
                    <option value="partnership" className="text-gray-800">Partnership</option>
                    <option value="llc" className="text-gray-800">Limited Liability Company</option>
                    <option value="freelancer" className="text-gray-800">Freelancer</option>
                    <option value="others" className="text-gray-800">Others (Specify)</option>
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
            {/* Split row errors */}
            <AnimatePresence>
              {(fieldErrors.sectorType || fieldErrors.businessType) && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[11px] text-red-500 font-bold ml-1 -mt-3">Please select both Sector and Business Type</motion.p>
              )}
            </AnimatePresence>

            {/* Terms and Privacy Checkbox */}
            <div className="flex items-start gap-3 mt-3">
              <div className="flex items-center h-5">
                <input 
                  id="terms" 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    clearFieldError('terms');
                  }}
                  className={`w-4 h-4 rounded cursor-pointer transition-colors ${fieldErrors.terms ? 'border-red-400 text-red-500 focus:ring-red-400' : 'border-gray-300 text-[#1a56db] focus:ring-[#1a56db]'}`}
                />
              </div>
              <label htmlFor="terms" className={`text-xs font-medium leading-relaxed ${fieldErrors.terms ? 'text-red-500' : 'text-gray-500'}`}>
                By creating an account, you agree to the <a href="#terms" className="text-[#1a56db] hover:underline">Terms of Service</a> and <a href="#privacy" className="text-[#1a56db] hover:underline">Privacy Policy</a>.
              </label>
            </div>

            {/* Submit Button */}
            <motion.button 
              type="submit" 
              disabled={isLoading || isSuccess}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#1a56db] text-white py-3.5 rounded-lg font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading && (
                <motion.svg animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-70">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </motion.svg>
              )}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </motion.button>

            {/* Switch to Login */}
            <p className="text-center text-sm text-gray-500 font-medium mt-4">
              Already have an account? <a href="/login" className="text-[#1a56db] font-bold hover:underline">Log in</a>
            </p>

          </form>
        </motion.div>
      </div>

    </div>
  );
};

export default SignUp;