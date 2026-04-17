import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Leaf,
  TrendingUp,
  Zap,
  Droplets,
  Wind,
  FileText,
  Download,
  BarChart2,
  Award,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const monthlyTrend = [
  { month: "Aug", carbon: 5.8, energy: 6200, water: 8500 },
  { month: "Sep", carbon: 5.4, energy: 5900, water: 8000 },
  { month: "Oct", carbon: 5.1, energy: 5700, water: 7800 },
  { month: "Nov", carbon: 4.7, energy: 5500, water: 7200 },
  { month: "Dec", carbon: 4.4, energy: 5200, water: 6900 },
  { month: "Jan", carbon: 4.0, energy: 4800, water: 6500 },
  { month: "Feb", carbon: 3.7, energy: 4500, water: 6200 },
];

const sdgIndicators = [
  { label: "Net-Zero Progress (SDG-13)", percent: 54 },
  { label: "Renewable Energy Share (SDG-7)", percent: 65 },
  { label: "Water Efficiency (SDG-6)", percent: 72 },
  { label: "Zero Waste Goal (SDG-12)", percent: 48 },
  { label: "Green Campus Coverage (SDG-15)", percent: 61 },
];

const reportTypes = [
  {
    icon: Leaf,
    title: "NAAC Green Sustainability Report",
    description: "Comprehensive environmental compliance report for NAAC accreditation covering all sustainability parameters.",
    category: "Accreditation",
    color: "from-emerald-50 to-teal-50 border-emerald-200",
    iconColor: "text-emerald-600",
    updated: "Feb 2025",
  },
  {
    icon: TrendingUp,
    title: "NIRF Environment Impact Report",
    description: "National ranking sustainability metrics aligned with NIRF criteria for better institutional scoring.",
    category: "Ranking",
    color: "from-blue-50 to-cyan-50 border-blue-200",
    iconColor: "text-blue-600",
    updated: "Feb 2025",
  },
  {
    icon: BarChart2,
    title: "SDG-13 Climate Action Report",
    description: "Progress tracking for Sustainable Development Goal 13 targets with evidence-based metrics.",
    category: "SDG Reporting",
    color: "from-violet-50 to-purple-50 border-violet-200",
    iconColor: "text-violet-600",
    updated: "Jan 2025",
  },
  {
    icon: Zap,
    title: "Energy Audit Report",
    description: "Building-wise energy consumption, renewable contribution, and efficiency analysis.",
    category: "Energy",
    color: "from-amber-50 to-orange-50 border-amber-200",
    iconColor: "text-amber-600",
    updated: "Jan 2025",
  },
  {
    icon: Wind,
    title: "Carbon Footprint Audit",
    description: "Scope 1, 2 and 3 emissions inventory with reduction roadmap and offset tracking.",
    category: "Carbon",
    color: "from-slate-50 to-gray-50 border-slate-200",
    iconColor: "text-slate-600",
    updated: "Dec 2024",
  },
  {
    icon: Droplets,
    title: "Water Conservation Report",
    description: "Daily consumption analysis, rainwater harvesting performance, and leak management.",
    category: "Water",
    color: "from-sky-50 to-blue-50 border-sky-200",
    iconColor: "text-sky-600",
    updated: "Dec 2024",
  },
];

