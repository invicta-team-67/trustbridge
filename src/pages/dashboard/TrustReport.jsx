  import React, { useEffect, useState } from 'react'; 
  import { 
    LayoutDashboard, ArrowRightLeft, PlusCircle, ShieldCheck, 
    FileText, Settings, LogOut, Share2, 
    Download, Shield, CheckCircle2, Quote,
    Lock as LockIcon,
    Menu, // Imported for mobile
    X     // Imported for mobile
  } from 'lucide-react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { Link, useNavigate } from 'react-router-dom';
  import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
  import { supabase } from '../../lib/supabase'; // 1. CONNECTED: Import Supabase Client

  const TrustReport = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile state

    // State for dynamic report data
    const [reportData, setReportData] = useState({
      businessName: 'Loading...',
      trustId: 'TB-XXXX-X',
      generatedDate: 'Loading...',
      trustScore: 0,
      volume: '₦0.00',
      accountAge: '0 Years',
      joinDate: 'Loading...',
      chartData: [],
      recentTransactions: []
    });

    // 2. CONNECTED: Auth Guard & Data Fetching
    useEffect(() => {
      const fetchReportData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }

        try {
          const userId = session.user.id;

  // A. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('business_name, created_at')
    .eq('user_id', userId) // CORRECT
    .maybeSingle();

          // B. Fetch Transactions (Verified ones count towards score/volume)
          const { data: transactions } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (profile && transactions) {
            // --- CALCULATIONS ---
            
            // 1. Volume (Sum of verified/pending transactions)
            const totalVolume = transactions
              .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

            // 2. Trust Score Algorithm (Mock Logic)
            const txCount = transactions.length;
            const calculatedScore = Math.min(100, 60 + (txCount * 2));

            // 3. Account Age
            const createdDate = new Date(profile.created_at);
            const now = new Date();
            const diffTime = Math.abs(now - createdDate);
            const diffYears = (diffTime / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

            // 4. Chart Data (Group by Month)
            const last6Months = Array.from({ length: 6 }, (_, i) => {
              const d = new Date();
              d.setMonth(d.getMonth() - (5 - i));
              return {
                month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
                value: 0, 
                rawDate: d.getMonth()
              };
            });

            

            transactions.forEach(tx => {
              const txMonth = new Date(tx.created_at).getMonth();
              const monthEntry = last6Months.find(m => m.rawDate === txMonth);
              if (monthEntry) {
                monthEntry.value += 10; 
              }
            });

            // 5. Recent Transactions (Top 3)
            const recent = transactions.slice(0, 3).map(tx => ({
              initial: tx.client_name.substring(0, 2).toUpperCase(),
              client: tx.client_name,
              type: tx.service_provided || 'General Service',
              date: new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }));

            // --- UPDATE STATE ---
            setReportData({
              businessName: profile.business_name || 'Verified Business',
              trustId: `TB-${userId.substring(0, 7).toUpperCase()}-X`,
              generatedDate: new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' UTC',
              trustScore: calculatedScore,
              volume: `₦${(totalVolume / 1000000).toFixed(2)}M`, 
              accountAge: `${diffYears} Years`,
              joinDate: `Member since ${createdDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
              chartData: last6Months,
              recentTransactions: recent.length > 0 ? recent : null 
            });
          }
        } catch (err) {
          console.error("Error generating report:", err);
        }
      };

      fetchReportData();
    }, [navigate]);

    const handleLogout = async () => {
      await supabase.auth.signOut();
      navigate('/login');
    };

    const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard! You can now share this report.");
  };

    const fallbackActivityData = [
      { month: 'MAY', value: 30 }, { month: 'JUN', value: 35 }, { month: 'JUL', value: 40 },
      { month: 'AUG', value: 65 }, { month: 'SEP', value: 60 }, { month: 'OCT', value: 85 },
    ];

    // Reusable Sidebar Content
    const SidebarContent = () => (
      <>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
          </div>
          <nav className="space-y-1">
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" /></Link>
            <Link to="/transaction-dashboard" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" /></Link>
            <Link to="/log-new-transaction" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" /></Link>
            <Link to="/trust-score" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<ShieldCheck size={18}/>} label="Trust Score" /></Link>
            <Link to="/trust-report" onClick={() => setIsMobileMenuOpen(false)}><NavItem icon={<FileText size={18}/>} label="Report" active /></Link>
  {/* Updated Settings link to point to your new Settings page */}
  <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
    <NavItem icon={<Settings size={18}/>} label="Settings" active={window.location.pathname === '/settings'} />
  </Link>
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
      {/* CSS for clean PDF export */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 10mm; }
          aside, header, .print\\:hidden { display: none !important; }
          main { margin-left: 0 !important; padding: 0 !important; }
          .max-w-5xl { max-width: 100% !important; width: 100% !important; margin: 0 !important; }
          .shadow-2xl { shadow: none !important; border: 1px solid #eee !important; }
        }
      `}} />
        
        {/* --- SIDEBAR (Desktop) --- */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30">
          <SidebarContent />
        </aside>

        {/* --- MOBILE DRAWER --- */}
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

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-10 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-50 rounded-lg text-slate-600"><Menu size={20} /></button>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                <ShieldCheck size={16} className="text-blue-600" /> <span className="hidden sm:inline">Trust Report Generator</span>
              </div>
            </div>
            <div className="flex gap-2 md:gap-3">
  <button 
    onClick={handleShare} // <--- Add this
    className="flex items-center gap-2 px-3 md:px-4 py-2 border..."
  >
    <Share2 size={14}/> <span className="hidden sm:inline">Secure Link</span>
  </button>
  <button 
    onClick={() => window.print()} 
    className="flex-1 sm:flex-none bg-[#1e40af] text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all"
  >
    <Download size={14}/> <span className="hidden sm:inline">Download PDF</span>
  </button>
            </div>
          </header>

          <div className="p-4 md:p-10 max-w-5xl mx-auto w-full">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[24px] md:rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden mb-12">
              <div className="p-6 md:p-12">
                {/* Report Header */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{reportData.businessName}</h1>
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 shrink-0">
                        <CheckCircle2 size={12} /> Verified Secure
                      </span>
                    </div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest break-all">TrustBridge ID: {reportData.trustId}</p>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Generated: {reportData.generatedDate}</p>
                  </div>
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner shrink-0 relative">
                    <Shield size={36} fill="currentColor" className="opacity-20 md:w-10 md:h-10" />
                    <ShieldCheck size={36} className="absolute md:w-10 md:h-10" />
                  </div>
                </div>

                {/* Executive Summary Metrics - Responsive Grid */}
                <div className="mb-16">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Executive Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trust Score</p>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-3xl md:text-4xl font-black text-[#1e40af]">{reportData.trustScore}</span>
                        <span className="text-lg font-bold text-slate-300">/ 100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#1e40af] h-full" style={{ width: `${reportData.trustScore}%` }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Verified Volume</p>
                      <p className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{reportData.volume}</p>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase">↗ +12.4% vs prev month</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Age</p>
                      <p className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{reportData.accountAge}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">{reportData.joinDate}</p>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="mb-16">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Verification Activity</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={reportData.chartData.length > 0 ? reportData.chartData : fallbackActivityData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8', fontWeight: 800}} dy={15} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Transactions Table - Horizontal scroll for mobile */}
                <div className="mb-16">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Recent Transactions</h3>
                  <div className="overflow-x-auto w-full">
                    <div className="min-w-[600px] space-y-4">
                      {reportData.recentTransactions ? (
                        reportData.recentTransactions.map((tx, index) => (
                          <ReportTableRow key={index} initial={tx.initial} client={tx.client} type={tx.type} date={tx.date} />
                        ))
                      ) : (
                        <>
                          <ReportTableRow initial="AS" client="Aether Systems" type="Infrastructure Audit" date="Oct 21, 2023" />
                          <ReportTableRow initial="QC" client="Quantum Core" type="Data Pipeline Sync" date="Oct 19, 2023" />
                          <ReportTableRow initial="SN" client="Solaris Networks" type="Smart Contract Deploy" date="Oct 15, 2023" />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Client Testimonials - Stacks on mobile */}
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Client Testimonials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TestimonialCard 
                      quote="The transparency and reliability of this business's records have been instrumental for our quarterly audits. They are the gold standard."
                      author="Jameson Doherty" role="Director @ Aether Systems" initial="JD"
                    />
                    <TestimonialCard 
                      quote="Working with them gives us peace of mind. Their TrustBridge score accurately reflects their commitment to excellence."
                      author="Sarah Liao" role="Ops Manager @ Solaris Networks" initial="SL"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-6 md:px-12 py-6 flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 gap-4">
                <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
                  <LockIcon size={12} className="shrink-0" /> Verified activity as of {reportData.generatedDate}.
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Seal of Trust</span>
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><ShieldCheck size={12} /></div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-4 mb-20">
              <div>
                <h4 className="text-sm font-black text-slate-800 mb-2 text-center md:text-left">What is a Trust Report?</h4>
                <p className="text-xs text-slate-400 leading-relaxed text-center md:text-left">A Trust Report is a real-time snapshot of business credibility on TrustBridge, aggregating history and peer reviews into one document.</p>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 mb-2 text-center md:text-left">Improve your score?</h4>
                <p className="text-xs text-slate-400 leading-relaxed text-center md:text-left">Maintain activity, use verified channels, and resolve disputes within 24 hours to boost your score by up to 15%.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  const NavItem = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
      active ? 'bg-[#eff6ff] text-[#1e40af]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}>
      {icon} <span>{label}</span>
    </button>
  );

  const ReportTableRow = ({ initial, client, type, date }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 gap-4">
      <div className="flex items-center gap-3 md:gap-4 w-1/3 min-w-[150px]">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">{initial}</div>
        <span className="text-sm font-bold text-slate-700 truncate">{client}</span>
      </div>
      <span className="text-sm font-medium text-slate-500 w-1/3 text-center truncate px-2">{type}</span>
      <div className="flex items-center justify-between w-1/3 min-w-[150px]">
        <span className="text-sm font-medium text-slate-400 ml-auto mr-4 md:mr-12">{date}</span>
        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-tighter shrink-0">Verified</span>
      </div>
    </div>
  );

  const TestimonialCard = ({ quote, author, role, initial }) => (
    <div className="bg-[#f8fafc] rounded-3xl p-6 md:p-8 relative border border-slate-50 h-full flex flex-col">
      <Quote className="absolute top-6 right-6 md:right-8 text-slate-100 w-8 h-8 md:w-12 md:h-12" />
      <p className="text-xs text-slate-500 leading-relaxed italic mb-8 relative z-10 flex-1">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 shrink-0">{initial}</div>
        <div className="overflow-hidden">
          <p className="text-[13px] font-bold text-slate-800 leading-none mb-1 truncate">{author}</p>
          <p className="text-[10px] text-slate-400 font-medium truncate">{role}</p>
        </div>
      </div>
    </div>
  );

  export default TrustReport;