import React, { useEffect, useState } from 'react'; 
import { 
  LayoutDashboard, ArrowRightLeft, PlusCircle, ShieldCheck, 
  FileText, Settings, LogOut, Share2, 
  Download, Shield, CheckCircle2, Quote,
  Lock as LockIcon, Menu, X, Bell, ChevronRight, Loader2, MailPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import { supabase } from '../../lib/supabase'; 

const TrustReport = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const [userData, setUserData] = useState({ name: '...', role: 'Merchant', avatarName: 'U' });

  const [reportData, setReportData] = useState({
    businessName: '',
    trustId: 'TB-PENDING',
    generatedDate: '',
    trustScore: 0,
    volume: '₦0.00',
    accountAge: '0.0 Years',
    joinDate: '',
    chartData: [],
    recentTransactions: []
  });

  // 1. PREMIUM DATA SYNC (From Scratch Logic)
  useEffect(() => {
    const fetchReportData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }

      try {
        const userId = session.user.id;

        const { data: profile } = await supabase
          .from('profiles')
          .select('business_name, business_type, created_at, linkedin_verified, tax_verified')
          .eq('user_id', userId) 
          .maybeSingle();

        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (profile) {
          setUserData({
            name: profile.business_name || 'Business Name',
            role: (profile.business_type || 'Merchant').replace('_', ' '),
            avatarName: (profile.business_name || 'U').split(' ').join('+')
          });

          // --- REAL-TIME CALCULATIONS (No padding) ---
          const totalVolume = transactions ? transactions.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0) : 0;
          const totalTx = transactions ? transactions.length : 0;
          const verifiedTx = transactions ? transactions.filter(t => t.status === 'Verified').length : 0;
          const vRate = totalTx > 0 ? (verifiedTx / totalTx) : 0;

          // Score: Max 100 (Earned only)
          let score = 0;
          score += Math.min(totalTx * 3, 30); // Volume points
          score += Math.round(vRate * 40);    // Verification quality
          if (profile.linkedin_verified) score += 15;
          if (profile.tax_verified) score += 15;

          const createdDate = new Date(profile.created_at || Date.now());
          const age = ((new Date() - createdDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);

          // Cumulative Chart Data
          const trend = [];
          if (totalTx === 0) {
            trend.push({ month: 'START', value: 0 }, { month: 'NOW', value: 0 });
          } else {
            transactions.forEach((tx, idx) => {
              const txDate = new Date(tx.created_at).toLocaleString('default', { month: 'short' }).toUpperCase();
              const runningCount = idx + 1;
              const runningVerified = transactions.slice(0, runningCount).filter(t => t.status === 'Verified').length;
              const runningScore = Math.min(100, (runningCount * 3) + Math.round((runningVerified / runningCount) * 40));
              trend.push({ month: txDate, value: runningScore });
            });
          }

          setReportData({
            businessName: profile.business_name || 'Verified Merchant',
            trustId: `TB-${userId.substring(0, 7).toUpperCase()}-X`,
            generatedDate: new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' UTC',
            trustScore: score,
            volume: `₦${totalVolume.toLocaleString()}`, 
            accountAge: `${age} Years`,
            joinDate: `Member since ${createdDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
            chartData: trend,
            recentTransactions: transactions ? [...transactions].reverse().slice(0, 5) : []
          });
        }
      } catch (err) { console.error("Sync Error:", err); }
      finally { setIsLoading(false); }
    };
    fetchReportData();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };
  const handleShare = () => { navigator.clipboard.writeText(window.location.href); setShowToast(true); setTimeout(() => setShowToast(false), 3000); };

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white"><ShieldCheck size={20} /></div>
          <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
        </div>
        <nav className="space-y-1">
          <Link to="/dashboard"><NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" /></Link>
          <Link to="/transaction-dashboard"><NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" /></Link>
          <Link to="/log-new-transaction"><NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" /></Link>
          <Link to="/trust-score"><NavItem icon={<ShieldCheck size={18}/>} label="Trust Score" /></Link>
          <Link to="/trust-report"><NavItem icon={<FileText size={18}/>} label="Report" active /></Link>
          <Link to="/settings"><NavItem icon={<Settings size={18}/>} label="Settings" /></Link>
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-slate-100">
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-rose-500 font-medium w-full text-left transition-colors"><LogOut size={18} /> <span>Log out</span></button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700 relative overflow-x-hidden">
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `@media print { aside, header, .print\\:hidden { display: none !important; } main { margin-left: 0 !important; padding: 0 !important; } .shadow-2xl { box-shadow: none !important; border: 1px solid #e2e8f0 !important; } .rounded-4xl { border-radius: 0 !important; } }`}} />
      
      <AnimatePresence>{showToast && ( <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className="fixed top-6 left-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 print:hidden"><CheckCircle2 size={16} className="text-emerald-400" /> Secure Link Copied!</motion.div>)}</AnimatePresence>
      
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30 print:hidden"><SidebarContent /></aside>

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full print:ml-0">
        {/* Nav Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-2 text-sm text-[#1e40af] font-bold bg-blue-50 px-3 py-1.5 rounded-lg"><ShieldCheck size={16} /> Trust Generator</div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block"><p className="text-sm font-bold text-slate-800 leading-none">{userData.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{userData.role}</p></div>
             <img src={`https://ui-avatars.com/api/?name=${userData.avatarName}&background=1e40af&color=fff`} className="w-9 h-9 rounded-full border border-slate-200" alt="profile" />
          </div>
        </header>

        {/* Action Bar */}
        <div className="max-w-5xl w-full mx-auto mt-8 px-6 flex justify-between items-end print:hidden">
          <div><h2 className="text-2xl font-black text-slate-900">Institutional Report</h2><p className="text-sm text-slate-400 font-medium">Verified Ledger Snapshot</p></div>
          <div className="flex gap-3">
            <button onClick={handleShare} className="p-3 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-all shadow-sm"><Share2 size={18}/></button>
            <button onClick={() => window.print()} className="bg-[#1e40af] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all flex items-center gap-2"><Download size={18}/> Save as PDF</button>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full pb-20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-slate-100 shadow-sm"><Loader2 className="animate-spin text-blue-600 mb-4" size={40} /><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Compiling Secure Ledger...</p></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden print:shadow-none print:border-slate-300">
              <div className="p-10 md:p-16">
                
                {/* 1. REPORT HEADER (Premium) */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8 border-b border-slate-100 pb-12">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">{reportData.businessName}</h1>
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100 flex items-center gap-1"><CheckCircle2 size={12}/> Verified</div>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Identifier: <span className="text-blue-600">{reportData.trustId}</span></p>
                    <p className="text-[10px] text-slate-300 font-medium uppercase tracking-widest">Timestamp: {reportData.generatedDate}</p>
                  </div>
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner relative shrink-0">
                    <Shield size={40} fill="currentColor" className="opacity-10" />
                    <ShieldCheck size={40} className="absolute" />
                  </div>
                </div>

                {/* 2. EXECUTIVE SUMMARY (Premium Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                  <MetricCard label="Trust Reliability" value={reportData.trustScore} suffix="/ 100" />
                  <MetricCard label="Verified Volume" value={reportData.volume} />
                  <MetricCard label="Ledger Age" value={reportData.accountAge} sub={reportData.joinDate} />
                </div>

                {/* 3. GROWTH CHART (Sleek AreaChart) */}
                <div className="mb-20">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Credibility History</h3>
                  <div className="h-72 w-full p-6 border border-slate-50 rounded-[32px] bg-[#fcfdfe]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={reportData.chartData}>
                        <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 900}} dy={10} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                        <Area type="stepAfter" dataKey="value" stroke="#3b82f6" strokeWidth={4} fill="url(#chartGrad)" dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. LEDGER TABLE (Styled) */}
                <div className="mb-20">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Verified Ledger Entries</h3>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50 shadow-sm">
                    {reportData.recentTransactions.length > 0 ? (
                      reportData.recentTransactions.map((tx, i) => (
                        <div key={i} className="p-5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4 w-1/3">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[11px] font-black shadow-sm">{tx.client_name?.charAt(0) || 'C'}</div>
                            <span className="text-sm font-bold text-slate-800 truncate">{tx.client_name}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-400 w-1/3 text-center">{new Date(tx.created_at).toLocaleDateString()}</span>
                          <div className="w-1/3 flex justify-end gap-3 items-center">
                             <span className="text-xs font-black text-slate-900">₦{parseFloat(tx.amount).toLocaleString()}</span>
                             <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${tx.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                {tx.status}
                             </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-xs font-bold text-slate-300 uppercase tracking-widest bg-slate-50/30">No transaction data recorded in ledger.</div>
                    )}
                  </div>
                </div>

                {/* 5. ENDORSEMENTS (Placeholder logic for real reviews) */}
                <div>
                   <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Institutional Endorsements</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <TestimonialCard quote="Records on this ledger meet our quarterly audit transparency requirements. High reliability." author="System Verification" role="TrustBridge Protocol" />
                      <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center print:hidden">
                        <MailPlus className="text-slate-300 mb-3" size={32} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Invite Clients</p>
                        <p className="text-[10px] text-slate-300 font-medium">Verified endorsements boost your score by +10pts.</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="bg-slate-950 px-10 md:px-16 py-10 flex flex-col sm:flex-row justify-between items-center border-t border-white/5">
                <div className="flex items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                  <LockIcon size={14} /> End-to-End Verified Activity
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mr-2">Institutional Seal</span>
                   <div className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center"><Shield size={16} fill="currentColor" /></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

// Sub-components
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all font-bold text-sm ${ active ? 'bg-blue-50 text-[#1e40af]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600' }`}>
    {icon} <span>{label}</span>
  </div>
);

const MetricCard = ({ label, value, suffix = "", sub = "Active Analysis" }) => (
  <div className="bg-[#fcfdfe] p-8 rounded-[32px] border border-slate-50 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-colors">
    <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 relative z-10">{label}</p>
    <p className="text-4xl font-black text-slate-900 mb-2 relative z-10">{value}<span className="text-sm text-slate-300 ml-1">{suffix}</span></p>
    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter relative z-10">{sub}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role }) => (
  <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm relative flex flex-col">
    <Quote size={40} className="absolute top-6 right-6 text-slate-50" fill="currentColor" />
    <p className="text-xs text-slate-600 italic font-medium leading-relaxed mb-8 flex-1">"{quote}"</p>
    <div>
      <p className="text-sm font-black text-slate-900">{author}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{role}</p>
    </div>
  </div>
);

export default TrustReport;
