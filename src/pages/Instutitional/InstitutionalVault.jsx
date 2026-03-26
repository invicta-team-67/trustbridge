import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Search, ShieldAlert, BarChart3, 
  FileCheck, Settings, LogOut, LifeBuoy, Bell, ChevronDown, 
  Filter, Download, AlertTriangle, Activity, ShieldCheck,
  PlusCircle, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const InstitutionalVault = () => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [vaultData, setVaultData] = useState({
    totalAssets: 0,
    averageScore: 0,
    criticalAlerts: 0,
    pendingAssessments: 0,
    portfolio: [],
    alertsFeed: []
  });

  // 1. REAL-TIME DATA AGGREGATION
  useEffect(() => {
    const fetchVaultData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate('/login'); return; }

        // Fetch all profiles (representing the lender's portfolio)
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, user_id, business_name, business_type, linkedin_verified, tax_verified');

        // Fetch all transactions to calculate aggregate risk & volume
        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select('user_id, amount, status, created_at');

        if (profiles && transactions) {
          let totalPlatformVolume = 0;
          let totalScoreSum = 0;
          let criticalCount = 0;
          let pendingCount = 0;
          let processedPortfolio = [];
          let generatedAlerts = [];

          profiles.forEach(profile => {
            const userTxs = transactions.filter(t => t.user_id === profile.user_id);
            const totalTx = userTxs.length;
            const verifiedTx = userTxs.filter(t => t.status === 'Verified').length;
            const pendingTx = userTxs.filter(t => t.status === 'Pending').length;
            const disputedTx = userTxs.filter(t => t.status === 'Disputed').length;
            
            pendingCount += pendingTx;

            const vRate = totalTx > 0 ? (verifiedTx / totalTx) : 0;
            const userVol = userTxs.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
            totalPlatformVolume += userVol;

            // Live Score Math (0-100 scale)
            let score = 0;
            score += Math.min(totalTx * 3, 30);
            score += Math.round(vRate * 40);
            if (profile.linkedin_verified) score += 15;
            if (profile.tax_verified) score += 15;

            // Optional scaling for "Institutional Score" (e.g., 0-1000 scale like the mockup)
            // Multiply by 10 to match the 842 / 912 style in your design
            const institutionalScore = score * 10;
            totalScoreSum += institutionalScore;

            // Risk Assessment
            let riskLevel = 'Stable';
            let riskColor = 'bg-emerald-500';
            if (institutionalScore < 500 || disputedTx > 0) {
              riskLevel = 'Critical';
              riskColor = 'bg-rose-500';
              criticalCount++;
              
              generatedAlerts.push({
                type: 'CRITICAL ALERT',
                entity: profile.business_name,
                message: disputedTx > 0 ? 'Negative signal detected: Disputed ledger entries.' : 'Credit signal degraded below institutional threshold.',
                time: 'Just now',
                color: 'text-rose-600',
                dot: 'bg-rose-600'
              });
            } else if (institutionalScore < 750) {
              riskLevel = 'Watching';
              riskColor = 'bg-amber-500';
              if (pendingTx > 0) {
                generatedAlerts.push({
                  type: 'MARKET WATCH',
                  entity: profile.business_name,
                  message: 'Verification bottleneck. Regulatory filing delayed.',
                  time: '2h ago',
                  color: 'text-amber-500',
                  dot: 'bg-amber-500'
                });
              }
            }

            processedPortfolio.push({
              id: profile.id,
              name: profile.business_name || 'Unnamed Entity',
              sector: (profile.business_type || 'General').replace('_', ' '),
              score: institutionalScore,
              riskColor
            });
          });

          // Add a system info alert just to populate the feed if it's empty
          generatedAlerts.push({
            type: 'SYSTEM INFO',
            entity: 'Automated Rebalancing',
            message: 'Portfolio collateral optimization completed for Q3 projection models.',
            time: '5h ago',
            color: 'text-slate-400',
            dot: 'bg-slate-300'
          });

          setVaultData({
            totalAssets: totalPlatformVolume,
            averageScore: profiles.length > 0 ? Math.round(totalScoreSum / profiles.length) : 0,
            criticalAlerts: criticalCount,
            pendingAssessments: pendingCount,
            // Sort by highest score, take top 5 for the main view
            portfolio: processedPortfolio.sort((a, b) => b.score - a.score).slice(0, 5),
            alertsFeed: generatedAlerts.slice(0, 4) // Keep latest 4 alerts
          });
        }
      } catch (err) {
        console.error("Vault Sync Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaultData();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  const formatCurrency = (val) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  // --- SUB-COMPONENTS ---
  const SidebarItem = ({ icon, label, active }) => (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors ${active ? 'bg-slate-50 text-[#1e40af] font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
      {icon} {label}
    </div>
  );

  const KPICard = ({ title, value, subtext, subtextColor = "text-slate-400", isAlert = false }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{title}</p>
      <p className={`text-4xl font-black tracking-tight mb-2 ${isAlert && parseInt(value) > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{value}</p>
      <div className={`text-xs font-medium flex items-center gap-1.5 ${subtextColor}`}>
        {subtext}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30">
        <div className="p-6">
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Institutional Vault</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lending Division</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <SidebarItem icon={<Users size={18} />} label="Entity Directory" />
          <SidebarItem icon={<Search size={18} />} label="Lookup" />
          <SidebarItem icon={<ShieldCheck size={18} />} label="Audit Sentinel" />
          <SidebarItem icon={<BarChart3 size={18} />} label="Analytics" />
          <SidebarItem icon={<FileCheck size={18} />} label="Compliance" />
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-3">
          <button className="w-full bg-[#1e40af] text-white py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-800 transition-colors">
            New Verification
          </button>
          <div className="flex flex-col gap-1 px-2 pt-2">
             <button className="flex items-center gap-3 text-slate-500 hover:text-slate-800 text-sm font-medium py-2"><LifeBuoy size={16} /> Support</button>
             <button onClick={handleLogout} className="flex items-center gap-3 text-slate-500 hover:text-rose-600 text-sm font-medium py-2"><LogOut size={16} /> Sign Out</button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        
        {/* TOP NAV */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center w-96 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Search size={16} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Search portfolio, entities, or alerts..." className="bg-transparent text-sm outline-none w-full placeholder-slate-400" />
          </div>
          <div className="flex items-center gap-5">
            <Bell size={18} className="text-slate-400 cursor-pointer hover:text-slate-700" />
            <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50"><Activity size={12}/></div>
            <div className="h-6 w-px bg-slate-200"></div>
            <button className="text-sm font-bold text-slate-600 hover:text-slate-900">Support</button>
            <button className="bg-[#1e40af] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-800">Verify New Entity</button>
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">Alex Mercer</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">CIO</p>
              </div>
              <img src="https://ui-avatars.com/api/?name=Alex+Mercer&background=0f172a&color=fff" className="w-9 h-9 rounded-lg border border-slate-200" alt="profile" />
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Aggregating Global Risk Data...</p>
          </div>
        ) : (
          <div className="p-8 flex-1">
            
            {/* PAGE HEADER */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-[28px] font-black text-slate-900 tracking-tight mb-2">Institutional Overview</h2>
                <p className="text-sm text-slate-500 font-medium">Real-time exposure analysis and institutional risk reporting for the Lending Division.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm"><Filter size={16}/> Filters</button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm"><Download size={16}/> Export Report</button>
              </div>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <KPICard 
                title="TOTAL AUDITED ASSETS" 
                value={formatCurrency(vaultData.totalAssets)} 
                subtext={<><TrendingUp size={14} className="text-emerald-500" /> <span className="text-emerald-600 font-bold">~4.2%</span> vs prev. month</>} 
              />
              <KPICard 
                title="AVERAGE TRUST SCORE" 
                value={vaultData.averageScore} 
                subtext={<><ShieldCheck size={14} className="text-[#1e40af]" /> <span className="text-slate-600 font-bold">High Yield Benchmark</span></>} 
              />
              <KPICard 
                title="CRITICAL RISK ALERTS" 
                value={vaultData.criticalAlerts < 10 ? `0${vaultData.criticalAlerts}` : vaultData.criticalAlerts} 
                isAlert={true}
                subtext={<><AlertTriangle size={14} className="text-rose-500" /> <span className="text-rose-600 font-bold">Requires Action</span></>} 
              />
              <KPICard 
                title="PENDING ASSESSMENTS" 
                value={vaultData.pendingAssessments} 
                subtext={<><Activity size={14} className="text-slate-400" /> <span className="text-slate-500 font-medium">In Review</span></>} 
              />
            </div>

            {/* MAIN LAYOUT (Table + Sidebar) */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              
              {/* Active Portfolio Entities Table */}
              <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">Active Portfolio Entities</h3>
                  <div className="flex gap-4 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Stable</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Watching</span>
                  </div>
                </div>

                <div className="flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="p-6 font-medium">Business Name</th>
                        <th className="p-6 font-medium">Sector</th>
                        <th className="p-6 font-medium">Score</th>
                        <th className="p-6 font-medium">Risk Profile</th>
                        <th className="p-6 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {vaultData.portfolio.length > 0 ? vaultData.portfolio.map((entity, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-6 flex items-center gap-4">
                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 uppercase">
                              {entity.name.substring(0,2)}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{entity.name}</span>
                          </td>
                          <td className="p-6 text-sm text-slate-500 capitalize">{entity.sector}</td>
                          <td className="p-6 text-sm font-bold text-emerald-600 bg-emerald-50/50 px-2 py-1 rounded inline-block mt-5 ml-4">{entity.score}</td>
                          <td className="p-6">
                            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${entity.riskColor} rounded-full`} style={{ width: `${(entity.score / 1000) * 100}%` }}></div>
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <button className="text-xs font-bold text-[#1e40af] hover:underline">View Details</button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" className="p-8 text-center text-sm font-medium text-slate-400">No entities currently in portfolio.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-50 text-center">
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Show All Portfolio Entities</button>
                </div>
              </div>

              {/* Risk Sentinel Sidebar */}
              <div className="w-full lg:w-80 bg-[#f8fafc] border border-slate-200 rounded-2xl shadow-inner flex flex-col p-6">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-slate-900 flex items-center gap-2"><ShieldCheck size={18} className="text-[#1e40af]" /> Risk Sentinel</h3>
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                </div>

                <div className="flex-1 space-y-8 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {vaultData.alertsFeed.map((alert, i) => (
                    <div key={i} className="relative flex items-start gap-4 z-10">
                      <div className={`w-3 h-3 mt-1 rounded-full border-2 border-[#f8fafc] shrink-0 ${alert.dot}`}></div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className={`text-[10px] font-black uppercase tracking-widest ${alert.color}`}>{alert.type}</p>
                          <span className="text-[10px] font-bold text-slate-400">{alert.time}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 mb-1">{alert.entity}</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">{alert.message}</p>
                        {alert.type === 'CRITICAL ALERT' && (
                          <button className="text-[10px] font-bold text-[#1e40af] border border-[#1e40af] px-3 py-1.5 rounded bg-white shadow-sm hover:bg-blue-50 transition-colors uppercase tracking-wider">Review Signal</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-[#1e40af] rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1 relative z-10">Risk Sentinel Status</p>
                  <p className="text-sm font-bold mb-4 relative z-10">Monitoring 4,284 nodes</p>
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex -space-x-2">
                      <img src="https://ui-avatars.com/api/?name=JS&background=fff&color=1e40af" className="w-6 h-6 rounded-full border border-[#1e40af]" alt="user" />
                      <img src="https://ui-avatars.com/api/?name=AM&background=0f172a&color=fff" className="w-6 h-6 rounded-full border border-[#1e40af]" alt="user" />
                      <div className="w-6 h-6 rounded-full border border-[#1e40af] bg-blue-800 flex items-center justify-center text-[8px] font-bold">+12</div>
                    </div>
                    <button className="text-[10px] font-bold underline underline-offset-2">Live Support</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* BLUE FOOTER AREA */}
        <footer className="bg-[#e0e7ff] border-t border-blue-100 py-12 px-8 mt-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
               <h4 className="text-sm font-black text-slate-900 mb-4">Institutional Vault</h4>
               <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">The premier operating system for modern lending institutions. Secure, compliant, and architected for institutional precision.</p>
               <button className="bg-[#1e40af] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-800 transition-colors">New Verification</button>
            </div>
            
            <div>
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Core Systems</h4>
               <ul className="space-y-3 text-xs font-medium text-slate-600">
                 <li className="hover:text-[#1e40af] cursor-pointer">Risk Sentinel Engine</li>
                 <li className="hover:text-[#1e40af] cursor-pointer">Portfolio Orchestrator</li>
                 <li className="hover:text-[#1e40af] cursor-pointer">Liquidity Matrix</li>
                 <li className="hover:text-[#1e40af] cursor-pointer">Compliance Ledger</li>
               </ul>
            </div>

            <div>
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Resources</h4>
               <ul className="space-y-3 text-xs font-medium text-slate-600">
                 <li className="hover:text-[#1e40af] cursor-pointer">Documentation</li>
                 <li className="hover:text-[#1e40af] cursor-pointer">API Reference</li>
                 <li className="hover:text-[#1e40af] cursor-pointer">Market Reports</li>
                 <li className="hover:text-[#1e40af] cursor-pointer">Trust Center</li>
               </ul>
            </div>

            <div>
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Legal & Compliance</h4>
               <div className="bg-white p-4 rounded-xl border border-blue-50 shadow-sm">
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">All transactions are secured with 256-bit encryption and monitored by Global Risk Compliance protocols.</p>
                 <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                   <span className="text-[10px] font-black text-slate-900">System Status: Optimal</span>
                   <div className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div></div>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-blue-200 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 TRUSTBRIDGE GLOBAL INSTITUTIONAL SERVICES LLC. ALL RIGHTS RESERVED.</p>
             <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
               <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
               <span className="hover:text-slate-600 cursor-pointer">SEC Disclosure</span>
             </div>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default InstitutionalVault;
