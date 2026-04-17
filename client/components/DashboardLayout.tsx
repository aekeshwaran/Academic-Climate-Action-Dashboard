import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar — desktop */}
      <aside
        className={`hidden lg:flex flex-col relative transition-all duration-500 ease-in-out flex-shrink-0 z-30 ${collapsed ? "w-20" : "w-72"}`}
      >
        <Sidebar collapsed={collapsed} />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-10 -right-3.5 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:bg-emerald-500 hover:scale-110 transition-all z-40 border-2 border-white"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Sidebar — mobile */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 z-50 lg:hidden transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        <div className="absolute top-4 right-4 z-10">
          <button onClick={() => setMobileOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <Sidebar collapsed={false} setMobileOpen={setMobileOpen} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar setMobileOpen={setMobileOpen} title={title} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
          
          {/* Global Footer */}
          <footer className="text-center py-8 px-6 border-t border-slate-100 bg-white/50 backdrop-blur-sm mt-12 rounded-t-3xl shadow-inner">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">
              Academic Climate Action Dashboard
            </p>
            <p className="text-xs text-slate-500 font-medium">
              © 2026 EcoTrack Systems. Built for Campus Sustainability Excellence.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
