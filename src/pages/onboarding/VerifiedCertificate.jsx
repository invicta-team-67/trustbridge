import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const VerifiedCertificate = () => {
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    businessName: '',
    tbId: 'TB-00000-X',
    joinDate: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('business_name, tb_id, created_at')
            .eq('id', user.id)
            .single();

          if (data) {
            setProfileData({
              businessName: data.business_name || 'YOUR BUSINESS',
              tbId: data.tb_id || 'TB-0000-X',
              joinDate: new Date(data.created_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })
            });
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // LOGIC: Get the first letter of the business name
  const businessInitial = profileData.businessName 
    ? profileData.businessName.trim().charAt(0).toUpperCase() 
    : 'B';

  if (isLoading) return <div className="h-screen flex items-center justify-center text-xs font-bold tracking-widest text-gray-400">VERIFYING...</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-8 font-mono uppercase text-black">
      <div className="w-full max-w-md">
        
        {/* CERTIFICATE AREA (This part is printable) */}
        <div id="certificate-content" className="border-4 border-black p-6 sm:p-10 relative bg-white overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)]">
          
          {/* Logo Section - Using First Letter */}
          <div className="flex justify-between items-start mb-12">
            <div className="w-12 h-12 border-2 border-black flex items-center justify-center font-bold text-2xl bg-black text-white">
              {businessInitial}
            </div>
            <div className="text-[10px] text-right font-bold leading-tight">
              VERIFIED<br/>MERCHANT<br/>2026
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] mb-2 opacity-40">ACCOUNT IDENTIFIER</p>
              <h1 className="text-xl sm:text-2xl font-black leading-none break-words">
                {profileData.businessName}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t-2 border-black pt-6">
              <div>
                <p className="text-[8px] font-bold tracking-[0.2em] mb-1 opacity-40">CERTIFICATE NO.</p>
                <p className="text-xs font-bold tracking-tighter">{profileData.tbId}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold tracking-[0.2em] mb-1 opacity-40">MEMBER SINCE</p>
                <p className="text-xs font-bold tracking-tighter">{profileData.joinDate}</p>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
               <div className="bg-black text-white px-4 py-2 text-[10px] font-bold tracking-widest">
                 OFFICIAL VERIFIED STATUS
               </div>
            </div>
          </motion.div>
        </div>

        {/* Buttons (Hidden when printing) */}
        <div className="mt-8 flex flex-col gap-3 print:hidden">
          <button 
            onClick={() => window.print()}
            className="w-full bg-black text-white py-4 text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors"
          >
            PRINT CERTIFICATE
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-white border-2 border-black text-black py-4 text-xs font-bold tracking-widest hover:bg-gray-50 transition-colors"
          >
            GO TO DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifiedCertificate;
