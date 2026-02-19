import React from 'react';
import { motion } from 'framer-motion';

// --- INLINE ICONS ---
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a56db]">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const AtSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a56db]">
    <circle cx="12" cy="12" r="4"/>
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4.8 8.4"/>
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a56db]">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a56db]">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const CloudUploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300 mb-3">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
    <path d="M12 12v9"/>
    <path d="m16 16-4-4-4 4"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 8-2 2 0 7 2 7 2a1 1 0 0 1 1 1v7z"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const UserCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>;


// --- MAIN COMPONENT ---
const Onboarding = () => {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-[#0f172a]">
      
      {/* Left Column: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-[40%] bg-[#0a3ca3] relative overflow-hidden flex-col justify-center p-12 xl:p-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-[#1a56db] blur-[120px] mix-blend-screen opacity-60"></div>
          <div className="absolute top-[30%] -right-[20%] w-[100%] h-[100%] rounded-full bg-[#0ea5e9] blur-[140px] mix-blend-screen opacity-40"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight">
            Welcome on Board
          </h1>
          <p className="text-blue-100 text-lg font-medium max-w-sm leading-relaxed">
            Start building your verified business history in minutes
          </p>
        </motion.div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-[60%] flex flex-col items-center py-8 px-6 sm:px-12 h-screen overflow-y-auto">
        <div className="w-full max-w-2xl flex flex-col items-center">
          
          {/* Progress Stepper */}
          <div className="w-full max-w-lg flex items-center justify-between mb-12 relative">
            <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-100 -z-10"></div>
            {/* Active Line Segment */}
            <div className="absolute top-4 left-0 w-1/2 h-[2px] bg-[#1a56db] -z-10"></div>
            
            <div className="flex flex-col items-center bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-[#1a56db] text-white flex items-center justify-center shadow-md">
                <CheckIcon />
              </div>
              <span className="text-[10px] sm:text-xs font-bold mt-2 text-[#1a56db]">General Info</span>
            </div>

            <div className="flex flex-col items-center bg-white px-2">
              <div className="w-8 h-8 rounded border-2 border-gray-200 text-gray-400 bg-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span className="text-[10px] sm:text-xs font-bold mt-2 text-gray-400">Contact Details</span>
            </div>

            <div className="flex flex-col items-center bg-white px-2">
              <div className="w-8 h-8 rounded border-2 border-gray-200 text-gray-400 bg-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="text-[10px] sm:text-xs font-bold mt-2 text-gray-400">Finalize</span>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2 tracking-tight text-[#0f172a]">Welcome to TrustBridge</h2>
              <p className="text-gray-500 text-sm font-medium">Let's get your business profile ready for the global market.</p>
            </div>

            <form className="flex flex-col gap-10">
              
              {/* Section 1: Business Identity */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BriefcaseIcon />
                  <h3 className="text-base font-bold text-[#0f172a]">Business Identity</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Business Name</label>
                    <input type="text" placeholder="e.g. Invicta Tech Solutions" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] outline-none transition-all placeholder-gray-400 font-medium" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Sector</label>
                    <div className="relative">
                      <select defaultValue="" className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] outline-none transition-all appearance-none text-gray-600 font-medium cursor-pointer">
                        <option value="" disabled>Select Sector</option>
                        <option value="tech">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="retail">Retail</option>
                      </select>
                      <ChevronDownIcon />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Business Type</label>
                    <div className="relative">
                      <select defaultValue="" className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] outline-none transition-all appearance-none text-gray-600 font-medium cursor-pointer">
                        <option value="" disabled>Select Type</option>
                        <option value="llc">LLC</option>
                        <option value="sole">Sole Proprietor</option>
                      </select>
                      <ChevronDownIcon />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <MapPinIcon />
                      </div>
                      <input type="text" placeholder="City, Country" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] outline-none transition-all placeholder-gray-400 font-medium" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AtSignIcon />
                  <h3 className="text-base font-bold text-[#0f172a]">Contact Info</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Business Email</label>
                    <input type="email" placeholder="support@invicta.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] outline-none transition-all placeholder-gray-400 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Phone Number</label>
                    <input type="tel" placeholder="+234 1234567890" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] outline-none transition-all placeholder-gray-400 font-medium" />
                  </div>
                </div>
              </div>

              {/* Section 3: Logo Upload */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon />
                  <h3 className="text-base font-bold text-[#0f172a]">Logo Upload <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span></h3>
                </div>
                <div className="w-full border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors cursor-pointer group">
                  <CloudUploadIcon />
                  <p className="text-sm text-[#1a56db] font-semibold mb-1 group-hover:underline">
                    Drag and drop your business logo here or <span className="text-[#1a56db]">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 font-medium">Recommended: PNG, JPG (Max 5MB)</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4">
                <button type="button" className="text-[#1a56db] font-bold text-sm hover:underline flex items-center gap-2">
                  <span>&larr;</span> Back
                </button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#1a56db] text-white px-8 py-3.5 rounded-lg font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                >
                  Complete Setup
                </motion.button>
              </div>

            </form>

            {/* Footer Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-16 pb-8 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                <ShieldIcon /> BANK-GRADE SECURITY
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                <LockIcon /> END-TO-END ENCRYPTION
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                <UserCheckIcon /> GDPR COMPLIANT
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;