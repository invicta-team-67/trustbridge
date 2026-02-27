  import React, { useState, useEffect } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { useNavigate } from 'react-router-dom';
  import { supabase } from '../../lib/supabase';
  import StepOne from './StepOne'; 
  import StepTwo from './StepTwo'; 
  import StepThree from './StepThree'; 
  import Logo from '../../components/logo2';

  // --- INLINE ICONS ---
  const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 8-2 2 0 7 2 7 2a1 1 0 0 1 1 1v7z"/></svg>;
  const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
  const UserCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>;

  // --- MAIN COMPONENT ---
  const Onboarding = () => {
    const navigate = useNavigate();

    // Core State
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');
    
    // NEW: Field-specific error tracking
    const [fieldErrors, setFieldErrors] = useState({});

    // Master Form State
    const [formData, setFormData] = useState({
      businessName: '',
      registrationNumber: '',
      industry: '',
      country: '', 
      businessEmail: '',
      phoneNumber: '',
      address: '',
      primaryIndustry: '',
      businessType: '',
      description: ''
    });

    // Pre-fill data if they came from SignUp
    useEffect(() => {
      const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // We check if a profile already exists or if metadata is available
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();        
          if (data) {
            setFormData(prev => ({
              ...prev,
              businessName: data.business_name || user.user_metadata.business_name || '',
              businessType: data.business_type || user.user_metadata.business_type || '',
              industry: data.industry || user.user_metadata.industry || ''
            }));
          } else if (user.user_metadata) {
            // Fallback to metadata if profile row isn't fully ready yet
            setFormData(prev => ({
              ...prev,
              businessName: user.user_metadata.business_name || '',
              businessType: user.user_metadata.business_type || '',
              industry: user.user_metadata.industry || ''
            }));
          }
        }
      };
      fetchProfile();
    }, []);

    // --- VALIDATION ENGINE ---
    const validateCurrentStep = () => {
      const errors = {};
      
      if (currentStep === 1) {
        if (!formData.businessName.trim()) errors.businessName = 'Required';
        if (!formData.registrationNumber.trim()) errors.registrationNumber = 'Required';
        if (!formData.industry) errors.industry = 'Required';
        if (!formData.country.trim()) errors.country = 'Required';
      }
      
      if (currentStep === 2) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.businessEmail.trim() || !emailRegex.test(formData.businessEmail)) errors.businessEmail = 'Valid email required';
        if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Required';
        if (!formData.address.trim()) errors.address = 'Required';
      }

      if (currentStep === 3) {
        if (!formData.primaryIndustry) errors.primaryIndustry = 'Required';
        if (!formData.businessType) errors.businessType = 'Required';
        if (!formData.description.trim()) errors.description = 'Brief description required';
      }

      setFieldErrors(errors);
      return Object.keys(errors).length === 0; // Returns true if NO errors
    };

    // --- NAVIGATION ---
    const nextStep = () => {
      setGlobalError('');
      if (validateCurrentStep()) {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
      } else {
        setGlobalError('Please fill out all required fields to continue.');
      }
    };

    const prevStep = () => {
      setGlobalError('');
      setFieldErrors({}); // Clear errors when going back
      if (currentStep > 1) setCurrentStep(currentStep - 1);
      else navigate('/signup'); 
    };

    // --- INPUT HANDLER ---
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear the specific error for this field as soon as they start typing!
      if (fieldErrors[name]) {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
      setGlobalError('');
    };

    // --- SUPABASE SUBMIT ---
    const submitToSupabase = async () => {
      if (!validateCurrentStep()) {
        setGlobalError('Please complete all final details before submitting.');
        return;
      }

      setIsLoading(true);
      setGlobalError('');

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user logged in. Please sign in again.");

        // Upsert: Create or Update the profile
        const { error: dbError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id, // Updated to match your new database schema
            business_name: formData.businessName,
            registration_number: formData.registrationNumber,
            industry: formData.primaryIndustry || formData.industry, 
            country: formData.country,
            email: formData.businessEmail,
            phone: formData.phoneNumber,
            address: formData.address,
            business_type: formData.businessType,
            description: formData.description,
            verification_status: 'pending',
            updated_at: new Date()
          }); 

        if (dbError) throw dbError;
        
        // Navigate to certificate/success page
        navigate('/certificate');

      } catch (err) {
        console.error("Supabase Error:", err); 
        // THIS WILL PRINT THE EXACT ERROR ON THE SCREEN FOR YOUR TESTERS
        setGlobalError(`DB Error: ${err.message || JSON.stringify(err)}`);
      } finally {
        // THIS STOPS THE LOADING SPINNER
        setIsLoading(false);
      }

    };

    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
      <div className="min-h-screen w-full flex bg-white font-sans text-[#0f172a]">
        
        {/* Left Column: Branding */}
              <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-20 h-screen sticky top-0">
                <img src="/auth-images/img-container.png" alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 mt-16">
                  <h1 className="text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight drop-shadow-sm">Welcome on Board</h1>
                  <p className="text-blue-50 text-lg xl:text-xl font-medium max-w-md leading-relaxed drop-shadow-sm">Start building your verified business history in minutes</p>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="relative z-10 flex items-center gap-2 drop-shadow-sm">
                  <Logo />
                  <span className="text-white font-bold text-2xl tracking-tight">TrustBridge</span>
                </motion.div>
              </div>

        {/* Right Column: Form Container */}
        <div className="w-full lg:w-[60%] flex flex-col items-center py-8 px-6 sm:px-12 h-screen overflow-y-auto">
          <div className="w-full max-w-lg flex flex-col my-auto">
            
            {/* Progress Stepper */}
            <div className="w-full mb-10">
              <div className="flex justify-between items-end text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                <span>Step {currentStep} of {totalSteps}</span>
                <span className={`capitalize font-medium tracking-normal text-[13px] ${currentStep === 3 ? 'text-[#1a56db] font-bold' : 'text-gray-400'}`}>
                  {currentStep === 1 && "Basic Details"}
                  {currentStep === 2 && "Contact Info"}
                  {currentStep === 3 && "Setup Complete"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full bg-[#1a56db] rounded-full" />
              </div>
            </div>

            {/* Global Error Banner */}
            <AnimatePresence>
              {globalError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {globalError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* DYNAMIC FORM AREA */}
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: "easeOut" }} className="w-full">
                {/* fieldError (red) */}
                {currentStep === 1 && <StepOne formData={formData} handleInputChange={handleInputChange} fieldErrors={fieldErrors} />}
                {currentStep === 2 && <StepTwo formData={formData} handleInputChange={handleInputChange} fieldErrors={fieldErrors} />}
                {currentStep === 3 && <StepThree formData={formData} handleInputChange={handleInputChange} fieldErrors={fieldErrors} />}
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8">
              <button type="button" onClick={prevStep} disabled={isLoading} className="text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50">
                <span>&larr;</span> Back
              </button>

              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={currentStep === totalSteps ? submitToSupabase : nextStep} 
                disabled={isLoading} type="button"
                className="bg-[#1a56db] text-white px-8 py-3.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && <motion.svg animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-70"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></motion.svg>}
                {!isLoading && (currentStep === totalSteps ? 'Complete Setup' : <>Next <span>&rarr;</span></>)}
              </motion.button>
            </div>

            {/* Footer Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-16 pb-8 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold tracking-widest uppercase"><ShieldIcon /> BANK-GRADE SECURITY</div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold tracking-widest uppercase"><LockIcon /> END-TO-END ENCRYPTION</div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold tracking-widest uppercase"><UserCheckIcon /> GDPR COMPLIANT</div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  export default Onboarding;