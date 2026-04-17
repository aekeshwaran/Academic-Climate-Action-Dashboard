import { useState, useEffect } from "react";
import { Leaf, Eye, EyeOff, Shield, GraduationCap, Briefcase, FlaskConical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";

const roles = [
  { icon: Shield, label: "Admin", desc: "Manage & Generate Reports", color: "text-red-500 bg-red-50" },
  { icon: Briefcase, label: "Officer", desc: "Upload Environmental Data", color: "text-blue-500 bg-blue-50" },
  { icon: FlaskConical, label: "Faculty", desc: "Add Research Projects", color: "text-purple-500 bg-purple-50" },
  { icon: GraduationCap, label: "Student", desc: "Green Initiatives & Credits", color: "text-emerald-500 bg-emerald-50" },
];

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("user") === "loggedIn") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/login", { email: username, password });
      localStorage.setItem("user", "loggedIn");
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user?.name || username}!`);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-black text-2xl leading-tight">EcoTrack</p>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Academic Dashboard</p>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white mb-4 leading-tight">
            Academic Climate<br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Action Dashboard
            </span>
          </h1>
          <p className="text-slate-400 mb-10 leading-relaxed">
            Monitor, analyze, and report campus sustainability activities. SDG-13 · NAAC · NIRF compliance in one platform.
          </p>

          {/* Role cards */}
          <div className="grid grid-cols-2 gap-3">
            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-left hover:bg-white/10 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${role.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-white text-sm font-bold">{role.label}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{role.desc}</p>
                </div>
              );
            })}
          </div>

          {/* SDG badges */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {["SDG-13", "NAAC", "NIRF", "Green Campus"].map((badge, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-xl">EcoTrack</p>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Academic Dashboard</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/30">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-1">Welcome back</h2>
              <p className="text-slate-500 text-sm">Sign in to access your sustainability dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input
                  id="username"
                  type="email"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder-slate-300 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder-slate-300 bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>

              {/* Register link */}
              <p className="text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-emerald-600 font-bold hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-500 mt-6">
            © 2026 All Rights Reserved – EcoTrack | Academic Climate Action Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
