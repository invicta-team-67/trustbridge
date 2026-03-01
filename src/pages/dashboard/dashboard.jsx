  import React, { useEffect, useState } from 'react'; 
  import { 
    LayoutDashboard, CreditCard, PlusSquare, ShieldCheck, 
    FileText, Settings, LogOut, Bell, Search, AlertCircle, 
    ArrowUpRight, ArrowDownRight, Zap, Download, ChevronRight,
    Menu, X 
  } from 'lucide-react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { Link, useNavigate } from 'react-router-dom';
  import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
  import { supabase } from '../../lib/supabase'; // <-- CONNECTED TO DB

  const transactionData = [
    { day: 'Mon', amount: 320 },
    { day: 'Tue', amount: 280 },
    { day: 'Wed', amount: 550 },
    { day: 'Thu', amount: 300 },
    { day: 'Fri', amount: 210 },
    { day: 'Sat', amount: 240 },
    { day: 'Sun', amount: 350 },
  ];

  const TrustBridgeDashboard = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      score: 70 // Fallback starting score
    });
  // 1. CONNECTED: Auth Guard & Data Fetching
  useEffect(() => {
      const fetchDashboardData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }

        try {
          const userId = session.user.id;

          // 1. Fetch Profile Data
          const { data: profile } = await supabase
            .from('profiles')
            .select('business_name, business_type')
            .eq('user_id', userId)
            .maybeSingle();

          if (profile) {
            setUserData({
              name: profile.business_name || 'My Business',
              role: (profile.business_type || 'Verified Merchant').replace('_', ' '),
              avatarName: (profile.business_name || 'User').split(' ').join('+')
            });
          }

          // 2. Fetch Transaction Counts for the Stat Cards
          const { data: txData } = await supabase
            .from('transactions')
            .select('status')
            .eq('user_id', userId);

          if (txData) {
            const total = txData.length;
            const verified = txData.filter(t => t.status === 'Verified').length;
            const disputed = txData.filter(t => t.status === 'Disputed').length;
            
            // Calculate a live score based on verification rate (Demo Logic)
            const vRate = total > 0 ? (verified / total) : 0;
            const liveScore = Math.min(100, 70 + (vRate * 20) + (Math.min(total, 10)));

            setStats({ total, verified, disputed, score: Math.round(liveScore) });
          }
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
        }
      };

      fetchDashboardData();
    }, [navigate]);

    // 2. CONNECTED: Logout Logic
    const handleLogout = async () => {
      await supabase.auth.signOut();
      navigate('/login');
    };

    const containerVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
      }
    };

    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      show: { y: 0, opacity: 1 }
    };

    // Reusable Sidebar Content
    const SidebarContent = () => (
      <>
        <div className="p-8 flex items-center gap-2">
          <div className="bg-[#003399] p-1.5 rounded-lg">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#001B4D]">TrustBridge</h1>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          </Link>
          <Link to="/transaction-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<CreditCard size={20}/>} label="Transaction" />
          </Link>
          <Link to="/log-new-transaction" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<PlusSquare size={20}/>} label="Add Transaction" />
          </Link>
          <Link to="/trust-score" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<ShieldCheck size={20}/>} label="Trust Score" />
          </Link>
          <Link to="/trust-report" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<FileText size={20}/>} label="Report" />
          </Link>
  <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
    <NavItem icon={<Settings size={20}/>} label="Settings" />
  </Link>
        </nav>

        <div className="p-8">
          <button 
            onClick={handleLogout} // <-- Connected Logout
            className="flex items-center gap-3 text-slate-400 hover:text-rose-500 transition-all font-medium w-full text-left"
          >
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </>
    );

    return (
      <div className="flex min-h-screen bg-[#F4F7FE] font-sans text-slate-700 relative overflow-x-hidden">
        
        {/* --- DESKTOP SIDEBAR (Hidden on mobile) --- */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col fixed h-full z-10">
          <SidebarContent />
        </aside>

        {/* --- MOBILE SIDEBAR DRAWER --- */}
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

        {/* --- MAIN CONTENT --- */}
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 w-full"
        >
          {/* Top Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Home</span> <ChevronRight size={14}/> <span className="text-slate-800 font-semibold">Dashboard</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-12 pr-4 py-2.5 rounded-full border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500/10 text-sm"
                />
              </div>
  <div className="flex items-center gap-3 border-l pl-0 sm:pl-6 border-slate-200">
                    <div className="text-right hidden sm:block">
                      {/* DYNAMIC NAME AND ROLE */}
                      <p className="text-sm font-bold text-slate-800 leading-none">{userData.name}</p>
                      <p className="text-[11px] text-slate-400 mt-1 capitalize">{userData.role}</p>
                    </div>
                    {/* DYNAMIC AVATAR IMAGE */}
                    <img 
                      src={`https://ui-avatars.com/api/?name=${userData.avatarName}&background=003399&color=fff`} 
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md" 
                      alt="profile" 
                    />
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
    cx="50%" cy="50%" r="45%" stroke="#003399" strokeWidth="12" fill="transparent"
    strokeDasharray="402.12" 
    initial={{ strokeDashoffset: 402.12 }}
    animate={{ strokeDashoffset: 402.12 * (1 - (stats.score / 100)) }} // DYNAMIC SCORE
    transition={{ duration: 1.5, ease: "easeOut" }}
    strokeLinecap="round"
  />
  ...
  <span className="text-2xl md:text-3xl font-black text-slate-800">{stats.score}%</span>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl md:text-3xl font-black text-slate-800">85%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">2 Months</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Overall Trust Score</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
                  Your business trust rating has improved by <span className="text-emerald-500 font-bold">4 points</span> since last month. High verification rates are positively impacting your score.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
                  <button 
                    onClick={() => navigate('/trust-report')}
                    className="bg-[#003399] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200"
                  >
                    View Detailed Report
                  </button>
                  <button className="border border-blue-100 text-[#003399] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all">Download</button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-4 bg-[#003399] p-6 md:p-8 rounded-[32px] text-white flex flex-col justify-between shadow-xl shadow-blue-900/10">
              <div className="mb-6 lg:mb-0">
                <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
                <p className="text-blue-200 text-sm leading-snug">Instantly log new transactions or manage pending notifications.</p>
              </div>
              <button 
                onClick={() => navigate('/log-new-transaction')}
                className="w-full bg-white text-[#003399] py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-50 transition-transform active:scale-95"
              >
                <PlusSquare size={20} />
                Log New Transaction
              </button>
            </motion.div>
          </div>

          {/* Priority Alert Box */}
          <motion.div variants={itemVariants} className="bg-[#EBF2FF] border border-[#D0E0FF] p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2.5 rounded-xl shadow-sm text-[#003399] shrink-0">
                <AlertCircle size={22} />
              </div>
              <p className="text-sm font-medium text-slate-600">
                <span className="font-bold text-slate-800">Priority Alert</span> &nbsp; Verification pending for "TechSolutions Inc" transaction (₦68,500). Needs immediate review.
              </p>
            </div>
            <button 
              onClick={() => navigate('/transaction-verification')}
              className="bg-[#003399] text-white px-6 py-2 rounded-xl text-xs font-black shadow-md hover:bg-blue-800 w-full sm:w-auto"
            >
              Review Now
            </button>
          </motion.div>

          {/* Stats & Growth Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            <div className="lg:col-span-9 space-y-8">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <StatCard label="Total Transactions" value={stats.total.toLocaleString()} change="+1" up />
    <StatCard label="Verified" value={stats.verified.toLocaleString()} change="+0" up />
    <StatCard label="Disputed" value={stats.disputed.toLocaleString()} change="0" />
  </div>

              {/* Growth Chart */}
              <motion.div variants={itemVariants} className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-white">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-slate-800">Transaction Growth</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg cursor-pointer">
                    Last 30 Days <ChevronRight className="rotate-90" size={14}/>
                  </div>
                </div>
                <div className="h-[250px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={transactionData}>
                      <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#003399" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#003399" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#94A3B8', fontWeight: 600}} 
                        dy={15} 
                      />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#003399" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorAmt)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* AI Insights Panel */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm h-full border border-white">
                  <div className="flex items-center gap-2 mb-8">
                    <Zap size={20} className="text-blue-500 fill-blue-500" />
                    <h3 className="font-bold text-slate-800">AI Insights</h3>
                  </div>
                  <div className="space-y-5">
                    <InsightCard type="warning" title="Medium Risk Detected" desc="High risk patterns detected in 3 recent transfers from new IP locations." />
                    <InsightCard type="info" title="Improve Score" desc="Verify past obscure company profile to increase your Trust Score by +5 points." />
                    <InsightCard type="success" title="Verification Tip" desc="Enable 2FA for all team members to satisfy security audit requirements." />
                  </div>
                  <button className="w-full text-center mt-12 text-xs font-bold text-slate-400 hover:text-blue-600 transition-all uppercase tracking-widest">View All Insights</button>
              </div>
            </motion.div>
          </div>

          {/* --- RECENT TRANSACTION TABLE --- */}
          <motion.div variants={itemVariants} className="bg-white rounded-[32px] shadow-sm border border-white overflow-hidden mb-10">
            <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center border-b border-slate-50 gap-4">
              <h3 className="text-lg font-bold text-slate-800">Recent Transaction</h3>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-5 py-2 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50">
                  <Download size={16}/> Export CSV
                </button>
                <button 
                  onClick={() => navigate('/log-new-transaction')}
                  className="flex items-center gap-2 px-5 py-2 bg-[#003399] rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-100"
                >
                  <PlusSquare size={16}/> New Transaction
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-[#F8FAFC]">
                  <tr className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    <th className="px-8 py-5">Client</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <TableRow name="Nexus Labs" amount="₦45,200.00" status="Verified" date="January 24, 2026" color="bg-blue-500" onAction={() => navigate('/transaction-receipt')} />
                  <TableRow name="Apex Ventures" amount="₦12,300.00" status="Pending" date="February 12, 2026" color="bg-purple-500" onAction={() => navigate('/transaction-receipt')} />
                  <TableRow name="TechSolutions Inc" amount="₦68,500.00" status="Blocked" date="December 21, 2025" color="bg-orange-500" onAction={() => navigate('/transaction-receipt')} />
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Promo Footer */}
          <motion.div variants={itemVariants} className="bg-[#000F2E] rounded-[32px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-center text-white gap-6 text-center md:text-left">
            <div className="z-10">
                <h4 className="text-2xl font-bold mb-2">Ready for more advanced insights?</h4>
                <p className="text-slate-400 text-sm">Upgrade to Enterprise Pro to unlock detailed analytics and priority support.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 z-10 w-full md:w-auto">
                <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-sm hover:shadow-xl transition-all">Upgrade Plan</button>
                <button className="bg-slate-800/50 backdrop-blur-md px-8 py-3 rounded-2xl font-black text-sm border border-slate-700">Dismiss</button>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
          </motion.div>
        </motion.main>
      </div>
    );
  };

  // --- SUB-COMPONENTS ---

  const NavItem = ({ icon, label, active = false }) => (
    <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all font-bold text-sm ${active ? 'bg-[#EBF2FF] text-[#003399]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
      {icon} <span>{label}</span>
    </div>
  );

  const StatCard = ({ label, value, change, up = false }) => (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 md:p-8 rounded-[32px] border border-white shadow-sm flex-1">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><CreditCard size={20} /></div>
        <div className={`flex items-center gap-1 text-xs font-black ${up ? 'text-emerald-500' : 'text-rose-500'}`}>{change} {up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}</div>
      </div>
      <p className="text-[10px] font-black text-slate-300 uppercase mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-800">{value}</p>
    </motion.div>
  );

  const InsightCard = ({ type, title, desc }) => {
    const styles = {
      warning: "bg-orange-50 border-orange-100 text-orange-800",
      info: "bg-blue-50 border-blue-100 text-blue-800",
      success: "bg-emerald-50 border-emerald-100 text-emerald-800"
    };
    return (
      <div className={`p-5 rounded-[24px] border ${styles[type]}`}>
        <span className="text-[10px] font-black uppercase block mb-1">{title}</span>
        <p className="text-[11px] font-medium opacity-90">{desc}</p>
      </div>
    );
  };

  const TableRow = ({ name, amount, status, date, color, onAction }) => (
    <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
      <td className="px-8 py-6 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white text-xs font-black`}>{name[0]}</div>
        <span className="text-sm font-bold text-slate-700">{name}</span>
      </td>
      <td className="px-8 py-6 text-sm font-black text-slate-800">{amount}</td>
      <td className="px-8 py-6"><span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-slate-100">{status}</span></td>
      <td className="px-8 py-6">
        <span className="text-sm font-bold text-slate-400 whitespace-nowrap">{date}</span>
      </td>
      <td className="px-8 py-6 text-right">
        <button onClick={onAction} className="text-[#003399] font-black text-xs hover:underline transition-all">View Details</button>
      </td>
    </tr>
  );

  export default TrustBridgeDashboard;
