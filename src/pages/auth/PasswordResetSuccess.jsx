import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../components/logo';

// Upgraded Green Success Icon with Spring Animation
const SuccessCheckIcon = () => (
  <motion.div 
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
    className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-emerald-50/50"
  >
    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  </motion.div>
);

// --- MAIN COMPONENT ---
const PasswordResetSuccess = () => {
  const navigate = useNavigate();

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
          className="bg-white w-full max-w-[440px] rounded-[24px] md:rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-blue-900/5 border border-slate-100 flex flex-col items-center text-center"
        >
          
          {/* Animated Success Icon */}
          <SuccessCheckIcon />

          {/* Texts */}
          <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight text-slate-900">
            Password Reset Successful
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed px-2 mb-8">
            Your password has been securely updated. You can now log in to your account with your new credentials.
          </p>

          {/* Action Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login', { replace: true })} // <-- CORE ROUTING PRESERVED
            type="button"
            className="w-full bg-[#1a56db] flex justify-center items-center gap-2 text-white py-4 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-800 transition-all"
          >
            Back to Log In <span className="text-lg leading-none ml-1">&rarr;</span>
          </motion.button>

        </motion.div>
        
        {/* Footer Help Text */}
        <p className="mt-8 text-xs font-medium text-slate-500 text-center">
          Need help? Contact our <Link to="#" className="text-[#1a56db] font-bold hover:underline">Support Team</Link>.
        </p>

      </main>
    </div>
  );
};

export default PasswordResetSuccess;
