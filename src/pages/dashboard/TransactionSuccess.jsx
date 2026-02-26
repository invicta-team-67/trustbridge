import React, { useEffect, useState } from 'react'; 
import { 
  LayoutDashboard, ArrowRightLeft, PlusCircle, ShieldCheck, 
  FileText, Settings, LogOut, CheckCircle2, ExternalLink, 
  Home, Copy, Link as LinkIcon, Menu, X, Bell, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; 

const TransactionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Get the ID from the URL
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('id');

  // Generate the Magic Link (Matches your App.jsx route: /transaction-verification)
  const verificationLink = `${window.location.origin}/transaction-verification?id=${transactionId || ''}`;

  const [summary, setSummary] = useState({
    clientName: 'Loading...',
    amount: '₦0.00',
    service: 'Loading...',
    refId: '...'
  });

  useEffect(() => {
    const fetchSpecificTransaction = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }

      // --- SAFETY CHECK (From Previous Code) ---
      // If no ID is passed, fetch the LATEST transaction so the page isn't empty
      if (!transactionId || transactionId === 'undefined') {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data) setSummaryData(data);
        return;
      }

      // Normal Fetch by ID
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('transaction_id', transactionId)
          .single();

        if (data) setSummaryData(data);
      } catch (err) {
        console.error("Error details:", err);
      }
    };

    fetchSpecificTransaction();
  }, [transactionId, navigate]);

  // Helper to format data
  const setSummaryData = (data) => {
    setSummary({
      clientName: data.client_name || 'Not Specified',
      amount: `₦${parseFloat(data.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`,
      service: data.service_provided || 'General Service',
      refId: `TX-${data.transaction_id.substring(0, 8).toUpperCase()}`
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // --- Sidebar Component ---
  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white font-bold">
            <ShieldCheck size={20} />
          </div>
          <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
        </div>
        <nav className="space-y-1">
          <Link to="/dashboard"><NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" /></Link>
          <Link to="/transaction-dashboard"><NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" /></Link>
          <Link to="/log-new-transaction"><NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" active /></Link>
          <Link to="/trust-score"><NavItem icon={<ShieldCheck size={18}/>} label="Trust Score" /></Link>
          <Link to="/trust-report"><NavItem icon={<FileText size={18}/>} label="Report" /></Link>
          <NavItem icon={<Settings size={18}/>} label="Settings" />
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-slate-100">
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-slate-600 font-medium w-full text-left">
          <LogOut size={18} /> <span>Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700 relative overflow-x-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl flex flex-col">
              <div className="absolute top-4 right-4"><button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400"><X size={24} /></button></div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-200"><Menu size={20} /></button>
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
              <span className="hidden sm:block">Transactions</span>
              <ChevronRight size={14} className="hidden sm:block" />
              <span className="text-slate-900 font-bold">Success</span>
            </div>
          </div>
          <button className="text-slate-400 p-1 hover:bg-slate-50 rounded-full"><Bell size={20} /></button>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 md:p-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden relative">
            
            {/* Success Content */}
            <div className="p-8 md:p-12 flex flex-col items-center text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-sm">
                <CheckCircle2 size={36} strokeWidth={3} />
              </motion.div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight">Proof Uploaded!</h1>
              <p className="text-slate-500 text-sm font-medium mb-8">Transaction securely recorded on the ledger.</p>

              {/* --- THE BRIDGE BOX (From Low-Fi Design) --- */}
              <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8 relative group">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <LinkIcon size={12} /> Share Confirmation Link
                  </p>
                  <span className="text-[9px] font-bold text-[#1e40af] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    Client Action Required
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-500 truncate select-all shadow-sm">
                    {verificationLink}
                  </div>
                  <button 
                    onClick={handleCopy}
                    className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 shrink-0 ${
                      copied 
                        ? 'bg-emerald-500 text-white shadow-emerald-200 scale-95' 
                        : 'bg-[#0f172a] text-white hover:bg-slate-800 shadow-slate-300 hover:shadow-xl hover:-translate-y-0.5'
                    }`}
                  >
                    {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 text-left leading-relaxed">
                  <span className="font-bold text-slate-500">* Important:</span> Send this link to <span className="font-bold text-slate-800">{summary.clientName}</span>. Once they verify, your Trust Score will increase.
                </p>
              </div>

              {/* Summary Card */}
              <div className="w-full border-t border-slate-100 pt-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</span>
                  <span className="text-xl font-black text-slate-900">{summary.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ref ID</span>
                  <span className="text-xs font-mono font-medium text-slate-500">{summary.refId}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <button onClick={() => navigate('/dashboard')} className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all uppercase tracking-wide">
                  Dashboard
                </button>
                
                {/* --- RESTORED ROUTE FROM PREVIOUS CODE --- */}
                <button 
                  onClick={() => navigate('/transaction-dashboard')} 
                  className="flex-1 py-3.5 bg-[#1e40af] text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  View Details <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
    active ? 'bg-[#eff6ff] text-[#1e40af]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
  }`}>
    {icon} <span>{label}</span>
  </div>
);

export default TransactionSuccess;