import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; 

// --- INLINE ICONS ---
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

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
    <path d="M16.82 9.76c-.05-2.5 2.04-3.72 2.13-3.78-1.16-1.7-2.96-1.93-3.6-1.96-1.52-.15-2.98.89-3.76.89-.78 0-1.98-.86-3.23-.84-1.63.02-3.13.95-3.96 2.39-1.69 2.93-.43 7.28 1.22 9.66.81 1.15 1.77 2.44 3.02 2.39 1.2-.05 1.67-.78 3.12-.78 1.45 0 1.89.78 3.14.75 1.28-.02 2.12-1.18 2.92-2.34.93-1.35 1.31-2.67 1.33-2.74-.03-.01-2.55-.98-2.6-3.87z" fill="#000"/>
    <path d="M15.01 6.51c.66-.8 1.1-1.91.98-3.01-1.01.04-2.18.67-2.86 1.47-.6.71-1.13 1.85-.99 2.93 1.12.09 2.2-.56 2.87-1.39z" fill="#000"/>
  </svg>
);

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
  </svg>
);


// --- MAIN COMPONENT ---
const Login = () => {
  const navigate = useNavigate();

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Error & Loading States
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation Logic
  const validateForm = () => {
    let isValid = true;
    setIdentifierError('');
    setPasswordError('');
    setGeneralError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!identifier.trim()) {
      setIdentifierError('Please enter your email.');
      isValid = false;
    } else if (!emailRegex.test(identifier)) {
      setIdentifierError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    }

    return isValid;
  };

  //SUPABASE SUBMIT HANDLER
  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    if (!validateForm()) return; 

    setIsLoading(true);

    try {
      // Connect to Supabase Auth -> signInWithPassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier, 
        password: password,
      });

      if (error) {
        // Handle incorrect passwords or missing users gracefully
        setGeneralError('Invalid email or password. Please try again.'); 
      } else if (data.user) {
        // Success! Send them to the dashboard
        navigate('/dashboard'); 
      }
    } catch (err) {
      setGeneralError('An unexpected error occurred. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  //SOCIAL LOGIN HANDLER
  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });
      if (error) throw error;
    } catch (err) {
      setGeneralError(`Could not authenticate with ${provider}.`);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-[#0f172a]">
      
      {/* Left Column: Branding (Hidden on smaller screens) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-20 h-screen sticky top-0">
        <img 
          src="/auth-images/img-container.png" 
          alt="Abstract blue background" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 mt-16"
        >
          <h1 className="text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight drop-shadow-sm">
            Welcome Back
          </h1>
          <p className="text-blue-50 text-lg xl:text-xl font-medium max-w-md leading-relaxed drop-shadow-sm">
            Log in to access your business trust dashboard.
          </p>
        </motion.div>

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
      <div className="w-full lg:w-1/2 flex flex-col items-center p-6 sm:p-12 xl:p-24 h-screen overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[400px] my-auto py-8"
        >
          {/* General Error Banner */}
          {generalError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-white border border-red-300 text-gray-700 px-4 py-3 rounded-lg mb-6 text-sm shadow-sm"
            >
              <InfoIcon />
              <span className="font-medium text-red-600">{generalError}</span>
            </motion.div>
          )}

          <div className="mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-[#0f172a]">Login</h2>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            {/* Identifier (Email) */}
            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input 
                  type="email" 
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setIdentifierError(''); 
                    setGeneralError('');
                  }}
                  placeholder="name@company.com" 
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg text-sm outline-none transition-all shadow-sm font-medium ${
                    identifierError || generalError ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] placeholder-gray-400'
                  }`}
                />
              </div>
              {identifierError && <p className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">{identifierError}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-[#0f172a]">Password</label>
                <a href="/forgot" className="text-xs font-bold text-[#1a56db] hover:underline mt-1">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                    setGeneralError('');
                  }}
                  placeholder="••••••••" 
                  className={`w-full pl-11 pr-11 py-3 bg-white border rounded-lg text-sm outline-none transition-all shadow-sm font-medium tracking-widest ${
                    passwordError || generalError ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] placeholder-gray-400'
                  }`}
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <EyeIcon show={showPassword} />
                </div>
              </div>
              {passwordError && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: [-5, 5, -5, 5, 0] }} 
                  transition={{ duration: 0.4 }}
                  className="text-[11px] text-red-500 font-bold mt-1.5 ml-1"
                >
                  {passwordError}
                </motion.p>
              )}
            </div>

            {/* Login Button */}
            <motion.button 
              type="submit" 
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#1a56db] flex justify-center items-center gap-2 text-white py-3.5 rounded-lg font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <motion.svg animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-70">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </motion.svg>
              )}
              {isLoading ? 'Authenticating...' : 'Login to Account'}
            </motion.button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-4 mt-2">
              <div className="absolute w-full border-t border-gray-200"></div>
              <span className="relative bg-white px-4 text-xs font-medium text-gray-400">Or continue with</span>
            </div>

            {/* Social Logins */}
            <div className="flex flex-col gap-3">
              <button 
                type="button" 
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-[#0f172a] py-3 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
              >
                <GoogleIcon /> Continue with Google
              </button>
              
              <button 
                type="button" 
                onClick={() => handleSocialLogin('apple')}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-[#0f172a] py-3 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
              >
                <AppleIcon /> Continue with Apple
              </button>
            </div>

            {/* Switch to Sign Up */}
            <p className="text-center text-sm text-gray-500 font-medium mt-6">
              Don't have an account? <a href="/signup" className="text-[#1a56db] font-bold hover:underline">Sign Up</a>
            </p>

          </form>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;