import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Plus, 
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // 1. CONNECTED: Import Supabase Client

const TransactionDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; 

  // 2. CONNECTED: Auth Guard - Ensures only logged-in users access this page
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkUser();
  }, [navigate]);

  // 3. CONNECTED: Logout Functionality
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // --- DATA ---
  const allTransactions = [
    { id: 1, clientName: 'Julianne Deaton', initials: 'JD', initialColor: 'bg-blue-50 text-blue-500', description: 'Quarterly Asset Management Fee', amount: '₦4,800,000.00', date: '14 Feb, 2026', status: 'Verified' },
    { id: 2, clientName: 'Marcus Kholi', initials: 'MK', initialColor: 'bg-orange-50 text-orange-500', description: 'Escrow Holding Release - Prop A', amount: '₦8,800,000.00', date: '14 Feb, 2026', status: 'Pending' },
    { id: 3, clientName: 'Sovereign Tech Ltd', initials: 'ST', initialColor: 'bg-purple-100 text-purple-500', description: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Awaiting' },
    { id: 4, clientName: 'Supreme Tech Ltd', initials: 'ST', initialColor: 'bg-purple-100 text-purple-500', description: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Awaiting' },
    { id: 5, clientName: 'Blue-Tree Holdings', initials: 'BT', initialColor: 'bg-red-100 text-red-500', description: 'Wire Transfer Rejection Fee', amount: '₦3,800,000.00', date: '16 Feb, 2026', status: 'Disputed' },
    { id: 6, clientName: 'Aramide Adeyemi', initials: 'AA', initialColor: 'bg-green-50 text-green-500', description: 'Corporate Bond Interest Payout', amount: '₦11,800,000.00', date: '16 Feb, 2026', status: 'Verified' },
    { id: 7, clientName: 'Adeyemi Araoye', initials: 'AA', initialColor: 'bg-green-50 text-green-500', description: 'Corporate Bond Interest Payout', amount: '₦11,800,000.00', date: '16 Feb, 2026', status: 'Verified' },
    ...Array.from({ length: 35 }).map((_, i) => ({
      id: 8 + i,
      clientName: 'Institutional Client ' + (i + 1),
      initials: 'IC',
      initialColor: 'bg-slate-100 text-slate-500',
      description: 'Standard Portfolio Rebalancing',
      amount: '₦2,450,000.00',
      date: '17 Feb, 2026',
      status: i % 2 === 0 ? 'Verified' : 'Pending'
    }))
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Verified': return 'bg-[#ecfdf5] text-[#10b981]';
      case 'Pending': return 'bg-[#fffbeb] text-[#f59e0b]';
      case 'Awaiting': return 'bg-[#eff6ff] text-[#3b82f6]';
      case 'Disputed': return 'bg-[#fef2f2] text-[#ef4444]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTransactions = allTransactions.filter(tx => activeTab === 'All' || tx.status === activeTab);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentItems = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-700">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
          </div>
          
          {/* Connected Sidebar */}
          <nav className="space-y-1">
            <Link to="/dashboard">
              <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" />
            </Link>
            <Link to="/transaction-dashboard">
              <NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" active />
            </Link>
            <Link to="/log-new-transaction">
              <NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" />
            </Link>
            <Link to="/trust-score">
              <NavItem icon={<ShieldCheck size={18}/>} label="Trust Score" />
            </Link>
            <Link to="/trust-report">
              <NavItem icon={<FileText size={18}/>} label="Report" />
            </Link>
            <NavItem icon={<Settings size={18}/>} label="Settings" />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout} // 4. CONNECTED: Logout trigger
            className="flex items-center gap-3 text-slate-400 hover:text-slate-600 font-medium transition-colors w-full text-left"
          >
            <LogOut size={18} /> <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search transactions, clients or amount" 
              className="w-full pl-10 pr-4 py-2 bg-[#f1f5f9] border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex items-center gap-5">
            <button className="text-slate-400 relative p-1">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">Alex Rivera</p>
                <p className="text-[11px] text-slate-400 font-medium">Compliance Officer</p>
              </div>
              <img src="https://ui-avatars.com/api/?name=Alex+Rivera&background=1e40af&color=fff" className="w-9 h-9 rounded-full border border-slate-200" alt="profile" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
              <p className="text-sm text-slate-500">Manage and track institutional flow of funds</p>
            </div>
            <button 
              onClick={() => navigate('/log-new-transaction')}
              className="bg-[#1e40af] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all"
            >
              <Plus size={18} /> Log New Transaction
            </button>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex bg-white border border-slate-200 p-1 rounded-lg gap-1">
              {['All', 'Verified', 'Pending', 'Awaiting', 'Disputed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab ? 'bg-[#1e40af] text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} /> More Filters
            </button>
          </div>

          {/* Table Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
            <table className="w-full text-left">
              <thead className="bg-[#f8fafc] border-b border-slate-100">
                <tr className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Amount (NGN)</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-orange-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${tx.initialColor}`}>
                          {tx.initials}
                        </div>
                        <span className="text-[13px] font-bold text-slate-700">{tx.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-500 max-w-[240px] truncate">{tx.description}</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-slate-800">{tx.amount}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-500">{tx.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusStyles(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate('/transaction-receipt')}
                        className="text-orange-500 font-bold text-[11px] hover:underline text-left leading-tight"
                      >
                        View<br/>Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[12px] text-slate-400 font-medium">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === i + 1 ? 'bg-[#1e40af] text-white' : 'hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30"
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Stats Grid */}
          <div className="grid grid-cols-4 gap-6">
            <SummaryCard label="Verified Total" value="₦24.2M" sub={<span className="text-emerald-500 font-bold">↗ +12% vs last month</span>} />
            <SummaryCard label="Pending Payouts" value="₦8.4M" sub="🕓 4 active requests" />
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Verification Rate</p>
              <p className="text-2xl font-bold text-slate-800 mb-4">94.2%</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-[#1e40af] h-1.5 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Disputed Cases</p>
              <p className="text-2xl font-bold text-rose-500 mb-2">2</p>
              <p className="text-[11px] text-rose-400 font-bold flex items-center gap-1">⚠ Requires attention</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
    active ? 'bg-[#eff6ff] text-[#1e40af]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
  }`}>
    {icon} <span>{label}</span>
  </button>
);

const SummaryCard = ({ label, value, sub }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
    <p className="text-[11px] text-slate-400 mt-2">{sub}</p>
  </div>
);


export default TransactionDashboard;