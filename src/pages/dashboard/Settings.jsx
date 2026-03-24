import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, CreditCard, PlusSquare, ShieldCheck, 
  FileText, Settings as SettingsIcon, LogOut, Save, 
  Loader2, CheckCircle, AlertCircle, Lock, Menu, X,
  Search, Bell, ChevronRight, Camera, Mail, Phone, MapPin, Briefcase, Building
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // NEW: Store dynamic user data for header and read-only fields
  const [userData, setUserData] = useState({ name: 'Loading...', role: '...', avatarName: 'User' });
  const [userEmail, setUserEmail] = useState('');

  // Form State
  const [profile, setProfile] = useState({
    business_name: '',
    phone: '',
    address: '',
    industry: ''
  });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });

  // CONNECTED: Fetch Data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
        
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data) {
          setProfile({
            business_name: data.business_name || '',
            phone: data.phone || '',
            address: data.address || '',
            industry: data.industry || ''
          });

          setUserData({
            name: data.business_name || 'My Business',
            role: (data.business_type || 'Verified Merchant').replace('_', ' '),
            avatarName: (data.business_name || 'User').split(' ').join('+')
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // CONNECTED: Update Logic
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: profile.business_name,
          phone: profile.phone,
          address: profile.address,
          industry: profile.industry,
          updated_at: new Date()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update header data instantly
      setUserData(prev => ({
        ...prev, 
        name: profile.business_name, 
        avatarName: profile.business_name.split(' ').join('+')
      }));

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match' });
    }
    if (passwords.newPassword.length < 8) {
      return setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Reusable Sidebar Content
  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center gap-2">
        <div className="bg-[#003399] p-1.5 rounded-lg shadow-md shadow-blue-900/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#001B4D] tracking-tight">TrustBridge</h1>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" />
        </Link>
        <Link to="/transaction-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
          <NavItem icon={<CreditCard size={20}/>} label="Transaction" />
        </Link>
        <Link to="/log-new-transaction" onClick={() => setIsMobileMenuOpen(false)}>
          <NavItem icon={<PlusSquare size={20}/>} label="Add Transaction" />
        </Link>
        <Link to="/trust-score" onClick={() => setIsMobileMenuOpen(false)}>
          <NavItem icon={<ShieldCheck size={20}/>} label="Trust Score" />
        </Link>
        <Link to="/trust-report" onClick={() => setIsMobileMenuOpen(false)}>
          <NavItem icon={<FileText size={20}/>} label="Report" />
        </Link>
        <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem icon={<SettingsIcon size={20}/>} label="Settings" active />
        </Link>
      </nav>

      <div className="p-8">
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-rose-500 transition-all font-medium w-full text-left">
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#003399] mb-4" size={40} />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans text-slate-700 relative overflow-x-hidden">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col fixed h-full z-10">
        <SidebarContent />
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl flex flex-col">
              <div className="absolute top-4 right-4"><button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={24} /></button></div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 w-full max-w-6xl mx-auto">
        
        {/* POLISHED: Unified Header matches other pages */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600"><Menu size={20} /></button>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Home</span> <ChevronRight size={14}/> <span className="text-slate-800 font-semibold">Settings</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Search settings..." className="w-full pl-12 pr-4 py-2.5 rounded-full border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500/10 text-sm outline-none" />
            </div>
            <div className="flex items-center gap-3 border-l pl-0 sm:pl-6 border-slate-200">
              <button className="relative text-slate-400 hover:text-slate-600 transition-colors hidden sm:block p-1">
                <Bell size={20} />
              </button>
              <div className="text-right hidden sm:block ml-2">
                <p className="text-sm font-bold text-slate-800 leading-none">{userData.name}</p>
                <p className="text-[11px] text-slate-400 mt-1 capitalize">{userData.role}</p>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${userData.avatarName}&background=003399&color=fff`} className="w-10 h-10 rounded-full border-2 border-white shadow-md" alt="profile" />
            </div>
          </div>
        </header>

        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 text-sm mt-2">Manage your institutional profile, security, and preferences.</p>
          </div>

          {/* Smooth Toast Notification */}
          <AnimatePresence>
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border shadow-sm ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}
              >
                {message.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                <p className="text-sm font-bold">{message.text}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Navigation */}
          <div className="flex gap-8 border-b border-slate-200 mb-8">
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`pb-4 text-sm font-black transition-all relative ${activeTab === 'profile' ? 'text-[#003399]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Profile Details
              {activeTab === 'profile' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003399] rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('security')} 
              className={`pb-4 text-sm font-black transition-all relative ${activeTab === 'security' ? 'text-[#003399]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Security
              {activeTab === 'security' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003399] rounded-t-full" />}
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-slate-100">
            {activeTab === 'profile' ? (
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                
                {/* Professional Avatar Section */}
                <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                  <div className="relative group cursor-pointer">
                    <img src={`https://ui-avatars.com/api/?name=${userData.avatarName}&background=003399&color=fff&size=100`} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-slate-50 shadow-sm transition-opacity group-hover:opacity-50" alt="Company Logo" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={24} className="text-[#003399]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Company Logo</h3>
                    <p className="text-xs text-slate-400 mt-1 mb-3">PNG, JPG up to 5MB. This will be displayed on your receipts.</p>
                    <button type="button" className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-200">Upload Image</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Name</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" value={profile.business_name} onChange={(e) => setProfile({...profile, business_name: e.target.value})} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#f8fafc] border border-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold text-slate-800" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Industry (Sector)</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        value={profile.industry} 
                        onChange={(e) => setProfile({...profile, industry: e.target.value})} 
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#f8fafc] border border-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold text-slate-800 appearance-none"
                      >
                        <option value="" disabled>Select Industry</option>
                        <option value="tech">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="retail">Trade & Retail</option>
                        <option value="agro">Agro Business</option>
                        <option value="services">Services</option>
                        <option value="others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      Registered Email <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded text-[9px]">Read-Only</span>
                    </label>
                    <div className="relative opacity-60 cursor-not-allowed">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" value={userEmail} readOnly className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-100 border border-slate-200 text-sm font-bold text-slate-500 outline-none cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#f8fafc] border border-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold text-slate-800" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Headquarters Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                    <textarea rows="3" value={profile.address} onChange={(e) => setProfile({...profile, address: e.target.value})} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#f8fafc] border border-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold text-slate-800 resize-none" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button type="submit" disabled={isSaving} className="bg-[#003399] text-white px-8 py-3.5 rounded-xl text-sm font-black shadow-lg shadow-blue-900/20 hover:bg-blue-800 flex items-center justify-center gap-2 transition-all active:scale-95 w-full sm:w-auto min-w-[200px]">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl mb-6">
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    <span className="font-bold">Security Tip:</span> Ensure your password is at least 8 characters long and includes a mix of numbers, symbols, and uppercase letters.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#f8fafc] border border-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold text-slate-800 tracking-widest placeholder:tracking-normal" placeholder="Min. 8 characters" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#f8fafc] border border-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold text-slate-800 tracking-widest placeholder:tracking-normal" placeholder="Repeat password" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button type="submit" disabled={isSaving} className="bg-slate-900 text-white w-full py-3.5 rounded-xl text-sm font-black shadow-lg shadow-slate-200 hover:bg-slate-800 flex items-center justify-center gap-2 transition-all active:scale-95">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />} Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component for Nav Items
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all font-bold text-sm ${active ? 'bg-[#EBF2FF] text-[#003399] shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
    {icon} <span>{label}</span>
  </div>
);

export default Settings;
