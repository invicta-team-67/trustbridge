import React from 'react';

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const StepThree = ({ formData, handleInputChange, fieldErrors = {}, handleSubmit }) => {
  
  const onFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(); // Directly triggers the parent's submit function
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-[#64748b]">
          Operational Details
        </h2>
        <p className="text-gray-400 text-sm font-medium">Setup almost complete.</p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={onFormSubmit}>
        
        {/* Expected Monthly Volume */}
        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.monthlyVolume ? 'text-red-500' : 'text-gray-500'}`}>
            Expected Monthly Volume
          </label>
          <div className="relative">
            <select 
              name="monthlyVolume" 
              value={formData.monthlyVolume || ""} 
              onChange={handleInputChange} 
              className={`w-full pl-4 pr-10 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all appearance-none font-medium cursor-pointer ${
                fieldErrors.monthlyVolume 
                  ? 'border-red-400 text-gray-800' 
                  : 'border-gray-200 text-gray-800 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'
              }`}
            >
              <option value="" disabled>Select expected volume</option>
              <option value="under_1m">Under ₦1,000,000</option>
              <option value="1m_10m">₦1,000,000 - ₦10,000,000</option>
              <option value="10m_50m">₦10,000,000 - ₦50,000,000</option>
              <option value="over_50m">Over ₦50,000,000</option>
            </select>
            <ChevronDownIcon />
          </div>
          {fieldErrors.monthlyVolume && (
            <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{fieldErrors.monthlyVolume}</p>
          )}
        </div>

        {/* Website or Social Link (Optional) */}
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-500">
            Business Website or Social Link (Optional)
          </label>
          <input 
            type="text" 
            name="websiteUrl" 
            value={formData.websiteUrl || ""} 
            onChange={handleInputChange} 
            placeholder="https://www.example.com" 
            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] font-medium transition-all"
          />
        </div>

        {/* Brief Description */}
        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.description ? 'text-red-500' : 'text-gray-500'}`}>
            Brief Description
          </label>
          <textarea 
            name="description" 
            value={formData.description || ""} 
            onChange={handleInputChange} 
            rows="4" 
            placeholder="Tell us a bit about what your business does..." 
            className={`w-full px-4 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all font-medium resize-none ${
              fieldErrors.description 
                ? 'border-red-400' 
                : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'
            }`}
          />
          {fieldErrors.description && (
            <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{fieldErrors.description}</p>
          )}
        </div>

        {/* Final Submit Button */}
        <button 
          type="submit" 
          className="w-full mt-4 bg-[#1a56db] hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg transition-colors active:scale-[0.98]"
        >
          Complete Setup
        </button>

      </form>
    </>
  );
};

export default StepThree;
