import { useState, useRef } from "react";
import { ChevronDown, Upload } from "lucide-react";

const MOCK_CLIENTS = [
  "Acme Corporation",
  "BrightPath Ltd",
  "CloudNine Technologies",
  "Delta Enterprises",
  "Emerald Solutions",
  "FinEdge Partners",
  "GlobalReach Inc",
];


export default function LogTransaction() {
  const [form, setForm] = useState({
    clientName: "",
    serviceProvided: "",
    transactionAmount: "",
    dueDate: "",
    description: "",
  });

  const fileInputRef = useRef(null);

  return (
    <div className="max-w-5xl bg-[#F6FAFF] mx-auto py-12 px-6">
      {/* Title Section */}
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">
          Log New Transaction
        </h1>
        <p className="text-[#64748b] text-lg">
          Enter the details of the service provided to record a new entry in the trust ledger.
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-white py-9 px-6 rounded-xl shadow-lg">
        
        
        {/* Client Name */}
<div className="flex flex-col gap-2">
  <label className="text-[#1e293b] font-medium flex gap-1">
    Client Name <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <select 
      className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3.5 text-[#0f172a] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-50 transition-all"
      value={form.clientName}
      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
    >
      <option value="" disabled>Select or search client</option>
      
      {/* THIS IS THE MISSING PART */}
      {MOCK_CLIENTS.map((client) => (
        <option key={client} value={client}>
          {client}
        </option>
      ))}
      
    </select>
    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
  </div>
</div>
        {/* Service Provided */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1e293b] font-medium flex gap-1">
            Service Provided <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g Landing page Redesign"
            className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-50 placeholder:text-gray-300"
          />
        </div>

        {/* Transaction Amount */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1e293b] font-medium flex gap-1">
            Transaction Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="₦0.00"
            className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-50"
          />
          <p className="text-[#94a3b8] text-xs">Total amount in Nigerian Naira</p>
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-2">
          <label className="text-[#1e293b] font-medium flex gap-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            onFocus={(e) => (e.target.type = "date")}
            className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3.5 text-[#64748b] outline-none focus:ring-2 focus:ring-blue-50"
          />
        </div>

        {/* Description - Full Width */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-[#1e293b] font-medium">Description</label>
          <textarea
            rows={5}
            placeholder="Briefly describe the deliverables or terms of service"
            className="w-full bg-[#E4EFFD] border border-[#757575] rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-[#94a3b8]"
          />
        </div>

        {/* Upload - Full Width */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-[#1e293b] font-medium">Upload Proof of Work</label>
          <div 
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-dashed border-[#757575] bg-[#E4EFFD] rounded-2xl py-12 flex flex-col items-center justify-center cursor-pointer hover:bg-[#e9f2ff] transition-colors"
          >
            <input type="file" ref={fileInputRef} className="hidden" />
            <div className="bg-white p-3 rounded-full shadow-sm mb-4">
              <Upload className="w-6 h-6 text-[#1d4ed8]" />
            </div>
            <p className="text-[#0f172a] font-bold">Click to upload or drag and drop</p>
            <p className="text-[#64748b] text-sm mt-1">PNG, JPG, or PDF up to 10MB</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row justify-end gap-4 mt-10">
        <button className="px-12 py-3 rounded-xl border border-[#e2e8f0] text-[#64748b] font-medium hover:bg-gray-50 transition-colors order-2 md:order-1">
          Cancel
        </button>
        <button className="px-12 py-3 rounded-xl bg-[#1d4ed8] text-white font-medium hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-100 order-1 md:order-2">
          Log Transaction
        </button>
      </div>
    </div>
  );
}