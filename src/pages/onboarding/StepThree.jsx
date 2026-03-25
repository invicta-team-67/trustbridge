import React from 'react';

const StepThree = ({ formData, handleInputChange, fieldErrors = {}, handleSubmit }) => {
  
  const onFormSubmit = (e) => {
    e.preventDefault();
    // Only trigger submit if they've checked the confirmation
    if (formData.confirmCreate) {
      handleSubmit();
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-[#64748b]">
          Final Step
        </h2>
        <p className="text-gray-400 text-sm font-medium">Almost there, let's wrap this up.</p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={onFormSubmit}>
        
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
        </div>

        {/* Website (Optional) */}
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-500">
            Website or Social Link (Optional)
          </label>
          <input 
            type="text" 
            name="websiteUrl" 
            value={formData.websiteUrl || ""} 
            onChange={handleInputChange} 
            placeholder="https://example.com" 
            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] font-medium transition-all"
          />
        </div>

        {/* Confirmation Radio Section */}
        <div className={`p-4 rounded-xl border transition-all ${formData.confirmCreate === 'yes' ? 'border-blue-200 bg-blue-50' : 'border-gray-100 bg-gray-50/50'}`}>
          <p className="text-sm font-semibold text-gray-700 mb-3">Complete Setup?</p>
          <div className="flex items-center gap-4">
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="confirmCreate"
                value="yes"
                checked={formData.confirmCreate === 'yes'}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#1a56db] border-gray-300 focus:ring-[#1a56db]"
              />
              <span className="ml-2 text-sm font-medium text-gray-600 group-hover:text-[#1a56db]">Yes</span>
            </label>
          </div>
          {fieldErrors.confirmCreate && (
            <p className="text-red-500 text-[10px] mt-2 uppercase font-bold tracking-wider">{fieldErrors.confirmCreate}</p>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={formData.confirmCreate !== 'yes'}
          className={`w-full mt-2 font-bold py-4 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] ${
            formData.confirmCreate === 'yes' 
              ? 'bg-[#1a56db] hover:bg-blue-700 text-white shadow-blue-200' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          Complete Setup
        </button>
      </form>
    </>
  );
};

export default StepThree;
