import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // <-- CONNECTED TO DB
import Logo from '../../components/logo2';

// --- INLINE ICONS & OFFICIAL GRAPHICS ---
const OfficialSeal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 100 100" className="drop-shadow-md">
    <circle cx="50" cy="50" r="45" fill="#1e40af" />
    <circle cx="50" cy="50" r="38" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M50 20 L55 35 L70 35 L58 45 L62 60 L50 50 L38 60 L42 45 L30 35 L45 35 Z" fill="#fbbf24" />
    <text x="50" y="80" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle" letterSpacing="1">VERIFIED</text>
  </svg>
);

const DigitalSignature = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 200 60">
    <path d="M20 40 Q 40 10, 60 40 T 90 20 T 120 40 T 150 20 T 180 50" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40 30 L 160 30" fill="none" stroke="#0f172a" strokeWidth="1" opacity="0.3" strokeDasharray="5 5" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
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
          // FIXED: Changed eq('id') to eq('user_id') to prevent 400 crash!
          const { data, error } = await supabase
            .from('profiles')
            .select('id, business_name, created_at')
            .eq('user_id', user.id) 
            .single();

          if (data && !error) {
            // Format the date (e.g., "2024-02-22" -> "Feb 2024")
            const dateObj = new Date(data.created_at || new Date());
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            
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
    window.print(); 
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] font-sans text-[#0f172a] print:bg-white">
      
      {/* Left Column: Branding (Hidden on mobile and during print) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-20 h-screen sticky top-0 print:hidden">
        <img src="/auth-images/img-container.png" alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 mt-16">
          <h1 className="text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight drop-shadow-sm">
            You're All Set!
          </h1>
          <p className="text-blue-50 text-lg xl:text-xl font-medium max-w-md leading-relaxed drop-shadow-sm">
            Your business is fully verified. Download your official TrustBridge certificate or head straight to your workspace.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="relative z-10 flex items-center gap-2 drop-shadow-sm">
          <Logo />
          <span className="text-white font-bold text-2xl tracking-tight">TrustBridge</span>
        </motion.div>
      </div>

      {/* Right Column: Certificate Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-12 min-h-screen overflow-y-auto bg-[#f8fafc] print:w-full print:p-0 print:m-0 print:bg-white">
        
        <div className="w-full max-w-[500px] flex flex-col items-center py-8 print:max-w-full print:py-0">
          
          {/* OFFICIAL CERTIFICATE PLAQUE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full bg-white relative p-2 sm:p-3 shadow-2xl border border-gray-200 mb-8 print:shadow-none print:border-none print:mb-0 print:break-inside-avoid"
          >
            {/* Inner Gold Border */}
            <div className="border-2 border-[#1e40af] p-8 sm:p-10 relative overflow-hidden h-full flex flex-col items-center text-center">
              
              {/* Subtle Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <LogoIconLarge />
              </div>

              {/* Header */}
              <h4 className="text-[10px] sm:text-xs font-black tracking-[0.3em] text-slate-400 uppercase mb-8 relative z-10">
                Official Credential
              </h4>

              {/* Certificate Title */}
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0f172a] uppercase mb-8 relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
                Certificate of<br/>Verification
              </h1>

              <p className="text-xs sm:text-sm font-medium text-slate-500 mb-3 relative z-10 italic" style={{ fontFamily: 'Georgia, serif' }}>
                This document certifies that
              </p>

              {/* DYNAMIC Business Name */}
              {isLoading ? (
                <div className="h-8 w-48 bg-gray-100 animate-pulse rounded mb-4"></div>
              ) : (
                <h2 className="text-xl sm:text-2xl font-black tracking-wider text-[#1e40af] uppercase mb-4 relative z-10 px-4 py-2 border-b border-gray-200 w-full truncate">
                  {profileData.businessName}
                </h2>
              )}

              <p className="text-xs sm:text-sm font-medium text-slate-500 mb-10 relative z-10 max-w-[300px] leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
                has successfully met the compliance and operational standards required to be a verified merchant on the TrustBridge Institutional Network.
              </p>

              {/* Bottom Layout Grid */}
              <div className="w-full flex justify-between items-end relative z-10">
                
                {/* Left: Signatures & Dates */}
                <div className="flex flex-col items-start text-left">
                  <DigitalSignature />
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-800 uppercase tracking-widest mt-1">Head of Compliance</p>
                  <p className="text-[9px] font-medium text-slate-400 mt-4 uppercase tracking-wider">Date Issued:</p>
                  <p className="text-[10px] font-bold text-slate-800">{isLoading ? '---' : profileData.joinDate}</p>
                </div>

                {/* Right: QR Code & Seal */}
                <div className="flex flex-col items-end gap-4">
                  <OfficialSeal />
                  
                  {!isLoading && (
                    <div className="bg-white p-1.5 border border-slate-200 shadow-sm">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://trustbridge.app/verify/${profileData.tbId}&color=0f172a`} 
                        alt="Verification QR Code" 
                        className="w-16 h-16 sm:w-20 sm:h-20"
                      />
                    </div>
                  )}
                  <p className="text-[8px] font-mono text-slate-400 tracking-widest uppercase">ID: {profileData.tbId}</p>
                </div>

              </div>

              {/* Verified Badge Tag */}
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 shadow-sm rounded-bl-lg flex items-center gap-1.5">
                <CheckCircleIcon color="white" /> Active
              </div>

            </div>
          </motion.div>

          {/* Action Buttons Container (Hidden during printing) */}
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden"
            >
              {/* Go to Dashboard Button */}
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-white border border-slate-200 text-slate-700 py-4 text-xs font-bold tracking-wider hover:bg-slate-50 hover:text-[#1e40af] transition-all rounded-xl shadow-sm active:scale-95"
              >
                GO TO DASHBOARD
              </button>

              {/* Download Button */}
              <button 
                onClick={handleDownload}
                className="w-full bg-[#1e40af] text-white py-4 text-xs font-bold tracking-wider hover:bg-blue-800 transition-all rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <DownloadIcon /> DOWNLOAD PDF
              </button>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

// Subtle background logo for the watermark
const LogoIconLarge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
  </svg>
);

export default VerifiedCertificate;
