import React, { useEffect } from 'react'; 
import { 
  LayoutDashboard, CreditCard, PlusSquare, ShieldCheck, 
  FileText, Settings, LogOut, Bell, Search, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Zap, Download, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase'; 

// Data strictly following the chart in your image
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

  // Auth Guard
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkSession();
  }, [navigate]);

  // Logout Logic
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

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans text-slate-700">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-10">
        <div className="p-8 flex items-center gap-2">
          <div className="bg-[#003399] p-1.5 rounded-lg">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#001B4D]">TrustBridge</h1>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-6 space-y-2">
          <Link to="/dashboard">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          </Link>
          <Link to="/transaction-dashboard">
            <NavItem icon={<CreditCard size={20}/>} label="Transaction" />
          </Link>
          <Link to="/log-new-transaction">
            <NavItem icon={<PlusSquare size={20}/>} label="Add Transaction" />
          </Link>
          <Link to="/trust-score">
            <NavItem icon={<ShieldCheck size={20}/>} label="Trust Score" />
          </Link>
          <Link to="/trust-report">
            <NavItem icon={<FileText size={20}/>} label="Report" />
          </Link>
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </nav>

        <div className="p-8">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-rose-500 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 ml-64 p-10"
      >
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2 text-sm text-slate-400">
             <span>Home</span> <ChevronRight size={14}/> <span className="text-slate-800 font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search transactions, clients or reports..." 
                className="w-80 pl-12 pr-4 py-2.5 rounded-full border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500/10 text-sm"
              />
            </div>
            <div className="relative p-2 bg-white rounded-full shadow-sm cursor-pointer">
              <Bell size={20} className="text-slate-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
               <div className="text-right">
                 <p className="text-sm font-bold text-slate-800 leading-none">Alex Bruno</p>
                 <p className="text-[11px] text-slate-400 mt-1">Chief Security Officer</p>
               </div>
               <img src="https://ui-avatars.com/api/?name=Alex+Bruno&background=003399&color=fff" className="w-10 h-10 rounded-full border-2 border-white shadow-md" alt="profile" />
            </div>
          </div>
        </header>

        {/* Hero Cards */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <motion.div variants={itemVariants} className="col-span-8 bg-white p-8 rounded-[32px] flex items-center gap-10 shadow-sm border border-white">
            <div className="relative w-36 h-36">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="72" cy="72" r="64" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                 <motion.circle 
                    cx="72" cy="72" r="64" stroke="#003399" strokeWidth="12" fill="transparent"
                    strokeDasharray="402.12" 
                    initial={{ strokeDashoffset: 402.12 }}
                    animate={{ strokeDashoffset: 402.12 * (1 - 0.85) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-black text-slate-800">85%</span>
                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">2 Months</span>
               </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Overall Trust Score</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                Your business trust rating has improved by <span className="text-emerald-500 font-bold">4 points</span> since last month. High verification rates are positively impacting your score.
              </p>
              <div className="flex gap-4 mt-6">
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

          <motion.div variants={itemVariants} className="col-span-4 bg-[#003399] p-8 rounded-[32px] text-white flex flex-col justify-between shadow-xl shadow-blue-900/10">
            <div>
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
        <motion.div variants={itemVariants} className="bg-[#EBF2FF] border border-[#D0E0FF] p-5 rounded-2xl flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-xl shadow-sm text-[#003399]">
              <AlertCircle size={22} />
            </div>
            <p className="text-sm font-medium text-slate-600">
              <span className="font-bold text-slate-800">Priority Alert</span> &nbsp; Verification pending for "TechSolutions Inc" transaction (₦68,500). Needs immediate review.
            </p>
          </div>
          <button 
            onClick={() => navigate('/transaction-verification')}
            className="bg-[#003399] text-white px-6 py-2 rounded-xl text-xs font-black shadow-md hover:bg-blue-800"
          >
            Review Now
          </button>
        </motion.div>

        {/* Stats & Growth Section */}
        <div className="grid grid-cols-12 gap-8 mb-10">
          <div className="col-span-9 space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <StatCard label="Total Transactions" value="1,284" change="+12%" up />
              <StatCard label="Verified" value="1,240" change="+8%" up />
              <StatCard label="Disputed" value="12" change="-2%" />
            </div>

            {/* Growth Chart */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] shadow-sm border border-white">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-slate-800">Transaction Growth</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg cursor-pointer">
                  Last 30 Days <ChevronRight className="rotate-90" size={14}/>
                </div>
              </div>
              <div className="h-[300px] w-full">
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
          <motion.div variants={itemVariants} className="col-span-3">
             <div className="bg-white p-8 rounded-[32px] shadow-sm h-full border border-white">
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
          <div className="p-8 flex justify-between items-center border-b border-slate-50">
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
            <table className="w-full text-left">
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
                <TableRow 
                  name="Nexus Labs" amount="₦45,200.00" status="Verified" date="January 24, 2026" color="bg-blue-500" 
                  onClick={() => navigate('/transaction-receipt')} 
                />
                <TableRow 
                  name="Apex Ventures" amount="₦12,300.00" status="Pending" date="February 12, 2026" color="bg-purple-500" 
                  onClick={() => navigate('/transaction-receipt')} 
                />
                <TableRow 
                  name="TechSolutions Inc" amount="₦68,500.00" status="Blocked" date="December 21, 2025" color="bg-orange-500" 
                  onClick={() => navigate('/transaction-receipt')} 
                />
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Promo Footer */}
        <motion.div variants={itemVariants} className="bg-[#000F2E] rounded-[32px] p-10 relative overflow-hidden flex justify-between items-center text-white">
           <div className="z-10">
              <h4 className="text-2xl font-bold mb-2">Ready for more advanced insights?</h4>
              <p className="text-slate-400 text-sm">Upgrade to Enterprise Pro to unlock detailed analytics and priority support.</p>
           </div>
           <div className="flex gap-4 z-10">
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
    {icon}
    <span>{label}</span>
  </div>
);

const StatCard = ({ label, value, change, up = false }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[32px] border border-white shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
        <CreditCard size={20} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-black ${up ? 'text-emerald-500' : 'text-rose-500'}`}>
        {change} {up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
      </div>
    </div>
    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</p>
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
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-black uppercase tracking-tighter">{title}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>
      </div>
      <p className="text-[11px] font-medium leading-relaxed opacity-90">{desc}</p>
    </div>
  );
};

const TableRow = ({ name, amount, status, date, color, onClick }) => (
  <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
    <td className="px-8 py-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white text-xs font-black`}>
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="text-sm font-bold text-slate-700">{name}</span>
      </div>
    </td>
    <td className="px-8 py-6 text-sm font-black text-slate-800">{amount}</td>
    <td className="px-8 py-6">
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${
        status === 'Verified' ? 'bg-emerald-100 text-emerald-600' : 
        status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-rose-100 text-rose-600'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-8 py-6 text-sm font-bold text-slate-400">{date}</td>
    <td className="px-8 py-6">
      <button onClick={onClick} className="text-[#003399] font-black text-xs hover:underline">View Details</button>
    </td>
  </tr>
);

export default TrustBridgeDashboard;