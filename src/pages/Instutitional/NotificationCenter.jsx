import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Settings, UserCircle, CheckCircle2, 
  ArrowRightLeft, ShieldAlert, FileText, ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); // Open by default to match your design
  const [businessName, setBusinessName] = useState('Loading...');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Helper to format timestamps (e.g., "2h ago", "Just now")
  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 5) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'YESTERDAY';
    return `${diffInDays}d ago`;
  };

  const fetchAndBuildNotifications = async (userId) => {
    try {
      // 1. Fetch Profile for Tier Upgrade Notification
      const { data: profile } = await supabase
        .from('profiles')
        .select('business_name, created_at, linkedin_verified, tax_verified')
        .eq('user_id', userId)
        .maybeSingle();

      // 2. Fetch Recent Transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('id, amount, status, client_name, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (profile) {
        setBusinessName(profile.business_name || 'My Business');
        let generatedFeed = [];

        // Generate Primary/Tier Notification if verified
        if (profile.linkedin_verified || profile.tax_verified) {
          generatedFeed.push({
            id: 'tier-upgrade',
            type: 'primary',
            title: 'Verification Complete',
            time: 'Just now',
            message: `${profile.business_name || 'Your entity'} is now an Institutional Tier 1 Partner. Your loan eligibility has been updated.`,
            isRead: false,
            actionText: 'View Benefits'
          });
        }

        // Map Transactions into Notifications
        if (transactions) {
          transactions.forEach((tx) => {
            if (tx.status === 'Verified') {
              generatedFeed.push({
                id: tx.id,
                type: 'transfer',
                title: 'Transfer Successful',
                time: timeAgo(tx.created_at),
                message: `Institutional wiring of ₦${parseFloat(tx.amount).toLocaleString()} to ${tx.client_name} has been finalized.`,
                isRead: false
              });
            } else if (tx.status === 'Disputed') {
              generatedFeed.push({
                id: tx.id,
                type: 'security',
                title: 'Security Alert',
                time: timeAgo(tx.created_at),
                message: `Transaction with ${tx.client_name} for ₦${parseFloat(tx.amount).toLocaleString()} has been flagged as disputed.`,
                isRead: false
              });
            } else if (tx.status === 'Pending') {
               generatedFeed.push({
                id: tx.id,
                type: 'audit',
                title: 'Validation Required',
                time: timeAgo(tx.created_at),
                message: `Pending validation for ₦${parseFloat(tx.amount).toLocaleString()} from ${tx.client_name}.`,
                isRead: false
              });
            }
          });
        }

        // Add a dummy audit notification just to match the design length if needed
        if (generatedFeed.length < 3) {
           generatedFeed.push({
            id: 'q3-audit',
            type: 'audit',
            title: 'Q3 Audit Ready',
            time: 'YESTERDAY',
            message: 'Your quarterly compliance documentation is now available for review.',
            isRead: true
          });
        }

        setNotifications(generatedFeed);
        setUnreadCount(generatedFeed.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error('Error generating notifications:', err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userId = session.user.id;
        await fetchAndBuildNotifications(userId);

        // REAL-TIME SUBSCRIPTION: Listen for new transactions and immediately rebuild notifications
        const channel = supabase.channel('realtime-ledger')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` }, () => {
            fetchAndBuildNotifications(userId); // Re-fetch to show the new notification instantly
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` }, () => {
             fetchAndBuildNotifications(userId); // Update if a pending tx gets verified
          })
          .subscribe();

        return () => supabase.removeChannel(channel);
      }
    };
    initData();
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  // --- ICONS MAPPING ---
  const getIcon = (type) => {
    switch (type) {
      case 'primary': return <CheckCircle2 size={20} className="text-white" />;
      case 'transfer': return <ArrowRightLeft size={16} className="text-[#1e40af]" />;
      case 'security': return <ShieldAlert size={16} className="text-slate-500" />;
      case 'audit': return <FileText size={16} className="text-slate-500" />;
      default: return <Bell size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* MOCK NAVBAR TO MATCH DESIGN CONTEXT */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-100 relative z-50">
        <div className="text-[#1e40af] font-black tracking-tight text-lg uppercase cursor-pointer" onClick={() => navigate('/dashboard')}>
          {businessName}
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[13px] font-bold text-slate-500">
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Dashboard</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Payments</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Analytics</span>
        </div>

        <div className="flex items-center gap-6 relative">
          {/* Notification Trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="relative text-[#1e40af] transition-colors"
          >
            <Bell size={20} className={isOpen ? "fill-[#1e40af]" : ""} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            )}
          </button>
          
          <Settings size={20} className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
          <UserCircle size={24} className="text-slate-700 cursor-pointer" />

          {/* NOTIFICATION DROPDOWN MODAL */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 right-0 w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-50">
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-[10px] font-black text-[#1e40af] uppercase tracking-widest hover:text-blue-800 transition-colors">
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notification Feed */}
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                      No recent activity
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`relative p-6 flex items-start gap-4 transition-colors ${
                          notif.type === 'primary' 
                            ? 'bg-[#f8fafc] border-l-[3px] border-[#1e40af]' 
                            : 'border-b border-slate-50 hover:bg-slate-50/50'
                        }`}
                      >
                        {/* Icon Badge */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          notif.type === 'primary' ? 'bg-[#1e40af]' : 'bg-slate-100 border border-slate-200'
                        }`}>
                          {getIcon(notif.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-0.5">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className={`text-sm font-bold ${notif.type === 'primary' ? 'text-slate-900' : 'text-slate-800'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{notif.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
                            {notif.message}
                          </p>
                          
                          {notif.actionText && (
                            <button className="bg-[#1e40af] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-blue-800 transition-colors active:scale-95">
                              {notif.actionText}
                            </button>
                          )}
                        </div>

                        {/* Unread dot indicator */}
                        {!notif.isRead && notif.type !== 'primary' && (
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#1e40af] rounded-full"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="bg-[#f8fafc] p-4 text-center border-t border-slate-50">
                  <button onClick={() => navigate('/transaction-dashboard')} className="text-xs font-bold text-[#1e40af] hover:text-blue-800 transition-colors inline-flex items-center gap-1">
                    See All Activity <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content Area (To provide background context) */}
      <div className="flex items-center justify-center min-h-[80vh]">
         <p className="text-slate-400 font-bold text-sm">Dashboard Content Here</p>
      </div>

    </div>
  );
};

export default NotificationCenter;
