import React from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import TransactionSuccess from './TransactionSuccess';

export default function TransactionSuccessLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      <aside className="fixed inset-y-0 left-0 z-50 w-64 hidden lg:block">
        <Sidebar />
      </aside>

      {/* 2. Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
    
        <TopNavbar />

        {/* Success Modal Container */}
        <main className="flex-1 flex items-center justify-center p-6 bg-[#F6FAFF]">
           <TransactionSuccess
  onNavigateBack={() => navigate("/dashboard")}
  onViewDetails={() => navigate(`/transaction/${transactionId}`)}
/>
        </main>
      </div>
    </div>
  );
}