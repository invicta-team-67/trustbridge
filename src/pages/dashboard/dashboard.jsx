import React, { useEffect, useState, useRef } from 'react'; 
import { 
  LayoutDashboard, CreditCard, PlusSquare, ShieldCheck, 
  FileText, Settings, LogOut, Bell, Search, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Zap, Download, ChevronRight,
  Menu, X, Loader2, Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase'; 

const TrustBridgeDashboard = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const notificationsRef = useRef(null);
  
  // Interactive UI States
  const [showPromo, setShowPromo] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [priorityAlert, setPriorityAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Store dynamic user data
  const [userData, setUserData] = useState({
    name: 'Loading...',
    role: '...',
    avatarName: 'User'
  });

  // Store real-time stats
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    disputed: 0,
    pending: 0,
    score: 0 
  });

  // Store dynamic lists
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dynamicInsights, setDynamicInsights] = useState([]);

  // 1. CONNECTED & REAL-TIME: Master Data Fetching & Math Logic
  useEffect(() => {
    let subscription;

    const fetchDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      try {
        const userId = session.user.id;

        // A. Fetch Profile Data (Added created_at for age points)
        const { data: profile } = await supabase
          .from('profiles')
          .select('business_name, business_type, created_at')
          .eq('user_id', userId)
          .maybeSingle();

        if (profile) {
          setUserData({
            name: profile.business_name || 'My Business',
            role: (profile.business_type || 'Verified Merchant').replace('_', ' '),
            avatarName: (profile.business_name || 'User').split(' ').join('+')
          });
        }

        // B. Fetch ALL Transactions
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (txError) throw txError;

        if (txData && txData.length > 0) {
          const total = txData.length;
          const verified = txData.filter(t => t.status === 'Verified').length;
          const disputed = txData.filter(t => t.status === 'Disputed').length;
          const pending = txData.filter(t => t.status === 'Pending' || t.status === 'Awaiting').length;
          
          // --- REALITY CALCULATION 1: Zero-Trust Math (Synced) ---
          const vRate = total > 0 ? Math.round((verified / total) * 100) : 0;
          const joinDate = new Date(profile?.created_at || new Date());
          const daysActive = Math.max(0, (new Date() - joinDate) / (1000 * 60 * 60 * 24));
          
          const volumePoints = Math.min(total * 4, 40); 
          const verificationPoints = Math.round((vRate / 100) * 40); 
          const agePoints = Math.min(Math.round(daysActive / 18.25), 20); 

          const liveScore = Math.min(100, 0 + volumePoints + verificationPoints + agePoints);
          
          setStats({ total, verified, disputed, pending, score: liveScore });

          // --- REALITY CALCULATION 2: Priority Alerts ---
          const urgentTx = txData.find(t => t.status === 'Pending' || t.status === 'Disputed' || t.status === 'Awaiting');
          if (urgentTx) setPriorityAlert(urgentTx);

          // --- REALITY CALCULATION 3: 7-Day Chart Volume ---
          const last7Days = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push({
              day: d.toLocaleDateString('en-US', { weekday: 'short' }),
              amount: 0,
              fullDate: d.toDateString()
            });
          }

          txData.forEach(tx => {
            const txDate = new Date(tx.created_at).toDateString();
            const dayMatch = last7Days.find(d => d.fullDate === txDate);
            if (dayMatch && (tx.status === 'Verified' || tx.status === 'Pending')) {
              dayMatch.amount += parseFloat(tx.amount || 0);
            }
          });
          setChartData(last7Days);

          // --- REALITY CALCULATION 4: Table Data ---
          setRecentTransactions(txData);

          // --- REALITY CALCULATION 5: Dynamic AI Insights ---
          const insights = [];
          if (disputed > 0) {
            insights.push({ type: 'warning', title: 'Action Required', desc: `You have ${disputed} disputed transaction(s) negatively impacting your score.` });
          }
          if (total > 0 && vRate < 50) {
            insights.push({ type: 'info', title: 'Verification Rate Low', desc: `Only ${vRate}% of your transactions are verified. Send follow-up links to clients.` });
          } else if (total >= 10) {
            insights.push({ type: 'success', title: 'Healthy Volume', desc: 'You have maxed out your transaction volume points. Keep verifying!' });
          }
          if (liveScore > 80) {
            insights.push({ type: 'success', title: 'Top Percentile', desc: 'You are in the top tier of merchants, unlocking higher transaction limits.' });
          }
          if (insights.length < 3) {
            insights.push({ type: 'info', title: 'Security Check', desc: 'Ensure your profile details and tax documents are up to date in Settings.' });
          }
          setDynamicInsights(insights.slice(0, 3));

        } else {
          // Zero-State Fallbacks (If DB is empty)
          setStats({ total: 0, verified: 0, disputed: 0, pending: 0, score: 0 });
          setDynamicInsights([
            { type: 'info', title: 'Start from Zero', desc: 'Log your first transaction to earn your first 4 Trust Points.' },
            { type: 'success', title: 'Profile Ready', desc: 'Your account is fully configured and ready for ledger entries.' },
            { type: 'info', title: 'Learn the Basics', desc: 'Visit the Trust Center to learn how verifications boost your business credibility.' }
          ]);
          setChartData([
            { day: 'Mon', amount: 0 }, { day: 'Tue', amount: 0 }, { day: 'Wed', amount: 0 },
            { day: 'Thu', amount: 0 }, { day: 'Fri', amount: 0 }, { day: 'Sat', amount: 0 }, { day: 'Sun', amount: 0 }
          ]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Setup Supabase Realtime for the Dashboard
    const setupRealtime = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      subscription = supabase
        .channel('dashboard-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${session.user.id}` }, fetchDashboardData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `user_id=eq.${session.user.id}` }, fetchDashboardData)
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [navigate]);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // REALITY: Working CSV Export based on actual DB Data
  const handleExportCSV = () => {
    if (!recentTransactions || recentTransactions.length === 0) {
      alert("No transactions available to export.");
      return;
    }
    const headers = ['Client Name', 'Amount (NGN)', 'Status', 'Date', 'Service Provided'];
    const csvContent = [
      headers.join(','),
      ...recentTransactions.map(t => `"${t.client_name || ''}","${t.amount || 0}","${t.status || ''}","${new Date(t.created_at).toLocaleDateString()}","${t.service_provided || ''}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `trustbridge_dashboard_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Helper for Search Filtering
  const filteredTableData = recentTransactions.filter(tx => 
    (tx.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (tx.service_provided || '').toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5); // Only show top 5 on dashboard

  // Helper for dynamic Avatar colors
  const getColorForName = (name) => {
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-rose-500'];
    const charCode = (name || 'A').charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center gap-2">
        <div className="bg-[#003399] p-1.5 rounded-lg shadow-sm">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#001B4D] tracking-tight">TrustBridge</h1>
      </div>
      <nav className="flex-1 px-6 space-y-2">
        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active /></Link>
        <Link to="/transaction-dashboard" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<CreditCard size={20}/>} label="Transaction" /></Link>
        <Link to="/log-new-transaction" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<PlusSquare size={20}/>} label="Add Transaction" /></Link>
        <Link to="/trust-score" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<ShieldCheck size={20}/>} label="Trust Score" /></Link>
        <Link to="/trust-report" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<FileText size={20}/>} label="Report" /></Link>
        <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<Settings size={20}/>} label="Settings" /></Link>
      </nav>
      <div className="p-8 border-t border-slate-100">
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-rose-500 transition-all font-medium w-full text-left">
          <LogOut size={20} /> <span>Log out</span>
        </button>
      </div>
    </>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#003399] mb-4" size={40} />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans text-slate-700 relative overflow-x-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col fixed h-full z-10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl flex flex-col">
              <div className="absolute top-4 right-4"><button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400"><X size={24} /></button></div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.main variants={containerVariants} initial="hidden" animate="show" className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
              <span>Home</span> <ChevronRight size={14}/> <span className="text-slate-800 font-bold">Dashboard</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clients..." 
                className="w-full pl-12 pr-4 py-2.5 rounded-full border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500/10 text-sm outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3 border-l pl-0 sm:pl-6 border-slate-200">
              
              {/* Working Notification Bell */}
              <div className="relative" ref={notificationsRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 relative">
                  <Bell size={20} />
                  {priorityAlert && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[#F4F7FE] rounded-full"></span>}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-10 right-0 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-5 z-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-slate-800">Notifications</h4>
                        {priorityAlert && <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">1 Urgent</span>}
                      </div>
                      <div className="space-y-4">
                        {priorityAlert ? (
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0"><AlertCircle size={14}/></div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">Transaction {priorityAlert.status}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Review your recent transaction with <span className="font-bold">{priorityAlert.client_name}</span>.</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 text-center py-4">You're all caught up!</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-right hidden sm:block ml-2">
                <p className="text-sm font-bold text-slate-800 leading-none">{userData.name}</p>
                <p className="text-[11px] text-slate-400 mt-1 capitalize">{userData.role}</p>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${userData.avatarName}&background=003399&color=fff`} className="w-10 h-10 rounded-full border-2 border-white shadow-md" alt="profile" />
            </div>
          </div>
        </header>

        {/* Hero Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <motion.div variants={itemVariants} className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-sm border border-white">
            <div className="relative w-32 h-32 md:w-36 md:h-36 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="45%" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                <motion.circle 
                  cx="50%" cy="50%" r="45%" stroke="#003399" strokeWidth="12" fill="transparent" strokeDasharray="402.12" 
                  initial={{ strokeDashoffset: 402.12 }} animate={{ strokeDashoffset: 402.12 * (1 - (stats.score / 100)) }} 
                  transition={{ duration: 1.5, ease: "easeOut" }} strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl md:text-3xl font-black text-slate-800">{stats.score}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Score</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Overall Trust Score</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
                Your business trust rating is based on <span className="font-bold text-slate-700">{stats.total} logged transactions</span>. High verification rates are positively impacting your score.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
                <button onClick={() => navigate('/trust-report')} className="bg-[#003399] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95">View Detailed Report</button>
                <button onClick={() => navigate('/trust-score')} className="border border-blue-100 text-[#003399] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all active:scale-95">Improve Score</button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-4 bg-[#003399] p-6 md:p-8 rounded-[32px] text-white flex flex-col justify-between shadow-xl shadow-blue-900/10">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
              <p className="text-blue-200 text-sm leading-snug">Instantly log new transactions or manage your ledger entries.</p>
            </div>
            <button onClick={() => navigate('/log-new-transaction')} className="w-full bg-white text-[#003399] py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-50 transition-transform active:scale-95 shadow-lg shadow-[#001B4D]">
              <PlusSquare size={20} /> Log New Transaction
            </button>
          </motion.div>
        </div>

        {/* Priority Alert Box */}
        <AnimatePresence>
          {priorityAlert && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-10 overflow-hidden">
              <div className="bg-[#EBF2FF] border border-[#D0E0FF] p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl shadow-sm shrink-0 ${priorityAlert.status === 'Disputed' ? 'bg-rose-100 text-rose-600' : 'bg-white text-[#003399]'}`}>
                    <AlertCircle size={22} />
                  </div>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">Priority Action:</span> &nbsp; You have a <span className={`font-bold ${priorityAlert.status === 'Disputed' ? 'text-rose-500' : 'text-blue-600'}`}>{priorityAlert.status}</span> transaction with {priorityAlert.client_name || 'a client'} (₦{parseFloat(priorityAlert.amount || 0).toLocaleString()}).
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => navigate('/transaction-dashboard')} className="flex-1 sm:flex-none bg-[#003399] text-white px-6 py-2 rounded-xl text-xs font-black shadow-md hover:bg-blue-800 transition-colors">Review Now</button>
                  <button onClick={() => setPriorityAlert(null)} className="p-2 text-blue-400 hover:bg-blue-100 rounded-xl transition-colors"><X size={16}/></button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats & Growth Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-9 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard label="Total Transactions" value={stats.total.toLocaleString()} icon={<CreditCard size={20}/>} color="text-blue-600" />
              <StatCard label="Verified Ledger" value={stats.verified.toLocaleString()} icon={<ShieldCheck size={20}/>} color="text-emerald-500" />
              <StatCard label="Pending / Disputed" value={(stats.pending + stats.disputed).toLocaleString()} icon={<AlertCircle size={20}/>} color="text-orange-500" />
            </div>

            {/* Dynamic Growth Chart */}
            <motion.div variants={itemVariants} className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-slate-800">7-Day Volume</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg cursor-not-allowed">
                  This Week <ChevronRight className="rotate-90" size={14}/>
                </div>
              </div>
              <div className="h-[250px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#003399" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#003399" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8', fontWeight: 600}} dy={15} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} formatter={(value) => `₦${value.toLocaleString()}`} />
                    <Area type="monotone" dataKey="amount" stroke="#003399" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" animationDuration={1500} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Dynamic AI Insights Panel */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm h-full border border-slate-100">
                <div className="flex items-center gap-2 mb-8">
                  <Zap size={20} className="text-blue-500 fill-blue-500" />
                  <h3 className="font-bold text-slate-800">AI Insights</h3>
                </div>
                <div className="space-y-4">
                  {dynamicInsights.map((insight, index) => (
                    <InsightCard key={index} type={insight.type} title={insight.title} desc={insight.desc} />
                  ))}
                </div>
                <button onClick={() => navigate('/trust-score')} className="w-full text-center mt-8 pt-6 border-t border-slate-100 text-xs font-bold text-slate-400 hover:text-[#003399] transition-all uppercase tracking-widest">View Trust Center</button>
            </div>
          </motion.div>
        </div>

        {/* REALITY: Dynamic Recent Transaction Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden mb-10">
          <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 gap-4">
            <h3 className="text-lg font-bold text-slate-800">Recent Ledger Activity</h3>
            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={handleExportCSV} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors active:scale-95 shadow-sm">
                <Download size={16}/> Export CSV
              </button>
              <button onClick={() => navigate('/transaction-dashboard')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 text-[#003399] rounded-xl text-xs font-black hover:bg-blue-100 transition-colors active:scale-95">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-[#F8FAFC]">
                <tr className="text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Client</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTableData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-16 text-center text-sm text-slate-400 font-medium">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 border border-slate-100 shadow-inner">
                        <Inbox size={28} />
                      </div>
                      No transactions recorded yet. <br/> 
                      <Link to="/log-new-transaction" className="text-blue-600 font-bold mt-2 inline-block hover:underline">Log your first transaction</Link>
                    </td>
                  </tr>
                ) : (
                  filteredTableData.map((tx) => {
                    const clientName = tx.client_name || 'Unknown';
                    const assignedColor = getColorForName(clientName);
                    return (
                      <TableRow 
                        key={tx.id || tx.transaction_id}
                        name={clientName} 
                        amount={`₦${parseFloat(tx.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`} 
                        status={tx.status || 'Pending'} 
                        date={new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                        color={assignedColor} 
                        onAction={() => navigate('/transaction-receipt', { state: { transactionData: tx } })} 
                      />
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Promo Footer - Dismissible */}
        <AnimatePresence>
          {showPromo && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#000F2E] rounded-[32px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-center text-white gap-6 text-center md:text-left mb-10 shadow-2xl">
              <div className="z-10">
                  <h4 className="text-2xl font-bold mb-2">Ready for more advanced insights?</h4>
                  <p className="text-slate-400 text-sm max-w-lg leading-relaxed">Upgrade to Enterprise Pro to unlock API access, priority compliance support, and unlimited ledger entries.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 z-10 w-full md:w-auto">
                  <button className="bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-black text-sm hover:shadow-xl hover:bg-slate-50 transition-all active:scale-95">Upgrade Plan</button>
                  <button onClick={() => setShowPromo(false)} className="bg-slate-800/50 backdrop-blur-md px-8 py-3.5 rounded-2xl font-black text-sm border border-slate-700 hover:bg-slate-700 transition-colors active:scale-95">Dismiss</button>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </motion.main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all font-bold text-sm ${active ? 'bg-[#EBF2FF] text-[#003399] shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
    {icon} <span>{label}</span>
  </div>
);

const StatCard = ({ label, value, icon, color }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex-1 flex items-center justify-between">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
    <div className={`p-4 bg-slate-50 rounded-2xl ${color} shadow-inner`}>{icon}</div>
  </motion.div>
);

const InsightCard = ({ type, title, desc }) => {
  const styles = {
    warning: "bg-rose-50 border-rose-100 text-rose-800",
    info: "bg-blue-50 border-blue-100 text-blue-800",
    success: "bg-emerald-50 border-emerald-100 text-emerald-800"
  };
  return (
    <div className={`p-5 rounded-2xl border ${styles[type]}`}>
      <span className="text-[10px] font-black uppercase block mb-1.5 tracking-widest">{title}</span>
      <p className="text-[11px] font-medium opacity-90 leading-relaxed">{desc}</p>
    </div>
  );
};

const TableRow = ({ name, amount, status, date, color, onAction }) => (
  <tr className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={onAction}>
    <td className="px-8 py-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white text-xs font-black shadow-sm`}>{name.charAt(0).toUpperCase()}</div>
      <span className="text-sm font-bold text-slate-700 group-hover:text-[#003399] transition-colors">{name}</span>
    </td>
    <td className="px-8 py-5 text-sm font-black text-slate-800">{amount}</td>
    <td className="px-8 py-5">
      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border ${
        status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
        status === 'Disputed' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
        'bg-orange-50 text-orange-600 border-orange-100'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-8 py-5">
      <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{date}</span>
    </td>
    <td className="px-8 py-5 text-right">
      <button className="text-[#003399] font-bold text-xs hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors active:scale-95 shadow-sm border border-transparent hover:border-blue-100">View Receipt</button>
    </td>
  </tr>
);

export default TrustBridgeDashboard;
