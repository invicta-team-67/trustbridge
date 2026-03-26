import React, { useEffect, useState, useRef } from 'react';
import { 
  LayoutDashboard, ArrowRightLeft, PlusCircle, ShieldCheck, 
  FileText, Settings, LogOut, Search, Bell, TrendingUp, 
  Zap, ChevronRight, Link as LinkIcon, BarChart3,
  Menu, X, AlertCircle, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

const TrustScore = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Interactive UI States
  const [timeframe, setTimeframe] = useState('6_months');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAiAdvisor, setShowAiAdvisor] = useState(true);
  
  const metricsRef = useRef(null);
  const notificationsRef = useRef(null);

  // Fully Dynamic Data States
  const [notifications, setNotifications] = useState([]);
  const [aiInsight, setAiInsight] = useState({ points: 0, title: 'Loading...', text: '...', action: '...' });
  const [dynamicTrendData, setDynamicTrendData] = useState([]);
  const [stats, setStats] = useState({
    businessName: 'Loading...',
    avatarName: 'User',
    score: 0,
    verificationRate: 0, 
    accountAge: '0y',
    txVolume: '0%',
    totalTransactions: 0, 
    rawTransactions: [], 
    joinDate: null, 
    isLoading: true
  });

  // 1. CONNECTED & REAL-TIME: Master Data Fetching & AI Logic
  useEffect(() => {
    let subscription;
    let userId;

    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      userId = session.user.id;

      try {
        // Fetch Profile and Transactions
        const { data: profile } = await supabase
          .from('profiles')
          .select('business_name, created_at')
          .eq('user_id', userId)
          .maybeSingle();

        const { data: transactions } = await supabase
          .from('transactions')
          .select('id, status, amount, created_at, client_name')
          .eq('user_id', userId)
          .order('created_at', { ascending: true }); 

        // --- PROGRESSIVE ADDITIVE SCORING MATH ---
        const totalTx = transactions ? transactions.length : 0;
        const verifiedTx = transactions ? transactions.filter(t => t.status === 'Verified').length : 0;
        const vRate = totalTx > 0 ? Math.round((verifiedTx / totalTx) * 100) : 0;
        
        const joinDate = new Date(profile?.created_at || new Date());
        const daysActive = Math.max(0, (new Date() - joinDate) / (1000 * 60 * 60 * 24));
        const years = (daysActive / 365.25).toFixed(1);

        // Additive Math: +4 for volume, +4 for verification. (Score never drops for logging)
        const volumePoints = Math.min(totalTx * 4, 40); 
        const verificationPoints = Math.min(verifiedTx * 4, 40); 
        const agePoints = Math.min(Math.round(daysActive / 18.25), 20); 
        
        const finalScore = Math.min(100, volumePoints + verificationPoints + agePoints);

        setStats({
          businessName: profile?.business_name || 'Your Business',
          avatarName: (profile?.business_name || 'User').split(' ').join('+'),
          score: finalScore,
          verificationRate: vRate,
          accountAge: `${years}y`,
          txVolume: `${Math.min(100, (totalTx / 10) * 100).toFixed(0)}%`, // Volume maxes out at 10 txs
          totalTransactions: totalTx,
          rawTransactions: transactions || [],
          joinDate: profile?.created_at || new Date(),
          isLoading: false
        });

        // --- Dynamic AI Advisor Logic (Updated for Additive Math) ---
        if (totalTx === 0) {
          setAiInsight({
            points: 4,
            title: "Start from Zero",
            text: "You haven't recorded any activity yet. You currently have 0 points. Let's fix that.",
            action: "Log your first transaction to earn your first 4 Trust Points."
          });
        } else if (verifiedTx < totalTx && verificationPoints < 40) {
          const pending = totalTx - verifiedTx;
          const obtainable = Math.min(pending * 4, 40 - verificationPoints);
          setAiInsight({
            points: obtainable,
            title: "Verify Pending Transactions",
            text: `You have ${pending} unverified transaction(s). Follow up with your clients to verify them.`,
            action: `Verify pending transactions to unlock +${obtainable} Points and boost your score.`
          });
        } else if (volumePoints < 40) {
          const needed = 10 - totalTx;
          setAiInsight({
            points: needed * 4,
            title: "Increase Transaction Volume",
            text: `You need ${needed} more verified transaction(s) to max out your Volume Points.`,
            action: `Log more transactions to unlock +${needed * 4} Points and build credibility.`
          });
        } else {
          setAiInsight({
            points: 5,
            title: "Connect External Identity",
            text: "Your transaction metrics are excellent. Take the final step by verifying your identity externally.",
            action: "Verify your LinkedIn or Company Registration to max out your profile."
          });
        }

        // --- Dynamic Notifications ---
        if (transactions) {
          const alerts = transactions
            .filter(t => t.status === 'Disputed' || t.status === 'Pending')
            .reverse()
            .slice(0, 3)
            .map(t => ({
              id: t.id,
              type: t.status,
              client: t.client_name || 'a client',
            }));
          setNotifications(alerts);
        }
      } catch (err) {
        console.error("Error in Trust Score lifecycle:", err);
      }
    };

    fetchData();

    const setupRealtime = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      subscription = supabase
        .channel('trust-score-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${session.user.id}` }, fetchData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `user_id=eq.${session.user.id}` }, fetchData)
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [navigate]);

  // 2. Real Historical Chart Generator (Additive Math)
  useEffect(() => {
    if (stats.isLoading) return;
    
    const transactions = stats.rawTransactions || [];
    let data = [];
    const now = new Date();

    const calculateHistoricalScore = (upToDate) => {
      const historicalTxs = transactions.filter(t => new Date(t.created_at) <= upToDate);
      const totalTx = historicalTxs.length;
      const verifiedTx = historicalTxs.filter(t => t.status === 'Verified').length;
      
      const volumePoints = Math.min(totalTx * 4, 40); 
      const verificationPoints = Math.min(verifiedTx * 4, 40); 
      
      const joinDate = new Date(stats.joinDate || now);
      const daysActive = Math.max(0, (upToDate - joinDate) / (1000 * 60 * 60 * 24));
      const agePoints = Math.min(Math.round(daysActive / 18.25), 20);

      return Math.min(100, volumePoints + verificationPoints + agePoints);
    };

    if (timeframe === '30_days') {
      for (let i = 4; i >= 0; i--) {
        const d = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
        data.push({ month: `Week ${5-i}`, score: calculateHistoricalScore(d) });
      }
    } else if (timeframe === '12_months') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 11; i >= 0; i--) {
        let d = new Date(now.getFullYear(), now.getMonth() - i + 1, 0); 
        data.push({ month: months[d.getMonth()], score: calculateHistoricalScore(d) });
      }
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 5; i >= 0; i--) {
        let d = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        data.push({ month: months[d.getMonth()], score: calculateHistoricalScore(d) });
      }
    }
    
    setDynamicTrendData(data);
  }, [timeframe, stats.rawTransactions, stats.isLoading, stats.joinDate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  useEffect(() => {
    if (['volume', 'age', 'rate'].includes(searchTerm.toLowerCase())) {
      metricsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchTerm]);

  const handleActionClick = (action) => {
    if (action === 'Upload') navigate('/settings'); 
    else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsRef]);

  const percentile = Math.max(1, Math.round(100 - stats.score + (stats.totalTransactions * 0.5)));

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
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" /></Link>
          <Link to="/transaction-dashboard" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" /></Link>
          <Link to="/log-new-transaction" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" /></Link>
          <Link to="/trust-score" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<ShieldCheck size={18}/>} label="Trust Score" active /></Link>
          <Link to="/trust-report" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<FileText size={18}/>} label="Report" /></Link>
          <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<Settings size={18}/>} label="Settings" active={window.location.pathname === '/settings'} />
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-slate-100">
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-rose-500 font-medium transition-colors w-full text-left">
          <LogOut size={18} /> <span>Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700 relative overflow-x-hidden">
      
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className="fixed top-6 left-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-bold">
            OAuth integration coming soon!
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-30">
        <SidebarContent />
      </aside>

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

      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 w-full">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-10 w-full">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-white rounded-lg border border-slate-200 text-slate-600 shrink-0"><Menu size={20} /></button>
            <div className="truncate">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">Trust Score Analysis</h1>
              <p className="text-[11px] md:text-sm text-slate-400 font-medium truncate">Real-time breakdown of {stats.businessName}'s credibility.</p>
            </div>
          </div>
          <div className="flex items-center justify-between w-full lg:w-auto gap-4 lg:pl-6 lg:border-l border-slate-200">
            <div className="relative flex-1 lg:w-64 max-w-sm hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search 'volume' or 'age'..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
            </div>
            
            {/* Notifications */}
            <div className="flex items-center gap-4 shrink-0 relative" ref={notificationsRef}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-slate-400 hover:text-slate-600 transition-colors p-1">
                <Bell size={20} />
                {notifications.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[#f8fafc] rounded-full"></span>}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-10 right-12 md:right-0 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-5 z-50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-slate-800">Notifications</h4>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{notifications.length} Alerts</span>
                    </div>
                    <div className="space-y-4">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-2">No pending alerts.</p>
                      ) : (
                        notifications.map((notif, i) => (
                          <div key={i} className={`flex gap-3 ${i > 0 ? 'border-t border-slate-100 pt-4' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'Disputed' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                              {notif.type === 'Disputed' ? <AlertCircle size={14}/> : <ShieldCheck size={14}/>}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">Transaction {notif.type}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Action needed for transaction with <span className="font-bold">{notif.client}</span>.</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <img src={`https://ui-avatars.com/api/?name=${stats.avatarName}&background=1e40af&color=fff`} className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" alt="profile" />
            </div>
          </div>
        </header>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-4 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            {stats.score > 75 && (
              <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[10px] font-black uppercase">+2.4% ↑</div>
            )}
            <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="40%" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                <motion.circle cx="50%" cy="50%" r="40%" stroke="#1e40af" strokeWidth="12" fill="transparent" strokeDasharray="251" initial={{ strokeDashoffset: 251 }} animate={{ strokeDashoffset: 251 * (1 - (stats.score / 100)) }} transition={{ duration: 2, ease: "easeOut" }} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-slate-800">{stats.score}</span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">
                  {stats.score > 80 ? 'Highly Trusted' : stats.score > 60 ? 'Trusted' : stats.score > 20 ? 'Developing' : 'New Account'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center font-medium max-w-[200px]">
              {stats.businessName}'s score is in the <span className="text-blue-600 font-bold">top {percentile}%</span> of institutional accounts.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Historical Trust Trend</h3>
              <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                <option value="30_days">Last 30 Days</option>
                <option value="6_months">Last 6 Months</option>
                <option value="12_months">Last 12 Months</option>
              </select>
            </div>
            <div className="w-full flex-1 min-h-[220px]"> 
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e40af" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} dy={10} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} itemStyle={{color: '#1e40af', fontWeight: 'bold'}} />
                  <Area type="monotone" dataKey="score" stroke="#1e40af" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* AI Advisor */}
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-8">
            {showAiAdvisor ? (
              <motion.div exit={{ opacity: 0, scale: 0.95 }} className="lg:col-span-8 bg-[#EEF2FF] rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row shadow-sm border border-blue-100 gap-6 relative">
                <button onClick={() => setShowAiAdvisor(false)} className="absolute top-4 right-4 p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><X size={16} /></button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600"><Zap size={18} fill="currentColor" /></div>
                    <h3 className="font-bold text-slate-800 text-sm md:text-base">AI Trust Advisor</h3>
                    <span className="ml-auto md:ml-2 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">AI <ChevronRight size={10} /></span>
                  </div>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{aiInsight.title}</p>
                  <h2 className="text-2xl md:text-3xl font-black text-[#1e40af] mb-3">+{aiInsight.points} Points Available ✨</h2>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm">{aiInsight.text}</p>
                </div>
                <div className="flex-1 bg-white/60 backdrop-blur-md rounded-2xl p-5 md:p-6 border border-white flex flex-col justify-center">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block mb-2">+{aiInsight.points} POINTS AVAILABLE ↗</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <span className="font-black text-slate-900">AI suggests:</span> {aiInsight.action}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="lg:col-span-8 flex items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-[32px]">
                <p className="text-slate-400 text-sm font-bold flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500"/> All AI suggestions reviewed.</p>
              </div>
            )}

            <div className="lg:col-span-4 bg-[#1e3a8a] rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 mb-6">
                <h3 className="text-lg font-bold mb-2">Benchmarking</h3>
                <p className="text-blue-100/80 text-xs leading-relaxed">Generate a verifiable report to compare your trust profile with top-tier firms.</p>
              </div>
              <button onClick={() => navigate('/trust-report')} className="relative z-10 bg-white text-[#1e40af] w-full py-3.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2">
                Generate Report <ArrowRightLeft size={16} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Score Breakdown Metrics */}
        <div ref={metricsRef} className="pt-4">
          <h3 className="text-lg font-black text-slate-900 mb-6">Score Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <MetricCard label="Verification Rate" value={`${stats.verificationRate}%`} color="bg-blue-600" />
            <MetricCard label="Account Age" value={stats.accountAge} color="bg-purple-500" sub="Growing monthly" />
            <MetricCard label="Tx Volume" value={stats.txVolume} color="bg-orange-500" sub="Consistent activity" />
          </div>
        </div>

        {/* Action List */}
        <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-slate-100 pb-6">
            <h3 className="font-bold text-slate-800 text-lg">How to improve your score</h3>
            <span className="px-4 py-2 bg-blue-50 rounded-full text-[11px] font-bold text-blue-600 uppercase tracking-wide">
              Est. Improvement: <span className="text-sm font-black ml-1">+{aiInsight.points} Pts ✨</span>
            </span>
          </div>
          <div className="space-y-3">
            <ActionRow 
              icon={<LinkIcon size={18}/>} 
              title="Verify LinkedIn Profile" 
              desc="Add institutional social proof to your account" 
              points="+5 pts" 
              btnText="Connect" 
              onAction={() => handleActionClick('Connect')}
            />
            {/* Fully Real Progress Bar mapping to DB Total Transactions */}
            <ActionRow 
              icon={<BarChart3 size={18}/>} 
              title="Reach 10 Transactions" 
              desc="Unlock 'Frequent Trader' tier volume" 
              points="+4 pts" 
              isProgress 
              progressValue={Math.min(100, Math.round(((stats.totalTransactions || 0) / 10) * 100))}
            />
            <ActionRow 
              icon={<FileText size={18}/>} 
              title="Update Tax Document" 
              desc="Current documentation expires in 12 days" 
              points="+3 pts" 
              btnText="Upload" 
              onAction={() => handleActionClick('Upload')}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all font-bold text-sm ${active ? 'bg-[#f1f5f9] text-[#1e40af]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
    {icon} <span>{label}</span>
  </div>
);

const MetricCard = ({ label, value, color, sub = "Max impact on score" }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-xl bg-slate-50 text-slate-400`}><TrendingUp size={16} /></div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
    <div className="flex items-end justify-between mb-4">
      <p className="text-3xl font-black text-slate-800">{value}</p>
      <p className="text-[10px] text-slate-400 font-bold hidden md:block">{sub}</p>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: value.includes('%') ? value : '60%' }}></div>
    </div>
  </div>
);

const ActionRow = ({ icon, title, desc, points, btnText, isProgress, progressValue, onAction }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all group gap-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{desc}</p>
      </div>
    </div>
    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:pl-4">
      <span className="text-sm font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg shrink-0">{points}</span>
      {isProgress ? (
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${progressValue}%` }}></div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{progressValue}% Complete</span>
        </div>
      ) : (
        <button onClick={onAction} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 ${btnText === 'Connect' ? 'bg-[#1e40af] text-white hover:bg-blue-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          {btnText}
        </button>
      )}
    </div>
  </div>
);

export default TrustScore;
