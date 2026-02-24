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

const TransactionDashboard = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // --- MOCK DATA: ORDERED SPECIFICALLY FOR YOUR PAGINATION ---
  const allTransactions = [
    // === PAGE 1 (Indices 0-4): Mixed Data ===
    { id: 1, clientName: 'Julianne Deaton', initials: 'JD', initialColor: 'bg-blue-100 text-blue-600', description: 'Quarterly Asset Management Fee', amount: '₦4,800,000.00', date: '14 Feb, 2026', status: 'Verified' },
    { id: 2, clientName: 'Marcus Kholi', initials: 'MK', initialColor: 'bg-yellow-100 text-yellow-600', description: 'Escrow Holding Release - Prop A', amount: '₦8,800,000.00', date: '14 Feb, 2026', status: 'Pending' },
    { id: 3, clientName: 'Sovereign Tech Ltd', initials: 'ST', initialColor: 'bg-purple-100 text-purple-600', description: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Awaiting' },
    { id: 4, clientName: 'Supreme Tech Ltd', initials: 'ST', initialColor: 'bg-purple-100 text-purple-600', description: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Awaiting' },
    { id: 5, clientName: 'Blue-Tree Holdings', initials: 'BT', initialColor: 'bg-red-100 text-red-600', description: 'Wire Transfer Rejection Fee', amount: '₦3,800,000.00', date: '16 Feb, 2026', status: 'Disputed' },

    // === PAGE 2 (Indices 5-9): VERIFIED Data ===
    { id: 6, clientName: 'Julianne Deaton', initials: 'JD', initialColor: 'bg-blue-100 text-blue-600', description: 'Quarterly Asset Management Fee', amount: '₦4,800,000.00', date: '14 Feb, 2026', status: 'Verified' },
    { id: 7, clientName: 'Marcus Kholi', initials: 'MK', initialColor: 'bg-yellow-100 text-yellow-600', description: 'Escrow Holding Release - Prop A', amount: '₦8,800,000.00', date: '14 Feb, 2026', status: 'Verified' },
    { id: 8, clientName: 'Sovereign Tech Ltd', initials: 'ST', initialColor: 'bg-purple-100 text-purple-600', description: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Verified' },
    { id: 9, clientName: 'Supreme Tech Ltd', initials: 'ST', initialColor: 'bg-purple-100 text-purple-600', description: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Verified' },
    { id: 10, clientName: 'Blue-Tree Holdings', initials: 'BT', initialColor: 'bg-red-100 text-red-600', description: 'Wire Transfer Rejection Fee', amount: '₦3,800,000.00', date: '16 Feb, 2026', status: 'Verified' },

    // === PAGE 3 (Indices 10-14): PENDING Data ===
    { id: 11, clientName: 'Julianne Deaton', initials: 'JD', initialColor: 'bg-blue-100 text-blue-600', description: 'Quarterly Asset Management Fee', amount: '₦4,800,000.00', date: '14 Feb, 2026', status: 'Pending' },
    { id: 12, clientName: 'Marcus Kholi', initials: 'MK', initialColor: 'bg-yellow-100 text-yellow-600', description: 'Escrow Holding Release - Prop A', amount: '₦8,800,000.00', date: '14 Feb, 2026', status: 'Pending' },
    { id: 13, clientName: 'Sovereign Tech Ltd', initials: 'ST', initialColor: 'bg-purple-100 text-purple-600', description: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Pending' },
    { id: 14, clientName: 'Supreme Tech Ltd', initials: 'ST', initialColor: 'bg-purple-100 text-purple-600', description: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Pending' },
    { id: 15, clientName: 'Blue-Tree Holdings', initials: 'BT', initialColor: 'bg-red-100 text-red-600', description: 'Wire Transfer Rejection Fee', amount: '₦3,800,000.00', date: '16 Feb, 2026', status: 'Pending' },

    // === PAGE 4 (Indices 15-19): AWAITING Data ===
    { id: 16, clientName: 'Julianne Deaton', initials: 'JD', initialColor: 'bg-blue-100 text-blue-600', description: 'Quarterly Asset Management Fee', amount: '₦4,800,000.00', date: '14 Feb, 2026', status: 'Awaiting' },
    { id: 17, clientName: 'Marcus Kholi', initials: 'MK', initialColor: 'bg-yellow-100 text-yellow-600', description: 'Escrow Holding Release - Prop A', amount: '₦8,800,000.00', date: '14 Feb, 2026', status: 'Awaiting' },
    { id: 18, clientName: 'Sovereign Tech Ltd', initials: 'ST', initialColor: 'bg-purple-100 text-purple-600', description: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Awaiting' },
    { id: 19, clientName: 'Supreme Tech Ltd', initials: 'ST', initialColor: 'bg-purple-100 text-purple-600', description: 'Treasury Note Purchase', amount: '₦1,900,000.00', date: '15 Feb, 2026', status: 'Awaiting' },
    { id: 20, clientName: 'Blue-Tree Holdings', initials: 'BT', initialColor: 'bg-red-100 text-red-600', description: 'Wire Transfer Rejection Fee', amount: '₦3,800,000.00', date: '16 Feb, 2026', status: 'Awaiting' },

    // === FILLER DATA (Indices 20-41) to make pagination work up to 42 items ===
    ...Array.from({ length: 22 }).map((_, i) => ({
      id: 21 + i,
      clientName: i % 2 === 0 ? 'Aramide Adeyemi' : 'Adeyemi Araoye',
      initials: 'AA',
      initialColor: 'bg-green-100 text-green-600',
      description: 'Corporate Bond Interest Payout',
      amount: '₦11,800,000.00',
      date: '16 Feb, 2026',
      status: i % 3 === 0 ? 'Verified' : 'Pending'
    }))
  ];

  // Helper to get status badge styles
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-[#fffbeb] text-[#b45309]';
      case 'Awaiting': return 'bg-blue-100 text-blue-700';
      case 'Disputed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // --- FILTERING & PAGINATION LOGIC ---
  // If Tab is 'All', we show everything (Pagination handles the "Verified/Pending" views per page)
  const filteredTransactions = allTransactions.filter(tx => activeTab === 'All' || tx.status === activeTab);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // --- DYNAMIC PAGE NUMBERS ---
  // This ensures that when you click "Next", the numbers shift (e.g., 1 2 3 -> 2 3 4)
  const getPageNumbers = () => {
    if (totalPages <= 3) return [...Array(totalPages)].map((_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  return (
    <div className="flex h-screen bg-white font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 flex flex-col justify-between fixed h-full bg-white z-10">
        <div>
          <div className="p-6 flex items-center gap-2">
            {/* Logo Proxy - Replace with <Logo /> if you have it imported */}
            <div className="w-8 h-8 bg-blue-800 rounded-sm flex items-center justify-center text-white font-bold">
              <span className="transform -rotate-45">T</span>
            </div>
            <span className="text-xl font-bold text-slate-900">TrustBridge</span>
          </div>

          <nav className="px-4 space-y-1 mt-4">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem icon={<ArrowRightLeft size={20} />} label="Transaction" active />
            <NavItem icon={<PlusCircle size={20} />} label="Add Transaction" />
            <NavItem icon={<FileText size={20} />} label="Report" />
            <NavItem icon={<ShieldCheck size={20} />} label="Trust Score" />
            <NavItem icon={<Settings size={20} />} label="Settings" />
          </nav>
        </div>
        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 w-full transition-colors font-medium">
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search transactions, clients or amount" className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600" />
          </div>
          <div className="flex items-center gap-6">
            <button className="text-slate-500 hover:text-slate-700 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900">Alex Rivera</p>
                <p className="text-xs text-slate-500">Compliance Officer</p>
              </div>
              <img src="/api/placeholder/40/40" alt="Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
              <p className="text-slate-500 mt-1">Manage and track institutional flow of funds</p>
            </div>
            <button className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-colors">
              <Plus size={18} /> Log New Transaction
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex bg-white border border-slate-200 p-1 rounded-full shadow-sm">
              {['All', 'Verified', 'Pending', 'Awaiting', 'Disputed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTab === tab 
                      ? 'bg-blue-800 text-white shadow-md' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
              <Filter size={16} /> More Filters
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
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
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${tx.initialColor}`}>
                              {tx.initials}
                            </div>
                            <span className="text-sm font-medium text-slate-900">{tx.clientName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{tx.description}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">{tx.amount}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(tx.status)}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-orange-600 hover:text-orange-700 text-xs font-medium hover:underline">View<br/>Details</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-sm">No transactions found for "{activeTab}".</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* --- PAGINATION CONTROL --- */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing {filteredTransactions.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {/* Dynamic Page Numbers */}
                {getPageNumbers().map((pageNum) => (
                   <button
                     key={pageNum}
                     onClick={() => setCurrentPage(pageNum)}
                     className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-colors ${
                       currentPage === pageNum 
                         ? 'bg-blue-800 text-white' 
                         : 'hover:bg-slate-100 text-slate-600'
                     }`}
                   >
                     {pageNum}
                   </button>
                ))}

                <button 
                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                   disabled={currentPage === totalPages}
                   className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
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
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    {icon} <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, subtext }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
    </div>
    <div className="text-xs">{subtext}</div>
  </div>
);

export default TransactionDashboard;