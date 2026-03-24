import React, { useEffect, useState } from 'react'; 
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
  CloudCheck,
  Menu, 
  X,
  Bell,
  ChevronRight,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; 

const TransactionReceipt = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('id');
  
  // NEW: Dynamic user data for the unified header
  const [userData, setUserData] = useState({ name: 'Loading...', role: 'Compliance Officer', avatarName: 'User' });

  // State for dynamic receipt data
  const [receiptData, setReceiptData] = useState({
    receiptNo: 'Loading...',
    issueDate: 'Loading...',
    paymentMethod: 'Direct Transfer',
    reference: 'Loading...',
    serviceProvider: 'Loading...',
    clientName: 'Loading...',
    serviceDescription: 'Loading...',
    subtotal: '₦0.00',
    vat: '₦0.00',
    totalAmount: '₦0.00' 
  });

  // CONNECTED: Auth Guard & Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      try {
        // 1. Fetch the User's Profile for Header AND Receipt
        const { data: profile } = await supabase
          .from('profiles')
          .select('business_name, business_type')
          .eq('user_id', session.user.id) 
          .maybeSingle();

        if (profile) {
          setUserData({
            name: profile.business_name || 'My Business',
            role: (profile.business_type || 'Compliance Officer').replace('_', ' '),
            avatarName: (profile.business_name || 'User').split(' ').join('+')
          });
        }

        // 2. NEW: Check if data was passed instantly via router state!
        const passedData = location.state?.transactionData;
        
        let transaction = null;

        if (passedData) {
          transaction = passedData;
        } else {
          // 3. Fallback: Fetch from database if user refreshed the page
          let query = supabase.from('transactions').select('*');

          if (transactionId && transactionId !== 'undefined') {
            query = query.eq('transaction_id', transactionId);
          } else {
            query = query.eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(1);
          }

          const { data, error } = await query.maybeSingle();
          if (error) throw error;
          transaction = data;
        }

        // 4. Calculate and set receipt math
        if (transaction) {
          // Handle amount whether it comes as a raw number or string
          const rawAmount = transaction.rawAmount || parseFloat(transaction.amount) || 0;
          const vat = rawAmount * 0.075; 
          const subtotal = rawAmount - vat;

          // Safe fallback for transaction ID
          const safeTxId = transaction.transaction_id || transaction.id || 'PENDING';

          setReceiptData({
            receiptNo: `TB-${safeTxId.substring(0, 8).toUpperCase()}`,
            issueDate: new Date(transaction.created_at || Date.now()).toLocaleDateString('en-US', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            }),
            paymentMethod: 'Direct Transfer',
            reference: `TRX-${safeTxId.substring(0, 4).toUpperCase()}-OP`,
            serviceProvider: profile?.business_name || 'Verified Merchant',
            clientName: transaction.client_name || transaction.clientName, // Supports both DB and mapped formats
            serviceDescription: transaction.service_provided || transaction.description,
            subtotal: `₦${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
            vat: `₦${vat.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
            totalAmount: `₦${rawAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
          });
        }
      } catch (err) {
        console.error("Error generating receipt:", err);
      }
    };

    fetchData();
  }, [navigate, transactionId, location.state]); 

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handlePrint = () => {
    window.print();
  };

  // Reusable Sidebar Content
  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
        </div>
        
        <nav className="space-y-1">
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" />
          </Link>
          <Link to="/transaction-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" active />
          </Link>
          <Link to="/log-new-transaction" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" />
          </Link>
          <Link to="/trust-score" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<ShieldCheck size={18}/>} label="Trust Score" />
          </Link>
          <Link to="/trust-report" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<FileText size={18}/>} label="Report" />
          </Link>
          <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<Settings size={18}/>} label="Settings" active={window.location.pathname === '/settings'} />
          </Link>
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-100">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 text-slate-400 hover:text-slate-600 font-medium w-full text-left transition-colors"
        >
          <LogOut size={18} /> <span>Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700 relative overflow-x-hidden">
      {/* CSS to hide sidebars and headers when saving as PDF */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: auto; margin: 0mm; }
          body { background-color: white; padding: 20px; }
          .print\\:hidden { display: none !important; }
          .max-w-4xl { max-width: 100% !important; width: 100% !important; margin: 0 !important; box-shadow: none !important; border: none !important; }
        }
      `}} />
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-30 print:hidden">
        <SidebarContent />
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden print:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl flex flex-col print:hidden"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 lg:ml-64 min-h-screen print:ml-0 w-full flex flex-col">
        
        {/* POLISHED: Unified Header (Hidden on Print) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-200"><Menu size={20} /></button>
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium font-sans">
              <span onClick={() => navigate('/transaction-dashboard')} className="hover:text-slate-600 cursor-pointer hidden sm:block">Transactions</span>
              <ChevronRight size={14} className="hidden sm:block" />
              <span className="text-[#1e40af] font-bold bg-blue-50 px-3 py-1.5 rounded-lg">Receipt</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:pl-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="hidden sm:block text-right ml-2">
              <p className="text-sm font-bold text-slate-800 leading-none">{userData.name}</p>
              <p className="text-[11px] text-slate-400 font-medium capitalize mt-1">{userData.role}</p>
            </div>
            <img 
              src={`https://ui-avatars.com/api/?name=${userData.avatarName}&background=1e40af&color=fff`} 
              className="w-9 h-9 rounded-full border border-slate-200 shadow-sm" 
              alt="profile" 
            />
          </div>
        </header>

        {/* Action Header - Hidden on print */}
        <div className="max-w-4xl w-full mx-auto mt-6 md:mt-10 mb-6 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <button 
            onClick={() => navigate('/transaction-dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-[#1e40af] text-sm font-bold transition-all bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200"
          >
            <ChevronLeft size={18} /> Back to Dashboard
          </button>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={handlePrint}
              className="flex-1 sm:flex-none bg-[#1e40af] text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all active:scale-95"
            >
              <Printer size={16} /> Print Receipt
            </button>
            <button 
              onClick={handlePrint} 
              className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <Download size={16} /> Save PDF
            </button>
          </div>
        </div>

        {/* --- THE RECEIPT CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full mx-auto bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-[24px] overflow-hidden mb-12 print:shadow-none print:border-none print:m-0 print:mx-0"
        >
          {/* Receipt Header */}
          <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-50">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#1e40af] rounded-xl flex items-center justify-center text-white shadow-sm">
                  <ShieldCheck size={24} />
                </div>
                <span className="text-2xl font-black text-[#1e3a8a] tracking-tight">TrustBridge</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Document Type</p>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">Transaction<br/>Receipt</h1>
            </div>
            <div className="text-left md:text-right w-full md:w-auto flex flex-col md:items-end">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase mb-4 shadow-sm border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Ledger Entry
              </span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receipt Number</p>
              <p className="text-sm font-black text-[#1e40af] font-mono bg-blue-50 px-3 py-1 rounded-md">{receiptData.receiptNo}</p>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-[#f8fafc] grid grid-cols-1 sm:grid-cols-3 px-8 md:px-12 py-6 md:py-8 border-y border-slate-100 gap-6 sm:gap-0">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
              <p className="text-sm font-bold text-slate-800">{receiptData.issueDate}</p>
            </div>
            <div className="sm:text-center border-t sm:border-t-0 sm:border-x border-slate-200 pt-4 sm:pt-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
              <p className="text-sm font-bold text-slate-800 flex items-center sm:justify-center gap-1.5">
                <ArrowRightLeft size={14} className="text-slate-400" /> {receiptData.paymentMethod}
              </p>
            </div>
            <div className="sm:text-right border-t sm:border-t-0 border-slate-200 pt-4 sm:pt-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reference</p>
              <p className="text-sm font-bold text-slate-800 font-mono">{receiptData.reference}</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="p-8 md:p-12 space-y-8 md:space-y-10">
            <div className="grid grid-cols-12 border-b border-slate-100 pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="col-span-12 sm:col-span-8">Description</div>
              <div className="col-span-12 sm:col-span-4 mt-2 sm:mt-0 sm:text-right">Details</div>
            </div>

            <div className="grid grid-cols-12 items-start gap-4 sm:gap-0">
              <div className="col-span-12 sm:col-span-8 pr-2">
                <p className="text-sm font-bold text-slate-800">Service Provider</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Merchant registered with TrustBridge</p>
              </div>
              <div className="col-span-12 sm:col-span-4 sm:text-right">
                <p className="text-sm font-bold text-slate-900 break-words">{receiptData.serviceProvider}</p>
              </div>
            </div>

            <div className="grid grid-cols-12 items-start gap-4 sm:gap-0">
              <div className="col-span-12 sm:col-span-8 pr-2">
                <p className="text-sm font-bold text-slate-800">Client Name</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Recipient of the service</p>
              </div>
              <div className="col-span-12 sm:col-span-4 sm:text-right">
                <p className="text-sm font-bold text-slate-900 break-words bg-slate-50 inline-block px-2 py-1 rounded-md">{receiptData.clientName}</p>
              </div>
            </div>

            <div className="grid grid-cols-12 items-start gap-4 sm:gap-0">
              <div className="col-span-12 sm:col-span-8 pr-2">
                <p className="text-sm font-bold text-slate-800">Service Description</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Details of service rendered</p>
              </div>
              <div className="col-span-12 sm:col-span-4 sm:text-right">
                <p className="text-sm font-bold text-slate-900 break-words leading-relaxed">{receiptData.serviceDescription}</p>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="pt-10 space-y-4 border-t border-slate-100">
              <div className="flex justify-between sm:justify-end gap-4 sm:gap-16">
                <span className="text-xs font-bold text-slate-500">Subtotal</span>
                <span className="text-sm font-bold text-slate-800">{receiptData.subtotal}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-4 sm:gap-16">
                <span className="text-xs font-bold text-slate-500">VAT (7.5%)</span>
                <span className="text-sm font-bold text-slate-800">{receiptData.vat}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-4 sm:gap-16 pt-5 border-t border-slate-50">
                <span className="text-lg font-black text-slate-900 mt-1">Total Amount</span>
                <span className="text-3xl font-black text-[#1e40af] tracking-tight">{receiptData.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="bg-[#f8fafc] px-8 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-center border-t border-slate-100 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm shrink-0 text-slate-300">
                {/* UPGRADED: Professional QR Code Icon */}
                <QrCode size={40} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 flex items-center gap-1 mb-1 uppercase tracking-tighter">
                  <ShieldAlert size={12} /> Secure & Verified
                </p>
                <p className="text-[10px] text-slate-500 font-medium max-w-[220px] leading-relaxed">
                  Scan to verify this transaction on the TrustBridge ledger. This document is encrypted and digitally signed.
                </p>
              </div>
            </div>
            <div className="text-left md:text-right w-full md:w-auto">
              <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-widest">
                System-generated receipt
              </p>
              <div className="flex justify-start md:justify-end gap-3 text-slate-300">
                <CloudCheck size={16} />
                <Settings size={16} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Footer - Hidden on print */}
        <div className="text-center pb-12 print:hidden px-4">
          <p className="text-xs text-slate-400 font-medium">Questions about this receipt? Contact <span className="text-blue-500 font-bold hover:underline cursor-pointer">TrustBridge Support</span></p>
          <p className="text-[10px] text-slate-300 font-bold mt-2 uppercase tracking-widest">© 2026 TrustBridge Inc. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
};

// NavItem Component
const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
    active ? 'bg-[#eff6ff] text-[#1e40af]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
  }`}>
    {icon} <span>{label}</span>
  </button>
);

export default TransactionReceipt;
