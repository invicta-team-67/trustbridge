import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Bell, 
  ChevronRight,
  Upload,
  Loader2,
  Menu,
  X,
  FileIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const LogNewTransaction = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  
  // NEW: Dynamic user data and past clients for autocomplete
  const [userData, setUserData] = useState({ name: 'Loading...', role: 'Compliance Officer', avatarName: 'User' });
  const [pastClients, setPastClients] = useState([]);
  
  const [formData, setFormData] = useState({
    clientName: '',
    serviceProvided: '',
    amount: '',
    dueDate: '',
    description: ''
  });

  // CONNECTED: Auth Guard & Dynamic Data Fetching
  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const user = session.user;

      // 1. Fetch profile for header
      const { data: profile } = await supabase
        .from('profiles')
        .select('business_name, business_type')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setUserData({
          name: profile.business_name || 'My Business',
          role: (profile.business_type || 'Compliance Officer').replace('_', ' '),
          avatarName: (profile.business_name || 'User').split(' ').join('+')
        });
      }

      // 2. Fetch past transactions to build dynamic client suggestions
      const { data: txs } = await supabase
        .from('transactions')
        .select('client_name')
        .eq('user_id', user.id);

      if (txs) {
        // Extract unique client names
        const uniqueClients = [...new Set(txs.map(t => t.client_name).filter(Boolean))];
        setPastClients(uniqueClients);
      }
    };

    fetchInitialData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // NEW: Professional File Size Validation (10MB Limit)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds the 10MB limit. Please select a smaller file.");
        return;
      }

      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  // NEW: Ability to clear the selected file
  const handleRemoveFile = (e) => {
    e.stopPropagation(); // Prevents clicking the div from opening the file dialog again
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the actual input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      let fileUrl = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('transaction-proofs')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('transaction-proofs').getPublicUrl(filePath);
        fileUrl = data.publicUrl;
      }

      // Updated: Capture the inserted data to get the ID
      const { data: insertedData, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          client_name: formData.clientName,
          service_provided: formData.serviceProvided,
          amount: parseFloat(formData.amount),
          due_date: formData.dueDate,
          description: formData.description,
          proof_files_urls: fileUrl,
          status: 'Pending'
        }])
        .select()
        .single();

      if (error) throw error;

      navigate(`/transaction-success?id=${insertedData.transaction_id}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white font-bold">
            <ShieldCheck size={20} />
          </div>
          <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
        </div>
        
        <nav className="space-y-1">
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" />
          </Link>
          <Link to="/transaction-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" />
          </Link>
          <Link to="/log-new-transaction" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" active />
          </Link>
          <Link to="/trust-score" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<ShieldCheck size={18}/>} label="Trust Score" />
          </Link>
          <Link to="/trust-report" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<FileText size={18}/>} label="Report" />
          </Link>
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
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-30">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl flex flex-col">
              <div className="absolute top-4 right-4">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full">
        {/* POLISHED: Unified Header matches other pages */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-200"><Menu size={20} /></button>
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium font-sans">
              <span onClick={() => navigate('/transaction-dashboard')} className="hover:text-slate-600 cursor-pointer transition-colors hidden sm:block">Transactions</span>
              <ChevronRight size={14} className="hidden sm:block" />
              <span className="text-[#1e40af] font-bold bg-blue-50 px-3 py-1.5 rounded-lg">Log New Entry</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:pl-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="hidden sm:block text-right ml-2">
              <p className="text-sm font-bold text-slate-800 leading-none">{userData.name}</p>
              <p className="text-[11px] text-slate-400 font-medium capitalize mt-1">{userData.role}</p>
            </div>
            <img 
              src={`https://ui-avatars.com/api/?name=${userData.avatarName}&background=1e40af&color=fff`} 
              className="w-9 h-9 rounded-full border border-slate-200 shadow-sm" 
              alt="profile" 
            />
          </div>
        </header>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-12 flex flex-col items-center w-full pb-20">
          <div className="w-full max-w-3xl">
            <div className="text-center mb-8 md:mb-10">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-sans tracking-tight">Log New Transaction</h1>
              <p className="text-slate-500 text-sm font-sans font-medium">Enter the details of the service provided to record a new entry in the trust ledger.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-sans">
                    Client Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    name="clientName" 
                    list="client-suggestions" 
                    placeholder="Enter client or business name" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 font-sans shadow-sm" 
                    onChange={handleInputChange} 
                  />
                  {/* DYNAMIC: Populated from their actual transaction history */}
                  <datalist id="client-suggestions">
                    {pastClients.map((client, index) => (
                      <option key={index} value={client} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-sans">Service Provided <span className="text-rose-500">*</span></label>
                  <input required type="text" name="serviceProvided" placeholder="e.g Landing page Redesign" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 font-sans shadow-sm" onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-sans">Transaction Amount <span className="text-rose-500">*</span></label>
                  <div className="relative font-sans">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₦</span>
                    <input required type="number" name="amount" placeholder="0.00" className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 font-sans shadow-sm" onChange={handleInputChange} />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold font-sans tracking-wide uppercase mt-1">Total amount in Nigerian Naira</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-sans">Due Date <span className="text-rose-500">*</span></label>
                  <input required type="date" name="dueDate" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-600 font-sans shadow-sm" onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 font-sans">Description</label>
                <textarea name="description" rows="4" placeholder="Briefly describe the deliverables or terms of service" className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-sans shadow-sm resize-none" onChange={handleInputChange}></textarea>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 font-sans">Upload Proof of Work</label>
                <div 
                  onClick={() => !selectedFile && fileInputRef.current.click()} 
                  className={`border-2 border-dashed rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center transition-all group overflow-hidden relative min-h-[160px] ${selectedFile ? 'border-blue-200 bg-blue-50/30 cursor-default' : 'border-slate-200 bg-[#f8fafc] hover:bg-[#f1f5f9] hover:border-blue-300 cursor-pointer'}`}
                >
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.pdf" />
                  
                  {filePreview ? (
                    <div className="flex flex-col items-center relative w-full">
                      {/* NEW: Remove File Button */}
                      <button 
                        type="button" 
                        onClick={handleRemoveFile} 
                        className="absolute -top-4 -right-2 md:right-4 bg-white text-rose-500 hover:text-white hover:bg-rose-500 p-1.5 rounded-full shadow-md border border-slate-100 transition-colors z-10"
                        title="Remove file"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>

                      {selectedFile?.type.includes('image') ? (
                        <img src={filePreview} alt="Preview" className="h-28 w-auto rounded-lg shadow-md mb-3 object-contain" />
                      ) : (
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3 shadow-sm">
                          <FileIcon size={32} />
                        </div>
                      )}
                      <p className="text-sm font-bold text-slate-800 font-sans truncate max-w-[200px] md:max-w-xs">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1 font-sans">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-800 text-center font-sans">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400 font-medium mt-1 font-sans">PNG, JPG, or PDF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => navigate('/dashboard')} className="w-full sm:flex-1 py-3.5 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-sans shadow-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="w-full sm:flex-[1.5] py-3.5 bg-[#1e40af] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2 font-sans disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> 
                      <span>Processing...</span>
                    </>
                  ) : "Log Transaction"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-bold transition-all font-sans ${active ? 'bg-[#eff6ff] text-[#1e40af]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
    {icon} <span>{label}</span>
  </button>
);

export default LogNewTransaction;
