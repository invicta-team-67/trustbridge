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
    X     
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
    
    // State for dynamic receipt data (Initialized with default/loading state)
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

    // 2. CONNECTED: Auth Guard & Data Fetching
  useEffect(() => {
      const fetchData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }

        try {
  // 1. Fetch the User's Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('business_name')
    .eq('user_id', session.user.id) // CORRECT: Matches your new table schema
    .maybeSingle();

          // 2. Build the query for the specific transaction
          let query = supabase.from('transactions').select('*');

          if (transactionId && transactionId !== 'undefined') {
            // Use transaction_id to match your database schema
            query = query.eq('transaction_id', transactionId);
          } else {
            // Fallback to the latest transaction for this user
            query = query
              .eq('user_id', session.user.id)
              .order('created_at', { ascending: false })
              .limit(1);
          }

  const { data: transaction, error } = await query.maybeSingle();

          if (error) throw error;

          if (transaction) {
            const amount = parseFloat(transaction.amount) || 0;
            const vat = amount * 0.075; 
            const subtotal = amount - vat;

            setReceiptData({
              // Use transaction_id for the receipt number and reference
              receiptNo: `TB-${transaction.transaction_id.substring(0, 8).toUpperCase()}`,
              issueDate: new Date(transaction.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }),
              paymentMethod: 'Direct Transfer',
              reference: `TRX-${transaction.transaction_id.substring(9, 13).toUpperCase()}-OP`,
              serviceProvider: profile?.business_name || 'Verified Merchant',
              clientName: transaction.client_name,
              serviceDescription: transaction.service_provided,
              subtotal: `₦${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
              vat: `₦${vat.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
              totalAmount: `₦${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
            });
          }
        } catch (err) {
          console.error("Error generating receipt:", err);
        }
      };

      fetchData();
    }, [navigate, transactionId]); // Add transactionId to dependency array

    // 3. CONNECTED: Logout Logic
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
            <NavItem icon={<Settings size={18}/>} label="Settings" />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-slate-400 hover:text-slate-600 font-medium w-full text-left"
          >
            <LogOut size={18} /> <span>Log out</span>
          </button>
        </div>
      </>
    );
  return (
    <div className="flex min-h-screen bg-[#F1F5F9] font-sans text-slate-700 relative overflow-x-hidden">
      {/* CSS to hide sidebars and headers when saving as PDF */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: auto; margin: 0mm; }
          body { background-color: white; }
          .print\\:hidden { display: none !important; }
          .max-w-4xl { max-width: 100% !important; width: 100% !important; margin: 0 !important; }
        }
      `}} />
        
        {/* --- DESKTOP SIDEBAR (Hidden on mobile) --- */}
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
        <main className="flex-1 lg:ml-64 min-h-screen print:ml-0 w-full">
          
          {/* Action Header - Hidden on print */}
          <div className="max-w-4xl mx-auto mt-6 md:mt-8 mb-6 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 bg-white rounded-lg border border-slate-200 text-slate-600 shadow-sm"
              >
                <Menu size={20} />
              </button>
              <button 
                onClick={() => navigate('/transaction-dashboard')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition-all"
              >
                <ChevronLeft size={18} /> Back to Dashboard
              </button>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={handlePrint}
                className="flex-1 sm:flex-none bg-[#1e40af] text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all"
              >
                <Printer size={16} /> Print Receipt
              </button>
  <button 
    onClick={handlePrint} // Reuse the print function
    className="flex-1 sm:flex-none bg-[#dbeafe] text-[#1e40af] px-5 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#cfdfff] transition-all"
  >
    <Download size={16} /> PDF
  </button>
            </div>
          </div>

          {/* --- THE RECEIPT CARD --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-4 lg:mx-auto bg-white shadow-2xl shadow-slate-200 border border-slate-100 rounded-2xl overflow-hidden mb-12 print:shadow-none print:border-none print:m-0 print:mx-0"
          >
            {/* Receipt Header */}
            <div className="p-6 md:p-12 flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Document Type</p>
                <h1 className="text-3xl font-black text-slate-900 leading-tight">Transaction<br/>Receipt</h1>
              </div>
              <div className="text-left md:text-right w-full md:w-auto">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4">
                  <div className="w-1 h-1 rounded-full bg-emerald-600" /> Verified Status
                </span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receipt No.</p>
                <p className="text-sm font-black text-[#1e40af] font-mono">{receiptData.receiptNo}</p>
              </div>
            </div>

            {/* Quick Info Bar - Stacks on mobile */}
            <div className="bg-[#f0f7ff] grid grid-cols-1 sm:grid-cols-3 px-6 md:px-12 py-6 md:py-8 border-y border-[#dbeafe] gap-6 sm:gap-0">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
                <p className="text-sm font-bold text-slate-800">{receiptData.issueDate}</p>
              </div>
              <div className="sm:text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
                <p className="text-sm font-bold text-slate-800 flex items-center sm:justify-center gap-1">
                  <ArrowRightLeft size={14} className="text-slate-400" /> {receiptData.paymentMethod}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reference</p>
                <p className="text-sm font-bold text-slate-800 font-mono">{receiptData.reference}</p>
              </div>
            </div>

            {/* Details Table */}
            <div className="p-6 md:p-12 space-y-8 md:space-y-10">
              <div className="grid grid-cols-12 border-b border-slate-100 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="col-span-8">Description</div>
                <div className="col-span-4 text-right">Details</div>
              </div>

              <div className="grid grid-cols-12 items-start">
                <div className="col-span-8 pr-2">
                  <p className="text-sm font-bold text-slate-800">Service Provider</p>
                  <p className="text-xs text-slate-400 font-medium">Merchant registered with TrustBridge</p>
                </div>
                <div className="col-span-4 text-right">
                  <p className="text-sm font-bold text-slate-800 break-words">{receiptData.serviceProvider}</p>
                </div>
              </div>

              <div className="grid grid-cols-12 items-start">
                <div className="col-span-8 pr-2">
                  <p className="text-sm font-bold text-slate-800">Client Name</p>
                  <p className="text-xs text-slate-400 font-medium">Recipient of the service</p>
                </div>
                <div className="col-span-4 text-right">
                  <p className="text-sm font-bold text-slate-800 break-words">{receiptData.clientName}</p>
                </div>
              </div>

              <div className="grid grid-cols-12 items-start">
                <div className="col-span-8 pr-2">
                  <p className="text-sm font-bold text-slate-800">Service Description</p>
                  <p className="text-xs text-slate-400 font-medium">Details of service rendered</p>
                </div>
                <div className="col-span-4 text-right">
                  <p className="text-sm font-bold text-slate-800 break-words">{receiptData.serviceDescription}</p>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-10 space-y-3 border-t border-slate-50">
                <div className="flex justify-between sm:justify-end gap-4 sm:gap-16">
                  <span className="text-xs font-bold text-slate-400">Subtotal</span>
                  <span className="text-sm font-bold text-slate-800">{receiptData.subtotal}</span>
                </div>
                <div className="flex justify-between sm:justify-end gap-4 sm:gap-16">
                  <span className="text-xs font-bold text-slate-400">VAT (7.5%)</span>
                  <span className="text-sm font-bold text-slate-800">{receiptData.vat}</span>
                </div>
                <div className="flex justify-between sm:justify-end gap-4 sm:gap-16 pt-4">
                  <span className="text-lg font-black text-slate-900">Total Amount</span>
                  <span className="text-2xl font-black text-[#1e40af] tracking-tight">{receiptData.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Receipt Footer - Stacks on mobile */}
            <div className="bg-[#f8fafc] px-6 md:px-12 py-8 md:py-10 flex flex-col md:flex-row justify-between items-start md:items-center border-t border-slate-100 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0">
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
              <div className="text-left md:text-right w-full md:w-auto">
                <p className="text-[9px] text-slate-400 font-medium mb-1 italic">
                  This is a system-generated receipt. No signature required.
                </p>
                <div className="flex justify-start md:justify-end gap-2 text-slate-300">
                  <CloudCheck size={14} />
                  <Settings size={14} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Footer - Hidden on print */}
          <div className="text-center pb-12 print:hidden px-4">
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
