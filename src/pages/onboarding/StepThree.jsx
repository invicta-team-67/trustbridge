import React from 'react';

const StepThree = ({ formData, handleInputChange, fieldErrors = {}, handleSubmit }) => {
  
  const onFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(); // Triggers the submission logic in your parent component
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-[#64748b]">
          Final Details
        </h2>
        <p className="text-gray-400 text-sm font-medium">Almost there, tell us about your business.</p>
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

        {/* Complete Setup Button */}
        <button 
          type="submit" 
          className="w-full mt-4 bg-[#1a56db] hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
        >
          Complete Setup
        </button>

      </form>
    </>
  );
};

export default StepThree;
