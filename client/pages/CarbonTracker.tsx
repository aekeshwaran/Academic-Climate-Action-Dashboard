import DashboardLayout from "../components/DashboardLayout";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Wind, Plus, RefreshCw, AlertCircle, TrendingDown, Search } from "lucide-react";
import CarbonCalculator from "../components/CarbonCalculator";
import axios from "axios";
import { toast } from "sonner";

interface CarbonRecord {
  id: number;
  source: string;
  emission_tons: number;
  month: string;
  year: number;
  created_at: string;
}

const COLORS: Record<string, string> = {
  Electricity: "#f59e0b", Transport: "#3b82f6", "Diesel Generator": "#ef4444",
  Laboratory: "#8b5cf6", "Canteen Gas": "#10b981", Default: "#94a3b8",
};

export default function CarbonTracker() {
  const [records, setRecords] = useState<CarbonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ source: "Electricity", emission_tons: "" });
  
  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await axios.get("/api/carbon");
      setRecords(Array.isArray(data) ? data : []);
    } catch { setError("Could not load carbon data."); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Filtering Logic
  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${r.month} ${r.year}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalCO2 = records.reduce((s, r) => s + (Number(r.emission_tons) || 0), 0);

  // By source for pie
  const bySource = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach(r => {
      const s = r.source || "Other";
      map[s] = (map[s] || 0) + (Number(r.emission_tons) || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value: +value.toFixed(3) }));
  }, [records]);

  // Monthly trend
  const trendData = useMemo(() => {
    const map: Record<string, number> = {};
    records.slice().reverse().forEach(r => {
      const key = r.month ? `${r.month.slice(0,3)} ${r.year}` : new Date(r.created_at).toLocaleDateString("en", { month: "short", year: "numeric" });
      map[key] = (map[key] || 0) + (Number(r.emission_tons) || 0);
    });
    return Object.entries(map).slice(-8).map(([month, total]) => ({ month, total: +total.toFixed(3) }));
  }, [records]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post("/api/carbon", {
        source: formData.source,
        emission_tons: parseFloat(formData.emission_tons),
        month: new Date().toLocaleString("default", { month: "long" }),
        year: new Date().getFullYear(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
      await loadData();
      toast.success("Carbon footprint data recorded");
      setTimeout(() => { setSubmitted(false); setShowForm(false); setFormData({ source: "Electricity", emission_tons: "" }); }, 2000);
    } catch { toast.error("Failed to archive emission data"); }
    finally { setSubmitting(false); }
  };

  return (
    <DashboardLayout title="Carbon Footprint Tracker">
      <div className="mb-6">
        <CarbonCalculator />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total CO₂ Logged", value: totalCO2 > 0 ? `${totalCO2.toFixed(2)} t` : "—", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
          { label: "Largest Source", value: bySource.sort((a,b)=>b.value-a.value)[0]?.name || "—", color: "bg-amber-50 border-amber-100 text-amber-700" },
          { label: "Records Logged", value: `${records.length}`, color: "bg-blue-50 border-blue-100 text-blue-700" },
          { label: "Global Goal", value: "Net Zero '50", color: "bg-violet-50 border-violet-100 text-violet-700" },
        ].map((item, i) => (
          <div key={i} className={`rounded-2xl border p-5 text-center transition-all hover:scale-105 ${item.color}`}>
            <p className="text-2xl font-black">{item.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><TrendingDown className="w-4 h-4 text-emerald-500" /> Emission Trend Analytics</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowForm(!showForm)} 
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
              >
                <Plus className="w-3 h-3" /> Log Emission
              </button>
            </div>
          </div>
          {showForm && (
            <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              {submitted ? <p className="text-sm font-black text-emerald-700 uppercase tracking-widest pb-2">✅ Synchronization Complete!</p> : (
                <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Source</label>
                    <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-emerald-500">
                      <option>Electricity</option><option>Transport</option><option>Diesel Generator</option><option>Laboratory</option><option>Canteen Gas</option><option>Other</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Emission (tons CO₂)</label>
                    <input required type="number" step="0.001" value={formData.emission_tons} onChange={e => setFormData({...formData, emission_tons: e.target.value})} placeholder="2.500" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-emerald-500" />
                  </div>
                  <button type="submit" disabled={submitting} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest disabled:opacity-50 shadow-md">Record Details</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">CANCEL</button>
                </form>
              )}
            </div>
          )}
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData}>
                <defs><linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.25} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" style={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis style={{ fontSize: 10, fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="total" stroke="#10b981" fill="url(#co2Grad)" strokeWidth={3} name="Total CO₂ (tons)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-slate-300">
              <Wind className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest">{loading ? "Synchronizing..." : "No historical records Found"}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Source Distribution</h3>
          {bySource.length > 0 ? (
            <>
              <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart style={{ cursor: 'pointer' }}>
                    <Pie data={bySource} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none" cornerRadius={6} paddingAngle={4}>
                      {bySource.map((entry, i) => <Cell key={i} fill={COLORS[entry.name] || COLORS.Default} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => `${v} tons`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {bySource.map((item, i) => (
                  <div key={i} className="flex flex-col p-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[item.name] || COLORS.Default }} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter truncate">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-800">{item.value} t</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="flex-1 flex items-center justify-center text-slate-300 font-bold text-xs">Dataset unavailable</div>}
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-bold shadow-sm"><AlertCircle className="w-5 h-5" />{error}</div>}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-bold" />
            <input 
              type="text" 
              placeholder="Search source or period..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
            />
          </div>
          <button onClick={loadData} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-400 transition-all"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Emission (tons)</th>
                <th className="px-6 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</th>
                <th className="px-6 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Intensity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentRecords.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-20 text-center text-slate-300 font-bold italic">{loading ? "Synchronizing logs..." : "No matching records found"}</td></tr>
              ) : currentRecords.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-700 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[r.source] || COLORS.Default }} />
                    {r.source || "—"}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-800">{Number(r.emission_tons || 0).toFixed(3)}</td>
                  <td className="px-6 py-4 text-center text-slate-400 text-[10px] font-black uppercase">{r.month} {r.year}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${Number(r.emission_tons) >= 2 ? "bg-rose-100 text-rose-600 border border-rose-200" : Number(r.emission_tons) >= 1 ? "bg-amber-100 text-amber-600 border border-amber-200" : "bg-emerald-100 text-emerald-600 border border-emerald-200"}`}>
                      {Number(r.emission_tons) >= 2 ? "High Risk" : Number(r.emission_tons) >= 1 ? "Moderate" : "Nominal"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dataset: {filteredRecords.length} Entries</p>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-1.5 border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 hover:bg-white disabled:opacity-30 transition-all">PREV</button>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-1.5 border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 hover:bg-white disabled:opacity-30 transition-all">NEXT</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
