import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import LogTransaction from "./LogTransaction";

export default function TransactionLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-[#f8fafc] overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <AnimatePresence initial={false}>
        {isDesktopSidebarOpen && (
          <motion.aside
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ duration: 0.25 }}
            className="hidden lg:flex w-64 flex-col border-r border-gray-100 bg-white z-20"
          >
            <Sidebar onDesktopClose={() => setIsDesktopSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-64 bg-white z-40 lg:hidden shadow-lg"
            >
              <Sidebar onDesktopClose={() => setIsMobileMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN COLUMN */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <LogTransaction />
          </div>
        </main>
      </div>
    </div>
  );
}
