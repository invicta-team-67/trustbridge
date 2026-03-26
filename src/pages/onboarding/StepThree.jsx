import React from 'react';

const StepThree = ({ formData, handleInputChange, fieldErrors = {} }) => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-[#64748b]">Final Details</h2>
        <p className="text-gray-400 text-sm font-medium">Setup almost complete.</p>
      </div>

      <div className="flex flex-col gap-6">
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
                fieldErrors.description ? 'border-red-400 focus:ring-red-400 text-gray-800' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'
              }`}
            />
            {fieldErrors.description && (
              <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{fieldErrors.description}</p>
            )}
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${formData.confirmAccount ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
          <input 
            type="checkbox" 
            name="confirmAccount"
            id="confirmAccount"
            checked={formData.confirmAccount || false}
            onChange={(e) => {
              handleInputChange({
                target: {
                  name: 'confirmAccount',
                  value: e.target.checked
                }
              });
            }}
            className="mt-1 w-4 h-4 text-[#1a56db] border-gray-300 rounded focus:ring-[#1a56db] cursor-pointer"
          />
          <label htmlFor="confirmAccount" className="text-sm text-gray-600 font-medium cursor-pointer">
            I confirm that the details provided are correct and I'm ready to create my account.
          </label>
        </div>
      </div>
    </>
  );
};

export default StepThree;
