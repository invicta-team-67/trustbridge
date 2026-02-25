import React, { useEffect } from 'react'; // Added useEffect
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Bell, 
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // 1. CONNECTED: Import Supabase Client

const TransactionSuccess = () => {
  const navigate = useNavigate();

  // 2. CONNECTED: Auth Guard - Protects the success view
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
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Mock data reflecting the summary in the image
  const summary = {
    clientName: 'Acme Corporation',
    amount: '₦12,500.00',
    service: 'Strategic Advisory Phase 1',
    refId: 'TX-9902-XJ2-2023'
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700">
      {/* Sidebar - Connected */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white font-bold">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
          </div>
          
          <nav className="space-y-1">
            <Link to="/dashboard">
              <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" />
            </Link>
            <Link to="/transaction-dashboard">
              <NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" />
            </Link>
            <Link to="/log-new-transaction">
              <NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" active />
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
            onClick={handleLogout} // CONNECTED: Sign out logic
            className="flex items-center gap-3 text-slate-400 hover:text-slate-600 font-medium transition-colors w-full text-left"
          >
            <LogOut size={18} /> <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            <span 
              onClick={() => navigate('/transaction-dashboard')}
              className="hover:text-slate-600 cursor-pointer"
            >
              Transactions
            </span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-bold">Log New Transaction</span>
          </div>
          <button className="text-slate-400 p-1 hover:bg-slate-50 rounded-full transition-colors">
            <Bell size={20} />
          </button>
        </header>

        {/* Success Modal Container */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden relative"
          >
            {/* Top Blue Accent Bar */}
            <div className="h-2 bg-[#1e40af] w-full" />

            <div className="p-12 flex flex-col items-center text-center">
              {/* Success Icon with Animation */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6"
              >
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </motion.div>

              <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                Transaction Logged Successfully!
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed max-w-md mb-10">
                The transaction has been recorded in the trust ledger. A notification has been sent to the client for verification.
              </p>

              {/* Transaction Summary Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full bg-[#f0f7ff] rounded-2xl p-8 mb-10 text-left border border-[#dbeafe]"
              >
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-[#dbeafe] pb-2">
                  Transaction Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Client Name</span>
                    <span className="text-sm font-black text-slate-900">{summary.clientName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Amount</span>
                    <span className="text-lg font-black text-[#1e40af]">{summary.amount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-bold text-slate-500">Service</span>
                    <span className="text-sm font-black text-slate-900">{summary.service}</span>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex w-full gap-4">
                <button 
                  onClick={() => navigate('/transaction-receipt')}
                  className="flex-1 bg-[#1e40af] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  View Transaction Details <ExternalLink size={16} />
                </button>
                
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  Back to Dashboard <Home size={16} />
                </button>
              </div>

              {/* Reference ID Footer */}
              <div className="mt-10">
                <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-400 font-mono tracking-wider">
                  Ref ID: {summary.refId}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
    active ? 'bg-[#eff6ff] text-[#1e40af]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
  }`}>
    {icon} <span>{label}</span>
  </button>
);


export default TransactionSuccess;