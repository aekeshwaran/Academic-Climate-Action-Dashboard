import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Zap, Wind, Droplets, Recycle, Leaf, 
  FileBarChart2, Users, LogOut, Sparkles, X, Radio
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Maglev System", icon: Radio, path: "/maglev-dashboard" },
  { label: "Energy Monitoring", icon: Zap, path: "/energy-monitoring" },
  { label: "Carbon Tracker", icon: Wind, path: "/carbon-tracker" },
  { label: "Climate Action", icon: Wind, path: "/climate-dashboard" },
  { label: "Water Management", icon: Droplets, path: "/water-management" },
  { label: "Waste Management", icon: Recycle, path: "/waste-management" },
  { label: "Green Activities", icon: Leaf, path: "/green-activities" },
  { label: "Environmental Monitoring", icon: Wind, path: "/environmental-impact" },
  { label: "AI Insights", icon: Sparkles, path: "/sustainability-insights" },
  { label: "Reports", icon: FileBarChart2, path: "/reports" },
  { label: "Users & Roles", icon: Users, path: "/users", adminOnly: true },
];

export default function Sidebar({ collapsed, mobileOpen, setMobileOpen }: any) {
  const location = useLocation();
  const navigate = useNavigate();

  const rawUser = localStorage.getItem("userData");
  const user = rawUser ? JSON.parse(rawUser) : { name: "User", role: "user" };
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-emerald-950/80 to-slate-900 border-r border-emerald-800/30">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-emerald-700/50 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-black text-sm leading-tight">EcoTrack</p>
            <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Academic Dashboard</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.filter(item => !item.adminOnly || isAdmin).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}`} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User Area */}
      <div className={`p-3 border-t border-emerald-700/30 ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
        {!collapsed && (
          <div className="px-3 py-2 mb-2 rounded-xl bg-white/5">
            <p className="text-white text-xs font-bold truncate">{user?.name || "User"}</p>
            <p className="text-emerald-400 text-[10px] capitalize font-semibold">{user?.role || "user"}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
