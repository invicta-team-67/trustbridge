import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ArrowRightLeft, PlusCircle, FileText, 
  ShieldCheck, Settings, LogOut, Search, Bell, Menu, X,
  ChevronRight, AlertCircle, TrendingUp, CheckCircle2, AlertTriangle, Download
} from 'lucide-react';
import Logo from '../../components/logo'; // Using your new global logo!

// --- MOCK DATA ---
const stats = [
  { title: "TOTAL TRANSACTIONS", value: "1,284", trend: "+12%", trendUp: true, icon: <ArrowRightLeft className="w-5 h-5 text-blue-500" /> },
  { title: "VERIFIED", value: "1,240", trend: "+8%", trendUp: true, icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
  { title: "DISPUTED", value: "12", trend: "-2%", trendUp: false, icon: <AlertTriangle className="w-5 h-5 text-red-500" /> },
];

const transactions = [
  { id: 1, client: "Nexus Labs", initial: "NL", amount: "₦45,200.00", status: "Verified", date: "January 24, 2026", color: "bg-blue-100 text-blue-600" },
  { id: 2, client: "Apex Ventures", initial: "AV", amount: "₦55,200.00", status: "Pending", date: "February 14, 2026", color: "bg-purple-100 text-purple-600" },
  { id: 3, client: "TechSolutions Inc", initial: "TS", amount: "₦68,500.00", status: "Disputed", date: "December 27, 2025", color: "bg-orange-100 text-orange-600" },
];

const insights = [
  { id: 1, type: "Medium Risk Detected", desc: "High-risk patterns detected in 2 recent transfers from a new IP location.", color: "bg-orange-500" },
  { id: 2, type: "IMPROVE SCORE", desc: "Verify your LinkedIn company page to increase your Trust Score by +4 points.", color: "bg-blue-500" },
  { id: 3, type: "VERIFICATION TIP", desc: "Enable 2FA for all team members to satisfy security audit criteria.", color: "bg-blue-500" },
];

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- COMPONENTS ---

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="p-6 flex items-center gap-3">
        <Logo size="w-8 h-8" />
        <span className="font-bold text-xl text-[#0f172a]">TrustBridge</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-[#1a56db] font-semibold rounded-lg transition-colors">
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#1a56db] hover:bg-gray-50 font-medium rounded-lg transition-colors">
          <ArrowRightLeft className="w-5 h-5" /> Transaction
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#1a56db] hover:bg-gray-50 font-medium rounded-lg transition-colors">
          <PlusCircle className="w-5 h-5" /> Add Transaction
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#1a56db] hover:bg-gray-50 font-medium rounded-lg transition-colors">
          <FileText className="w-5 h-5" /> Report
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#1a56db] hover:bg-gray-50 font-medium rounded-lg transition-colors">
          <ShieldCheck className="w-5 h-5" /> Trust Score
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#1a56db] hover:bg-gray-50 font-medium rounded-lg transition-colors">
          <Settings className="w-5 h-5" /> Settings
        </a>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 font-medium rounded-lg transition-colors w-full">
          <LogOut className="w-5 h-5" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-[#0f172a]">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:block w-64 h-full flex-shrink-0 z-20 shadow-sm">
        <SidebarContent />
      </aside>

      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 h-full z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
              <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-4 p-1 bg-gray-100 rounded-full text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center text-sm font-medium text-gray-500">
              <span className="hover:text-gray-800 cursor-pointer">Home</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-[#0f172a] font-bold">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 w-full justify-end lg:w-auto">
            <div className="relative hidden md:block w-64 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search transactions, clients or reports..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:bg-white transition-all" />
            </div>
            
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-[#0f172a]">Alex Rivera</p>
                <p className="text-xs text-gray-500 font-medium">Compliance Officer</p>
              </div>
              <img src="/landing-images/user1.jpg" alt="Profile" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
            </div>
          </div>
        </header>

        {/* SCROLLABLE DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* ROW 1: Trust Score & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trust Score Card */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-[#1a56db]" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-[#0f172a]">85%</span>
                    <span className="text-[10px] font-bold text-[#1a56db] tracking-widest uppercase">Strong</span>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold mb-2">Overall Trust Score</h2>
                  <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">
                    Your business trust rating has improved by <span className="text-green-500 font-bold">5 points</span> since last month. High verification rates are positively impacting your score.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                    <button className="bg-[#1a56db] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">View Detailed Report</button>
                    <button className="bg-white border border-gray-200 text-[#0f172a] px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">Share Score</button>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-[#1a56db] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
                  <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6">Instantly log new transactions or manage pending verifications.</p>
                </div>
                <button className="bg-white text-[#1a56db] w-full py-3 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                  <PlusCircle className="w-5 h-5" /> Log New Transaction
                </button>
              </div>
            </div>

            {/* ROW 2: Priority Alert */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
                  <AlertCircle className="w-5 h-5 text-[#1a56db]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0f172a] text-sm mb-0.5">Priority Alert</h4>
                  <p className="text-gray-500 text-sm font-medium">Verification pending for "TechSolutions Inc" transaction (₦45,200). Needs immediate review.</p>
                </div>
              </div>
              <button className="bg-[#1a56db] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors whitespace-nowrap w-full sm:w-auto">
                Resolve Now
              </button>
            </div>

            {/* ROW 3: Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className={`px-2.5 py-1 rounded text-xs font-bold ${stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {stat.trend}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-gray-400 tracking-wider mb-1">{stat.title}</h4>
                  <p className="text-3xl font-extrabold text-[#0f172a]">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* ROW 4: Chart & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart Placeholder */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-[#0f172a]">Transaction Growth</h3>
                  <select className="bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 rounded-lg px-3 py-1.5 outline-none">
                    <option>Last 30 Days</option>
                    <option>This Year</option>
                  </select>
                </div>
                <div className="flex-1 min-h-[250px] relative w-full flex items-end">
                  {/* CSS-based Mock Area Chart matching the design exactly */}
                  <div className="absolute inset-0 border-b-2 border-dashed border-gray-200 top-1/2"></div>
                  <div className="absolute inset-0 border-b-2 border-dashed border-gray-200 top-1/4"></div>
                  <div className="absolute inset-0 border-b-2 border-dashed border-gray-200 top-3/4"></div>
                  <svg viewBox="0 0 800 300" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#1a56db" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#1a56db" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 150 Q 100 200 200 150 T 350 50 T 500 200 T 650 250 T 800 150 L 800 300 L 0 300 Z" fill="url(#gradient)" />
                    <path d="M0 150 Q 100 200 200 150 T 350 50 T 500 200 T 650 250 T 800 150" fill="none" stroke="#1a56db" strokeWidth="4" className="drop-shadow-md" />
                  </svg>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-400 mt-4 px-4">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>

              {/* AI Insights Sidebar */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-[#0f172a] mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#1a56db]" /> AI Insights
                </h3>
                <div className="flex-1 space-y-4">
                  {insights.map((insight) => (
                    <div key={insight.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-gray-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`text-xs font-bold tracking-wide ${insight.color === 'bg-orange-500' ? 'text-orange-600' : 'text-[#1a56db]'}`}>{insight.type}</h4>
                        <div className={`w-2 h-2 rounded-full ${insight.color}`}></div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">{insight.desc}</p>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full py-2 text-sm font-bold text-gray-400 hover:text-[#1a56db] transition-colors">
                  View All Insights
                </button>
              </div>
            </div>

            {/* ROW 5: Recent Transactions Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-bold text-[#0f172a]">Recent Transaction</h3>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#1a56db] text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
                    <PlusCircle className="w-4 h-4" /> New Transaction
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-blue-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${txn.color}`}>
                            {txn.initial}
                          </div>
                          <span className="font-bold text-[#0f172a] text-sm">{txn.client}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-[#0f172a] text-sm">{txn.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            txn.status === 'Verified' ? 'bg-green-50 text-green-600 border border-green-200' :
                            txn.status === 'Pending' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                            'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            {txn.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                            {txn.status === 'Pending' && <AlertCircle className="w-3 h-3" />}
                            {txn.status === 'Disputed' && <AlertTriangle className="w-3 h-3" />}
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{txn.date}</td>
                        <td className="px-6 py-4">
                          <button className="text-[#1a56db] font-bold text-sm hover:underline">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ROW 6: Bottom CTA */}
            <div className="bg-[#1a56db] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a56db] to-[#1e3a8a] z-0"></div>
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready for more advanced insights?</h3>
                <p className="text-blue-100 text-sm font-medium">Upgrade to Enterprise Pro to unlock detailed analytics and priority support.</p>
              </div>
              <div className="relative z-10 flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-white text-[#1a56db] px-6 py-3 rounded-lg text-sm font-bold shadow-md hover:bg-gray-50 transition-colors">Upgrade Plan</button>
                <button className="flex-1 md:flex-none bg-blue-800 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors border border-blue-700">Dismiss</button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}