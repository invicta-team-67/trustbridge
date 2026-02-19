import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // <-- ADD THIS IMPORT
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
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
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


// --- MAIN COMPONENT ---
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-[#0f172a]">
      
      {/* Left Column: Branding (Hidden on smaller screens) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-20 h-screen sticky top-0">
        
        {/* Background Image Setup */}
        <img 
          src="../public/auth-images/img-container.png" 
          alt="Abstract blue background" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 mt-16"
        >
          <h1 className="text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight drop-shadow-sm">
            Create Your <br/> Business Profile
          </h1>
          <p className="text-blue-50 text-lg xl:text-xl font-medium max-w-md leading-relaxed drop-shadow-sm">
            Start building your verified business history in minutes
          </p>
        </motion.div>

        {/* Logo at bottom */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 flex items-center gap-2 drop-shadow-sm"
        >
          <LogoIcon />
          <span className="text-white font-bold text-2xl tracking-tight">TrustBridge</span>
        </motion.div>
      </div>

      {/* Right Column: Form */}
      {/* CHANGED THIS DIV: Replaced items-center justify-center with flex-col */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 xl:p-16 h-screen overflow-y-auto">
        
        {/* CHANGED THIS DIV: Added my-auto to center it vertically without cutting off top content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[440px] my-auto mx-auto py-8"
        >
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-[#0f172a]">Join TrustBridge</h2>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Securely manage your institutional fintech operation with industry-grade compliance
            </p>
          </div>

          <form className="flex flex-col gap-5">
            
            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Business Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <BuildingIcon />
                </div>
                <input 
                  type="text" 
                  placeholder="Acme Corporation" 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] outline-none transition-all shadow-sm placeholder-gray-400 font-medium"
                />
              </div>
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] outline-none transition-all shadow-sm placeholder-gray-400 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] outline-none transition-all shadow-sm placeholder-gray-400 font-medium tracking-widest"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <EyeIcon show={showPassword} />
                </div>
              </div>
              
              {/* Password Strength Indicator */}
              <div className="mt-3">
                <div className="flex gap-1.5 mb-1.5">
                  <div className="h-1 flex-1 bg-[#1a56db] rounded-full"></div>
                  <div className="h-1 flex-1 bg-[#1a56db] rounded-full"></div>
                  <div className="h-1 flex-1 bg-[#1a56db] rounded-full"></div>
                  <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    At least 8 characters with numbers and symbols
                  </div>
                  <span className="font-bold tracking-wider uppercase">Medium</span>
                </div>
              </div>
            </div>

            {/* Split Row: Sector & Business Type */}
            <div className="flex flex-col sm:flex-row gap-5 mt-1">
              {/* Sector Type Dropdown */}
              <div className="flex-1 relative">
                <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Sector Type</label>
                <div className="relative">
                  <select 
                    defaultValue=""
                    className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] outline-none transition-all shadow-sm appearance-none text-gray-600 font-medium cursor-pointer"
                  >
                    <option value="" disabled>Select type</option>
                    <option value="agro">Agro Business</option>
                    <option value="trade_retail">Trade and Retail</option>
                    <option value="services">Services</option>
                    <option value="others">Others (Specify)</option>
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

              {/* Business Type Dropdown */}
              <div className="flex-1 relative">
                <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">Business Type</label>
                <div className="relative">
                  <select 
                    defaultValue=""
                    className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] outline-none transition-all shadow-sm appearance-none text-gray-600 font-medium cursor-pointer"
                  >
                    <option value="" disabled>Business type</option>
                    <option value="sole_proprietor">Sole Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="llc">Limited Liability Company</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="others">Others (Specify)</option>
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="flex items-start gap-3 mt-3">
              <div className="flex items-center h-5">
                <input 
                  id="terms" 
                  type="checkbox" 
                  className="w-4 h-4 border-gray-300 rounded text-[#1a56db] focus:ring-[#1a56db] cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="text-xs text-gray-500 font-medium leading-relaxed">
                By creating an account, you agree to the <a href="#terms" className="text-[#1a56db] hover:underline">Terms of Service</a> and <a href="#privacy" className="text-[#1a56db] hover:underline">Privacy Policy</a>.
              </label>
            </div>

            {/* Submit Button */}
            <motion.button 
              type="button" // <-- ADD THIS
              onClick={() => navigate('/onboarding')} // <-- ADD THIS
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#1a56db] text-white py-3.5 rounded-lg font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors mt-4"
            >
              Create Account
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