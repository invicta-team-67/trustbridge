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
  
  const [timeframe, setTimeframe] = useState('6_months');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAiAdvisor, setShowAiAdvisor] = useState(true);
  
  const metricsRef = useRef(null);
  const notificationsRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [aiInsight, setAiInsight] = useState({ points: 0, title: 'Analysis Pending', text: 'Waiting for data...', action: 'Add data to see insights.' });
  const [dynamicTrendData, setDynamicTrendData] = useState([]);
  const [stats, setStats] = useState({
    businessName: '...',
    avatarName: 'U',
    score: 0,
    verificationRate: 0, 
    accountAge: '0y',
    txVolume: '0%',
    totalTransactions: 0, 
    isLoading: true
  });

  // 1. REAL-TIME DATA FETCHING
  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }

      try {
        const userId = session.user.id;

        const { data: profile } = await supabase
          .from('profiles')
          .select('business_name, created_at, linkedin_verified, tax_verified')
          .eq('user_id', userId)
          .maybeSingle();

        const { data: transactions } = await supabase
          .from('transactions')
          .select('id, status, amount, created_at, client_name')
          .eq('user_id', userId)
          .order('created_at', { ascending: true }); 

        if (profile) {
          const totalTx = transactions ? transactions.length : 0;
          const verifiedTx = transactions ? transactions.filter(t => t.status === 'Verified').length : 0;
          const vRate = totalTx > 0 ? Math.round((verifiedTx / totalTx) * 100) : 0;
          
          // --- SCRATCH SCORE LOGIC ---
          // No dummy +50 baseline. Score is earned 100% from activity.
          let calculatedScore = 0;
          calculatedScore += Math.min(totalTx * 3, 30); // Max 30 pts for activity
          calculatedScore += Math.round((vRate / 100) * 40); // Max 40 pts for verification quality
          if (profile.linkedin_verified) calculatedScore += 15;
          if (profile.tax_verified) calculatedScore += 15;
          
          const joinDate = new Date(profile.created_at || new Date());
          const years = ((new Date() - joinDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);

          setStats({
            businessName: profile.business_name || 'Business Name',
            avatarName: (profile.business_name || 'U').split(' ').join('+'),
            score: calculatedScore,
            verificationRate: vRate,
            accountAge: `${years}y`,
            txVolume: `${Math.min(100, (totalTx / 20) * 100)}%`, // Scaled to a 20-tx "Full Volume" target
            totalTransactions: totalTx,
            isLoading: false
          });

          // AI Advisor logic strictly matching current stats
          if (totalTx === 0) {
            setAiInsight({ points: 20, title: "Identity Baseline", text: "Your score is 0 because no transactions are logged.", action: "Log your first business transaction to establish your trust baseline." });
          } else if (vRate < 70) {
            setAiInsight({ points: 15, title: "Low Verification", text: `Your ${vRate}% verification rate is pulling your score down.`, action: "Request verification for your pending items." });
          } else {
            setAiInsight({ points: 10, title: "Next Milestone", text: "Verified activity is high.", action: "Connect institutional documents in Settings to reach 'Highly Trusted' status." });
          }

          // Real-time notifications for pending/disputed items
          if (transactions) {
            setNotifications(transactions.filter(t => t.status !== 'Verified').reverse().slice(0, 3).map(t => ({ id: t.id, type: t.status, client: t.client_name || 'Client' })));
          }

          // 2. REAL-TIME CHART LOGIC (Mapping actual transaction growth)
          const trend = [];
          if (totalTx === 0) {
             trend.push({ month: 'Start', score: 0 }, { month: 'Now', score: 0 });
          } else {
            // Group transactions by month to see real score growth over time
            const sortedByDate = [...transactions].sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
            sortedByDate.forEach((tx, index) => {
              const txDate = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short' });
              const cumulativeTotal = index + 1;
              const cumulativeVerified = sortedByDate.slice(0, cumulativeTotal).filter(t => t.status === 'Verified').length;
              const runningVRate = Math.round((cumulativeVerified / cumulativeTotal) * 100);
              const runningScore = Math.min(100, (cumulativeTotal * 3) + Math.round((runningVRate / 100) * 40));
              
              trend.push({ month: txDate, score: runningScore });
            });
          }
          setDynamicTrendData(trend);
        }
      } catch (err) { console.error("Sync Error:", err); }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  // Percentile Logic: Now purely based on score vs a static market average (70)
  const percentile = stats.score === 0 ? 100 : Math.max(1, 100 - stats.score);

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white font-bold"><ShieldCheck size={20} /></div>
          <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
        </div>
        <nav className="space-y-1">
          <Link to="/dashboard"><NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" /></Link>
          <Link to="/transaction-dashboard"><NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" /></Link>
          <Link to="/log-new-transaction"><NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" /></Link>
          <Link to="/trust-score"><NavItem icon={<ShieldCheck size={18}/>} label="Trust Score" active /></Link>
          <Link to="/trust-report"><NavItem icon={<FileText size={18}/>} label="Report" /></Link>
          <Link to="/settings"><NavItem icon={<Settings size={18}/>} label="Settings" /></Link>
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-slate-100">
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-rose-500 font-medium transition-colors w-full"><LogOut size={18} /> <span>Log out</span></button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700 relative overflow-x-hidden">
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-30"><SidebarContent /></aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 w-full">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-10">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">Trust Score Analysis</h1>
            <p className="text-[11px] md:text-sm text-slate-400 font-medium tracking-tight">Real-time credibility sync for {stats.businessName}.</p>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 bg-white rounded-full border border-slate-200 text-slate-400">
               <Bell size={20} />
               {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
             </button>
             <img src={`https://ui-avatars.com/api/?name=${stats.avatarName}&background=1e40af&color=fff`} className="w-10 h-10 rounded-full border border-slate-200" alt="profile" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Main Score Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-4 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="40%" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                <motion.circle cx="50%" cy="50%" r="40%" stroke="#1e40af" strokeWidth="12" fill="transparent" strokeDasharray="251" initial={{ strokeDashoffset: 251 }} animate={{ strokeDashoffset: 251 * (1 - (stats.score / 100)) }} transition={{ duration: 1.5 }} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800">{stats.score}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Trust Score</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center font-bold">Top <span className="text-blue-600">{percentile}%</span> of new businesses</p>
          </motion.div>

          {/* Real-time Trend Chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[300px]">
            <h3 className="font-bold text-slate-800 mb-6">Verified Growth Trend</h3>
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicTrendData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1e40af" stopOpacity={0.1}/><stop offset="95%" stopColor="#1e40af" stopOpacity={0}/></linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#1e40af" strokeWidth={3} fill="url(#scoreGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Insight Advisor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 bg-[#EEF2FF] rounded-[32px] p-8 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
               <Zap size={18} className="text-blue-600" fill="currentColor"/>
               <h3 className="font-bold text-slate-800">AI Trust Advisor</h3>
            </div>
            <h2 className="text-2xl font-black text-[#1e40af] mb-2">{aiInsight.title}</h2>
            <p className="text-sm text-slate-600 mb-6">{aiInsight.text}</p>
            <div className="p-4 bg-white rounded-2xl border border-blue-100 text-xs font-medium text-slate-700">
               <span className="font-black text-blue-600 uppercase mr-2">Action:</span> {aiInsight.action}
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#1e3a8a] rounded-[32px] p-8 text-white flex flex-col justify-between">
             <h3 className="text-lg font-bold mb-2 tracking-tight">Trust Verification</h3>
             <p className="text-blue-100/70 text-xs leading-relaxed mb-6">Export your verified transaction history as an institutional PDF report.</p>
             <button onClick={() => navigate('/trust-report')} className="w-full bg-white text-[#1e40af] py-3 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-all">Generate Report</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <MetricCard label="Verification Rate" value={`${stats.verificationRate}%`} color="bg-blue-600" />
          <MetricCard label="Account Age" value={stats.accountAge} color="bg-indigo-500" />
          <MetricCard label="Tx Volume" value={stats.txVolume} color="bg-amber-500" />
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all font-bold text-sm ${active ? 'bg-[#f1f5f9] text-[#1e40af]' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon} <span>{label}</span>
  </div>
);

const MetricCard = ({ label, value, color }) => (
  <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{label}</p>
    <p className="text-3xl font-black text-slate-800 mb-4">{value}</p>
    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
      <div className={`${color} h-full transition-all duration-1000`} style={{ width: value.includes('%') ? value : '20%' }}></div>
    </div>
  </div>
);

export default TrustScore;
