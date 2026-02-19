import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// --- ICONS (Inline SVGs) ---
const DocumentXIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <path d="M14 2v6h6"/>
    <path d="m9.5 12.5 5 5"/>
    <path d="m9.5 17.5 5-5"/>
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M12 7v5l4 2"/>
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
    <circle cx="12" cy="12" r="10"/>
    <path d="m15 9-6 6"/>
    <path d="m9 9 6 6"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

// --- SECTIONS ---


const Navbar = () => {
  const navigate = useNavigate(); // <-- Initialize the router hook

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex justify-between items-center"
    >
      <div className="flex items-center gap-2 cursor-pointer">
        <img src="../public/landing-images/logo-bg.svg" alt="TrustBridge Logo" className="h-8 w-auto" />
        <span className="font-bold text-xl text-[#0f172a]">TrustBridge</span>
      </div>

      <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-gray-600">
        <a href="#products" className="hover:text-blue-600 transition-colors">Products</a>
        <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
        <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
      </div>

      <div className="hidden md:flex items-center gap-6">
        {/* Wired up the Login button */}
        <button 
          onClick={() => navigate('/login')} 
          className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
        >
          Login
        </button>
        {/* Wired up the Create Account button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/signup')}
          className="bg-[#1a56db] text-white px-5 py-2.5 rounded-md text-sm font-semibold shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-colors"
        >
          Create Account
        </motion.button>
      </div>
    </motion.nav>
  );
};

const HeroSection = () => {
  const navigate = useNavigate(); // <-- Initialize the router hook here too

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6 z-10">
        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#0f172a] leading-[1.15] tracking-tight">
          Turn Everyday <br/>
          Business Into <span className="text-[#1a56db]">Verified</span> <br/>
          <span className="text-[#1a56db]">Trust</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed max-w-lg font-medium mt-2">
          Stop losing opportunities due to lack of formal history. Build a portable, 
          credible Trust Score backed by your actual business activity.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mt-4">
          {/* Wired up the Create Account button */}
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => navigate('/signup')}
            className="bg-[#1a56db] text-white px-6 py-3 rounded-md font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Create Account
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }} 
            whileTap={{ scale: 0.95 }} 
            className="bg-white text-gray-700 px-6 py-3 rounded-md font-semibold border border-gray-200 shadow-sm transition-colors w-full sm:w-auto text-center"
          >
            Learn more
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
          <div className="flex -space-x-3">
            <img src="../public/landing-images/user1.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            <img src="../public/landing-images/user2.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            <img src="../public/landing-images/user3.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            <img src="../public/landing-images/user4.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            <img src="../public/landing-images/user5.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            Join <span className="font-bold text-gray-900">10k+</span> businesses building credit today.
          </p>
        </motion.div>
      </motion.div>

      {/* Hidden on mobile and tablet, block on large screens */}
      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }} className="hidden lg:block relative lg:translate-x-12">
        <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
          <img src="../public/landing-images/hero-img.png" alt="Businessman" className="w-full h-auto object-contain max-w-2xl drop-shadow-2xl" />
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 rounded-full blur-[100px] opacity-30 -z-10 pointer-events-none"></div>
      </motion.div>
    </main>
  );
};

