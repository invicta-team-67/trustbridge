import React from 'react';

const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 absolute right-4 top-4"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a56db]"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;

const StepTwo = ({ formData, handleInputChange, fieldErrors = {} }) => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-[#64748b]">Contact Information</h2>
        <p className="text-gray-400 text-sm font-medium">Please provide details on how we can reach your business.</p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.businessEmail ? 'text-red-500' : 'text-gray-500'}`}>Business Email</label>
          <div className="relative">
            <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleInputChange} placeholder="e.g. contact@company.com" className={`w-full pl-4 pr-10 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all font-medium ${fieldErrors.businessEmail ? 'border-red-400 focus:ring-red-400 text-gray-800' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'}`} />
            <MailIcon />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.phoneNumber ? 'text-red-500' : 'text-gray-500'}`}>Phone Number</label>
          <div className="relative">
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className={`w-full pl-4 pr-10 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all font-medium ${fieldErrors.phoneNumber ? 'border-red-400 focus:ring-red-400 text-gray-800' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'}`} />
            <PhoneIcon />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-bold mb-2 ${fieldErrors.address ? 'text-red-500' : 'text-gray-500'}`}>Headquarters Address</label>
          <div className="relative">
            <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" placeholder="Street Address, Suite, City, State, ZIP Code" className={`w-full pl-4 pr-10 py-3.5 bg-white border rounded-lg text-sm outline-none transition-all font-medium resize-none ${fieldErrors.address ? 'border-red-400 focus:ring-red-400 text-gray-800' : 'border-gray-200 focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]'}`}></textarea>
            <MapPinIcon />
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex gap-3 mt-2">
          <div className="mt-0.5"><InfoIcon /></div>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">Your contact information will be used for official communications and account verification.</p>
        </div>
      </form>
    </>
  );
};

export default StepTwo;