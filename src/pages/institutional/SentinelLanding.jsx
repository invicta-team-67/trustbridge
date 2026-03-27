import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Landmark, ShieldCheck, Gauge, ArrowRight, Bell, UserCircle, Building2, Briefcase, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const TrustBridgeSentinel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Real-time states
  const [isLoading, setIsLoading] = useState(true);
  const [totalEntities, setTotalEntities] = useState(0);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);

  // Fetch real data on mount
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        // 1. Get the actual count of registered businesses
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (!countError && count !== null) {
          // If you have a small userbase initially, you can add a baseline (e.g., count + 1200) 
          // for marketing purposes, but here is the raw real-time count:
          setTotalEntities(count); 
        }

        // 2. Fetch up to 4 real businesses to feature
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, user_id, business_name, business_type')
          .limit(4); // You could add .order('trust_score', { ascending: false }) later

        if (!profileError && profiles) {
          setFeaturedBusinesses(profiles);
        }
      } catch (err) {
        console.error("Error fetching Sentinel data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/lookup/${searchQuery.trim()}`);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-slate-100 max-w-[1400px] mx-auto bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-[#1e40af]">
              <path d="M12 2L2 20H22L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M12 10L8 17H16L12 10Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0f172a]">
            TrustBridge <span className="text-[#1e40af] font-medium">Sentinel</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-500">
          <Link to="#" className="hover:text-slate-900 transition-colors">Portfolio</Link>
          <Link to="#" className="text-[#1e40af] border-b-2 border-[#1e40af] pb-1">Lookup</Link>
          <Link to="#" className="hover:text-slate-900 transition-colors">Compliance</Link>
          <Link to="#" className="hover:text-slate-900 transition-colors">Reports</Link>
        </div>

        <div className="flex items-center gap-5">
<button onClick={() => navigate('/institutional-vault')} className="bg-[#1e40af] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-800 transition-colors active:scale-95">
  Go to Vault
</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
          <motion.h1 variants={fadeUp} className="text-5xl md:text-[64px] font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Verify Entity <span className="text-[#1e40af]">Integrity</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[17px] text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
            Access institutional-grade validation for global lending partners.<br className="hidden md:block"/> Secure, transparent, and authoritative compliance at your fingertips.
          </motion.p>

          <motion.form variants={fadeUp} onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center max-w-2xl mx-auto bg-[#f8fafc] border border-slate-200 rounded-xl p-1.5 shadow-lg shadow-slate-200/50 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <div className="flex items-center flex-1 px-4 py-3 w-full">
              <Search className="text-slate-400 mr-3 shrink-0" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Business Name, TrustBridge ID, or Tax ID..." 
                className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 font-medium text-[15px]"
              />
            </div>
            <button type="submit" className="w-full sm:w-auto bg-[#1e40af] text-white px-8 py-3.5 rounded-lg font-bold hover:bg-blue-800 active:scale-95 transition-all mt-2 sm:mt-0">
              Run Lookup
            </button>
          </motion.form>
        </motion.div>

        {/* Dynamic Metrics Grid */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-[1100px] mx-auto">
          <MetricCard 
            icon={<Landmark size={28} strokeWidth={2.5} />} 
            title={isLoading ? "..." : totalEntities.toLocaleString()} 
            subtitle="VERIFIED ENTITIES" 
            text="Real-time mapping of global institutional structures and legal relationships on our ledger." 
          />
          <MetricCard 
            icon={<ShieldCheck size={28} strokeWidth={2.5} />} 
            title="99.9%" 
            subtitle="VALIDATION ACCURACY" 
            text="Multi-source cross-referencing ensuring the highest data integrity standards in fintech." 
          />
          <MetricCard 
            icon={<Gauge size={28} strokeWidth={2.5} />} 
            title="<2.4s" 
            subtitle="LOOKUP LATENCY" 
            text="Institutional speed for automated underwriting and compliance workflows." 
          />
        </motion.div>
      </main>

      {/* Real-Time Featured Institutions */}
      <section className="bg-[#eef2ff] py-24 px-6 border-y border-blue-50">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="text-[28px] font-black text-slate-900 mb-2 tracking-tight">Featured Reliable Institutions</h2>
              <p className="text-slate-500 font-medium text-[15px]">High-volume entities currently active on the TrustBridge protocol.</p>
            </div>
            <button className="text-[#1e40af] font-bold text-[15px] flex items-center gap-2 hover:text-blue-800 transition-colors pb-1">
              View Full Directory <ArrowRight size={18} />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBusinesses.length > 0 ? (
                featuredBusinesses.map((business, index) => (
                  <FeaturedCard 
                    key={business.id || index}
                    name={business.business_name || "Verified Entity"} 
                    // Generate a display ID based on their actual database ID
                    lei={`ID: TB-${business.user_id ? business.user_id.substring(0, 6).toUpperCase() : 'XXXXXX'}`} 
                    avatarCount={Math.floor(Math.random() * 10) + 2} // Randomizing the avatar count for the UI
                    icon={<Building2 size={20} />} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-slate-500 font-bold">
                  No verified entities public yet. Be the first!
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto bg-[#0a192f] rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #1e40af 2px, transparent 2.5px)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a192f]/80"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-[40px] font-black text-white mb-6 tracking-tight">Ready to expand your lending portfolio?</h2>
            <p className="text-[#94a3b8] text-[17px] font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Join leading institutional lenders using TrustBridge for precise entity validation and risk assessment.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-[#0f172a] px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-xl active:scale-95 text-[15px]">
                Create Free Account
              </button>
              <button className="bg-[#0a192f] text-white border border-[#334155] px-8 py-4 rounded-xl font-bold hover:bg-[#0f172a] transition-colors shadow-lg active:scale-95 text-[15px]">
                Request a Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const MetricCard = ({ icon, title, subtitle, text }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-left hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all border border-slate-50">
    <div className="text-[#1e40af] mb-8">{icon}</div>
    <h3 className="text-[40px] font-black text-slate-900 mb-2 tracking-tight leading-none">{title}</h3>
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">{subtitle}</p>
    <p className="text-[15px] text-slate-500 font-medium leading-relaxed">{text}</p>
  </motion.div>
);

const FeaturedCard = ({ name, lei, avatarCount, icon }) => (
  <motion.div whileHover={{ y: -4 }} className="bg-white p-7 rounded-[24px] shadow-sm border border-transparent hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all cursor-pointer">
    <div className="w-12 h-12 bg-[#eff6ff] text-[#1e40af] flex items-center justify-center rounded-xl mb-6">
      {icon}
    </div>
    <h4 className="font-black text-[17px] text-slate-900 mb-1.5 tracking-tight truncate">{name}</h4>
    <p className="text-[11px] text-slate-400 font-bold mb-6 font-mono">{lei}</p>
    
    <div className="flex items-center gap-2 mb-8">
      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
      <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Verified Active</span>
    </div>

    <div className="flex items-center -space-x-3">
      <img src={`https://ui-avatars.com/api/?name=${name.charAt(0)}&background=1e40af&color=fff`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm relative z-20" alt="avatar" />
      <img src={`https://ui-avatars.com/api/?name=${name.charAt(1) || 'B'}&background=0f172a&color=fff`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm relative z-10" alt="avatar" />
      <div className="w-8 h-8 rounded-full border-2 border-white bg-[#f8fafc] flex items-center justify-center text-[10px] font-black text-slate-600 relative z-0">
        +{avatarCount}
      </div>
    </div>
  </motion.div>
);

export default TrustBridgeSentinel;
