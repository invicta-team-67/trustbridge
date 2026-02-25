import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const TransactionSuccess = ({ onNavigateBack, onViewDetails }) => {
  
  const transactionData = {
    clientName: "Acme Corporation",
    amount: "₦12,500.00",
    service: "Strategic Advisory Phase 1",
    refId: "TX-9902-XJ2-2023",
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-[#F6FAFF]  w-full p-4 font-['Inter']">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
       
        className="relative w-full max-w-xl bg-white rounded-base shadow-[0px_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border-t-[6px] border-[#1056B1]"
      >
        <div className="px-12 pt-6 pb-6 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-15 h-15 bg-[#22C55E] rounded-full flex items-center justify-center shadow-xl shadow-green-300">
              <Check className="text-white w-6 h-6 stroke-[3px]" />
            </div>
          </div>

          {/* Title & Subtext */}
          <h2 className="text-[#0F172A] text-xl font-extrabold mb-3">
            Transaction Logged Successfully!
          </h2>
          <p className="text-[#64748B] text-base leading-relaxed mb-8 max-w-[520px] mx-auto">
            The transaction has been recorded in the trust ledger. A
            notification has been sent to the client for verification.
          </p>

          {/* Summary Card */}
          <div className="bg-[#EBF3FF] rounded-xl p-4 mb-8 text-left">
            <h4 className="text-[#64748B] text-sm font-semibold uppercase tracking-wider mb-5">
              Transaction Summary
            </h4>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] font-medium">Client Name</span>
                <span className="text-[#0F172A] font-semibold">
                  {transactionData.clientName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#64748B] font-medium">Amount</span>
                <span className="text-[#1056B1] text-xl font-bold">
                  {transactionData.amount}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#64748B] font-medium">Service</span>
                <span className="text-[#0F172A] font-semibold text-right max-w-[200px]">
                  {transactionData.service}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={onViewDetails}
              className="flex-1 bg-[#1056B1] text-white font-semibold py-4 rounded-lg shadow-lg shadow-blue-100 hover:bg-[#0d47a1] transition-all active:scale-[0.98]"
            >
              View Transaction Details
            </button>
            <button
              onClick={onNavigateBack}
              className="flex-1 bg-white text-[#1056B1] font-semibold py-4 rounded-lg border border-[#1056B1] hover:bg-blue-50 transition-all active:scale-[0.98]"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Ref ID Badge */}
          <div className="inline-block px-4 py-1.5 bg-[#F1F5F9] rounded-md">
            <span className="text-[#64748B] text-xs font-mono tracking-tight">
              Ref ID: {transactionData.refId}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionSuccess;
