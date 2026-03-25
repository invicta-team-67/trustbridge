import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Plus, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Menu, 
  X,
  Download,
  Loader2,
  Inbox,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion'; 

const TransactionDashboard = () => {
  const navigate = useNavigate();
  const notificationsRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const itemsPerPage = 7; 

  // Interactive UI States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // State for Transactions
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Store dynamic user data
  const [userData, setUserData] = useState({
    name: 'Loading...',
    role: 'Compliance Officer',
    avatarName: 'User'
  });

  // 1. CONNECTED: Auth Guard
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // 1. FETCH PROFILE INFO
          const { data: profile } = await supabase
            .from('profiles')
            .select('business_name, business_type')
            .eq('user_id', user.id) 
            .maybeSingle();

          if (profile) {
            setUserData({
              name: profile.business_name || 'My Business',
              role: (profile.business_type || 'Compliance Officer').replace('_', ' '),
              avatarName: (profile.business_name || 'User').split(' ').join('+')
            });
          }

          // 2. FETCH TRANSACTIONS
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id) 
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          if (data && data.length > 0) {
            // NEW: Deterministic Colors for Avatars
            const colorPalette = [
              'bg-blue-100 text-blue-700', 
              'bg-emerald-100 text-emerald-700', 
              'bg-purple-100 text-purple-700', 
              'bg-orange-100 text-orange-700', 
              'bg-rose-100 text-rose-700'
            ];

            const mappedData = data.map((tx, index) => {
              const clientName = tx.client_name || 'Unknown Client';
              const initials = clientName.substring(0, 2).toUpperCase();
              // Assign color based on character code so the same client always gets the same color
              const charCode = clientName.charCodeAt(0) || 0;
              const assignedColor = colorPalette[charCode % colorPalette.length];

              return {
                id: tx.id || tx.transaction_id || `tx-${index}`, 
                clientName: clientName,
                initials: initials,
                initialColor: assignedColor,
                description: tx.description || 'No description provided',
                rawAmount: Number(tx.amount || 0), 
                amount: `₦${Number(tx.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`,
                date: new Date(tx.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: tx.status || 'Pending'
              };
            });
            setTransactions(mappedData);
          } else {
            setTransactions(mockTransactions);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setTransactions(mockTransactions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]); 

  // 3. CONNECTED: Logout Functionality
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Close notifications if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]); 

  // --- MOCK DATA (Fallback if DB is empty) ---
  const mockTransactions = [
    { id: 1, clientName: 'Julianne Deaton', initials: 'JD', initialColor: 'bg-emerald-100 text-emerald-700', description: 'Quarterly Asset Management Fee', rawAmount: 4800000, amount: '₦4,800,000.00', date: '14 Feb 2026', status: 'Verified' },
    { id: 2, clientName: 'Marcus Kholi', initials: 'MK', initialColor: 'bg-orange-100 text-orange-700', description: 'Escrow Holding Release - Prop A', rawAmount: 8800000, amount: '₦8,800,000.00', date: '14 Feb 2026', status: 'Pending' },
    { id: 3, clientName: 'Sovereign Tech Ltd', initials: 'ST', initialColor: 'bg-blue-100 text-blue-700', description: 'Treasury Note Purchase', rawAmount: 1900000, amount: '₦1,900,000.00', date: '15 Feb 2026', status: 'Awaiting' },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Verified': return 'bg-emerald-50 border-emerald-100 text-emerald-600';
      case 'Pending': return 'bg-amber-50 border-amber-100 text-amber-600';
      case 'Awaiting': return 'bg-blue-50 border-blue-100 text-blue-600';
      case 'Disputed': return 'bg-rose-50 border-rose-100 text-rose-600';
      default: return 'bg-slate-100 border-slate-200 text-slate-600';
    }
  };

  // Dynamic Filtering Logic
  const filteredTransactions = transactions.filter(tx => {
    const matchesTab = activeTab === 'All' || tx.status === activeTab;
    const matchesSearch = tx.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const currentItems = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamic Calculations for Summary Cards
  const verifiedTotal = transactions.filter(t => t.status === 'Verified').reduce((acc, curr) => acc + (curr.rawAmount || 0), 0);
  const pendingTotal = transactions.filter(t => t.status === 'Pending' || t.status === 'Awaiting').reduce((acc, curr) => acc + (curr.rawAmount || 0), 0);
  const pendingCount = transactions.filter(t => t.status === 'Pending' || t.status === 'Awaiting').length;
  const disputedCount = transactions.filter(t => t.status === 'Disputed').length;
  const verificationRate = transactions.length > 0 
    ? ((transactions.filter(t => t.status === 'Verified').length / transactions.length) * 100).toFixed(1) 
    : 0;

  // NEW: Working Export CSV Function
  const handleExportCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      alert("No transactions available to export based on current filters.");
      return;
    }
    const headers = ['Transaction ID', 'Client Name', 'Description', 'Amount (NGN)', 'Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => `"${t.id}","${t.clientName}","${t.description}","${t.rawAmount}","${t.date}","${t.status}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `TrustBridge_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
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
          className="flex items-center gap-3 text-slate-400 hover:text-rose-500 font-medium transition-colors w-full text-left"
        >
          <LogOut size={18} /> <span>Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700 relative overflow-x-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, x: '-50%' }} 
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg text-sm font-bold"
          >
            Advanced filters coming soon!
          </motion.div>
        )}
      </AnimatePresence>

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
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-200"
            >
              <Menu size={20} />
            </button>
            
            <div className="relative w-full md:w-96 hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clients, transactions, or ID..." 
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 pl-5 border-l border-slate-200">
            {/* Interactive Notification Bell */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-slate-400 hover:text-slate-600 transition-colors relative p-1"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-10 right-0 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-5 z-50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-slate-800">Notifications</h4>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">New</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0"><ShieldCheck size={14}/></div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Transaction Disputed</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">A client has raised an issue with a recent ledger entry.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="text-right ml-2">
              <p className="text-sm font-bold text-slate-800 leading-none">{userData.name}</p>
              <p className="text-[11px] text-slate-400 font-medium capitalize mt-1">{userData.role}</p>
            </div>
            <img 
              src={`https://ui-avatars.com/api/?name=${userData.avatarName}&background=1e40af&color=fff`} 
              className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" 
              alt="profile" 
            />
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ledger Operations</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Manage and track your institutional flow of funds</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <button 
                onClick={handleExportCSV}
                className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
              >
                <Download size={16} /> <span className="hidden sm:inline">Export</span>
              </button>
              <button 
                onClick={() => navigate('/log-new-transaction')}
                className="flex-1 md:flex-none bg-[#1e40af] text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all active:scale-95"
              >
                <Plus size={18} /> New Entry
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 bg-white border border-slate-200 p-1.5 rounded-xl gap-1 scrollbar-hide shadow-sm">
              {['All', 'Verified', 'Pending', 'Awaiting', 'Disputed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab ? 'bg-[#1e40af] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button 
              onClick={() => {
                if(searchTerm) setSearchTerm('');
                else {
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition-colors w-full md:w-auto justify-center md:justify-start ${searchTerm ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'}`}
            >
              {searchTerm ? <X size={16} /> : <Filter size={16} />} 
              {searchTerm ? 'Clear Search' : 'More Filters'}
            </button>
          </div>

          {/* Table Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead className="bg-[#f8fafc] border-b border-slate-100">
                  <tr className="text-[11px] uppercase font-black text-slate-400 tracking-widest">
                    <th className="px-6 py-5">Client Profile</th>
                    <th className="px-6 py-5">Description</th>
                    <th className="px-6 py-5">Amount (NGN)</th>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center">
                        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Syncing Ledger Data...</p>
                      </td>
                    </tr>
                  ) : currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 border border-slate-100 shadow-inner">
                          <Inbox size={28} />
                        </div>
                        <p className="text-base font-black text-slate-800 mb-1">No records found</p>
                        <p className="text-sm text-slate-500 mb-6 font-medium">We couldn't find any transactions matching your current filters.</p>
                        <button onClick={() => {setSearchTerm(''); setActiveTab('All');}} className="bg-white border border-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                           Clear Filters
                        </button>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black shadow-sm border border-white ${tx.initialColor}`}>
                              {tx.initials}
                            </div>
                            <span className="text-[13px] font-bold text-slate-800 group-hover:text-[#1e40af] transition-colors">{tx.clientName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-[13px] font-medium text-slate-500 max-w-[240px] truncate">{tx.description}</td>
                        <td className="px-6 py-5 text-[14px] font-black text-slate-800 tracking-tight">{tx.amount}</td>
                        <td className="px-6 py-5 text-[12px] font-bold text-slate-400">{tx.date}</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(tx.status)}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => navigate('/transaction-receipt', { state: { transactionData: tx } })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold text-[11px] hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
                          >
                            View <ArrowRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredTransactions.length > 0 && (
              <div className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f8fafc]">
                <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest text-center sm:text-left">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} entries
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-lg text-xs font-black transition-all shrink-0 ${
                          currentPage === i + 1 ? 'bg-[#1e40af] text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard 
              label="Verified Total" 
              value={`₦${(verifiedTotal / 1000000).toFixed(2)}M`} 
              sub={<span className="text-emerald-500 font-bold flex items-center gap-1 mt-1"><TrendingUp size={12} /> Total approved volume</span>} 
            />
            <SummaryCard 
              label="Pending Payouts" 
              value={`₦${(pendingTotal / 1000000).toFixed(2)}M`} 
              sub={<span className="text-amber-500 font-bold block mt-1">🕓 {pendingCount} active request{pendingCount !== 1 ? 's' : ''}</span>} 
            />
            <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-blue-200 group">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest group-hover:text-blue-500 transition-colors">Verification Rate</p>
              <p className="text-3xl font-black text-slate-800 mb-5 tracking-tight">{verificationRate}%</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#1e40af] h-2 rounded-full transition-all duration-1000" style={{ width: `${verificationRate}%` }}></div>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-rose-200 group">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest group-hover:text-rose-500 transition-colors">Disputed Cases</p>
              <p className="text-3xl font-black text-rose-500 mb-2 tracking-tight">{disputedCount}</p>
              <p className={`text-[11px] font-bold flex items-center gap-1.5 mt-3 ${disputedCount > 0 ? 'text-rose-500 bg-rose-50 px-2 py-1 rounded-md w-max' : 'text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md w-max'}`}>
                {disputedCount > 0 ? <><AlertCircle size={12}/> Requires attention</> : <><ShieldCheck size={12}/> All clear</>}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- SUB COMPONENTS ---

const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[13px] font-bold transition-all ${
    active ? 'bg-[#eff6ff] text-[#1e40af] shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
  }`}>
    {icon} <span>{label}</span>
  </button>
);

const SummaryCard = ({ label, value, sub }) => (
  <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-blue-200 group">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest group-hover:text-blue-500 transition-colors">{label}</p>
      <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
    <div className="text-[11px] text-slate-400 mt-2">{sub}</div>
  </div>
);

export default TransactionDashboard;
