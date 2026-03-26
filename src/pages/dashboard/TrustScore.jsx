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
  const [aiInsight, setAiInsight] = useState({ points: 0, title: 'Analyzing...', text: 'Fetching ledger data...', action: '...' });
  const [dynamicTrendData, setDynamicTrendData] = useState([]);
  const [stats, setStats] = useState({
    businessName: '...',
    avatarName: 'U',
    score: 0,
    verificationRate: 0, 
    accountAge: '0y',
    txVolume: '0%',
    totalTransactions: 0,
    linkedinVerified: false,
    taxVerified: false,
    isLoading: true
  });

  // 1. REAL-TIME DATA & SCORE CALCULATION
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
          
          // --- SCRATCH SCORE MATH (Max 100) ---
          let earnedScore = 0;
          earnedScore += Math.min(totalTx * 3, 30); // Activity (Max 30)
          earnedScore += Math.round((vRate / 100) * 40); // Verification (Max 40)
          if (profile.linkedin_verified) earnedScore += 15; // Social proof
          if (profile.tax_verified) earnedScore += 15; // Institutional proof
          
          const joinDate = new Date(profile.created_at || new Date());
          const years = ((new Date() - joinDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);

          setStats({
            businessName: profile.business_name || 'Your Business',
            avatarName: (profile.business_name || 'U').split(' ').join('+'),
            score: earnedScore,
            verificationRate: vRate,
            accountAge: `${years}y`,
            txVolume: `${Math.min(100, Math.round((totalTx / 15) * 100))}%`, 
            totalTransactions: totalTx,
            linkedinVerified: profile.linkedin_verified || false,
            taxVerified: profile.tax_verified || false,
            isLoading: false
          });

          // AI Insights based on real-time gaps
          if (totalTx === 0) {
            setAiInsight({ points: 30, title: "Initial Baseline", text: "Your score is currently 0. Log your first transaction to start building history.", action: "Add a transaction record to unlock your score." });
          } else if (vRate < 80) {
            setAiInsight({ points: 12, title: "Verification Boost", text: "You have pending transactions. Verified records carry 2x more weight.", action: "Request verification from your clients." });
          } else {
            setAiInsight({ points: 15, title: "Identity Verification", text: "Your ledger is healthy. Add institutional proof to reach the next tier.", action: "Connect your LinkedIn profile below." });
          }

          if (transactions) {
            setNotifications(transactions.filter(t => t.status !== 'Verified').reverse().slice(0, 3).map(t => ({ id: t.id, type: t.status, client: t.client_name || 'Client' })));
          }

          // Real-time chart mapping
          const trend = [];
          if (totalTx === 0) {
            trend.push({ month: 'Start', score: 0 }, { month: 'Now', score: 0 });
          } else {
            transactions.forEach((tx, i) => {
              const month = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short' });
              const currentTotal = i + 1;
              const currentVerified = transactions.slice(0, currentTotal).filter(t => t.status === 'Verified').length;
              const currentVRate = (currentVerified / currentTotal);
              const currentScore = Math.min(100, (currentTotal * 3) + Math.round(currentVRate * 40));
              trend.push({ month, score: currentScore });
            });
          }
          setDynamicTrendData(trend);
        }
      } catch (err) { console.error("Sync Error:", err); }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };
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
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-rose-500 font-medium w-full transition-colors"><LogOut size={18} /> <span>Log out</span></button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700 relative overflow-x-hidden">
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-30"><SidebarContent /></aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 w-full">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-10 w-full">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-white rounded-lg border border-slate-200 text-slate-600"><Menu size={20} /></button>
            <div className="truncate">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">Trust Score Analysis</h1>
              <p className="text-[11px] md:text-sm text-slate-400 font-medium truncate">Live sync for {stats.businessName}.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="text-slate-400 cursor-pointer" size={20} />
            <img src={`https://ui-avatars.com/api/?name=${stats.avatarName}&background=1e40af&color=fff`} className="w-10 h-10 rounded-full border border-slate-200" alt="profile" />
          </div>
        </header>

        {/* Score & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-4 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center relative">
            <div className="relative w-40 h-40 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="40%" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                <motion.circle cx="50%" cy="50%" r="40%" stroke="#1e40af" strokeWidth="12" fill="transparent" strokeDasharray="251" initial={{ strokeDashoffset: 251 }} animate={{ strokeDashoffset: 251 * (1 - (stats.score / 100)) }} transition={{ duration: 1.5 }} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-800">{stats.score}</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Earned Points</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center font-bold uppercase tracking-tight">Top <span className="text-blue-600">{percentile}%</span> of new accounts</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Historical Growth</h3>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Data Only</div>
            </div>
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicTrendData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1e40af" stopOpacity={0.1}/><stop offset="95%" stopColor="#1e40af" stopOpacity={0}/></linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="score" stroke="#1e40af" strokeWidth={3} fill="url(#scoreGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* AI Advisor - Premium Look */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 bg-[#EEF2FF] rounded-[32px] p-8 border border-blue-100 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-blue-600" fill="currentColor"/>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">AI Recommendation</h3>
              </div>
              <h2 className="text-2xl font-black text-[#1e40af] mb-2">+{aiInsight.points} Points Available ✨</h2>
              <p className="text-sm text-slate-600 mb-6 max-w-md">{aiInsight.text}</p>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-bold text-[#1e40af] border border-blue-100">
                <ChevronRight size={14} /> {aiInsight.action}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#1e3a8a] rounded-[32px] p-8 text-white flex flex-col justify-between shadow-xl">
             <h3 className="text-lg font-bold mb-2">Trust Ledger</h3>
             <p className="text-blue-100/70 text-xs leading-relaxed mb-6">Generate a verified institutional report of your real-time score and transaction history.</p>
             <button onClick={() => navigate('/trust-report')} className="w-full bg-white text-[#1e40af] py-3 rounded-xl font-black text-sm hover:bg-blue-50 transition-all">Generate Report</button>
          </div>
        </div>

        {/* Metrics Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <MetricCard label="Verification Rate" value={`${stats.verificationRate}%`} color="bg-blue-600" />
          <MetricCard label="Account Age" value={stats.accountAge} color="bg-indigo-500" />
          <MetricCard label="Tx Volume" value={stats.txVolume} color="bg-orange-500" />
        </div>

        {/* Action List - High Quality Component */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Improve Your Credibility</h3>
          <div className="space-y-4">
            <ActionRow 
              icon={<LinkIcon size={18}/>} 
              title="Verify LinkedIn Profile" 
              desc="Add institutional social proof to your trust profile" 
              points="+15 pts" 
              btnText={stats.linkedinVerified ? "Verified" : "Connect"}
              isCompleted={stats.linkedinVerified}
            />
            <ActionRow 
              icon={<BarChart3 size={18}/>} 
              title="Reach 10 Transactions" 
              desc="Unlock higher credibility tiers by logging more activity" 
              points="+10 pts" 
              isProgress 
              progressValue={Math.min(100, Math.round((stats.totalTransactions / 10) * 100))}
            />
            <ActionRow 
              icon={<FileText size={18}/>} 
              title="Institutional Tax ID" 
              desc="Verify your business legal residency status" 
              points="+15 pts" 
              btnText={stats.taxVerified ? "Verified" : "Upload"}
              isCompleted={stats.taxVerified}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all font-bold text-sm ${active ? 'bg-blue-50 text-[#1e40af]' : 'text-slate-500 hover:bg-slate-50'}`}>
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

const ActionRow = ({ icon, title, desc, points, btnText, isProgress, progressValue, isCompleted }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-200 transition-all group gap-4">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'} rounded-xl flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
    </div>
    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
      <span className={`text-[10px] font-black ${isCompleted ? 'text-emerald-500' : 'text-blue-600'} bg-slate-50 px-3 py-1 rounded-lg uppercase`}>{points}</span>
      {isProgress ? (
        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
          <div className="bg-blue-600 h-full" style={{ width: `${progressValue}%` }}></div>
        </div>
      ) : (
        <button disabled={isCompleted} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-[#1e40af] text-white hover:bg-blue-800'}`}>
          {btnText}
        </button>
      )}
    </div>
  </div>
);

export default TrustScore;
