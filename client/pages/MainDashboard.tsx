import DashboardLayout from "../components/DashboardLayout";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Zap, Droplets, Wind, Leaf, Recycle, TrendingUp, TrendingDown, Users, ArrowRight, RefreshCw, Sparkles, Lightbulb, Sun, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../components/ui/skeleton";

const energyTrend = [
  { month: "Aug", electricity: 6200, solar: 1100 },
  { month: "Sep", electricity: 5800, solar: 1300 },
  { month: "Oct", electricity: 5400, solar: 1500 },
  { month: "Nov", electricity: 5100, solar: 1400 },
  { month: "Dec", electricity: 4800, solar: 1600 },
  { month: "Jan", electricity: 4500, solar: 1800 },
  { month: "Feb", electricity: 4200, solar: 2000 },
];

const carbonTrend = [
  { month: "Aug", electricity: 2.5, transport: 1.8, generator: 0.9 },
  { month: "Sep", electricity: 2.3, transport: 1.7, generator: 0.8 },
  { month: "Oct", electricity: 2.1, transport: 1.6, generator: 0.7 },
  { month: "Nov", electricity: 2.0, transport: 1.5, generator: 0.6 },
  { month: "Dec", electricity: 1.8, transport: 1.4, generator: 0.5 },
  { month: "Jan", electricity: 1.6, transport: 1.3, generator: 0.5 },
  { month: "Feb", electricity: 1.4, transport: 1.2, generator: 0.4 },
];

const waterData = [
  { week: "W1", consumption: 8500, harvested: 1200, groundwater: 2100 },
  { week: "W2", consumption: 7800, harvested: 1400, groundwater: 1900 },
  { week: "W3", consumption: 7200, harvested: 1600, groundwater: 1700 },
  { week: "W4", consumption: 6900, harvested: 1800, groundwater: 1500 },
  { week: "W5", consumption: 6500, harvested: 2000, groundwater: 1300 },
  { week: "W6", consumption: 6200, harvested: 2200, groundwater: 1100 },
];

const wasteData = [
  { type: "Plastic", generated: 200, recycled: 120 },
  { type: "Paper", generated: 150, recycled: 130 },
  { type: "Organic", generated: 300, recycled: 250 },
  { type: "E-Waste", generated: 80, recycled: 45 },
];

const treePlantation = [
  { month: "Sep", trees: 80 },
  { month: "Oct", trees: 120 },
  { month: "Nov", trees: 95 },
  { month: "Dec", trees: 60 },
  { month: "Jan", trees: 180 },
  { month: "Feb", trees: 215 },
];

