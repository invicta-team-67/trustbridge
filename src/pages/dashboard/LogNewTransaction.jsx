import React, { useState, useEffect, useRef } from 'react'; // Added useRef
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
  Loader2 // Added for submission state
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // 1. CONNECTED: Import Supabase

const LogNewTransaction = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Ref for file upload
  
  // 2. CONNECTED: State for submission and file handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [formData, setFormData] = useState({
    clientName: '',
    serviceProvided: '',
    amount: '',
    dueDate: '',
    description: ''
  });

  // 3. CONNECTED: Auth Guard
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/login');
    };
    checkUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 4. CONNECTED: Handle Form Submission to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      let fileUrl = null;

      // A. Upload File if exists
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('transaction-proofs')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('transaction-proofs').getPublicUrl(filePath);
        fileUrl = data.publicUrl;
      }

      // B. Insert to Database
      const { error } = await supabase
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
        }]);

      if (error) throw error;

      navigate('/transaction-success'); 
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#1e40af] rounded flex items-center justify-center text-white font-bold">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold text-[#1e3a8a] tracking-tight">TrustBridge</span>
          </div>
          
          <nav className="space-y-1">
            <Link to="/dashboard">
              <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" />
            </Link>
            <Link to="/transaction-dashboard">
              <NavItem icon={<ArrowRightLeft size={18}/>} label="Transaction" />
            </Link>
            <Link to="/log-new-transaction">
              <NavItem icon={<PlusCircle size={18}/>} label="Log Transaction" active />
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
            onClick={handleLogout} 
            className="flex items-center gap-3 text-slate-400 hover:text-slate-600 font-medium transition-colors w-full text-left"
          >
            <LogOut size={18} /> <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            <span 
              onClick={() => navigate('/transaction-dashboard')} 
              className="hover:text-slate-600 cursor-pointer"
            >
              Transactions
            </span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-bold">Log New Transaction</span>
          </div>
          <button className="text-slate-400 p-1 hover:bg-slate-50 rounded-full transition-colors">
            <Bell size={20} />
          </button>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 flex flex-col items-center"
        >
          <div className="w-full max-w-3xl">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Log New Transaction</h1>
              <p className="text-slate-500">Enter the details of the service provided to record a new entry in the trust ledger.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    Client Name <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    required
                    name="clientName"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-500"
                    onChange={handleInputChange}
                  >
                    <option value="">Select or search client</option>
                    <option value="Nexus Labs">Nexus Labs</option>
                    <option value="Apex Ventures">Apex Ventures</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    Service Provided <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    required
                    type="text"
                    name="serviceProvided"
                    placeholder="e.g Landing page Redesign"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    Transaction Amount <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₦</span>
                    <input 
                      required
                      type="number"
                      name="amount"
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Total amount in Nigerian Naira</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    Due Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      required
                      type="date"
                      name="dueDate"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-400"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea 
                  name="description"
                  rows="4"
                  placeholder="Briefly describe the deliverables or terms of service"
                  className="w-full bg-[#f0f7ff] border border-[#dbeafe] rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400/60"
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Upload Proof of Work</label>
                <div 
                  onClick={() => fileInputRef.current.click()} // Trigger hidden input
                  className="border-2 border-dashed border-[#dbeafe] bg-[#f8fafc] rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#f1f5f9] transition-all group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-1">PNG, JPG, or PDF up to 10MB</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => navigate('/dashboard')} 
                  className="flex-1 py-3.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[1.5] py-3.5 bg-[#1e40af] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Log Transaction"}
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
  <button className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${
    active ? 'bg-[#eff6ff] text-[#1e40af]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
  }`}>
    {icon} <span>{label}</span>
  </button>
);

export default LogNewTransaction;