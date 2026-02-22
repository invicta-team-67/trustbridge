import React from 'react';

const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>;

const StepThree = ({ formData, handleInputChange, fieldErrors = {} }) => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-[#64748b]">Business Category</h2>
        <p className="text-gray-400 text-sm font-medium">Setup almost complete.</p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.primaryIndustry ? 'text-red-500' : 'text-gray-500'}`}>Primary Industry</label>
          <div className="relative">
            <select name="primaryIndustry" value={formData.primaryIndustry} onChange={handleInputChange} className={`w-full pl-4 pr-10 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all appearance-none font-medium cursor-pointer ${fieldErrors.primaryIndustry ? 'border-red-400 text-gray-800 focus:ring-red-400' : (formData.primaryIndustry ? 'border-gray-200 text-gray-800 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]' : 'border-gray-200 text-gray-400 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]')}`}>
              <option value="" disabled>Select your industry</option>
              <option value="tech" className="text-gray-800">Technology & Software</option>
              <option value="retail" className="text-gray-800">Retail & E-commerce</option>
              <option value="finance" className="text-gray-800">Finance & Banking</option>
              <option value="healthcare" className="text-gray-800">Healthcare</option>
              <option value="manufacturing" className="text-gray-800">Manufacturing</option>
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.businessType ? 'text-red-500' : 'text-gray-500'}`}>Business Type</label>
          <div className="relative">
            <select name="businessType" value={formData.businessType} onChange={handleInputChange} className={`w-full pl-4 pr-10 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all appearance-none font-medium cursor-pointer ${fieldErrors.businessType ? 'border-red-400 text-gray-800 focus:ring-red-400' : (formData.businessType ? 'border-gray-200 text-gray-800 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]' : 'border-gray-200 text-gray-400 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]')}`}>
              <option value="" disabled>Select legal structure</option>
              <option value="llc" className="text-gray-800">Limited Liability Company (LLC)</option>
              <option value="sole" className="text-gray-800">Sole Proprietorship</option>
              <option value="corp" className="text-gray-800">Corporation</option>
              <option value="partnership" className="text-gray-800">Partnership</option>
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.description ? 'text-red-500' : 'text-gray-500'}`}>Brief Description</label>
          <div className="relative">
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Tell us a bit about what your business does..." className={`w-full px-4 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all font-medium resize-none ${fieldErrors.description ? 'border-red-400 focus:ring-red-400 text-gray-800' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'}`}></textarea>
          </div>
        </div>
      </form>
    </>
  );
};

export default StepThree;