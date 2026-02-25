import React, { useEffect } from 'react'; // Added useEffect
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ChevronLeft,
  Printer,
  Download,
  ShieldAlert,
  CloudCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // 1. CONNECTED: Import Supabase

const TransactionReceipt = () => {
  const navigate = useNavigate();

  // 2. CONNECTED: Auth Guard - Protects the receipt view
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkSession();
  }, [navigate]);

  // 3. CONNECTED: Logout Logic
  const handleLogout = async () => {
    await supabase.signOut();
    navigate('/login');
  };

  // Data strictly following the receipt image
  const receiptData = {
    receiptNo: 'TB-9923485710',
    issueDate: 'October 24, 2023',
    paymentMethod: 'Direct Transfer',
    reference: 'TRX-7721-OP-90',
    serviceProvider: 'Acme Corporation',
    clientName: 'John Doe',
    serviceDescription: 'Strategic Advisory Phase 1',
    subtotal: '₦232,558.14',
    vat: '₦17,441.86',
    totalAmount: '₦250,000.00' 
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] font-sans text-slate-700">
      {/* Sidebar - Hidden on print */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30 print:hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
          </div>
          
          <nav className="space-y-1">
            <Link to="/dashboard">
              <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" />
            </Link>
            <Link to="/transaction-dashboard">
              <NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" active />
            </Link>
            <Link to="/log-new-transaction">
              <NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" />
            </Link>
            <Link to="/trust-score">
              <NavItem icon={<ShieldCheck size={18}/>} label="Trust Score" />
            </Link>
            <Link to="/trust-report">
              <NavItem icon={<FileText size={18}/>} label="Report" />
            </Link>
            <NavItem icon={<Settings size={18}/>} label="Settings" />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout} // 4. CONNECTED: Logout Trigger
            className="flex items-center gap-3 text-slate-400 hover:text-rose-500 transition-all font-medium w-full text-left"
          >
            <LogOut size={18} /> <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen print:ml-0">
        {/* Action Header - Hidden on print */}
        <div className="max-w-4xl mx-auto mt-8 mb-6 px-4 flex justify-between items-center print:hidden">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition-all"
          >
            <ChevronLeft size={18} /> Back to Dashboard
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="bg-[#1e40af] text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all"
            >
              <Printer size={16} /> Print Receipt
            </button>
            <button className="bg-[#dbeafe] text-[#1e40af] px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-[#cfdfff] transition-all">
              <Download size={16} /> PDF
            </button>
          </div>
        </div>

        {/* --- THE RECEIPT CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white shadow-2xl shadow-slate-200 border border-slate-100 rounded-2xl overflow-hidden mb-12 print:shadow-none print:border-none print:m-0"
        >
          {/* Receipt Header */}
          <div className="p-12 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Document Type</p>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">Transaction<br/>Receipt</h1>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4">
                <div className="w-1 h-1 rounded-full bg-emerald-600" /> Verified Status
              </span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receipt No.</p>
              <p className="text-sm font-black text-[#1e40af] font-mono">{receiptData.receiptNo}</p>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-[#f0f7ff] grid grid-cols-3 px-12 py-8 border-y border-[#dbeafe]">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
              <p className="text-sm font-bold text-slate-800">{receiptData.issueDate}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
              <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                <ArrowRightLeft size={14} className="text-slate-400" /> {receiptData.paymentMethod}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reference</p>
              <p className="text-sm font-bold text-slate-800 font-mono">{receiptData.reference}</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="p-12 space-y-10">
            <div className="grid grid-cols-12 border-b border-slate-100 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="col-span-8">Description</div>
              <div className="col-span-4 text-right">Details</div>
            </div>

            <div className="grid grid-cols-12 items-start">
              <div className="col-span-8">
                <p className="text-sm font-bold text-slate-800">Service Provider</p>
                <p className="text-xs text-slate-400 font-medium">Merchant registered with TrustBridge</p>
              </div>
              <div className="col-span-4 text-right">
                <p className="text-sm font-bold text-slate-800">{receiptData.serviceProvider}</p>
              </div>
            </div>

            <div className="grid grid-cols-12 items-start">
              <div className="col-span-8">
                <p className="text-sm font-bold text-slate-800">Client Name</p>
                <p className="text-xs text-slate-400 font-medium">Recipient of the service</p>
              </div>
              <div className="col-span-4 text-right">
                <p className="text-sm font-bold text-slate-800">{receiptData.clientName}</p>
              </div>
            </div>

            <div className="grid grid-cols-12 items-start">
              <div className="col-span-8">
                <p className="text-sm font-bold text-slate-800">Service Description</p>
                <p className="text-xs text-slate-400 font-medium">Cloud & Devops Consulting</p>
              </div>
              <div className="col-span-4 text-right">
                <p className="text-sm font-bold text-slate-800">{receiptData.serviceDescription}</p>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="pt-10 space-y-3 border-t border-slate-50">
              <div className="flex justify-end gap-16">
                <span className="text-xs font-bold text-slate-400">Subtotal</span>
                <span className="text-sm font-bold text-slate-800">{receiptData.subtotal}</span>
              </div>
              <div className="flex justify-end gap-16">
                <span className="text-xs font-bold text-slate-400">VAT (7.5%)</span>
                <span className="text-sm font-bold text-slate-800">{receiptData.vat}</span>
              </div>
              <div className="flex justify-end gap-16 pt-4">
                <span className="text-lg font-black text-slate-900">Total Amount</span>
                <span className="text-2xl font-black text-[#1e40af] tracking-tight">{receiptData.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="bg-[#f8fafc] px-12 py-10 flex justify-between items-center border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 shadow-sm">
                  {/* QR Code Proxy */}
                  <div className="w-full h-full bg-slate-900 rounded-sm opacity-20" />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 flex items-center gap-1 mb-0.5 uppercase tracking-tighter">
                  <ShieldAlert size={10} /> Secure & Verified
                </p>
                <p className="text-[9px] text-slate-400 font-medium max-w-[200px] leading-tight">
                  Scan to verify this transaction on the TrustBridge ledger. This document is encrypted and digitally signed.
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 font-medium mb-1 italic">
                This is a system-generated receipt. No signature required.
              </p>
              <div className="flex justify-end gap-2 text-slate-300">
                <CloudCheck size={14} />
                <Settings size={14} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Footer - Hidden on print */}
        <div className="text-center pb-12 print:hidden">
          <p className="text-xs text-slate-400 font-medium">Questions about this receipt? Contact <span className="text-blue-500 hover:underline cursor-pointer">TrustBridge Support</span></p>
          <p className="text-[10px] text-slate-300 font-bold mt-2 uppercase tracking-widest">© 2026 TrustBridge Inc. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
};

// NavItem Component
const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
    active ? 'bg-[#eff6ff] text-[#1e40af]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
  }`}>
    {icon} <span>{label}</span>
  </button>
);


export default TransactionReceipt;