import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/logo';

// Green Success Icon with the halo effect
const SuccessCheckIcon = () => (
  <div className="relative flex items-center justify-center w-16 h-16">
    {/* Light green outer halo */}
    <div className="absolute inset-0 bg-green-100 rounded-full opacity-60"></div>
    {/* Darker green inner circle with check */}
    <div className="relative flex items-center justify-center w-10 h-10 bg-green-500 rounded-full text-white shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const PasswordResetSuccess = () => {
  const navigate = useNavigate();

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
      <main className="flex-1 flex items-center justify-center p-4">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white w-full max-w-[400px] rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100 flex flex-col items-center text-center"
        >
          
          {/* Success Icon */}
          <SuccessCheckIcon />

          {/* Texts */}
          <h2 className="text-xl sm:text-2xl font-bold mt-6 mb-3 tracking-tight text-[#0f172a]">
            Password Reset Successful
          </h2>
          <p className="text-gray-500 text-[13px] font-medium leading-relaxed px-2 mb-8">
            Your password has been updated. You can now log in to your account with your new credentials.
          </p>

          {/* Action Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login', { replace: true })} // <-- THE MAGIC FIX
            type="button"
            className="w-full bg-[#1a56db] text-white py-3.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
          >
            Back to login
          </motion.button>

        </motion.div>
      </main>
    </div>
  );
};

export default PasswordResetSuccess;