import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, ArrowRightLeft, PlusCircle, FileText, 
  ShieldCheck, Settings, LogOut, Search, Bell, Menu, X,
  ChevronRight, AlertCircle, TrendingUp, CheckCircle2, AlertTriangle, 
  Filter, ChevronLeft, UploadCloud, ChevronDown, Calendar, Download, Loader2
} from 'lucide-react';
import Logo from '../../components/logo';

// --- 1. OVERVIEW DATA ---
const stats = [
  { title: "TOTAL TRANSACTIONS", value: "1,284", trend: "+12%", trendUp: true, icon: <ArrowRightLeft className="w-5 h-5 text-blue-500" /> },
  { title: "VERIFIED", value: "1,240", trend: "+8%", trendUp: true, icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
  { title: "DISPUTED", value: "12", trend: "-2%", trendUp: false, icon: <AlertTriangle className="w-5 h-5 text-red-500" /> },
];

const insights = [
  { id: 1, type: "Medium Risk Detected", desc: "High-risk patterns detected in 2 recent transfers from a new IP location.", color: "bg-orange-500" },
  { id: 2, type: "IMPROVE SCORE", desc: "Verify your LinkedIn company page to increase your Trust Score by +4 points.", color: "bg-blue-500" },
  { id: 3, type: "VERIFICATION TIP", desc: "Enable 2FA for all team members to satisfy security audit criteria.", color: "bg-blue-500" },
];

// --- 2. TRANSACTION DATA ---
const allTransactions = [
    // Page 1
    { id: 1, client: 'Julianne Deaton', initials: 'JD', color: 'bg-blue-100 text-blue-600', desc: 'Quarterly Asset Management Fee', amount: '₦4,800,000.00', date: '14 Feb, 2026', status: 'Verified' },
    { id: 2, client: 'Marcus Kholi', initials: 'MK', color: 'bg-yellow-100 text-yellow-600', desc: 'Escrow Holding Release - Prop A', amount: '₦8,800,000.00', date: '14 Feb, 2026', status: 'Pending' },
    { id: 3, client: 'Sovereign Tech Ltd', initials: 'ST', color: 'bg-purple-100 text-purple-600', desc: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Awaiting' },
    { id: 4, client: 'Supreme Tech Ltd', initials: 'ST', color: 'bg-purple-100 text-purple-600', desc: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Awaiting' },
    { id: 5, client: 'Blue-Tree Holdings', initials: 'BT', color: 'bg-red-100 text-red-600', desc: 'Wire Transfer Rejection Fee', amount: '₦3,800,000.00', date: '16 Feb, 2026', status: 'Disputed' },
    // Page 2
    { id: 6, client: 'Julianne Deaton', initials: 'JD', color: 'bg-blue-100 text-blue-600', desc: 'Quarterly Asset Management Fee', amount: '₦4,800,000.00', date: '14 Feb, 2026', status: 'Verified' },
    { id: 7, client: 'Marcus Kholi', initials: 'MK', color: 'bg-yellow-100 text-yellow-600', desc: 'Escrow Holding Release - Prop A', amount: '₦8,800,000.00', date: '14 Feb, 2026', status: 'Verified' },
    { id: 8, client: 'Sovereign Tech Ltd', initials: 'ST', color: 'bg-purple-100 text-purple-600', desc: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Verified' },
    { id: 9, client: 'Supreme Tech Ltd', initials: 'ST', color: 'bg-purple-100 text-purple-600', desc: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Verified' },
    { id: 10, client: 'Blue-Tree Holdings', initials: 'BT', color: 'bg-red-100 text-red-600', desc: 'Wire Transfer Rejection Fee', amount: '₦3,800,000.00', date: '16 Feb, 2026', status: 'Verified' },
    // Page 3
    { id: 11, client: 'Julianne Deaton', initials: 'JD', color: 'bg-blue-100 text-blue-600', desc: 'Quarterly Asset Management Fee', amount: '₦4,800,000.00', date: '14 Feb, 2026', status: 'Pending' },
    { id: 12, client: 'Marcus Kholi', initials: 'MK', color: 'bg-yellow-100 text-yellow-600', desc: 'Escrow Holding Release - Prop A', amount: '₦8,800,000.00', date: '14 Feb, 2026', status: 'Pending' },
    { id: 13, client: 'Sovereign Tech Ltd', initials: 'ST', color: 'bg-purple-100 text-purple-600', desc: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Pending' },
    { id: 14, client: 'Supreme Tech Ltd', initials: 'ST', color: 'bg-purple-100 text-purple-600', desc: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Pending' },
    { id: 15, client: 'Blue-Tree Holdings', initials: 'BT', color: 'bg-red-100 text-red-600', desc: 'Wire Transfer Rejection Fee', amount: '₦3,800,000.00', date: '16 Feb, 2026', status: 'Pending' },
    // Page 4
    { id: 16, client: 'Julianne Deaton', initials: 'JD', color: 'bg-blue-100 text-blue-600', desc: 'Quarterly Asset Management Fee', amount: '₦4,800,000.00', date: '14 Feb, 2026', status: 'Awaiting' },
    { id: 17, client: 'Marcus Kholi', initials: 'MK', color: 'bg-yellow-100 text-yellow-600', desc: 'Escrow Holding Release - Prop A', amount: '₦8,800,000.00', date: '14 Feb, 2026', status: 'Awaiting' },
    { id: 18, client: 'Sovereign Tech Ltd', initials: 'ST', color: 'bg-purple-100 text-purple-600', desc: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Awaiting' },
    { id: 19, client: 'Supreme Tech Ltd', initials: 'ST', color: 'bg-purple-100 text-purple-600', desc: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Awaiting' },
    { id: 20, client: 'Blue-Tree Holdings', initials: 'BT', color: 'bg-red-100 text-red-600', desc: 'Wire Transfer Rejection Fee', amount: '₦3,800,000.00', date: '16 Feb, 2026', status: 'Awaiting' },
    // Filler
    ...Array.from({ length: 22 }).map((_, i) => ({
      id: 21 + i,
      client: i % 2 === 0 ? 'Aramide Adeyemi' : 'Adeyemi Araoye',
      initials: 'AA',
      color: 'bg-green-100 text-green-600',
      desc: 'Corporate Bond Interest Payout',
      amount: '₦11,800,000.00',
      date: '16 Feb, 2026',
      status: i % 3 === 0 ? 'Verified' : 'Pending'
    }))
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  // STATE: Navigation & Data
  const [activeView, setActiveView] = useState('transactions'); 
  const [transactionFilter, setTransactionFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // AUTH GUARD
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate('/login'); } 
        else { setIsLoadingAuth(false); }
      } catch (error) { navigate('/login'); }
    };
    checkAuth();
  }, [navigate]);

  // Reset pagination when filter changes
  useEffect(() => { setCurrentPage(1); }, [transactionFilter]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // --- RENDERER 1: OVERVIEW COMPONENT ---
  const renderOverview = () => (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              Your business trust rating has improved by <span className="text-green-500 font-bold">5 points</span> since last month.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
              <button className="bg-[#1a56db] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">View Report</button>
              <button className="bg-white border border-gray-200 text-[#0f172a] px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">Share Score</button>
            </div>
          </div>
        </div>
        <div className="bg-[#1a56db] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div>
            <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
            <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6">Instantly log new transactions or manage pending verifications.</p>
          </div>
          <button onClick={() => setActiveView('log-transaction')} className="bg-white text-[#1a56db] w-full py-3 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors z-10">
            <PlusCircle className="w-5 h-5" /> Log New Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className={`px-2.5 py-1 rounded text-xs font-bold ${stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{stat.trend}</div>
            </div>
            <h4 className="text-xs font-bold text-gray-400 tracking-wider mb-1">{stat.title}</h4>
            <p className="text-3xl font-extrabold text-[#0f172a]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-bold text-[#0f172a]">Transaction Growth</h3>
               <select className="bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 rounded-lg px-3 py-1.5 outline-none"><option>Last 30 Days</option></select>
             </div>
             <div className="flex-1 min-h-[250px] relative w-full flex items-end">
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
        </div>
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
        </div>
      </div>
    </div>
  );

  // --- RENDERER 2: TRANSACTION TABLE COMPONENT ---
  const renderTransactions = () => {
    const filteredData = allTransactions.filter(tx => transactionFilter === 'All' || tx.status === transactionFilter);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const getPageNumbers = () => {
      if (totalPages <= 3) return [...Array(totalPages)].map((_, i) => i + 1);
      if (currentPage <= 2) return [1, 2, 3];
      if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages];
      return [currentPage - 1, currentPage, currentPage + 1];
    };

    const getStatusStyles = (status) => {
      switch (status) {
        case 'Verified': return 'bg-green-100 text-green-700';
        case 'Pending': return 'bg-[#fffbeb] text-[#b45309]';
        case 'Awaiting': return 'bg-blue-100 text-blue-700';
        case 'Disputed': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
            <p className="text-slate-500 mt-1">Manage and track institutional flow of funds</p>
          </div>
          <button onClick={() => setActiveView('log-transaction')} className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-colors">
            <PlusCircle size={18} /> Log New Transaction
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
           <div className="flex bg-white border border-slate-200 p-1 rounded-full shadow-sm">
             {['All', 'Verified', 'Pending', 'Awaiting', 'Disputed'].map((tab) => (
               <button key={tab} onClick={() => setTransactionFilter(tab)}
                 className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                   transactionFilter === tab ? 'bg-blue-800 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                 }`}>
                 {tab}
               </button>
             ))}
           </div>
           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
              <Filter size={16} /> More Filters
            </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Amount (NGN)</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.length > 0 ? (
                  currentItems.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${tx.color}`}>{tx.initials}</div>
                          <span className="text-sm font-medium text-slate-900">{tx.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{tx.desc}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{tx.amount}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(tx.status)}`}>{tx.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-orange-600 hover:text-orange-700 text-xs font-medium hover:underline">View<br/>Details</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-sm">No transactions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
             <span>Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} transactions</span>
             <div className="flex items-center gap-1">
               <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-50"><ChevronLeft size={16} /></button>
               {getPageNumbers().map((pageNum) => (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-colors ${currentPage === pageNum ? 'bg-blue-800 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>{pageNum}</button>
               ))}
               <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-50"><ChevronRight size={16} /></button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="VERIFIED TOTAL" value="₦24.2M" subtext={<span className="text-green-600 font-medium">↗ +12% vs last month</span>} />
            <StatCard label="PENDING PAYOUTS" value="₦8.4M" subtext={<span className="text-slate-500">🕓 4 active requests</span>} />
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">VERIFICATION RATE</p>
               <p className="text-2xl font-bold text-slate-900 mb-3">94.2%</p>
               <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-blue-700 h-1.5 rounded-full" style={{ width: '94.2%' }}></div></div>
            </div>
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">DISPUTED CASES</p>
               <p className="text-2xl font-bold text-red-600 mb-2">2</p>
               <p className="text-xs text-red-500 font-medium flex items-center gap-1">⚠ Requires attention</p>
            </div>
        </div>
      </div>
    );
  };

  // --- RENDERER 3: LOG TRANSACTION FORM (NEW!) ---
  const renderLogTransaction = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Log New Transaction</h1>
        <p className="text-slate-500 mt-2 text-sm">Enter the details of the service provided to record a new entry in the trust ledger.</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Client Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select or search client</option>
                <option>Julianne Deaton</option>
                <option>Marcus Kholi</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Service Provided <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g Landing page Redesign" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Transaction Amount <span className="text-red-500">*</span></label>
            <input type="text" placeholder="₦0.00" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-slate-400">Total amount in Nigerian Naira</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Due Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <label className="text-sm font-bold text-slate-700">Description</label>
          <textarea rows="4" placeholder="Briefly describe the deliverables or terms of service" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
        </div>

        <div className="space-y-2 mb-8">
          <label className="text-sm font-bold text-slate-700">Upload Proof of Work</label>
          <div className="border-2 border-dashed border-blue-100 bg-blue-50/50 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-3">
              <UploadCloud className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, or PDF up to 10MB</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button onClick={() => setActiveView('transactions')} className="px-6 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button className="px-6 py-2.5 bg-blue-800 text-white rounded-lg text-sm font-bold hover:bg-blue-900 shadow-md transition-colors">Log Transaction</button>
        </div>
      </div>
    </div>
  );

  // 3. SIDEBAR COMPONENT
  const SidebarContent = ({ onDesktopClose }) => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 w-64">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="w-8 h-8" />
          <span className="font-bold text-xl text-[#0f172a]">TrustBridge</span>
        </div>
        {onDesktopClose && <button onClick={onDesktopClose} className="hidden lg:block p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>}
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <button onClick={() => setActiveView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-blue-50 text-[#1a56db] font-semibold' : 'text-gray-500 hover:text-[#1a56db] hover:bg-gray-50'}`}>
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </button>
        <button onClick={() => setActiveView('transactions')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-colors ${activeView === 'transactions' || activeView === 'log-transaction' ? 'bg-blue-50 text-[#1a56db] font-semibold' : 'text-gray-500 hover:text-[#1a56db] hover:bg-gray-50'}`}>
          <ArrowRightLeft className="w-5 h-5" /> Transaction
        </button>
        <button onClick={() => setActiveView('log-transaction')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#1a56db] hover:bg-gray-50 font-medium rounded-lg"><PlusCircle className="w-5 h-5" /> Add Transaction</button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#1a56db] hover:bg-gray-50 font-medium rounded-lg"><FileText className="w-5 h-5" /> Report</button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#1a56db] hover:bg-gray-50 font-medium rounded-lg"><ShieldCheck className="w-5 h-5" /> Trust Score</button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#1a56db] hover:bg-gray-50 font-medium rounded-lg"><Settings className="w-5 h-5" /> Settings</button>
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 font-medium rounded-lg transition-colors w-full"><LogOut className="w-5 h-5" /> Log out</button>
      </div>
    </div>
  );

  if (isLoadingAuth) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]"><Loader2 className="w-10 h-10 text-[#1a56db] animate-spin mb-4" /><p className="text-gray-500 font-medium animate-pulse">Authenticating securely...</p></div>;

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-[#0f172a]">
      {/* Sidebar Desktop */}
      <AnimatePresence initial={false}>
        {isDesktopSidebarOpen && (
          <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 256, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="hidden lg:block h-full flex-shrink-0 z-20 shadow-sm overflow-hidden">
            <SidebarContent onDesktopClose={() => setIsDesktopSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed inset-y-0 left-0 w-64 h-full z-50 lg:hidden shadow-2xl overflow-hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Menu className="w-5 h-5" /></button>
            {!isDesktopSidebarOpen && <button onClick={() => setIsDesktopSidebarOpen(true)} className="hidden lg:block p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg mr-2"><Menu className="w-5 h-5" /></button>}
            <div className="hidden sm:flex items-center text-sm font-medium text-gray-500">
              <span className="hover:text-gray-800 cursor-pointer" onClick={() => setActiveView('dashboard')}>Home</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              {activeView === 'log-transaction' && (
                <>
                  <span className="hover:text-gray-800 cursor-pointer" onClick={() => setActiveView('transactions')}>Transactions</span>
                  <ChevronRight className="w-4 h-4 mx-1" />
                </>
              )}
              <span className="text-[#0f172a] font-bold capitalize">{activeView.replace('-', ' ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
               <div className="hidden sm:block text-right">
                 <p className="text-sm font-bold text-[#0f172a]">Alex Rivera</p>
                 <p className="text-xs text-gray-500 font-medium">Compliance Officer</p>
               </div>
               <img src="/landing-images/user1.jpg" alt="Profile" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
             </div>
          </div>
        </header>

        {/* Dynamic Content Switching */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
           {activeView === 'dashboard' && renderOverview()}
           {activeView === 'transactions' && renderTransactions()}
           {activeView === 'log-transaction' && renderLogTransaction()}
        </main>
      </div>
    </div>
  );
}

// Sub-component for Stats
const StatCard = ({ label, value, subtext }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
    </div>
    <div className="text-xs">{subtext}</div>
  </div>
);