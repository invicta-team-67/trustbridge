import React from 'react';

const StepThree = ({ formData, handleInputChange, fieldErrors = {}, handleSubmit }) => {
  
  const onFormSubmit = (e) => {
    e.preventDefault();
    // We only call handleSubmit if the parent allows it
    handleSubmit(); 
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-[#64748b]">
          Final Details
        </h2>
        <p className="text-gray-400 text-sm font-medium">Just one more thing to get you started.</p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={onFormSubmit}>
        
        {/* Brief Description */}
        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.description ? 'text-red-500' : 'text-gray-500'}`}>
            Brief Description
          </label>
          <div className="relative">
            <textarea 
              name="description" 
              value={formData.description || ""} 
              onChange={handleInputChange} 
              rows="5" 
              placeholder="Tell us a bit about what your business does..." 
              className={`w-full px-4 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all font-medium resize-none ${
                fieldErrors.description 
                  ? 'border-red-400 focus:ring-red-400 text-gray-800' 
                  : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'
              }`}
            />
            {fieldErrors.description && (
              <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{fieldErrors.description}</p>
            )}
          </div>
        </div>

        {/* Simple Confirmation Checkbox */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <input 
            type="checkbox" 
            name="confirmAccount"
            id="confirmAccount"
            checked={formData.confirmAccount || false}
            onChange={(e) => {
              // Custom handler if your handleInputChange doesn't support checkboxes
              handleInputChange({
                target: {
                  name: 'confirmAccount',
                  value: e.target.checked
                }
              });
            }}
            className="mt-1 w-4 h-4 text-[#1a56db] border-gray-300 rounded focus:ring-[#1a56db]"
          />
          <label htmlFor="confirmAccount" className="text-sm text-gray-600 font-medium cursor-pointer">
            I confirm that the details provided are correct and I'm ready to create my account.
          </label>
        </div>

        {/* Complete Setup Button */}
        <button 
          type="submit" 
          disabled={!formData.confirmAccount}
          className={`w-full mt-4 font-bold py-4 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] ${
            formData.confirmAccount 
              ? 'bg-[#1a56db] hover:bg-blue-700 text-white shadow-blue-100' 
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
