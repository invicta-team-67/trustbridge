import React, { useEffect } from 'react'; // Added useEffect
import { 
  LayoutDashboard, ArrowRightLeft, PlusCircle, ShieldCheck, 
  FileText, Settings, LogOut, Search, Bell, TrendingUp, 
  Zap, ChevronRight, Link as LinkIcon, Upload, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
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

  // 2. CONNECTED: Auth Guard - Ensures only logged-in users access the score analysis
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
              <NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" />
            </Link>
            <Link to="/trust-score">
              <NavItem icon={<ShieldCheck size={18}/>} label="Trust Score" active />
            </Link>
            <Link to="/trust-report">
              <NavItem icon={<FileText size={18}/>} label="Report" />
            </Link>
            <NavItem icon={<Settings size={18}/>} label="Settings" />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout} // CONNECTED: Sign out from Supabase
            className="flex items-center gap-3 text-slate-400 hover:text-slate-600 font-medium transition-colors w-full text-left"
          >
            <LogOut size={18} /> <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Trust Score Analysis</h1>
            <p className="text-sm text-slate-400 font-medium">Real-time breakdown of Acme Corp's institutional credibility.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search insights..." 
                className="w-64 pl-12 pr-4 py-2.5 rounded-full border-none bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
              />
            </div>
            <Bell size={20} className="text-slate-300 cursor-pointer hover:text-slate-500 transition-colors" />
          </div>
        </header>

        {/* Top Section: Gauge and Trend */}
        <div className="grid grid-cols-12 gap-8 mb-8">
          {/* Circular Score Gauge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="col-span-4 bg-white p-8 rounded-[32px] border border-white shadow-sm flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[10px] font-black uppercase">
              +2.4% ↑
            </div>
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                <motion.circle 
                  cx="96" cy="96" r="80" stroke="#1e40af" strokeWidth="12" fill="transparent"
                  strokeDasharray="502.65" initial={{ strokeDashoffset: 502.65 }}
                  animate={{ strokeDashoffset: 502.65 * (1 - 0.88) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-800">88</span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">Highly Trusted</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center font-medium max-w-[200px]">
              Acme Corp's score is in the <span className="text-blue-600 font-bold">top 5%</span> of institutional accounts in your region.
            </p>
          </motion.div>

          {/* Historical Trend Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="col-span-8 bg-white p-8 rounded-[32px] border border-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-800">Historical Trust Trend</h3>
              <select className="bg-slate-50 border-none text-[10px] font-black text-slate-400 rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                <option>Last 6 Months</option>
              </select>
            </div>
            <div className="w-full" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e40af" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8', fontWeight: 600}} dy={10} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="score" stroke="#1e40af" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* AI Advisor Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-12 gap-8 mb-8"
        >
          <div className="col-span-8 bg-[#EEF2FF] rounded-[32px] p-8 relative overflow-hidden flex shadow-sm">
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600">
                  <Zap size={20} fill="currentColor" />
                </div>
                <h3 className="font-bold text-slate-800">AI Trust Advisor</h3>
                <span className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                  AI <ChevronRight size={10} />
                </span>
              </div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Predictive Score Growth</p>
              <h2 className="text-3xl font-black text-[#1e40af] mb-4">+12 Points Available ✨</h2>
              <p className="text-xs text-slate-500 leading-relaxed max-sm:max-w-none max-w-sm">
                "Based on your current transaction velocity, we project a 4-point increase by targeting specific verification gaps."
              </p>
            </div>
            <div className="relative z-10 flex-1 bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">+12 POINTS AVAILABLE ↗</span>
               </div>
               <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  <span className="font-black text-slate-800">AI suggests:</span> Verify your latest tax residency to unlock <span className="text-blue-600 font-bold">+12 Points Available</span> trust status and reduced escrow fees.
               </p>
            </div>
          </div>

          <div className="col-span-4 bg-[#1e40af] rounded-[32px] p-8 text-white flex flex-col justify-between shadow-xl shadow-blue-900/10">
            <div>
              <h3 className="text-lg font-bold mb-2">Institutional Benchmarking</h3>
              <p className="text-blue-100/60 text-xs leading-relaxed">Compare your trust profile with top-tier hedge funds and VC firms.</p>
            </div>
            <button 
              onClick={() => navigate('/trust-report')} // Connected Routing
              className="bg-white text-[#1e40af] w-full py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-md active:scale-95"
            >
              Generate Report →
            </button>
          </div>
        </motion.div>

        {/* Score Breakdown Metrics */}
        <h3 className="text-lg font-black text-slate-900 mb-6">Score Breakdown</h3>
        <div className="grid grid-cols-3 gap-8 mb-10">
          <MetricCard label="Verification Rate" value="98%" color="bg-blue-600" />
          <MetricCard label="Account Age" value="2.4y" color="bg-purple-500" sub="Growing monthly" />
          <MetricCard label="Tx Volume" value="81%" color="bg-orange-500" sub="Consistent activity detected" />
        </div>

        {/* Improvement Action List */}
        <div className="bg-white rounded-[32px] p-8 border border-white shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <h3 className="font-bold text-slate-800">How to improve your score</h3>
             <span className="text-[10px] font-black text-blue-600 uppercase">Estimated Improvement: <span className="text-sm font-black ml-1">+12 Points Available ✨</span></span>
          </div>
          <div className="space-y-4">
            <ActionRow icon={<LinkIcon size={16}/>} title="Verify your LinkedIn profile" desc="Add institutional social proof to your account" points="+5 pts" btnText="Connect" />
            <ActionRow icon={<BarChart3 size={16}/>} title="Log 5 more transactions this month" desc="Reach the 'Frequent Trader' consistency tier" points="+4 pts" isProgress />
            <ActionRow icon={<FileText size={16}/>} title="Update Tax Residency Document" desc="Your current certificate expires in 12 days" points="+3 pts" btnText="Upload" />
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

const MetricCard = ({ label, value, color, sub = "Maximum impact on score" }) => (
  <div className="bg-white p-6 rounded-3xl border border-white shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      <div className={`p-2 rounded-lg bg-slate-50 text-slate-400`}>
        <TrendingUp size={16} />
      </div>
      <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{label}</p>
    </div>
    <div className="flex items-end justify-between mb-4">
      <p className="text-3xl font-black text-slate-800">{value}</p>
      <p className="text-[10px] text-slate-400 font-bold">{sub}</p>
    </div>
    <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full`} style={{ width: value.includes('%') ? value : '60%' }}></div>
    </div>
  </div>
);

const ActionRow = ({ icon, title, desc, points, btnText, isProgress }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50/30 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <span className="text-sm font-black text-emerald-500 tracking-tighter">{points}</span>
      {isProgress ? (
        <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
           <div className="bg-blue-600 h-full w-[40%]"></div>
        </div>
      ) : (
        <button className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all shadow-sm active:scale-95 ${btnText === 'Connect' ? 'bg-[#1e40af] text-white shadow-blue-900/20' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
          {btnText}
        </button>
      )}
    </div>
  </div>
);


export default TrustScore;