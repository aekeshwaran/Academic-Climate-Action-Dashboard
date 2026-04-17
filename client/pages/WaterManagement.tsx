import DashboardLayout from "../components/DashboardLayout";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { Droplets, AlertTriangle, CheckCircle2, Plus, RefreshCw, AlertCircle, Search } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface WaterRecord {
  id: number;
  building_name: string;
  daily_consumption_liters: number;
  rainwater_harvested_liters: number;
  groundwater_used_liters: number;
  leak_detected: boolean | number;
  date: string;
  created_at: string;
}

export default function WaterManagement() {
  const [records, setRecords] = useState<WaterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ building: "", consumption: "", harvested: "", groundwater: "", leak: false });
  
  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await axios.get("/api/water");
      setRecords(Array.isArray(data) ? data : []);
    } catch { setError("Could not load water data."); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const totalConsumption = records.reduce((s, r) => s + (Number(r.daily_consumption_liters) || 0), 0);
  const totalHarvested = records.reduce((s, r) => s + (Number(r.rainwater_harvested_liters) || 0), 0);
  const leakRecords = records.filter(r => r.leak_detected == 1 || r.leak_detected === true);
  const savedPct = totalConsumption > 0 ? Math.round((totalHarvested / totalConsumption) * 100) : 0;

  // Trend chart — by date
  const trendData = useMemo(() => {
    const trendMap: Record<string, { date: string; consumption: number; harvested: number }> = {};
    records.slice().reverse().forEach(r => {
      const key = r.date ? new Date(r.date).toLocaleDateString("en", { month: "short", day: "numeric" }) : new Date(r.created_at).toLocaleDateString("en", { month: "short", day: "numeric" });
      if (!trendMap[key]) trendMap[key] = { date: key, consumption: 0, harvested: 0 };
      trendMap[key].consumption += Number(r.daily_consumption_liters) || 0;
      trendMap[key].harvested += Number(r.rainwater_harvested_liters) || 0;
    });
    return Object.values(trendMap).slice(-10);
  }, [records]);

  // Filtering Logic
  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.building_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (searchTerm.toLowerCase() === "leak" && (r.leak_detected == 1 || r.leak_detected === true))
    );
  }, [records, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post("/api/water", {
        building_name: formData.building,
        daily_consumption_liters: parseFloat(formData.consumption),
        rainwater_harvested_liters: parseFloat(formData.harvested || "0"),
        groundwater_used_liters: parseFloat(formData.groundwater || "0"),
        leak_detected: formData.leak,
        date: new Date().toISOString().split("T")[0],
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
      await loadData();
      setTimeout(() => { setSubmitted(false); setShowForm(false); setFormData({ building: "", consumption: "", harvested: "", groundwater: "", leak: false }); }, 2000);
      toast.success("Water record synchronized successfully");
    } catch { toast.error("Failed to synchronize water record"); } finally { setSubmitting(false); }
  };

  return (
    <DashboardLayout title="Water Management">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Consumption", value: totalConsumption > 0 ? `${(totalConsumption / 1000).toFixed(1)}k L` : "—", color: "bg-blue-50 border-blue-100 text-blue-700" },
          { label: "Rainwater Harvested", value: totalHarvested > 0 ? `${(totalHarvested / 1000).toFixed(1)}k L` : "—", color: "bg-teal-50 border-teal-100 text-teal-700" },
          { label: "Water Saved", value: `${savedPct}%`, color: "bg-cyan-50 border-cyan-100 text-cyan-700" },
          { label: "Leak Alerts", value: `${leakRecords.length}`, color: `${leakRecords.length > 0 ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-700"}` },
        ].map((item, i) => (
          <div key={i} className={`rounded-2xl border p-5 text-center ${item.color}`}>
            <p className="text-2xl font-black">{item.value}</p>
            <p className="text-xs font-bold uppercase tracking-wide opacity-70 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {leakRecords.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-800 text-sm">⚠️ Leak Detected — Immediate Action Required</p>
            <p className="text-red-600 text-xs mt-0.5">{leakRecords.map(r => r.building_name || "Unknown building").join(", ")} — Maintenance team should be notified.</p>
          </div>
        </div>
      )}

      {trendData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500" /> Consumption vs Harvesting</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="waterBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" style={{ fontSize: 10 }} />
                <YAxis style={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="consumption" stroke="#3b82f6" fill="url(#waterBlue)" strokeWidth={2} name="Consumption (L)" />
                <Area type="monotone" dataKey="harvested" stroke="#10b981" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Harvested (L)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Groundwater Usage Comparison</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trendData.slice(-6)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" style={{ fontSize: 10 }} />
                <YAxis style={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumption" fill="#3b82f6" name="Consumption (L)" radius={[4,4,0,0]} />
                <Bar dataKey="harvested" fill="#10b981" name="Harvested (L)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search building or 'leak'..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={loadData} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" /> Log Data
            </button>
          </div>
        </div>

        {showForm && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            {submitted ? <p className="text-emerald-700 font-bold text-sm">✅ Water data saved!</p> : (
              <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
                <div><label className="block text-xs font-bold text-slate-600 mb-1 leading-none">Building</label><input required value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})} placeholder="Admin Block" className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all" /></div>
                <div><label className="block text-xs font-bold text-slate-600 mb-1 leading-none">Consumption (L)</label><input required type="number" value={formData.consumption} onChange={e => setFormData({...formData, consumption: e.target.value})} placeholder="1200" className="w-28 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all" /></div>
                <div><label className="block text-xs font-bold text-slate-600 mb-1 leading-none">Harvested (L)</label><input type="number" value={formData.harvested} onChange={e => setFormData({...formData, harvested: e.target.value})} placeholder="280" className="w-28 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all" /></div>
                <div><label className="block text-xs font-bold text-slate-600 mb-1 leading-none">Groundwater (L)</label><input type="number" value={formData.groundwater} onChange={e => setFormData({...formData, groundwater: e.target.value})} placeholder="320" className="w-28 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all" /></div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer h-[38px]"><input type="checkbox" checked={formData.leak} onChange={e => setFormData({...formData, leak: e.target.checked})} className="w-4 h-4" />Leak Detected</label>
                <button type="submit" disabled={submitting} className="h-[38px] px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm disabled:opacity-60 hover:bg-blue-700 transition-all shadow-md shadow-blue-100">{submitting ? "…" : "Record Details"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="h-[38px] px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-sm hover:bg-white transition-all">Cancel</button>
              </form>
            )}
          </div>
        )}

        {error && <div className="mx-6 my-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}

        <div className="overflow-x-auto">
          {filteredRecords.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <Droplets className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">{loading ? "Loading results..." : "No matching water records."}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Building</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Consumption (L)</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Harvested (L)</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Groundwater (L)</th>
                  <th className="px-6 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Leak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentRecords.map(r => (
                  <tr key={r.id} className={`hover:bg-slate-50/50 transition-colors ${(r.leak_detected == 1 || r.leak_detected === true) ? "bg-red-50/30" : ""}`}>
                    <td className="px-6 py-4 font-bold text-slate-700">{r.building_name || "—"}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-600">{Number(r.daily_consumption_liters || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-bold">{Number(r.rainwater_harvested_liters || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-slate-500">{Number(r.groundwater_used_liters || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-slate-400 text-xs font-medium">{r.date ? new Date(r.date).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="px-6 py-4 text-center">
                      {(r.leak_detected == 1 || r.leak_detected === true) ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-100 text-[10px] font-black uppercase text-red-600 border border-red-200"><AlertTriangle className="w-2.5 h-2.5" />Leak</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-black uppercase text-emerald-600 border border-emerald-200"><CheckCircle2 className="w-2.5 h-2.5" />OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Section */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {(currentPage-1)*itemsPerPage + 1} to {Math.min(currentPage*itemsPerPage, filteredRecords.length)} of {filteredRecords.length} results
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-4 py-1.5 border border-slate-200 rounded-xl hover:bg-white transition-all disabled:opacity-30 text-xs font-black text-slate-500 uppercase tracking-widest"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                  currentPage === page ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "hover:bg-white text-slate-400"
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-4 py-1.5 border border-slate-200 rounded-xl hover:bg-white transition-all disabled:opacity-30 text-xs font-black text-slate-500 uppercase tracking-widest"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
