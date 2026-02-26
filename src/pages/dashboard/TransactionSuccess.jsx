import React, { useEffect, useState } from 'react'; 
// ... keep other imports
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import { supabase } from '../../lib/supabase'; 

const TransactionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access URL parameters
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Get the ID from the URL (?id=...)
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('id');

  const [summary, setSummary] = useState({
    clientName: 'Loading...',
    amount: '₦0.00',
    service: 'Loading...',
    refId: 'Loading...'
  });

  useEffect(() => {
const fetchSpecificTransaction = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    navigate('/login');
    return;
  }

  try {
    let query = supabase.from('transactions').select('*');

    if (transactionId) {
      // Priority: Fetch the specific ID from the URL
      query = query.eq('id', transactionId);
    } else {
      // Fallback: Fetch the user's latest entry if ID is missing from URL
      query = query
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);
    }

    const { data, error } = await query.single();

    if (error) throw error;

    if (data) {
      setSummary({
        clientName: data.client_name || 'Not Specified',
        amount: `₦${parseFloat(data.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`,
        service: data.service_provided || 'General Service',
        refId: `TX-${data.id.substring(0, 8).toUpperCase()}-2026`
      });
    }
  } catch (err) {
    console.error("Error fetching transaction details:", err);
    setSummary(prev => ({ ...prev, clientName: 'Error Loading', service: 'Check Connection' }));
  } finally {
    setLoading(false);
  }
};

    fetchSpecificTransaction();
  }, [transactionId, navigate]);

  // ... keep the rest of your component (SidebarContent and Return)

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

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
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" />
          </Link>
          <Link to="/transaction-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" />
          </Link>
          <Link to="/log-new-transaction" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" active />
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
          className="flex items-center gap-3 text-slate-400 hover:text-slate-600 font-medium transition-colors w-full text-left"
        >
          <LogOut size={18} /> <span>Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700 relative overflow-x-hidden">
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-30">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl flex flex-col"
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

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-200"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
              <span onClick={() => navigate('/transaction-dashboard')} className="hover:text-slate-600 cursor-pointer hidden sm:block">
                Transactions
              </span>
              <ChevronRight size={14} className="hidden sm:block" />
              <span className="text-slate-900 font-bold">Log New Transaction</span>
            </div>
          </div>
          <button className="text-slate-400 p-1 hover:bg-slate-50 rounded-full transition-colors">
            <Bell size={20} />
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden relative"
          >
            <div className="h-2 bg-[#1e40af] w-full" />
            <div className="p-6 md:p-12 flex flex-col items-center text-center">
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6"
              >
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </motion.div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                Transaction Logged Successfully!
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed max-w-md mb-8 md:mb-10">
                The transaction has been recorded in the trust ledger. 
              </p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="w-full bg-[#f0f7ff] rounded-2xl p-6 md:p-8 mb-8 md:mb-10 text-left border border-[#dbeafe]"
              >
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-[#dbeafe] pb-2">
                  Transaction Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Client</span>
                    <span className="text-sm font-black text-slate-900">{summary.clientName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Amount</span>
                    <span className="text-lg font-black text-[#1e40af]">{summary.amount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-bold text-slate-500">Service</span>
                    <span className="text-sm font-black text-slate-900 text-right">{summary.service}</span>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row w-full gap-4">
                <button 
                  onClick={() => navigate('/transaction-dashboard')}
                  className="flex-1 bg-[#1e40af] text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  View Details <ExternalLink size={16} />
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  Dashboard <Home size={16} />
                </button>
              </div>

              <div className="mt-8 md:mt-10">
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
  <button className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
    active ? 'bg-[#eff6ff] text-[#1e40af]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
  }`}>
    {icon} <span>{label}</span>
  </button>
);

export default TransactionSuccess;