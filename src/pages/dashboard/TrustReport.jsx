import React, { useEffect } from 'react'; // Added useEffect
import { 
  LayoutDashboard, ArrowRightLeft, PlusCircle, ShieldCheck, 
  FileText, Settings, LogOut, Share2, 
  Download, Shield, CheckCircle2, Quote,
  Lock as LockIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase'; // 1. CONNECTED: Import Supabase Client

// Data for the Verification Activity Chart
const activityData = [
  { month: 'MAY', value: 30 },
  { month: 'JUN', value: 35 },
  { month: 'JUL', value: 40 },
  { month: 'AUG', value: 65 },
  { month: 'SEP', value: 60 },
  { month: 'OCT', value: 85 },
];

const TrustReport = () => {
  const navigate = useNavigate();

  // 2. CONNECTED: Auth Guard - Ensures only logged-in users see the reports
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
            <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white">
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
              <NavItem icon={<ShieldCheck size={18}/>} label="Trust Score" />
            </Link>
            <Link to="/trust-report">
              <NavItem icon={<FileText size={18}/>} label="Report" active />
            </Link>
            <NavItem icon={<Settings size={18}/>} label="Settings" />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout} // CONNECTED: Trigger sign out
            className="flex items-center gap-3 text-slate-400 hover:text-rose-500 transition-all font-medium w-full text-left"
          >
            <LogOut size={18} /> <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header with Share/Download actions */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
            <ShieldCheck size={16} className="text-blue-600" /> Trust Report Generator
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Share2 size={14}/> SECURE LINK
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1e40af] rounded-lg text-xs font-bold text-white shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all">
              <Download size={14}/> DOWNLOAD PDF
            </button>
          </div>
        </header>

        <div className="p-10 max-w-5xl mx-auto w-full">
          {/* --- THE REPORT CONTAINER --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-12"
          >
            <div className="p-12">
              {/* Report Header */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Nexus Labs</h1>
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified Secure
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">TrustBridge ID: TB-9928341-X</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Generated on: October 24, 2023 • 14:32 UTC</p>
                </div>
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                  <Shield size={40} fill="currentColor" className="opacity-20" />
                  <ShieldCheck size={40} className="absolute" />
                </div>
              </div>

              {/* Executive Summary Metrics */}
              <div className="mb-16">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Executive Summary</h3>
                <div className="grid grid-cols-3 gap-12">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Trust Score</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-black text-[#1e40af]">88</span>
                      <span className="text-lg font-bold text-slate-300">/ 100</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#1e40af] h-full w-[88%]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Verified Volume</p>
                    <p className="text-4xl font-black text-slate-900 mb-1">$1.24M</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">↗ +12.4% from last month</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Age</p>
                    <p className="text-4xl font-black text-slate-900 mb-1">5.5 <span className="text-lg text-slate-400">Years</span></p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Member since May 2020</p>
                  </div>
                </div>
              </div>

              {/* Verification Activity Chart */}
              <div className="mb-16">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Verification Activity</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#94A3B8', fontWeight: 800}} 
                        dy={15} 
                      />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Transactions Table */}
              <div className="mb-16">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Recent Transactions</h3>
                <div className="space-y-4">
                  <ReportTableRow initial="AS" client="Aether Systems" type="Infrastructure Audit" date="Oct 21, 2023" />
                  <ReportTableRow initial="QC" client="Quantum Core" type="Data Pipeline Sync" date="Oct 19, 2023" />
                  <ReportTableRow initial="SN" client="Solaris Networks" type="Smart Contract Deploy" date="Oct 15, 2023" />
                </div>
              </div>

              {/* Client Testimonials */}
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Client Testimonials</h3>
                <div className="grid grid-cols-2 gap-6">
                  <TestimonialCard 
                    quote="The transparency and reliability of Nexus Labs' ledger records have been instrumental for our quarterly audits. They are the gold standard in the industry."
                    author="Jameson Doherty"
                    role="Director @ Aether Systems"
                    initial="JD"
                  />
                  <TestimonialCard 
                    quote="Working with Nexus Labs gives us peace of mind. Their TrustBridge score accurately reflects their commitment to excellence and secure operations."
                    author="Sarah Liao"
                    role="Ops Manager @ Solaris Networks"
                    initial="SL"
                  />
                </div>
              </div>
            </div>

            {/* Report Footer */}
            <div className="bg-slate-50 px-12 py-6 flex justify-between items-center border-t border-slate-100">
              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <LockIcon size={12} /> This report is signed and reflects verified ledger activity as of October 24, 2023.
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Seal of Trust</span>
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <ShieldCheck size={12} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Context Info */}
          <div className="grid grid-cols-2 gap-12 px-4 mb-20">
            <div>
              <h4 className="text-sm font-black text-slate-800 mb-2">What is a Trust Report?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A Trust Report is a real-time snapshot of your business credibility on the TrustBridge network. It aggregates transaction history, verification consistency, and peer reviews into a single verifiable document.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 mb-2">How to improve your score?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintain consistent activity, ensure all ledger transactions are completed through verified channels, and resolve any disputes within 24 hours to boost your score by up to 15%.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
    active ? 'bg-[#eff6ff] text-[#1e40af]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
  }`}>
    {icon} <span>{label}</span>
  </button>
);

const ReportTableRow = ({ initial, client, type, date }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-50">
    <div className="flex items-center gap-4 w-1/3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">{initial}</div>
      <span className="text-sm font-bold text-slate-700">{client}</span>
    </div>
    <span className="text-sm font-medium text-slate-500 w-1/3 text-center">{type}</span>
    <div className="flex items-center justify-between w-1/3">
      <span className="text-sm font-medium text-slate-400 ml-auto mr-12">{date}</span>
      <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-tighter">Verified</span>
    </div>
  </div>
);

const TestimonialCard = ({ quote, author, role, initial }) => (
  <div className="bg-[#f8fafc] rounded-3xl p-8 relative border border-slate-50">
    <Quote className="absolute top-6 right-8 text-slate-100 w-12 h-12" />
    <p className="text-xs text-slate-500 leading-relaxed italic mb-8 relative z-10">"{quote}"</p>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">{initial}</div>
      <div>
        <p className="text-[13px] font-bold text-slate-800 leading-none mb-1">{author}</p>
        <p className="text-[10px] text-slate-400 font-medium">{role}</p>
      </div>
    </div>
  </div>
);


export default TrustReport;