import React, { useState, useEffect } from 'react';

const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>;

const StepThree = ({ formData, handleInputChange, fieldErrors = {}, handleSubmit }) => {
  // 1. Setup our traps
  const [honeypot, setHoneypot] = useState('');
  const [mountTime, setMountTime] = useState(0);

  // 2. Start the timer exactly when the component appears on screen
  useEffect(() => {
    setMountTime(Date.now());
  }, []);

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    // --- SECURITY CHECKS ---
    
    // Check 1: Did they fall for the honeypot?
    if (honeypot.length > 0) {
      console.warn("Bot detected: Honeypot filled.");
      return; // Silently fail. The bot thinks it succeeded, but we do nothing.
    }

    // Check 2: Did they fill it out too fast? (e.g., under 4 seconds)
    const submitTime = Date.now();
    const timeTaken = submitTime - mountTime;
    
    if (timeTaken < 4000) {
      console.warn("Bot detected: Form submitted abnormally fast.");
      return; // Silently fail.
    }

    // --- IF WE GET HERE, IT'S LIKELY A HUMAN ---
    console.log("Human verified! Proceeding to submit.");
    handleSubmit(); 
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-[#64748b]">Operational Details</h2>
        <p className="text-gray-400 text-sm font-medium">Setup almost complete.</p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleFinalSubmit}>
        
        {/* THE HONEYPOT FIELD (Hidden from humans using opacity-0 and absolute positioning) */}
        {/* We give it a tempting name like "fax_number" or "business_website_url" so bots want to fill it */}
        <div className="opacity-0 absolute -z-10 w-0 h-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="fax_number">Fax Number</label>
          <input 
            type="text" 
            id="fax_number" 
            name="fax_number" 
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex="-1" // Prevents humans from tabbing into it by accident
            autoComplete="off"
          />
        </div>

        {/* Expected Monthly Volume */}
        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.monthlyVolume ? 'text-red-500' : 'text-gray-500'}`}>Expected Monthly Volume</label>
          <div className="relative">
            <select name="monthlyVolume" value={formData.monthlyVolume} onChange={handleInputChange} className={`w-full pl-4 pr-10 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all appearance-none font-medium cursor-pointer ${fieldErrors.monthlyVolume ? 'border-red-400 text-gray-800 focus:ring-red-400' : (formData.monthlyVolume ? 'border-gray-200 text-gray-800 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]' : 'border-gray-200 text-gray-400 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]')}`}>
              <option value="" disabled>Select expected volume</option>
              <option value="under_1m" className="text-gray-800">Under ₦1,000,000</option>
              <option value="1m_10m" className="text-gray-800">₦1,000,000 - ₦10,000,000</option>
              <option value="10m_50m" className="text-gray-800">₦10,000,000 - ₦50,000,000</option>
              <option value="over_50m" className="text-gray-800">Over ₦50,000,000</option>
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        {/* Website or Social Link */}
        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.websiteUrl ? 'text-red-500' : 'text-gray-500'}`}>Business Website or Social Link (Optional)</label>
          <div className="relative">
            <input 
              type="text" 
              name="websiteUrl" 
              value={formData.websiteUrl} 
              onChange={handleInputChange} 
              placeholder="https://www.example.com" 
              className={`w-full px-4 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all font-medium ${fieldErrors.websiteUrl ? 'border-red-400 focus:ring-red-400 text-gray-800' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'}`}
            />
          </div>
        </div>

        {/* Brief Description */}
        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.description ? 'text-red-500' : 'text-gray-500'}`}>Brief Description</label>
          <div className="relative">
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Tell us a bit about what your business does..." className={`w-full px-4 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all font-medium resize-none ${fieldErrors.description ? 'border-red-400 focus:ring-red-400 text-gray-800' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'}`}></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full mt-4 bg-[#1a56db] hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg transition-colors"
        >
          Complete Setup
        </button>

      </form>
    </>
  );
};

export default StepThree;
