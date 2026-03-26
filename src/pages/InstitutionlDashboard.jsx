import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, Landmark, ShieldCheck, FileText, LifeBuoy, 
  PlusCircle, Shield, LogOut, Bell, Settings, UserCircle,
  Zap, ArrowUpRight, ArrowDownLeft, CheckCircle2, Percent, 
  Clock, HeadphonesIcon, Building2, Loader2, ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const InstitutionalDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const [userData, setUserData] = useState({
    businessName: 'Loading...',
    initials: 'U',
    tier: 3,
    score: 0,
    preApprovedAmount: 0,
    scoreIncrease: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  // 1. REAL-TIME DATA SYNC & SCORE CALCULATION
  const fetchDashboardData = async (userId) => {
    try {
      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('business_name, linkedin_verified, tax_verified')
        .eq('user_id', userId)
        .maybeSingle();

      // Fetch Transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('id, amount, status, client_name, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (profile) {
        const txs = transactions || [];
        const totalTx = txs.length;
        const verifiedTx = txs.filter(t => t.status === 'Verified').length;
        const vRate = totalTx > 0 ? (verifiedTx / totalTx) : 0;
        const totalVolume = txs.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

        // Core Score Logic (Base 100, scaled to 1000 for Institutional Index)
        let baseScore = 0;
        baseScore += Math.min(totalTx * 3, 30);
        baseScore += Math.round(vRate * 40);
        if (profile.linkedin_verified) baseScore += 15;
        if (profile.tax_verified) baseScore += 15;
        
        const institutionalScore = baseScore * 10; // e.g., 920

        // Calculate Tier (Tier 1 > 800, Tier 2 > 500)
        let tier = 3;
        if (institutionalScore >= 800) tier = 1;
        else if (institutionalScore >= 500) tier = 2;

        // Dynamic Credit Line: 10% of verified volume, capped at ₦5M for Tier 1
        const calculatedCredit = tier === 1 
          ? Math.min(5000000, Math.max(50000, totalVolume * 0.1)) 
          : 0;

        setUserData({
          businessName: profile.business_name || 'My Business',
          initials: (profile.business_name || 'U').substring(0, 1).toUpperCase(),
          tier: tier,
          score: institutionalScore,
          preApprovedAmount: calculatedCredit,
          scoreIncrease: profile.tax_verified ? 140 : 40 // Simulated recent jump
        });

        // Format transactions for the UI
        setRecentActivity(txs.slice(0, 4).map((tx, index) => {
          // Simulate deposit/withdrawal visuals based on index or logic
          const isDeposit = index % 2 !== 0; 
          return {
            id: tx.id,
            entity: tx.client_name,
            type: isDeposit ? 'DEPOSIT' : 'PAYROLL / SETTLEMENT',
            amount: parseFloat(tx.amount),
            isDeposit: isDeposit,
            status: tx.status.toUpperCase(),
            time: timeAgo(tx.created_at)
          };
        }));
      }
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      
      const userId = session.user.id;
      await fetchDashboardData(userId);

      // REAL-TIME SUBSCRIPTION
      const channel = supabase.channel('realtime-dashboard')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` }, () => {
          fetchDashboardData(userId);
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    };
    initData();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(amount).replace('NGN', '₦');
  };

  const timeAgo = (dateString) => {
    const diff = new Date() - new Date(dateString);
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'JUST NOW';
    if (hours < 24) return `${hours}H AGO`;
    return `${Math.floor(hours / 24)}D AGO`;
  };

  // SVG Circle Math for the Score
  const circleRadius = 54;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circleCircumference - (userData.score / 1000) * circleCircumference;

  // --- SUB COMPONENTS ---
  const SidebarItem = ({ icon, label, active }) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-bold transition-all ${active ? 'bg-blue-50 text-[#1e40af]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
      {icon} {label}
    </div>
  );

  const BenefitCard = ({ icon, title, text }) => (
    <div className="bg-[#f8fafc] p-5 rounded-2xl border border-slate-100 flex flex-col h-full hover:border-blue-100 transition-colors">
      <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#1e40af] mb-4">
        {icon}
      </div>
      <h4 className="text-sm font-black text-slate-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{text}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* 1. SIDEBAR */}
      <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col fixed h-full z-30">
        <div className="p-6">
          <h1 className="text-[#1e40af] font-black text-xl tracking-tight uppercase cursor-pointer" onClick={() => navigate('/dashboard')}>
            {userData.businessName} BANKING
          </h1>
        </div>

        <div className="px-6 mb-6">
          <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-50 cursor-pointer">
            <div className="w-10 h-10 bg-[#1e40af] text-white rounded-lg flex items-center justify-center font-black text-lg shadow-sm">
              {userData.initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-slate-900 truncate">{userData.businessName}</p>
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={10} /> Verified Enterprise
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<LayoutGrid size={18} />} label="Overview" active />
          <SidebarItem icon={<Landmark size={18} />} label="Accounts" />
          <SidebarItem icon={<ShieldCheck size={18} />} label="Verified Entities" />
          <SidebarItem icon={<FileText size={18} />} label="Audit Trail" />
          <SidebarItem icon={<LifeBuoy size={18} />} label="Support" />
        </nav>

        <div className="p-6 border-t border-slate-100 space-y-4">
          <button onClick={() => navigate('/log-new-transaction')} className="w-full bg-[#1e40af] text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 active:scale-95">
            <PlusCircle size={18} /> New Transaction
          </button>
          <div className="flex flex-col gap-2 pt-2">
             <button className="flex items-center gap-3 text-slate-500 hover:text-slate-800 text-sm font-bold py-2 px-2"><Shield size={16} /> Security</button>
             <button onClick={handleLogout} className="flex items-center gap-3 text-slate-500 hover:text-rose-600 text-sm font-bold py-2 px-2"><LogOut size={16} /> Log Out</button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 ml-[260px] min-h-screen flex flex-col relative overflow-hidden">
        
        {/* TOP NAV */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20 relative">
          <div className="flex items-center gap-8 text-[13px] font-bold text-slate-500">
            <span className="text-[#1e40af] border-b-2 border-[#1e40af] pb-1 h-20 flex items-center cursor-pointer">Dashboard</span>
            <span className="hover:text-slate-900 transition-colors cursor-pointer">Payments</span>
            <span className="hover:text-slate-900 transition-colors cursor-pointer">Analytics</span>
          </div>
          <div className="flex items-center gap-6">
            <Bell size={18} className="text-slate-400 cursor-pointer hover:text-slate-700 transition-colors" />
            <Settings size={18} className="text-slate-400 cursor-pointer hover:text-slate-700 transition-colors" />
            <img src={`https://ui-avatars.com/api/?name=${userData.initials}&background=0f172a&color=fff`} className="w-9 h-9 rounded-full shadow-sm cursor-pointer" alt="profile" />
          </div>
        </header>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#1e40af] mb-4" size={40} />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Aggregating Profile Data...</p>
          </div>
        ) : (
          <div className="p-8 lg:p-10 max-w-6xl w-full mx-auto relative z-10">
            
            {/* ACCELERATED FUNDING BANNER (Dark) */}
            {userData.tier === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f172a] rounded-[24px] p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex-1 w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center"><Zap size={18} fill="currentColor" /></div>
                    <h2 className="text-2xl font-black tracking-tight">Accelerated Funding</h2>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">STATUS</p>
                  <p className="text-sm font-medium text-slate-300 max-w-sm mb-6 flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    Instant approval active due to <span className="font-bold text-white">Tier {userData.tier} Verified</span> status.
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">TIME TO DISBURSEMENT</p>
                  <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-300">
                    <Clock size={14} /> &lt; 24 Hours
                  </div>
                </div>
                
                <div className="relative z-10 w-full md:w-auto mt-8 md:mt-0 flex flex-col items-start md:items-end">
                  <div className="flex items-center gap-2 mb-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">LIVE OFFER</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PRE-APPROVED AMOUNT</p>
                  <p className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">{formatCurrency(userData.preApprovedAmount)}</p>
                  <button className="w-full md:w-auto bg-[#3b82f6] text-white px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider shadow-lg hover:bg-blue-500 transition-colors active:scale-95">
                    Get Funds Now
                  </button>
                </div>
              </motion.div>
            )}

            {/* CONGRATULATIONS BANNER (Blue) */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] rounded-[24px] p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-center shadow-lg shadow-blue-900/10 mb-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10 flex items-center justify-center">
                <ShieldCheck size={180} />
              </div>
              <div className="relative z-10 flex-1 pr-8">
                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-blue-200 mb-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-white">LEVEL UNLOCKED</span>
                  <span>• Tier {userData.tier} Status Active</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-3">Congratulations! Your Business is Now Tier {userData.tier} Verified</h2>
                <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-xl">
                  Your institutional integrity has been confirmed. You now have full access to our premium lending suite and preferential market rates.
                </p>
              </div>
              <button className="mt-6 md:mt-0 relative z-10 w-full md:w-auto bg-white text-[#1e40af] px-8 py-4 rounded-xl text-sm font-black shadow-lg hover:bg-blue-50 transition-colors active:scale-95 whitespace-nowrap">
                View All Benefits
              </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              
              {/* TRUST INDEX CIRCLE */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-4 bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TRUST</h3>
                    <p className="text-sm font-black text-slate-900 uppercase">Integrity Index</p>
                  </div>
                  <div className="bg-blue-50 text-[#1e40af] px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-blue-100">
                    <CheckCircle2 size={10} /> Verified
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative mb-8">
                  <svg width="140" height="140" viewBox="0 0 120 120" className="transform -rotate-90">
                    <circle cx="60" cy="60" r={circleRadius} stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                    <motion.circle 
                      cx="60" cy="60" r={circleRadius} stroke="#1e40af" strokeWidth="10" fill="transparent" strokeLinecap="round"
                      strokeDasharray={circleCircumference}
                      initial={{ strokeDashoffset: circleCircumference }}
                      animate={{ strokeDashoffset: strokeOffset }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">{userData.score}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{userData.score >= 800 ? 'Excellent' : 'Good'}</span>
                  </div>
                </div>

                <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-50 flex items-start gap-3">
                  <TrendingUp size={16} className="text-[#1e40af] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 font-medium">
                    Increased by <span className="font-black text-slate-900">{userData.scoreIncrease} points</span> after Tier 1 KYC completion.
                  </p>
                </div>
              </motion.div>

              {/* VERIFICATION MILESTONES GRID */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-8 bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Verification Milestone</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">As a Tier {userData.tier} entity, the following institutional benefits are now active.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <BenefitCard 
                    icon={<Landmark />} title="Access to Loans" 
                    text="Unlock credit lines up to ₦5M with instant approval protocols."
                  />
                  <BenefitCard 
                    icon={<Percent />} title="Lower Interest Rates" 
                    text="Enjoy a 1.5% reduction on all standard APR across your portfolio."
                  />
                  <BenefitCard 
                    icon={<FileText />} title="Priority Settlements" 
                    text="T+0 settlement windows for all verified outbound transactions."
                  />
                  <BenefitCard 
                    icon={<HeadphonesIcon />} title="Dedicated Advisor" 
                    text="24/7 access to your assigned Institutional Relationship Manager."
                  />
                </div>
              </motion.div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 pb-20">
              
              {/* RECENT ACTIVITY */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-8 bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Verified transaction flow</p>
                  </div>
                  <button className="text-xs font-black text-[#1e40af] uppercase tracking-widest hover:text-blue-800">
                    View Full Audit Trail
                  </button>
                </div>

                <div className="space-y-2">
                  {recentActivity.length > 0 ? recentActivity.map((tx, i) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.isDeposit ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                          {tx.isDeposit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{tx.entity || 'Unknown Entity'}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                            {tx.type} • {tx.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${tx.isDeposit ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {tx.isDeposit ? '+' : '-'}{formatCurrency(tx.amount)}
                        </p>
                        <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${tx.status === 'VERIFIED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="py-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No recent transactions found.</div>
                  )}
                  
                  {/* Static Milestone injection for UI fidelity to the mockup */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/50 border border-blue-50 mt-4">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#1e40af] text-white flex items-center justify-center">
                          <Shield size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Account Verification</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">SECURITY • 1D AGO</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-[#1e40af]">Tier {userData.tier} Upgrade</p>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">COMPLETED</p>
                      </div>
                  </div>
                </div>
              </motion.div>

              {/* FLOATING PROMO CARD */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-4 rounded-[24px] bg-[#0f172a] text-white p-8 flex flex-col justify-end relative overflow-hidden shadow-2xl h-[380px] group">
                {/* Simulated building background */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent z-10"></div>
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" alt="building" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                
                <div className="relative z-20">
                  <div className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded inline-block mb-4">NEW EXCLUSIVE</div>
                  <h3 className="text-2xl font-black tracking-tight leading-tight mb-3">Expand your horizons with Tier 1 Capital Loans.</h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed mb-8 max-w-[240px]">
                    Your newly verified status allows you to bypass traditional wait times. Apply for expansion capital today and get funded within 24 hours.
                  </p>
                  <button className="bg-white text-slate-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors active:scale-95 shadow-lg">
                    Explore Loans
                  </button>
                </div>
              </motion.div>
            </div>

          </div>
        )}

        {/* BOTTOM RIGHT FLOATING ACTION (Optional, based on mockup) */}
        <div className="fixed bottom-8 right-8 z-50">
           <button onClick={() => navigate('/log-new-transaction')} className="bg-[#1e40af] text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-900/30 hover:bg-blue-800 transition-colors active:scale-95 flex items-center gap-2">
             Log Transaction
           </button>
        </div>
      </main>
    </div>
  );
};

export default InstitutionalDashboard;
