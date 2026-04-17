import DashboardLayout from "../components/DashboardLayout";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from "recharts";
import { 
  Zap, TrendingUp, Sun, Building2, Plus, 
  RefreshCw, AlertCircle, Search, ChevronLeft, ChevronRight 
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";

interface EnergyRecord {
  id: number;
  building_name: string;
  electricity_kwh: number;
  solar_kwh: number;
  savings_percentage: number;
  month: string;
  year: number;
  created_at: string;
}

export default function EnergyMonitoring() {
  const [records, setRecords] = useState<EnergyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ building: "", electricity: "", solar: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/energy");
      setRecords(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Could not load energy data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Derived Values
  const totalElec = records.reduce((s, r) => s + (Number(r.electricity_kwh) || 0), 0);
  const totalSolar = records.reduce((s, r) => s + (Number(r.solar_kwh) || 0), 0);
  const avgSavings = records.length > 0
    ? Math.round(records.reduce((s, r) => s + (Number(r.savings_percentage) || 0), 0) / records.length)
    : 0;

  // Filtering Logic
  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.building_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.month?.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    const savedPct = formData.solar && formData.electricity
      ? Math.round((parseFloat(formData.solar) / parseFloat(formData.electricity)) * 100)
      : 0;

    try {
      await axios.post("/api/energy", {
        building_name: formData.building,
        electricity_kwh: parseFloat(formData.electricity),
        solar_kwh: parseFloat(formData.solar || "0"),
        savings_percentage: savedPct,
        month: new Date().toLocaleString("default", { month: "long" }),
        year: new Date().getFullYear(),
        user_id: 1, // Placeholder
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSubmitted(true);
      await loadData();
      toast.success("Energy usage synchronized successfully");
      setTimeout(() => { 
        setSubmitted(false); 
        setShowForm(false); 
        setFormData({ building: "", electricity: "", solar: "" }); 
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save data");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Energy Monitoring">
      {/* KPI Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Electricity", value: `${(totalElec / 1000).toFixed(1)}k kWh`, icon: Zap, color: "bg-amber-50 text-amber-700" },
          { label: "Solar Generation", value: `${(totalSolar / 1000).toFixed(1)}k kWh`, icon: Sun, color: "bg-green-50 text-green-700" },
          { label: "Avg Efficiency", value: `${avgSavings}%`, icon: TrendingUp, color: "bg-blue-50 text-blue-700" },
          { label: "Buildings", value: `${new Set(records.map(r=>r.building_name)).size}`, icon: Building2, color: "bg-purple-50 text-purple-700" },
        ].map((item, i) => (
          <div key={i} className={`rounded-2xl border border-slate-100 p-5 text-center ${item.color}`}>
            <item.icon className="w-6 h-6 mx-auto mb-2 opacity-70" />
            {loading ? (
              <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
            ) : (
              <p className="text-2xl font-black">{item.value}</p>
            )}
            <p className="text-xs font-bold uppercase tracking-wide opacity-70 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Header with Search */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search building or month..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={loadData} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Log Energy
            </button>
          </div>
        </div>

        {/* Data Logger Form */}
        {showForm && (
          <div className="px-6 py-4 bg-primary/5 border-b border-primary/10">
            {submitted ? (
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <TrendingUp className="w-4 h-4" /> Data synchronized successfully!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-slate-500 mb-1 leading-none uppercase">Building Name</label>
                  <input required value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})} placeholder="Main Research Block" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-bold text-slate-500 mb-1 leading-none uppercase">Elec (kWh)</label>
                  <input required type="number" step="0.01" value={formData.electricity} onChange={e => setFormData({...formData, electricity: e.target.value})} placeholder="4500" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-bold text-slate-500 mb-1 leading-none uppercase">Solar (kWh)</label>
                  <input type="number" step="0.01" value={formData.solar} onChange={e => setFormData({...formData, solar: e.target.value})} placeholder="1200" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all" />
                </div>
                <button type="submit" disabled={submitting} className="px-8 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all">
                  {submitting ? "Processing..." : "Record Details"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Dynamic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left font-black text-slate-400 uppercase tracking-widest text-[10px]">Campus Building</th>
                <th className="px-6 py-4 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Electricity (kWh)</th>
                <th className="px-6 py-4 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Solar Contribution</th>
                <th className="px-6 py-4 text-center font-black text-slate-400 uppercase tracking-widest text-[10px]">Period</th>
                <th className="px-6 py-4 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Calculated CO₂</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-3/4" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-1/2 ml-auto" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-1/2 ml-auto" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-1/3 mx-auto" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-1/3 ml-auto" /></td>
                  </tr>
                ))
              ) : currentRecords.map((r) => {
                const carbon = (r.electricity_kwh * 0.85).toFixed(1);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-700 group-hover:text-primary transition-colors">{r.building_name}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-600">{r.electricity_kwh?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-emerald-600">{r.solar_kwh?.toLocaleString()} kWh</span>
                        <div className="w-20 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${Math.min(r.savings_percentage, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500">{r.month} {r.year}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-black text-slate-800">{carbon}kg</span>
                    </td>
                  </tr>
                );
              })}
              {currentRecords.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">
                    No records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs font-bold text-slate-500">
            Showing {(currentPage-1)*itemsPerPage + 1} to {Math.min(currentPage*itemsPerPage, filteredRecords.length)} of {filteredRecords.length} results
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 border border-slate-200 rounded-xl hover:bg-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  currentPage === page ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-white text-slate-500"
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 border border-slate-200 rounded-xl hover:bg-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
