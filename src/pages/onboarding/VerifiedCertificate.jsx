import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Logo from '../../components/logo2';

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const VerifiedCertificate = () => {
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    businessName: 'Loading...',
    tbId: 'Generating...',
    joinDate: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // FIX: Changed .eq('id', user.id) to .eq('user_id', user.id) 
          // to match your Onboarding.jsx save logic
          const { data, error } = await supabase
            .from('profiles')
            .select('user_id, business_name, created_at')
            .eq('user_id', user.id) 
            .single();

          if (data) {
            const dateObj = new Date(data.created_at);
            setProfileData({
              businessName: data.business_name || 'VERIFIED MERCHANT',
              // Using user_id to generate the certificate ID
              tbId: `TB-${data.user_id.substring(0, 5).toUpperCase()}-X`,
              joinDate: dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            });
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const initial = profileData.businessName.charAt(0).toUpperCase() || 'T';

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-[#0f172a]">
      {/* Left Branding Column */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-20 h-screen sticky top-0">
        <img src="/auth-images/img-container.png" alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="relative z-10 mt-16 text-white text-left">
          <h1 className="text-5xl font-extrabold mb-6">You're All Set!</h1>
          <p className="text-blue-50 text-lg font-medium">Your business is fully verified.</p>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-white">
          <Logo /> <span className="font-bold text-2xl">TrustBridge</span>
        </div>
      </div>

      {/* Right Certificate Column */}
      <div className="w-full lg:w-[60%] flex flex-col items-center p-6 sm:p-12 h-screen overflow-y-auto bg-[#f8fafc]">
        <div className="w-full max-w-[360px] flex flex-col items-center my-auto py-8">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white w-full rounded p-8 border border-gray-800 flex flex-col items-center text-center shadow-sm mb-6">
            
            {/* 1. First Letter Logo */}
            <div className="w-16 h-16 bg-[#0f172a] text-white flex items-center justify-center text-2xl font-bold rounded shadow-sm mb-6">
              {initial}
            </div>

            {/* 2. BUSINESS NAME (Directly above the QR code) */}
            <h1 className="text-lg font-bold tracking-widest text-[#0f172a] uppercase mb-1 truncate w-full px-2">
              {profileData.businessName}
            </h1>
            
            {/* 3. GENERATED ID */}
            <p className="text-xs font-medium text-gray-500 font-mono tracking-wider mb-8">
              ID: {profileData.tbId}
            </p>

            {/* 4. QR CODE */}
            <div className="bg-white p-3 border border-gray-200 rounded-xl shadow-sm mb-8">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://trustbridge.app/verify/${profileData.tbId}&color=0f172a`} 
                alt="Verification QR Code" 
                className="w-40 h-40"
              />
            </div>

            <div className="w-full h-[1px] bg-gray-200 mb-4"></div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0f172a] tracking-wider uppercase">
                <CheckCircleIcon /> VERIFIED
              </div>
              <p className="text-[10px] font-medium text-gray-500 uppercase">
                Member Since: {profileData.joinDate}
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3 print:hidden">
            <button onClick={() => window.print()} className="w-full bg-[#1e293b] text-white py-3.5 text-xs font-bold tracking-wider rounded">DOWNLOAD PDF</button>
            <button onClick={() => navigate('/dashboard')} className="w-full bg-white border-2 border-[#1e293b] text-[#1e293b] py-3.5 text-xs font-bold tracking-wider rounded">GO TO DASHBOARD</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedCertificate;
