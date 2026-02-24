import {
  LayoutDashboard, ArrowRightLeft, PlusCircle,
  FileText, ShieldCheck, Settings, LogOut, X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../../components/logo";

export default function Sidebar({ onDesktopClose }) {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Transaction", icon: ArrowRightLeft, path: "/log-transaction" },
    { name: "Add Transaction", icon: PlusCircle, path: "/new-transaction" }, // can have separate route
    { name: "Report", icon: FileText, path: "/report" }, // placeholder
    { name: "Trust Score", icon: ShieldCheck, path: "/trust-score" }, // placeholder
    { name: "Settings", icon: Settings, path: "/settings" }, // placeholder
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 w-64">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="w-8 h-8" />
          <span className="font-bold text-xl text-[#0f172a]">TrustBridge</span>
        </div>

        {onDesktopClose && (
          <button
            onClick={onDesktopClose}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-50 text-[#1a56db] font-semibold"
                  : "text-gray-500 hover:text-[#1a56db] hover:bg-gray-50"
              }`
            }
          >
            <item.icon className="w-5 h-5" /> {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 font-medium rounded-lg w-full">
          <LogOut className="w-5 h-5" /> Log out
        </button>
      </div>
    </div>
  );
}