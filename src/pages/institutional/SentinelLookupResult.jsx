import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, ShieldAlert, Download, Star, Info, 
  TrendingUp, Activity, ShieldCheck, FileText, Search, 
  ChevronRight, Loader2, Building2 
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { supabase } from '../../lib/supabase';

const SentinelLookupResult = () => {
  const { id } = useParams(); // Gets the search query from the URL
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [entityData, setEntityData] = useState({
    businessName: '',
    trustId: '',
    entityType: '',
    score: 0,
    verificationRate: 0,
    totalVolume: 0,
    disputes: 0,
    joinDate: '',
    riskProfile: 'Evaluating',
    tierStanding: 'Unranked',
    revenueData: []
  });

  // REAL-TIME FETCH LOGIC
  useEffect(() => {
    const fetchEntityData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Search for the profile (by business_name OR short ID)
// 1. Clean the search term (removes %20 spaces) and search ONLY by business_name
        const cleanSearchTerm = decodeURIComponent(id);
        
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .ilike('business_name', `%${cleanSearchTerm}%`)
          .limit(1);

        if (profileError || !profiles || profiles.length === 0) {
          setError("Entity not found in the TrustBridge directory.");
          setIsLoading(false);
          return;
        }

        const profile = profiles[0];

        // 2. Fetch their real transactions
        const { data: transactions } = await supabase
          .from('transactions')
          .select('amount, status, created_at')
          .eq('user_id', profile.user_id)
          .order('created_at', { ascending: true });

        // 3. Perform Live Calculations
        const totalTx = transactions ? transactions.length : 0;
        const verifiedTx = transactions ? transactions.filter(t => t.status === 'Verified').length : 0;
        const disputedTx = transactions ? transactions.filter(t => t.status === 'Disputed').length : 0;
        
        const vRate = totalTx > 0 ? (verifiedTx / totalTx) * 100 : 0;
        const totalVol = transactions ? transactions.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0) : 0;

        // Trust Score Math (0-100)
        let calculatedScore = 0;
        calculatedScore += Math.min(totalTx * 2, 20); 
        calculatedScore += Math.round((vRate / 100) * 40);
        if (profile.linkedin_verified) calculatedScore += 20;
        if (profile.tax_verified) calculatedScore += 20;

        // Assign Risk & Tier based on Live Score
        let risk = 'High Risk';
        let tier = 'Tier 3 Basic';
        if (calculatedScore >= 80) { risk = 'Low Risk'; tier = 'Tier 1 Qualified'; }
        else if (calculatedScore >= 50) { risk = 'Medium Risk'; tier = 'Tier 2 Standard'; }

        // Revenue Bar Chart Math (Grouping by month)
        const revenueMap = {};
        if (transactions) {
          transactions.forEach(tx => {
            const month = new Date(tx.created_at).toLocaleDateString('default', { month: 'short' });
            revenueMap[month] = (revenueMap[month] || 0) + parseFloat(tx.amount || 0);
          });
        }
        // Take last 6 active months, or pad with empty data
        const revData = Object.keys(revenueMap).slice(-6).map(month => ({
          month,
          amount: revenueMap[month]
        }));
        
        // Ensure we always have 6 bars for the UI even if new
        while (revData.length < 6) {
          revData.unshift({ month: '-', amount: 0 });
        }

        // 4. Update State
        setEntityData({
          businessName: profile.business_name,
          trustId: `TB-${profile.user_id.substring(0, 6).toUpperCase()}-X`,
          entityType: (profile.business_type || 'Institution').replace('_', ' '),
          score: calculatedScore,
          verificationRate: vRate.toFixed(1),
          totalVolume: totalVol,
          disputes: disputedTx,
          joinDate: new Date(profile.created_at).toLocaleDateString('default', { month: 'short', year: 'numeric' }),
          riskProfile: risk,
          tierStanding: tier,
          revenueData: revData
        });

      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching the ledger.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntityData();
  }, [id]);

  // Format volume for display (e.g., 4,200,000 -> ₦4.2M)
  const formatVolume = (vol) => {
    if (vol >= 1000000000) return `₦${(vol / 1000000000).toFixed(1)}B`;
    if (vol >= 1000000) return `₦${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `₦${(vol / 1000).toFixed(1)}K`;
    return `₦${vol.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Querying Institutional Ledger...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <ShieldAlert size={64} className="text-slate-300 mb-6" />
        <h2 className="text-2xl font-black text-slate-800 mb-2">Lookup Failed</h2>
        <p className="text-slate-500 mb-8">{error}</p>
        <button onClick={() => navigate('/sentinel')} className="bg-[#1e40af] text-white px-6 py-2 rounded-lg font-bold shadow-md">
          Return to Sentinel
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      
      {/* 1. NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/sentinel')}>
          <div className="w-8 h-8 flex items-center justify-center">
             <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-[#1e40af]">
               <path d="M12 2L2 20H22L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
               <path d="M12 10L8 17H16L12 10Z" fill="currentColor"/>
             </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#0f172a]">TrustBridge</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-500">
          <Link to="#" className="hover:text-slate-900">Portfolio</Link>
          <Link to="#" className="text-[#1e40af] border-b-2 border-[#1e40af] pb-1">Lookup</Link>
          <Link to="#" className="hover:text-slate-900">Analytics</Link>
          <Link to="#" className="hover:text-slate-900">Compliance</Link>
          <Link to="#" className="hover:text-slate-900">Reports</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <Search size={14} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Search entity..." className="bg-transparent text-xs outline-none w-32" />
          </div>
          <button onClick={() => navigate('/dashboard')} className="bg-[#1e40af] text-white px-5 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-blue-800 transition-colors">
            Go to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10">
        
        {/* 2. HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
              <span className="bg-blue-100 text-[#1e40af] px-2 py-1 rounded">Entity Lookup</span>
              <span>•</span>
              <span>Trust ID: {entityData.trustId}</span>
            </div>
            <h1 className="text-3xl sm:text-[40px] font-black text-slate-900 tracking-tight">
              Search results for <span className="text-[#1e40af]">'{entityData.businessName}'</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            Last verified by TrustBridge Protocol: Just now <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </div>
        </div>

        {/* 3. HERO CARDS (Status & Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Main Status Card */}
          <div className="lg:col-span-2 bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <ShieldCheck size={160} className="absolute -right-10 -bottom-10 text-slate-50 stroke-[1]" />
            
            <div className="relative z-10 flex items-start gap-4 mb-10">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Verified</h2>
                <p className="text-slate-400 text-sm font-medium">Active Institutional Standing</p>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-4">
              <Badge icon={<ShieldAlert size={14}/>} label="Risk Profile" value={entityData.riskProfile} />
              <Badge icon={<Star size={14}/>} label="Tier Standing" value={entityData.tierStanding} />
              <Badge icon={<Building2 size={14}/>} label="Entity Type" value={entityData.entityType} className="capitalize" />
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-[#0a192f] rounded-[24px] p-8 text-white flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-lg font-bold mb-6">Available Actions</h3>
              <button className="w-full bg-[#1e40af] text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/50 mb-4 active:scale-95">
                <Download size={16} /> Download Due Diligence Report
              </button>
              <button className="w-full bg-slate-800 text-white border border-slate-700 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors active:scale-95">
                <Star size={16} /> Add to Portfolio
              </button>
            </div>
            <div className="flex items-start gap-3 text-slate-400 text-xs mt-6 bg-slate-800/50 p-4 rounded-xl">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>Data refreshed in real-time. For historical snapshots, please visit the <Link to="#" className="text-blue-400 underline">Analytics Vault</Link>.</p>
            </div>
          </div>
        </div>

        {/* 4. TOP METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard 
            title="TRUST SCORE" 
            value={entityData.score} 
            suffix="/ 100" 
            icon={<Activity size={18} />} 
            progress={entityData.score} 
          />
          <StatCard 
            title="VERIFICATION RATE" 
            value={`${entityData.verificationRate}%`} 
            icon={<ShieldCheck size={18} />} 
            subtext={<span className="text-emerald-500 font-bold flex items-center gap-1"><TrendingUp size={12}/> Live from ledger</span>} 
          />
          <StatCard 
            title="TOTAL TRANSACTION VOL" 
            value={formatVolume(entityData.totalVolume)} 
            icon={<span className="font-serif italic text-lg leading-none">₦</span>} 
            subtext={`Across ${entityData.totalVolume > 0 ? 'active' : '0'} institutional liquidity pools.`} 
          />
        </div>

        {/* 5. BOTTOM METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Revenue Chart */}
          <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-[13px] font-black text-slate-800 mb-6 flex items-center gap-2">
              <Activity size={16} className="text-[#1e40af]" /> Revenue Consistency
            </h3>
            <div className="flex-1 min-h-[120px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={entityData.revenueData}>
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {entityData.revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === entityData.revenueData.length - 1 ? '#1e40af' : '#dbeafe'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 font-medium pt-4 border-t border-slate-50">Ledger stability index mapped over time.</p>
          </div>

          {/* Dispute History */}
          <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <h3 className="text-[13px] font-black text-slate-800 mb-6 flex items-center gap-2">
              <ShieldAlert size={16} className="text-[#1e40af]" /> Dispute History
            </h3>
            <div className="text-center my-auto">
              <p className={`text-5xl font-black mb-2 tracking-tight ${entityData.disputes === 0 ? 'text-[#1e40af]' : 'text-rose-600'}`}>
                {entityData.disputes === 0 ? 'Zero' : entityData.disputes}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recorded Incidents</p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-6">
               <span className="text-xs text-slate-400 font-medium">Clean record since</span>
               <span className="text-xs font-black text-slate-800">{entityData.joinDate}</span>
            </div>
          </div>

          {/* Audit Trail Status */}
          <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <h3 className="text-[13px] font-black text-slate-800 mb-8 flex items-center gap-2">
              <FileText size={16} className="text-[#1e40af]" /> Audit Trail Status
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                   <TrendingUp size={14} />
                 </div>
                 <div>
                   <p className="text-sm font-black text-slate-800">Up-to-date</p>
                   <p className="text-xs text-slate-400 mt-1">Q3 2026 compliance seal active</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                   DB
                 </div>
                 <div>
                   <p className="text-sm font-black text-slate-800">Database Verified</p>
                   <p className="text-xs text-slate-400 mt-1 font-mono">Hash: {entityData.trustId.split('-')[1]}...x9a</p>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-black text-slate-800">Institutional Integrity Group <span className="text-slate-400 font-medium ml-2">© 2026 TrustBridge Protocol. All rights reserved.</span></p>
          <div className="flex gap-6 text-xs font-bold text-slate-400">
            <Link to="#" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-slate-800 transition-colors">Compliance Standards</Link>
            <Link to="#" className="hover:text-slate-800 transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- SUB COMPONENTS ---

const Badge = ({ icon, label, value, className = "" }) => (
  <div className={`flex items-center gap-3 bg-[#eff6ff] border border-[#dbeafe] px-4 py-2.5 rounded-xl ${className}`}>
    <div className="text-[#1e40af]">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-[13px] font-black text-[#1e3a8a] leading-none">{value}</p>
    </div>
  </div>
);

const StatCard = ({ title, value, suffix = "", icon, subtext, progress }) => (
  <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-6">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="text-[#1e40af]">{icon}</div>
    </div>
    <div className="flex items-baseline gap-1 mb-4">
      <h3 className="text-[40px] font-black text-slate-900 tracking-tight leading-none">{value}</h3>
      <span className="text-sm font-bold text-slate-400">{suffix}</span>
    </div>
    {progress !== undefined ? (
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-6">
        <div className="bg-[#1e40af] h-full" style={{ width: `${progress}%` }}></div>
      </div>
    ) : (
      <p className="text-xs text-slate-400 font-medium">{subtext}</p>
    )}
  </div>
);

export default SentinelLookupResult;
