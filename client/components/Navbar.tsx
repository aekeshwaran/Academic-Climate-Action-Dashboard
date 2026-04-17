import { Menu } from "lucide-react";

export default function Navbar({ setMobileOpen, title }: any) {
  const rawUser = localStorage.getItem("userData");
  const user = rawUser ? JSON.parse(rawUser) : { name: "User" };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden text-slate-500 hover:text-slate-900"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div>
        <h1 className="text-lg font-black text-slate-900">{title || "Academic Climate Action Dashboard"}</h1>
        <p className="text-xs text-slate-500 hidden sm:block">SDG-13 · NAAC · NIRF Compliance Monitoring System</p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-700">Live</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-black">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
