  import React, { useState, useEffect } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { 
    LayoutDashboard, CreditCard, PlusSquare, ShieldCheck, 
    FileText, Settings as SettingsIcon, LogOut, Save, 
    Loader2, CheckCircle, AlertCircle, Lock, Menu, X 
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

    // Form State
    const [profile, setProfile] = useState({
      business_name: '',
      phone: '',
      address: '',
      industry: ''
    });
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });

    useEffect(() => {
      fetchProfile();
    }, []);

    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id) // Using user_id as established
            .maybeSingle();
          
          if (data) setProfile(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

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
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
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

      setIsSaving(true);
      try {
        const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswords({ newPassword: '', confirmPassword: '' });
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

    // Reusable Sidebar Content (Matches Dashboard)
    const SidebarContent = () => (
      <>
        <div className="p-8 flex items-center gap-2">
          <div className="bg-[#003399] p-1.5 rounded-lg">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#001B4D]">TrustBridge</h1>
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

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

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
        <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 w-full">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600">
                <Menu size={20} />
              </button>
              <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
            </div>

            {/* Status Message */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-6 border-b border-slate-200 mb-8">
              <button onClick={() => setActiveTab('profile')} className={`pb-4 text-sm font-bold transition-all ${activeTab === 'profile' ? 'text-[#003399] border-b-2 border-[#003399]' : 'text-slate-400'}`}>Profile Details</button>
              <button onClick={() => setActiveTab('security')} className={`pb-4 text-sm font-bold transition-all ${activeTab === 'security' ? 'text-[#003399] border-b-2 border-[#003399]' : 'text-slate-400'}`}>Security</button>
            </div>

            <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-white">
              {activeTab === 'profile' ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Business Name</label>
                      <input type="text" value={profile.business_name} onChange={(e) => setProfile({...profile, business_name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone Number</label>
                      <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Headquarters Address</label>
                    <textarea rows="3" value={profile.address} onChange={(e) => setProfile({...profile, address: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-blue-500/20 resize-none" />
                  </div>
                  <button type="submit" disabled={isSaving} className="bg-[#003399] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-800 flex items-center gap-2 transition-all">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
                  </button>
                </form>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">New Password</label>
                    <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-blue-500/20" placeholder="Min. 8 characters" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Confirm New Password</label>
                    <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-blue-500/20" placeholder="Repeat password" />
                  </div>
                  <button type="submit" disabled={isSaving} className="bg-[#003399] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-800 flex items-center gap-2 transition-all">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />} Update Password
                  </button>
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
    <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all font-bold text-sm ${active ? 'bg-[#EBF2FF] text-[#003399]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
      {icon} <span>{label}</span>
    </div>
  );

  export default Settings;