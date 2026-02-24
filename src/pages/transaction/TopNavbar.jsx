import { Bell, ChevronRight } from "lucide-react";

export default function TopNavbar() {
  return (
    <header className="bg-[#F6FAFF] border-b border-gray-100 h-16 flex items-center justify-between px-6 lg:px-12 w-full">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm font-medium">
        <span className="text-gray-400">Transactions</span>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="text-[#0f172a] font-semibold">Log New Transaction</span>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}