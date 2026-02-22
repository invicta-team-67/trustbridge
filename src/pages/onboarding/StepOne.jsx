import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"><path d="m6 9 6 6 6-6"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;

// Added fieldErrors here!
const StepOne = ({ formData, handleInputChange, fieldErrors = {} }) => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-[#64748b]">Business Information</h2>
        <p className="text-gray-400 text-sm font-medium">Tell us about your business to get started with your profile setup.</p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        
        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.businessName ? 'text-red-500' : 'text-gray-500'}`}>Business Name</label>
          <input 
            type="text" 
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Enter name" 
            className={`w-full px-4 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all font-medium ${fieldErrors.businessName ? 'border-red-400 focus:ring-red-400 text-gray-800' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'}`} 
          />
        </div>

        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.registrationNumber ? 'text-red-500' : 'text-gray-500'}`}>Registration Number</label>
          <input 
            type="text" 
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleInputChange}
            placeholder="12345678" 
            className={`w-full px-4 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all font-medium ${fieldErrors.registrationNumber ? 'border-red-400 focus:ring-red-400 text-gray-800' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'}`} 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="relative">
            <label className={`block text-xs font-bold mb-2 ${fieldErrors.industry ? 'text-red-500' : 'text-gray-500'}`}>Industry</label>
            <div className="relative">
              <select 
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className={`w-full pl-4 pr-10 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all appearance-none font-medium cursor-pointer ${fieldErrors.industry ? 'border-red-400 text-gray-800 focus:ring-red-400' : (formData.industry ? 'border-gray-200 text-gray-800 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]' : 'border-gray-200 text-gray-400 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]')}`}
              >
                <option value="" disabled>Select industry</option>
                <option value="tech" className="text-gray-800">Technology</option>
                <option value="finance" className="text-gray-800">Finance</option>
                <option value="retail" className="text-gray-800">Retail</option>
                <option value="agriculture" className="text-gray-800">Agriculture</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="relative">
            <label className={`block text-xs font-bold mb-2 ${fieldErrors.country ? 'text-red-500' : 'text-gray-500'}`}>Country</label>
            <div className="relative">
              <input 
                type="text" 
                name="country" // Fixed from "location" to "country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="e.g. Nigeria" 
                className={`w-full pl-4 pr-10 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all font-medium ${fieldErrors.country ? 'border-red-400 focus:ring-red-400 text-gray-800' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'}`} 
              />
              <MapPinIcon />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default StepOne;