const kpiData = [
  { label: "Energy Saved", value: "12%", icon: "⚡", sub: "vs last year", color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Water Saved", value: "18%", icon: "💧", sub: "vs last year", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Carbon Reduction", value: "9%", icon: "🌿", sub: "vs last year", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Trees Planted", value: "850", icon: "🌳", sub: "this academic year", color: "text-teal-600", bg: "bg-teal-50" },
  { label: "Waste Recycled", value: "65%", icon: "♻️", sub: "recycling rate", color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Green Events", value: "36", icon: "📅", sub: "this year", color: "text-red-600", bg: "bg-red-50" },
];

const emissionPie = [
  { name: "Electricity", value: 45, color: "#f59e0b" },
  { name: "Transport", value: 28, color: "#3b82f6" },
  { name: "Generator", value: 15, color: "#ef4444" },
  { name: "Others", value: 12, color: "#cbd5e1" },
];

export default function Reports() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("user") === "loggedIn");
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setAnalytics(d))
      .catch(() => {});
  }, []);

  const handleDownload = (type: "csv" | "pdf") => {
    setDownloading(type);
    window.open(`/api/reports/${type}`, "_blank");
    setTimeout(() => setDownloading(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">EcoTrack</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Home</Link>
              <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/leaderboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Leaderboard</Link>
              <Link to="/reports" className="text-sm font-medium text-primary transition-colors font-bold">Reports</Link>
            </nav>
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button className="bg-primary hover:bg-primary/90">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="bg-primary hover:bg-primary/90">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <FileText className="w-4 h-4" />
            NAAC · NIRF · SDG-13 Compliance
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Sustainability{" "}
            <span className="bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
              Reports & Analytics
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive environmental data, institutional reporting, and accreditation-ready sustainability metrics for your campus.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => handleDownload("csv")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white gap-2"
              disabled={downloading === "csv"}
            >
              <Download className="w-4 h-4" />
              {downloading === "csv" ? "Preparing..." : "Download CSV"}
            </Button>
            <Button
              onClick={() => handleDownload("pdf")}
              className="bg-primary hover:bg-primary/90 gap-2"
              disabled={downloading === "pdf"}
            >
              <FileText className="w-4 h-4" />
              {downloading === "pdf" ? "Generating..." : "Full PDF Report"}
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {kpiData.map((item, i) => (
            <Card key={i} className={`p-4 text-center ${item.bg} border-transparent`}>
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
              <p className="text-xs font-bold text-slate-600 mt-0.5">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <Card className="lg:col-span-2 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              6-Month Environmental Trend
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" style={{ fontSize: 11 }} />
                <YAxis yAxisId="left" style={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" style={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="carbon" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Carbon (tons)" />
                <Line yAxisId="right" type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Energy (kWh)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              Carbon Source Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={emissionPie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
                  {emissionPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Live Analytics from DB */}
        {analytics && (
          <Card className="p-6 mb-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black">Live Campus Analytics</h2>
                <p className="text-slate-400 text-sm mt-1">Data sourced from institutional database</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Carbon Footprint", value: `${Number(analytics.carbonFootprint || 0).toFixed(2)} t`, color: "text-emerald-400" },
                { label: "Energy Consumed", value: `${Number(analytics.energyConsumption || 0).toLocaleString()} kWh`, color: "text-amber-400" },
                { label: "Water Used", value: `${Number(analytics.waterUsage || 0).toLocaleString()} L`, color: "text-blue-400" },
                { label: "Recycling Rate", value: `${Number(analytics.wasteRecyclingPercentage || 0).toFixed(1)}%`, color: "text-purple-400" },
                { label: "Trees Planted", value: Number(analytics.treesPlanted || 0).toLocaleString(), color: "text-teal-400" },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* SDG Progress */}
        <Card className="p-6 mb-10">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-violet-600" />
            SDG Compliance Progress
          </h3>
          <div className="space-y-4">
            {sdgIndicators.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  <span className="text-sm font-black text-primary">{item.percent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${item.percent >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : item.percent >= 50 ? 'bg-gradient-to-r from-amber-400 to-yellow-400' : 'bg-gradient-to-r from-red-400 to-rose-400'}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Report Cards Grid */}
        <h2 className="text-2xl font-black text-slate-900 mb-6">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {reportTypes.map((report, i) => {
            const Icon = report.icon;
            return (
              <Card key={i} className={`p-6 bg-gradient-to-br ${report.color} border hover:shadow-lg transition-all group cursor-pointer`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                    <Icon className={`w-5 h-5 ${report.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {report.updated}
                  </div>
                </div>
                <span className="inline-block text-xs font-bold text-slate-500 bg-white/60 px-2 py-0.5 rounded-full mb-2">{report.category}</span>
                <h3 className="font-black text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">{report.title}</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">{report.description}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-0 text-primary font-bold hover:gap-2 transition-all flex items-center gap-1"
                  onClick={() => handleDownload("pdf")}
                >
                  Download <Download className="w-4 h-4" />
                </Button>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-r from-emerald-900 to-teal-800 text-white border-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black mb-2">Ready to submit for NAAC/NIRF?</h2>
              <p className="text-emerald-200">Go to the dashboard to update your sustainability data before generating reports.</p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="border-emerald-500 text-white hover:bg-emerald-900/50 whitespace-nowrap px-8 py-6 text-base font-black">
                Open Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">EcoTrack</span>
            </div>
            <p className="text-sm text-center">© 2024 EcoTrack. All rights reserved. | Academic Climate Action Dashboard</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