const ProblemSection = () => {
  const problems = [
    {
      id: 1,
      title: "Informal Agreements",
      description: "Business done on handshakes leaves no paper trail for banks or partners to evaluate your success.",
      icon: <DocumentXIcon />
    },
    {
      id: 2,
      title: "No Transaction History",
      description: "Lack of formal records makes it impossible to prove your historical scale or payment reliability.",
      icon: <HistoryIcon />
    },
    {
      id: 3,
      title: "High Rejection Rates",
      description: "Traditional institutions reject high-potential businesses simply because they lack verifiable digital data.",
      icon: <XCircleIcon />
    }
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="bg-white py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={headerVariants}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-tight mb-4">
            Millions of Real Businesses. <br />
            <span className="text-[#475569]">Zero Verifiable Records.</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg font-medium">
            Informal agreements lead to financial invisibility and missed opportunities for growth.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardContainerVariants}
        >
          {problems.map((problem) => (
            <motion.div 
              key={problem.id}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-[#f8f9fc] rounded-2xl p-6 lg:p-8 flex flex-col gap-4 border border-transparent hover:border-gray-200 transition-colors"
            >
              <div className="bg-white w-12 h-12 rounded-xl shadow-sm flex items-center justify-center mb-2">
                {problem.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0f172a]">{problem.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      title: "Record Transaction",
      description: "Log your daily business activity easily through our intuitive mobile-first interface."
    },
    {
      id: 2,
      title: "Get Client Confirmation",
      description: "Your clients receive a simple SMS or link to verify the service with a single click; no app needed."
    },
    {
      id: 3,
      title: "Generate Trust Report",
      description: "Export a verified history and a certified Trust Score for partners, vendors, and lenders."
    }
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const stepContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.2 } }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="bg-[#f8f9fc] py-16 lg:py-24 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        <motion.div 
          className="text-center mb-16 lg:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={headerVariants}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight">
            TrustBridge Makes Informal Activity Verifiable.
          </h2>
        </motion.div>

        <motion.div 
          className="flex flex-col md:flex-row relative justify-between gap-12 md:gap-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stepContainerVariants}
        >
          {/* Horizontal Line Connecting Circles (Desktop Only) */}
          <div className="hidden md:block absolute top-[36px] left-[15%] right-[15%] h-[2px] bg-blue-100 -z-10">
            <motion.div 
              className="h-full bg-[#1a56db]"
              initial={{ scaleX: 0, transformOrigin: "left" }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            />
          </div>

          {steps.map((step) => (
            <motion.div 
              key={step.id} 
              variants={stepVariants}
              className="flex-1 flex flex-col items-center text-center px-4 relative"
            >
              {/* Number Circle */}
              <div className="w-[72px] h-[72px] rounded-full bg-[#1a56db] text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-blue-500/20 z-10 relative">
                {step.id}
                
                {/* Vertical line for mobile ONLY (drops down to the next circle) */}
                {step.id !== steps.length && (
                  <div className="md:hidden absolute top-[72px] h-[48px] w-[2px] bg-blue-100 -z-10" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">{step.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-[#1a56db] text-white rounded-full shadow-xl z-50 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Scroll to top"
        >
          <ChevronUpIcon />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- ICONS FOR ASSISTANT SECTION ---
const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a56db]">
    <path d="M12 8V4H8"/>
    <rect width="16" height="12" x="4" y="8" rx="2"/>
    <path d="M2 14h2"/>
    <path d="M20 14h2"/>
    <path d="M15 13v2"/>
    <path d="M9 13v2"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a56db] mt-0.5 flex-shrink-0">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <path d="m9 11 3 3L22 4"/>
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

// --- COMPONENT ---
const AssistantSection = () => {
  const features = [
    "Automated verification triggers",
    "Score optimization tips",
    "Fraud prevention alerts"
  ];

  return (
    <section className="bg-[#f8f9fc] py-16 lg:py-24 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Text & Features */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-2">
            <BotIcon />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
            Meet Your <span className="text-[#1a56db]">Trust Assistant.</span>
          </h2>
          
          <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed max-w-lg">
            Our AI automatically analyzes your transaction patterns to detect inconsistencies before they impact your score. It even suggests the best times to request client confirmations for the highest conversion rates.
          </p>

          <ul className="flex flex-col gap-4 mt-4">
            {features.map((feature, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                className="flex items-start gap-3 text-[#0f172a] font-semibold"
              >
                <CheckCircleIcon />
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right Column: UI Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end lg:translate-x-4"
        >
          {/* Mockup Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl shadow-blue-900/10 border border-gray-100 w-full max-w-md">
            
            <div className="flex items-start gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#1a56db] flex items-center justify-center flex-shrink-0 shadow-md">
                <SparklesIcon />
              </div>
              <p className="text-gray-700 font-medium text-sm md:text-base leading-relaxed mt-1">
                Hello! I noticed you haven't requested verification for your last 3 sales. Would you like me to send them now?
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full bg-[#0f172a] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors shadow-md">
                Yes, send to all
              </button>
              <button className="w-full bg-white text-gray-700 py-3.5 rounded-full font-semibold text-sm border-2 border-gray-200 hover:bg-gray-50 transition-colors">
                Let me review first
              </button>
            </div>
            
          </div>

          {/* Optional decorative background blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        </motion.div>

      </div>
    </section>
  );
};

const DashboardSection = () => {
  // Using exact hex codes to prevent Tailwind from purging dynamic classes
  const chartData = [
    { day: "MON", height: "30%", color: "#1a56db" }, // Dark blue
    { day: "TUE", height: "45%", color: "#93c5fd" }, // Light blue
    { day: "WED", height: "35%", color: "#1a56db" }, // Dark blue
    { day: "THU", height: "65%", color: "#93c5fd" }, // Light blue
    { day: "FRI", height: "40%", color: "#1a56db" }, // Dark blue
    { day: "SAT", height: "70%", color: "#93c5fd" }, // Light blue
    { day: "SUN", height: "50%", color: "#1a56db" }, // Dark blue
  ];

  return (
    <section className="bg-white py-16 lg:py-24 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4">
            Your Business, <span className="text-[#1a56db]">Quantified.</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg font-medium max-w-2xl mx-auto">
            Everything you log turns into beautiful, shareable data. Track revenue, monitor client satisfaction, and prove your consistency.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-xl md:rounded-2xl border-[4px] md:border-[8px] border-[#0f172a] shadow-2xl overflow-hidden"
        >
          {/* Mac Window Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex gap-1.5 md:gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-[10px] md:text-xs text-gray-400 font-mono w-1/2 md:w-1/3 text-center truncate shadow-sm">
              app.trustbridge.com/dashboard
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>

          {/* Dashboard Body */}
          <div className="p-4 md:p-8 flex flex-col gap-6 bg-white">
            
            {/* Widget 1: Revenue Summary */}
            <div className="border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-bold text-gray-500 tracking-wider">REVENUE SUMMARY</h4>
                <span className="text-gray-300">•••</span>
              </div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-semibold text-[#1a56db]">THIS MONTH</span>
                <span className="text-xl md:text-2xl font-bold text-[#1a56db]">#4,280.00</span>
              </div>
              {/* Horizontal Progress Bar */}
              <div className="h-2.5 md:h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ backgroundColor: "#1a56db" }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "80%" }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                />
              </div>
              <div className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                +14% from last month
              </div>
            </div>

            {/* Widget 2: Client Feedback */}
            <div className="border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm">
              <h4 className="text-xs font-bold text-gray-500 tracking-wider mb-4">CLIENT FEEDBACK</h4>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1 text-yellow-400">
                  {[1, 2, 3, 4].map(star => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                  {/* Half Star Approximation */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <span className="font-bold text-[#0f172a] ml-2">4.8/5.0</span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Based on 142 verified reviews</p>
            </div>

            {/* Widget 3: Verification Activity Bar Chart */}
            <div className="border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-xs font-bold text-gray-500 tracking-wider">VERIFICATION ACTIVITY</h4>
                <span className="text-gray-300">•••</span>
              </div>
              
              {/* Vertical Animated Bar Chart */}
              <div className="h-40 md:h-48 flex items-end justify-between gap-3 md:gap-6 px-2 md:px-6">
                {chartData.map((data, index) => (
                  <div key={data.day} className="flex flex-col items-center gap-3 w-full h-full justify-end">
                    <motion.div 
                      className="w-full rounded-t-md md:rounded-t-lg"
                      style={{ backgroundColor: data.color }}
                      initial={{ height: 0 }}
                      whileInView={{ height: data.height }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.8, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                    />
                    <span className="text-[10px] md:text-xs font-bold text-gray-400">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Make sure this is imported at the top of your file if it isn't already!
// import { useNavigate } from 'react-router-dom'; 

const CTASection = () => {
  const navigate = useNavigate(); // <-- Initialize the hook here

  return (
    <section className="bg-white py-16 lg:py-24 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-[#1a56db] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden px-6 py-16 md:py-20 text-center shadow-2xl shadow-blue-900/20"
        >
          {/* Decorative Corner Shapes */}
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-[#2b66eb] rounded-full z-0"></div>
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#2b66eb] rounded-full z-0"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl md:text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight"
            >
              Start Building Your <br className="hidden md:block" /> Trust Today.
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-blue-100 text-base md:text-lg mb-10 max-w-xl font-medium"
            >
              Join thousands of entrepreneurs who are finally getting the financial recognition they deserve.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              {/* WIRED UP THE GET STARTED BUTTON */}
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => navigate('/signup')} 
                className="bg-white text-[#1a56db] px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Get Started Free
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="bg-white/15 text-white px-8 py-3.5 rounded-xl font-bold backdrop-blur-sm hover:bg-white/25 transition-colors w-full sm:w-auto"
              >
                Talk to Sales
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
// --- ICONS FOR FOOTER ---
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#0f172a] hover:text-[#1a56db] transition-colors">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#0f172a] hover:text-[#1a56db] transition-colors">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

// --- COMPONENT ---
const FooterSection = () => {
  return (
    <footer className="bg-white pt-16 pb-8 px-6 lg:px-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section: Logo & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="../public/landing-images/logo-bg.svg" alt="TrustBridge Logo" className="h-8 w-auto" />
              <span className="font-bold text-xl text-[#0f172a]">TrustBridge</span>
            </div>
            <p className="text-[#334155] text-sm font-medium leading-relaxed max-w-sm">
              Building financial identities for the informal economy. We turn everyday transactions into verifiable growth opportunities.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#0f172a] font-bold text-sm tracking-wide uppercase">Product</h4>
            <a href="#features" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Features</a>
            <a href="#trust-score" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Trust Score</a>
            <a href="#reports" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Reports</a>
            <a href="#api" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">API</a>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#0f172a] font-bold text-sm tracking-wide uppercase">Company</h4>
            <a href="#about" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">About Us</a>
            <a href="#careers" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Careers</a>
            <a href="#security" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Security</a>
            <a href="#contact" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Contact</a>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#0f172a] font-bold text-sm tracking-wide uppercase">Resources</h4>
            <a href="#help" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Help Center</a>
            <a href="#docs" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Documentation</a>
            <a href="#blog" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Blog</a>
            <a href="#community" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Community</a>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#0f172a] font-bold text-sm tracking-wide uppercase">Legal</h4>
            <a href="#privacy" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Privacy Policy</a>
            <a href="#terms" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Terms of Service</a>
            <a href="#cookies" className="text-[#334155] hover:text-[#1a56db] text-sm font-medium transition-colors">Cookie Policy</a>
          </div>

        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm font-medium text-center md:text-left">
            © 2026 TrustBridge Systems Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#twitter" aria-label="Twitter" className="p-2 rounded-full border border-gray-200 hover:border-[#1a56db] transition-colors">
              <TwitterIcon />
            </a>
            <a href="#linkedin" aria-label="LinkedIn" className="p-2 rounded-full border border-gray-200 hover:border-[#1a56db] transition-colors">
              <LinkedInIcon />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
// --- MAIN PAGE EXPORT ---

const LandingPage = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    // Added overflow-x-hidden right here to the main wrapper!
    <div className="min-h-screen font-sans relative overflow-x-hidden text-[#0f172a] bg-[#f8f9fc]">
      <div className="bg-[#f8f9fc]">
        <Navbar />
        <HeroSection />
      </div>
      <ProblemSection />
      <HowItWorksSection />
      <DashboardSection />
      <AssistantSection />
      <CTASection />
      <FooterSection />
      
      {/* Floating Action Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default LandingPage;
