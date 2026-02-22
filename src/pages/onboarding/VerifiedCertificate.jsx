import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // <-- CONNECTED TO DB

// --- INLINE ICONS ---
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// --- MAIN COMPONENT ---
const VerifiedCertificate = () => {
  const navigate = useNavigate();
  
  // State to hold the dynamic data from Supabase
  const [profileData, setProfileData] = useState({
    businessName: 'YOUR BUSINESS',
    tbId: 'TB-00000-X',
    joinDate: 'Loading...'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the user's data when the page loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, business_name, created_at')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            // Format the date (e.g., "2024-02-22" -> "Feb 2024")
            const dateObj = new Date(data.created_at || new Date());
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            // Create a fake, clean-looking ID using the first 5 characters of their UUID
            const shortId = data.id.substring(0, 5).toUpperCase();

            setProfileData({
              businessName: data.business_name || 'VERIFIED BUSINESS',
              tbId: `TB-${shortId}-X`,
              joinDate: formattedDate
            });
          }
        }
      } catch (err) {
        console.error("Error fetching profile for certificate:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Simple print function for the "Download" button
  const handleDownload = () => {
    window.print(); // Quick hack: opens the browser print dialog so they can save as PDF!
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-[#0f172a]">
      
      {/* Left Column: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-[40%] relative overflow-hidden flex-col justify-center p-12 xl:p-20 h-screen sticky top-0">
        
        {/* Background Image Setup */}
        <img 
          src="/auth-images/img-container.png" 
          alt="Abstract blue background" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight drop-shadow-sm">
            You're All Set!
          </h1>
          <p className="text-blue-50 text-lg font-medium max-w-sm leading-relaxed drop-shadow-sm">
            Your business is fully verified. Download your TrustBridge ID or head straight to your dashboard.
          </p>
        </motion.div>
      </div>

      {/* Right Column: Certificate Content */}
      <div className="w-full lg:w-[60%] flex flex-col items-center p-6 sm:p-12 h-screen overflow-y-auto bg-[#f8fafc]">
        
        <div className="w-full max-w-[360px] flex flex-col items-center my-auto py-8">
          
          {/* Certificate Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white w-full rounded p-8 border border-gray-800 flex flex-col items-center text-center shadow-sm mb-6 print:border-none print:shadow-none"
          >
            
            {/* Logo Placeholder */}
            <div className="w-16 h-16 bg-[#e2e8f0] border border-gray-300 flex items-center justify-center mb-6">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider">LOGO</span>
            </div>

            {/* DYNAMIC Title & ID */}
            {isLoading ? (
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
            ) : (
              <h1 className="text-lg font-bold tracking-widest text-[#0f172a] uppercase mb-1 truncate w-full px-2">
                {profileData.businessName}
              </h1>
            )}
            
            <p className="text-xs font-medium text-gray-500 font-mono tracking-wider mb-8">
              ID: {profileData.tbId}
            </p>

            {/* QR Code Placeholder */}
            <div className="w-48 h-48 bg-[#e2e8f0] border border-gray-300 flex items-center justify-center mb-8">
              <span className="text-[11px] font-bold text-gray-500 tracking-widest">QR CODE</span>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gray-200 mb-4"></div>

            {/* Verification Status */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0f172a] tracking-wider uppercase">
                <CheckCircleIcon /> VERIFIED
              </div>
              <p className="text-[10px] font-medium text-gray-500 uppercase">
                Member Since: {profileData.joinDate}
              </p>
            </div>

          </motion.div>

          {/* Action Buttons Container (Hidden during printing) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full flex flex-col gap-3 print:hidden"
          >
            {/* Download Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              type="button"
              className="w-full bg-[#1e293b] text-white py-3.5 text-xs font-bold tracking-wider hover:bg-black transition-colors rounded"
            >
              DOWNLOAD PDF
            </motion.button>

            {/* Go to Dashboard Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
              type="button"
              className="w-full bg-white border-2 border-[#1e293b] text-[#1e293b] py-3.5 text-xs font-bold tracking-wider hover:bg-gray-50 transition-colors rounded"
            >
              GO TO DASHBOARD
            </motion.button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default VerifiedCertificate;