const kpis = [
  { label: "Energy Saved", value: "12%", icon: Zap, color: "from-amber-500 to-orange-500", bg: "bg-amber-50 border-amber-100", text: "text-amber-700", trend: "+3%" },
  { label: "Water Saved", value: "18%", icon: Droplets, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 border-blue-100", text: "text-blue-700", trend: "+5%" },
  { label: "Carbon Reduction", value: "9%", icon: Wind, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", trend: "+2%" },
  { label: "Trees Planted", value: "850", icon: Leaf, color: "from-green-500 to-lime-500", bg: "bg-green-50 border-green-100", text: "text-green-700", trend: "+75" },
  { label: "Waste Recycled", value: "65%", icon: Recycle, color: "from-purple-500 to-violet-500", bg: "bg-purple-50 border-purple-100", text: "text-purple-700", trend: "+8%" },
  { label: "Participants", value: "1,250+", icon: Users, color: "from-rose-500 to-pink-500", bg: "bg-rose-50 border-rose-100", text: "text-rose-700", trend: "+120" },
];

const quickNav = [
  { label: "Environmental Monitoring", path: "/environmental-impact", icon: "📊", desc: "Detailed campus environmental performance" },
  { label: "Carbon Tracker & Calc", path: "/carbon-tracker", icon: "🌍", desc: "CO₂ emissions & footprint calculator" },
  { label: "Energy Monitoring", path: "/energy-monitoring", icon: "⚡", desc: "Track building-wise electricity & solar" },
  { label: "Water Management", path: "/water-management", icon: "💧", desc: "Consumption, harvesting & leak alerts" },
  { label: "Waste Management", path: "/waste-management", icon: "♻️", desc: "Recycling rates per waste category" },
  { label: "Green Activities", path: "/green-activities", icon: "🌳", desc: "Eco events, tree plantation drives" },
  { label: "Sustainability Insights", path: "/sustainability-insights", icon: "✨", desc: "Smart recommendations for optimization" },
  { label: "Research Tracker", path: "/research-tracker", icon: "🔬", desc: "Publications, projects, student theses" },
];

export default function MainDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [score, setScore] = useState<any>({ score: 75, energy_subscore: 80, carbon_subscore: 70, water_subscore: 85, waste_subscore: 65 });
  const [treeRecords, setTreeRecords] = useState<any[]>([]);
  const [energyRecords, setEnergyRecords] = useState<any[]>([]);
  const [waterRecords, setWaterRecords] = useState<any[]>([]);
  const [carbonRecords, setCarbonRecords] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [
        analyticsRes,
        scoreRes,
        treesRes,
        energyRes,
        waterRes,
        carbonRes,
        insightsRes
      ] = await Promise.all([
        axios.get("/api/analytics"),
        axios.get("/api/sustainability/score"),
        axios.get("/api/trees"),
        axios.get("/api/energy"),
        axios.get("/api/water"),
        axios.get("/api/carbon"),
        axios.get("/api/insights")
      ]);

      setAnalytics(analyticsRes.data);
      setScore(scoreRes.data);
      setTreeRecords(Array.isArray(treesRes.data) ? treesRes.data : []);
      setEnergyRecords(Array.isArray(energyRes.data) ? energyRes.data : []);
      setWaterRecords(Array.isArray(waterRes.data) ? waterRes.data : []);
      setCarbonRecords(Array.isArray(carbonRes.data) ? carbonRes.data : []);
      setInsights(Array.isArray(insightsRes.data) ? insightsRes.data.slice(0, 3) : []);
    } catch (err) {
      console.error("Dashboard sync error:", err);
      setError("Failed to synchronize campus data. Some metrics may be unavailable.");
    } finally {
      setRefreshing(false);
    }
  };

  const [globalFilter, setGlobalFilter] = useState("All"); 
  const [buildingSearch, setBuildingSearch] = useState("");

  useEffect(() => { 
    loadAll(); 
    const interval = setInterval(loadAll, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, [loadAll]);

  const filteredEnergy = useMemo(() => globalFilter === "All" ? energyRecords : energyRecords.filter(r => r.month === globalFilter), [energyRecords, globalFilter]);
  const filteredWater = useMemo(() => globalFilter === "All" ? waterRecords : waterRecords.filter(r => r.month === globalFilter), [waterRecords, globalFilter]);
  const filteredCarbon = useMemo(() => globalFilter === "All" ? carbonRecords : carbonRecords.filter(r => r.month === globalFilter), [carbonRecords, globalFilter]);

  const totalElec = filteredEnergy.reduce((s, r) => s + (Number(r.electricity_kwh) || 0), 0);
  const totalSolar = filteredEnergy.reduce((s, r) => s + (Number(r.solar_kwh) || 0), 0);
  const totalWater = filteredWater.reduce((s, r) => s + (Number(r.daily_consumption_liters) || 0), 0);
  const totalHarvested = filteredWater.reduce((s, r) => s + (Number(r.rainwater_harvested_liters) || 0), 0);
  const totalTrees = treeRecords.reduce((s, r) => s + (Number(r.trees_planted) || 0), 0);
  const totalCO2 = filteredCarbon.reduce((s, r) => s + (Number(r.emission_tons) || 0), 0);

  const energySavedPct = totalElec > 0 ? Math.round((totalSolar / totalElec) * 100) : score.energy_subscore || 0;
  const waterSavedPct = totalWater > 0 ? Math.round((totalHarvested / totalWater) * 100) : score.water_subscore || 0;

  const buildingComparison = useMemo(() => {
    const buildings: Record<string, any> = {};
    filteredEnergy.forEach(r => {
      if (!buildings[r.building_name]) buildings[r.building_name] = { name: r.building_name, electricity: 0, solar: 0, water: 0, carbon: 0 };
      buildings[r.building_name].electricity += Number(r.electricity_kwh) || 0;
      buildings[r.building_name].solar += Number(r.solar_kwh) || 0;
      buildings[r.building_name].carbon += (Number(r.electricity_kwh) * 0.85) / 1000;
    });
    filteredWater.forEach(r => {
      if (!buildings[r.building_name]) buildings[r.building_name] = { name: r.building_name, electricity: 0, solar: 0, water: 0, carbon: 0 };
      buildings[r.building_name].water += Number(r.daily_consumption_liters) || 0;
    });
    return Object.values(buildings).filter((b: any) => b.name.toLowerCase().includes(buildingSearch.toLowerCase()));
  }, [filteredEnergy, filteredWater, buildingSearch]);

  const treeMap: Record<string, number> = {};
  treeRecords.forEach(r => {
    const key = r.date ? new Date(r.date).toLocaleDateString("en", { month: "short" }) : new Date(r.created_at).toLocaleDateString("en", { month: "short" });
    treeMap[key] = (treeMap[key] || 0) + (Number(r.trees_planted) || 0);
  });
  const liveTreeData = Object.entries(treeMap).map(([month, trees]) => ({ month, trees }));

  // Build energy trend from real data
  const elecMap: Record<string, { electricity: number; solar: number }> = {};
  energyRecords.forEach(r => {
    const key = r.month ? r.month.slice(0,3) : new Date(r.created_at).toLocaleDateString("en", { month: "short" });
    if (!elecMap[key]) elecMap[key] = { electricity: 0, solar: 0 };
    elecMap[key].electricity += Number(r.electricity_kwh) || 0;
    elecMap[key].solar += Number(r.solar_kwh) || 0;
  });
  const liveEnergyTrend = Object.entries(elecMap).map(([month, v]) => ({ month, ...v }));

  // Build carbon trend from real data
  const co2Map: Record<string, { electricity: number; transport: number; generator: number }> = {};
  carbonRecords.forEach(r => {
    const key = r.month ? r.month.slice(0,3) : new Date(r.created_at).toLocaleDateString("en", { month: "short" });
    if (!co2Map[key]) co2Map[key] = { electricity: 0, transport: 0, generator: 0 };
    const src = (r.source || "").toLowerCase();
    if (src.includes("electricity")) co2Map[key].electricity += Number(r.emission_tons) || 0;
    else if (src.includes("transport")) co2Map[key].transport += Number(r.emission_tons) || 0;
    else if (src.includes("generator") || src.includes("diesel")) co2Map[key].generator += Number(r.emission_tons) || 0;
  });
  const liveCarbonTrend = Object.entries(co2Map).map(([month, v]) => ({ month, ...v }));

  // Build water trend from real data
  const waterMap: Record<string, { consumption: number; harvested: number }> = {};
  waterRecords.forEach(r => {
    const key = r.date ? new Date(r.date).toLocaleDateString("en", { month: "short", day: "numeric" }) : new Date(r.created_at).toLocaleDateString("en", { month: "short", day: "numeric" });
    if (!waterMap[key]) waterMap[key] = { consumption: 0, harvested: 0 };
    waterMap[key].consumption += Number(r.daily_consumption_liters) || 0;
    waterMap[key].harvested += Number(r.rainwater_harvested_liters) || 0;
  });
  const liveWaterData = Object.entries(waterMap).slice(-6).map(([week, v]) => ({ week, ...v }));

  const displayEnergyTrend = liveEnergyTrend.length > 0 ? liveEnergyTrend : energyTrend;
  const displayCarbonTrend = liveCarbonTrend.length > 0 ? liveCarbonTrend : carbonTrend;
  const displayWaterData = liveWaterData.length > 0 ? liveWaterData : waterData;
  const displayTreeData = liveTreeData.length > 0 ? liveTreeData : treePlantation;

  const liveKpis = [
    { label: "Energy Saved", value: energySavedPct > 0 ? `${energySavedPct}%` : (analytics ? `${Math.min(energySavedPct,99)}%` : "—"), icon: Zap, color: "from-amber-500 to-orange-500", bg: "bg-amber-50 border-amber-100", text: "text-amber-700", trend: "solar/elec" },
    { label: "Water Saved", value: waterSavedPct > 0 ? `${waterSavedPct}%` : "—", icon: Droplets, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 border-blue-100", text: "text-blue-700", trend: "harvested" },
    { label: "Carbon (tons)", value: totalCO2 > 0 ? `${totalCO2.toFixed(1)}t` : (analytics ? `${Number(analytics.carbonFootprint||0).toFixed(1)}t` : "—"), icon: Wind, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", trend: "CO₂" },
    { label: "Trees Planted", value: totalTrees > 0 ? String(totalTrees) : (analytics ? String(Number(analytics.treesPlanted||0)) : "—"), icon: Leaf, color: "from-green-500 to-lime-500", bg: "bg-green-50 border-green-100", text: "text-green-700", trend: "this year" },
    { label: "Waste Recycled", value: analytics && Number(analytics.wasteRecyclingPercentage) > 0 ? `${Number(analytics.wasteRecyclingPercentage).toFixed(0)}%` : "—", icon: Recycle, color: "from-purple-500 to-violet-500", bg: "bg-purple-50 border-purple-100", text: "text-purple-700", trend: "rate" },
    { label: "Energy (kWh)", value: totalElec > 0 ? `${(totalElec/1000).toFixed(1)}k` : (analytics ? `${(Number(analytics.energyConsumption||0)/1000).toFixed(1)}k` : "—"), icon: Users, color: "from-rose-500 to-pink-500", bg: "bg-rose-50 border-rose-100", text: "text-rose-700", trend: "kWh" },
  ];

  return (
    <DashboardLayout title="Academic Climate Action Dashboard">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Command Center</h2>
          <p className="text-xs text-slate-500 font-bold mt-1">Real-time multi-dimensional sustainability monitoring</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          {["All", "February", "January", "December"].map(f => (
            <button
              key={f}
              onClick={() => setGlobalFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                globalFilter === f ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              {f === "All" ? "All Time" : f}
            </button>
          ))}
          <div className="w-px h-6 bg-slate-100 mx-1" />
          <button 
            onClick={loadAll} 
            disabled={refreshing}
            className="p-1.5 hover:bg-slate-50 rounded-xl transition-all text-emerald-600 disabled:opacity-50"
            title="Force Global Synchronization"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest">
        <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          Live Metrics
        </span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-400 italic font-medium">Sync complete at {new Date().toLocaleTimeString()}</span>
      </div>

      {/* KPI Cards — Live */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {liveKpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`p-5 rounded-3xl border transition-all hover:scale-105 hover:shadow-xl hover:shadow-slate-200/50 ${kpi.bg}`}>
              <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {refreshing ? (
                <Skeleton className="h-8 w-1/2 mx-auto mb-1" />
              ) : (
                <p className={`text-2xl font-black ${kpi.text}`}>{kpi.value}</p>
              )}
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-70">{kpi.label}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-600 uppercase italic opacity-80">{kpi.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Green Score Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-5 mb-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" stroke="#1e3a2f" strokeWidth="10" fill="none" />
              <circle cx="40" cy="40" r="32" stroke="#10b981" strokeWidth="10" fill="none"
                strokeDasharray={`${(score?.score || 75) * 2.01} 201`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-emerald-400">{Math.round(score?.score || 75)}</span>
              <span className="text-[9px] text-emerald-600 font-bold">/ 100</span>
            </div>
          </div>
          <div>
            <p className="text-white font-black text-xl">Institutional Green Score</p>
            <p className="text-emerald-400 text-sm">Overall sustainability rating</p>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          {[
            { label: "Energy", value: score?.energy_subscore || 80, color: "text-amber-400" },
            { label: "Carbon", value: score?.carbon_subscore || 70, color: "text-emerald-400" },
            { label: "Water", value: score?.water_subscore || 85, color: "text-blue-400" },
            { label: "Waste", value: score?.waste_subscore || 65, color: "text-purple-400" },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 rounded-xl px-4 py-2 text-center border border-white/10">
              <p className={`text-xl font-black ${s.color}`}>{Math.round(s.value)}</p>
              <p className="text-xs text-slate-500 font-bold">{s.label}</p>
            </div>
          ))}
        </div>
        {analytics && (
          <div className="ml-auto flex gap-3 flex-wrap">
            {[
              { label: "Carbon (tons)", value: Number(analytics.carbonFootprint || 0).toFixed(1), color: "text-emerald-400" },
              { label: "Energy (kWh)", value: Number(analytics.energyConsumption || 0).toLocaleString(), color: "text-amber-400" },
              { label: "Water (L)", value: Number(analytics.waterUsage || 0).toLocaleString(), color: "text-blue-400" },
            ].map((m, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center">
                <p className={`text-lg font-black ${m.color}`}>{m.value}</p>
                <p className="text-[10px] text-slate-500 font-bold">{m.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Energy Consumption Trend */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Zap className="w-4 h-4 text-amber-600" /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">📊 Energy Consumption Trend</h3>
              <p className="text-xs text-slate-400">Electricity vs Solar (kWh) {liveEnergyTrend.length > 0 ? '— Live' : '— Sample'}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={displayEnergyTrend}>
              <defs>
                <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" style={{ fontSize: 11 }} />
              <YAxis style={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="electricity" stroke="#f59e0b" strokeWidth={2} fill="url(#elecGrad)" name="Electricity (kWh)" />
              <Area type="monotone" dataKey="solar" stroke="#10b981" strokeWidth={2} fill="url(#solarGrad)" name="Solar (kWh)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Carbon Emission Graph */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><Wind className="w-4 h-4 text-emerald-600" /></div>
            <div>
                <h3 className="font-bold text-slate-800 text-sm">🌍 Carbon Emission Graph</h3>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-tighter">Formula: 1 kWh = 0.85 kg CO₂</p>
                <p className="text-xs text-slate-400">{liveCarbonTrend.length > 0 ? '— Live' : '— Sample'}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={displayCarbonTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" style={{ fontSize: 11 }} />
              <YAxis style={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="electricity" fill="#10b981" name="Electricity" radius={[3, 3, 0, 0]} />
              <Bar dataKey="transport" fill="#3b82f6" name="Transport" radius={[3, 3, 0, 0]} />
              <Bar dataKey="generator" fill="#f59e0b" name="Generator" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Water Usage Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><Droplets className="w-4 h-4 text-blue-600" /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">💧 Water Usage Chart</h3>
              <p className="text-xs text-slate-400">Weekly consumption & harvesting (L)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={displayWaterData}>
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" style={{ fontSize: 11 }} />
              <YAxis style={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="consumption" stroke="#3b82f6" fill="url(#waterGrad)" name="Consumption (L)" strokeWidth={2} />
              <Line type="monotone" dataKey="harvested" stroke="#10b981" name="Harvested (L)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Waste Recycling Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center"><Recycle className="w-4 h-4 text-purple-600" /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">♻ Waste Recycling Rate</h3>
              <p className="text-xs text-slate-400">Generated vs Recycled (kg)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={wasteData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" style={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="type" style={{ fontSize: 11 }} width={60} />
              <Tooltip />
              <Legend />
              <Bar dataKey="generated" fill="#f1f5f9" radius={[0, 4, 4, 0]} name="Generated (kg)" stroke="#e2e8f0" />
              <Bar dataKey="recycled" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Recycled (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Smart AI Recommendations</h3>
              <p className="text-xs text-slate-400 font-medium">Campus-wide optimization insights based on real-time data</p>
            </div>
          </div>
          <Link to="/sustainability-insights" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.length > 0 ? insights.map((insight, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  insight.impact_level === 'High' ? 'bg-red-100 text-red-700' : 
                  insight.impact_level === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  {insight.impact_level} Impact
                </span>
                <Lightbulb className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-bold text-slate-800 mb-2 leading-tight">
                {insight.message}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                <span>Suggested:</span>
                <span className="text-slate-500 normal-case font-medium truncate">{insight.action_suggested}</span>
              </div>
            </div>
          )) : (
            <div className="col-span-3 py-8 text-center text-slate-400 text-sm italic">
              Analyzing campus data for new recommendations...
            </div>
          )}
        </div>
      </div>

      {/* Tree Plantation + Quick Nav */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Tree Plantation */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center"><Leaf className="w-4 h-4 text-green-600" /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">🌳 Tree Plantation</h3>
              <p className="text-xs text-slate-400">Monthly trees planted</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={displayTreeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" style={{ fontSize: 10 }} />
              <YAxis style={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="trees" fill="#22c55e" radius={[4, 4, 0, 0]} name="Trees Planted" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-green-700">{totalTrees > 0 ? totalTrees : (analytics?.treesPlanted || 0)}</p>
              <p className="text-[10px] text-slate-500 font-bold">Total Planted</p>
            </div>
            <div className="bg-teal-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-teal-700">{((totalTrees > 0 ? totalTrees : (analytics?.treesPlanted || 0)) * 0.022).toFixed(1)}t</p>
              <p className="text-[10px] text-slate-500 font-bold">CO₂ Absorbed</p>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm">Quick Module Access</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickNav.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{item.label}</p>
                  <p className="text-xs text-slate-400 leading-snug">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 ml-auto flex-shrink-0 mt-0.5 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Building-wise Comparative Benchmarking */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Campus Building Benchmarking</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">Comparative analysis of resource consumption across segments</p>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 font-bold" />
            <input 
              type="text" 
              placeholder="Filter specific buildings..." 
              value={buildingSearch}
              onChange={(e) => setBuildingSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Building Entity</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Electricity</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Solar Opt</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Water Draw</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Carbon Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {refreshing ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-4"><Skeleton className="h-10 w-full rounded-2xl" /></td>
                    <td className="px-8 py-4 text-right"><Skeleton className="h-6 w-1/2 ml-auto" /></td>
                    <td className="px-8 py-4 text-right"><Skeleton className="h-6 w-1/3 ml-auto" /></td>
                    <td className="px-8 py-4 text-right"><Skeleton className="h-6 w-1/2 ml-auto" /></td>
                    <td className="px-8 py-4 text-right"><Skeleton className="h-8 w-1/3 ml-auto rounded-full" /></td>
                  </tr>
                ))
              ) : buildingComparison.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Sparkles className="w-8 h-8" />
                      <p className="text-[10px] font-black uppercase italic tracking-widest">No benchmark data available for current filter</p>
                    </div>
                  </td>
                </tr>
              ) : buildingComparison.map((b: any, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-500 transition-colors" />
                      <div>
                        <p className="font-black text-slate-800 text-[13px]">{b.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Campus Segment</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <span className="font-black text-slate-700">{(b.electricity || 0).toLocaleString()}</span>
                    <span className="text-[9px] font-black text-slate-400 ml-1 uppercase">kWh</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black">
                      <Sun className="w-3 h-3" />
                      {b.electricity > 0 ? Math.round((b.solar/b.electricity)*100) : 0}%
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right font-black text-blue-600">
                    {(b.water || 0).toLocaleString()}
                    <span className="text-[9px] font-black text-slate-400 ml-1 uppercase">Liters</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${b.carbon > 5 ? 'bg-rose-100 text-rose-700' : 'bg-slate-900 text-white'}`}>
                      {b.carbon.toFixed(2)} t
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Carbon Predictor Teaser */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <Sparkles className="absolute -right-8 -top-8 w-48 h-48 text-white/5" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">
                🤖 Advanced AI Forecasting
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tighter">Carbon Footprint Predictor</h2>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Leveraging machine learning algorithms to analyze historic multi-variant campus data. Predicted trajectories assist in proactive sustainability budgeting and carbon offset planning.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
              {[
                { label: "Predicted Next Month", value: "3.2 tons", color: "text-emerald-400" },
                { label: "Expected Reduction", value: "-14%", color: "text-blue-400" },
                { label: "Algorithm Confidence", value: "92%", color: "text-indigo-300" },
                { label: "Data Quality Score", value: "Optimal", color: "text-slate-300" },
              ].map((m, i) => (
                <div key={i} className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 flex flex-col items-center md:items-start justify-center min-w-[160px] hover:bg-white/[0.06] transition-all">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{m.label}</span>
                  <span className={`text-xl font-black ${m.color}`}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
