import React, { useEffect, useState } from 'react'; // Updated imports
import { 
  LayoutDashboard, ArrowRightLeft, PlusCircle, ShieldCheck, 
  FileText, Settings, LogOut, Search, Bell, TrendingUp, 
  Zap, ChevronRight, Link as LinkIcon, Upload, BarChart3,
  Menu, // Imported for mobile
  X     // Imported for mobile
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase'; // 1. CONNECTED: Import Supabase Client

// Mock data for the historical trend chart
const trendData = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 75 },
  { month: 'Apr', score: 82 },
  { month: 'May', score: 85 },
  { month: 'Jun', score: 88 },
];

const TrustScore = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile state

  // State for dynamic metrics
  const [stats, setStats] = useState({
    businessName: 'Loading...',
    score: 0,
    verificationRate: '0%',
    accountAge: '0y',
    txVolume: '0%',
    isLoading: true
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
        const userId = session.user.id;

        // Fetch Profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('business_name, created_at')
          .eq('id', userId)
          .single();

        // Fetch Transactions
        const { data: transactions } = await supabase
          .from('transactions')
          .select('status, amount')
          .eq('user_id', userId);

        if (profile && transactions) {
          const totalTx = transactions.length;
          const verifiedTx = transactions.filter(t => t.status === 'Verified').length;
          
          const vRate = totalTx > 0 ? Math.round((verifiedTx / totalTx) * 100) : 100;
          const joinDate = new Date(profile.created_at);
          const years = ((new Date() - joinDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
          const calculatedScore = Math.min(100, 70 + (vRate * 0.2) + (Math.min(totalTx, 10)));
          const volPercent = Math.min(95, 60 + (totalTx * 2));

          setStats({
            businessName: profile.business_name || 'Your Business',
            score: Math.round(calculatedScore),
            verificationRate: `${vRate}%`,
            accountAge: `${years}y`,
            txVolume: `${volPercent}%`,
            isLoading: false
          });
        }
      } catch (err) {
        console.error("Error fetching score data:", err);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Reusable Sidebar Content
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
          <NavItem icon={<Settings size={18}/>} label="Settings" />
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-slate-100">
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-slate-600 font-medium transition-colors w-full text-left">
          <LogOut size={18} /> <span>Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700 relative overflow-x-hidden">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
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

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-10 w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-white rounded-lg border border-slate-200 text-slate-600"><Menu size={20} /></button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight text-center md:text-left">Trust Score Analysis</h1>
              <p className="text-[11px] md:text-sm text-slate-400 font-medium">Real-time breakdown of {stats.businessName}'s institutional credibility.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Search insights..." className="w-full pl-12 pr-4 py-2.5 rounded-full border-none bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-500/10 outline-none" />
            </div>
            <Bell size={20} className="text-slate-300 cursor-pointer hover:text-slate-500 transition-colors shrink-0" />
          </div>
        </header>

        {/* Top Section: Gauge and Trend - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-4 bg-white p-8 rounded-[32px] border border-white shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[10px] font-black uppercase">+2.4% ↑</div>
            <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="40%" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                <motion.circle cx="50%" cy="50%" r="40%" stroke="#1e40af" strokeWidth="12" fill="transparent" strokeDasharray="251" initial={{ strokeDashoffset: 251 }} animate={{ strokeDashoffset: 251 * (1 - (stats.score / 100)) }} transition={{ duration: 2, ease: "easeOut" }} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-slate-800">{stats.score}</span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">Highly Trusted</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center font-medium max-w-[200px]">{stats.businessName}'s score is in the <span className="text-blue-600 font-bold">top 5%</span> of institutional accounts.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[32px] border border-white shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-800">Historical Trust Trend</h3>
              <select className="bg-slate-50 border-none text-[10px] font-black text-slate-400 rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                <option>Last 6 Months</option>
              </select>
            </div>
            <div className="w-full" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs><linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1e40af" stopOpacity={0.1}/><stop offset="95%" stopColor="#1e40af" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8', fontWeight: 600}} dy={10} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="score" stroke="#1e40af" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* AI Advisor Card - Responsive Stack */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-8">
          <div className="lg:col-span-8 bg-[#EEF2FF] rounded-[24px] md:rounded-[32px] p-6 md:p-8 relative overflow-hidden flex flex-col sm:flex-row shadow-sm gap-6">
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600 shrink-0"><Zap size={20} fill="currentColor" /></div>
                <h3 className="font-bold text-slate-800 text-sm md:text-base">AI Trust Advisor</h3>
                <span className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0">AI <ChevronRight size={10} /></span>
              </div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Predictive Score Growth</p>
              <h2 className="text-2xl md:text-3xl font-black text-[#1e40af] mb-4">+12 Points Available ✨</h2>
              <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed max-w-sm">"Based on your current transaction velocity, we project a 4-point increase by targeting specific verification gaps."</p>
            </div>
            <div className="relative z-10 flex-1 bg-white/40 backdrop-blur-md rounded-2xl p-5 md:p-6 border border-white/50">
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter block mb-3">+12 POINTS AVAILABLE ↗</span>
               <p className="text-[10px] md:text-[11px] text-slate-600 leading-relaxed font-medium">
                  <span className="font-black text-slate-800">AI suggests:</span> Verify your latest tax residency to unlock <span className="text-blue-600 font-bold">+12 Points</span> status and reduced fees.
               </p>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#1e40af] rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-white flex flex-col justify-between shadow-xl gap-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Benchmarking</h3>
              <p className="text-blue-100/60 text-xs leading-relaxed">Compare your trust profile with top-tier firms.</p>
            </div>
            <button onClick={() => navigate('/trust-report')} className="bg-white text-[#1e40af] w-full py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-md">Generate Report →</button>
          </div>
        </motion.div>

        {/* Score Breakdown Metrics - Responsive Grid */}
        <h3 className="text-lg font-black text-slate-900 mb-6">Score Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-10">
          <MetricCard label="Verification Rate" value={stats.verificationRate} color="bg-blue-600" />
          <MetricCard label="Account Age" value={stats.accountAge} color="bg-purple-500" sub="Growing monthly" />
          <MetricCard label="Tx Volume" value={stats.txVolume} color="bg-orange-500" sub="Consistent activity" />
        </div>

        {/* Action List - Horizontal scrolling for ActionRow if needed */}
        <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-white shadow-sm overflow-hidden mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-2">
             <h3 className="font-bold text-slate-800">How to improve your score</h3>
             <span className="text-[10px] font-black text-blue-600 uppercase">Estimated Improvement: <span className="text-xs md:text-sm font-black ml-1">+12 Points ✨</span></span>
          </div>
          <div className="space-y-4">
            <ActionRow icon={<LinkIcon size={16}/>} title="Verify LinkedIn" desc="Add institutional social proof" points="+5 pts" btnText="Connect" />
            <ActionRow icon={<BarChart3 size={16}/>} title="Log 5 Transactions" desc="Reach 'Frequent Trader' tier" points="+4 pts" isProgress />
            <ActionRow icon={<FileText size={16}/>} title="Update Tax Doc" desc="Expires in 12 days" points="+3 pts" btnText="Upload" />
          </div>
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all font-bold text-sm ${active ? 'bg-[#EBF2FF] text-[#003399]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
    {icon} <span>{label}</span>
  </div>
);

const MetricCard = ({ label, value, color, sub = "Max impact on score" }) => (
  <div className="bg-white p-6 rounded-3xl border border-white shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      <div className={`p-2 rounded-lg bg-slate-50 text-slate-400`}><TrendingUp size={16} /></div>
      <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{label}</p>
    </div>
    <div className="flex items-end justify-between mb-4">
      <p className="text-2xl md:text-3xl font-black text-slate-800">{value}</p>
      <p className="text-[10px] text-slate-400 font-bold hidden md:block">{sub}</p>
    </div>
    <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full`} style={{ width: value.includes('%') ? value : '60%' }}></div>
    </div>
  </div>
);

const ActionRow = ({ icon, title, desc, points, btnText, isProgress }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50/30 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition-all group gap-4">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
      <span className="text-sm font-black text-emerald-500 tracking-tighter">{points}</span>
      {isProgress ? (
        <div className="w-20 md:w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden shrink-0"><div className="bg-blue-600 h-full w-[40%]"></div></div>
      ) : (
        <button className={`px-4 py-1.5 rounded-lg text-[10px] md:text-[11px] font-black uppercase transition-all shadow-sm active:scale-95 shrink-0 ${btnText === 'Connect' ? 'bg-[#1e40af] text-white shadow-blue-900/20' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
          {btnText}
        </button>
      )}
    </div>
  </div>
);

export default TrustScore;