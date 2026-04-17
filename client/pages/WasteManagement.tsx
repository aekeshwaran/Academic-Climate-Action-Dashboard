import DashboardLayout from "../components/DashboardLayout";
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Recycle, AlertCircle, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface WasteRecord {
  id: number;
  month: string;
  year: number;
  plastic_kg: number;
  organic_kg: number;
  paper_kg: number;
  e_waste_kg: number;
  recycled_kg: number;
  created_at: string;
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];
const REC_COLORS = ['#fca5a5', '#fde68a', '#93c5fd', '#c4b5fd'];

export default function WasteManagement() {
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    plastic_kg: '',
    organic_kg: '',
    paper_kg: '',
    e_waste_kg: '',
    recycled_kg: '',
  });

  const loadData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await axios.get('/api/waste');
      setRecords(Array.isArray(data) ? data : []);
    } catch { setError("Could not load waste data."); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const totals = useMemo(() => {
    return records.reduce((acc, row) => ({
      plastic: acc.plastic + (Number(row.plastic_kg) || 0),
      organic: acc.organic + (Number(row.organic_kg) || 0),
      paper: acc.paper + (Number(row.paper_kg) || 0),
      eWaste: acc.eWaste + (Number(row.e_waste_kg) || 0),
      recycled: acc.recycled + (Number(row.recycled_kg) || 0),
    }), { plastic: 0, organic: 0, paper: 0, eWaste: 0, recycled: 0 });
  }, [records]);

  const totalGenerated = totals.plastic + totals.organic + totals.paper + totals.eWaste;
  const recyclingRate = totalGenerated > 0 ? (totals.recycled / totalGenerated) * 100 : 0;

  const barData = [
    { name: 'Plastic', generated: totals.plastic, recycled: Math.min(totals.recycled * 0.4, totals.plastic) },
    { name: 'Organic', generated: totals.organic, recycled: Math.min(totals.recycled * 0.35, totals.organic) },
    { name: 'Paper', generated: totals.paper, recycled: Math.min(totals.recycled * 0.2, totals.paper) },
    { name: 'E-Waste', generated: totals.eWaste, recycled: Math.min(totals.recycled * 0.05, totals.eWaste) },
  ];

  const pieData = [
    { name: 'Recycled', value: totals.recycled },
    { name: 'Landfill', value: Math.max(0, totalGenerated - totals.recycled) },
  ];
  const PIE_COLORS = ['#10b981', '#f1f5f9'];

  // Filtering Logic
  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      `${r.month} ${r.year}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Number(r.recycled_kg) > 0 && "recycled".includes(searchTerm.toLowerCase()))
    );
  }, [records, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post('/api/waste', {
        user_id: 1, month, year,
        plastic_kg: Number(formData.plastic_kg),
        organic_kg: Number(formData.organic_kg),
        paper_kg: Number(formData.paper_kg),
        e_waste_kg: Number(formData.e_waste_kg),
        recycled_kg: Number(formData.recycled_kg),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
      await loadData();
      toast.success("Waste record logged successfully");
      setTimeout(() => { setSubmitted(false); setShowForm(false); setFormData({ plastic_kg: '', organic_kg: '', paper_kg: '', e_waste_kg: '', recycled_kg: '' }); }, 2000);
    } catch { toast.error("Could not sync waste data with backend."); } finally { setSubmitting(false); }
  };

  return (
    <DashboardLayout title="Waste Management">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Plastic', value: `${totals.plastic.toFixed(1)}kg`, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
          { label: 'Organic', value: `${totals.organic.toFixed(1)}kg`, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Paper', value: `${totals.paper.toFixed(1)}kg`, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { label: 'E-Waste', value: `${totals.eWaste.toFixed(1)}kg`, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
        ].map((item, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${item.bg} text-center transition-transform hover:scale-105`}>
            <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className={`p-8 rounded-3xl text-white mb-6 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-emerald-900/10 ${recyclingRate >= 60 ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : recyclingRate >= 40 ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-rose-500 to-red-700'}`}>
        <div className="text-center md:text-left">
          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Institutional Recycling Rate</p>
          <div className="flex items-baseline justify-center md:justify-start gap-2 mt-2">
            <h2 className="text-7xl font-black tracking-tighter">{recyclingRate.toFixed(1)}%</h2>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border mb-4 ${recyclingRate >= 60 ? 'bg-white/20 border-white/20' : 'bg-black/20 border-black/10'}`}>
              {recyclingRate >= 60 ? 'Elite Performance' : recyclingRate >= 40 ? 'Moderate Growth' : 'Action Required'}
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 max-w-sm mt-2 leading-relaxed">
            Our campus goal is a 75% recycling rate by 2030 through source segregation and composting.
          </p>
        </div>
        <div className="w-48 h-48 mt-8 md:mt-0 relative group">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none" cornerRadius={6}>
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} className="transition-all" />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Recycle className="w-8 h-8 opacity-40" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Waste Breakdown Analytics</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" style={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis dataKey="name" type="category" style={{ fontSize: 10, fontWeight: 700 }} width={70} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <RechartsLegend iconType="circle" />
                <Bar dataKey="generated" fill="#f1f5f9" radius={[0, 4, 4, 0]} name="Logged" stroke="#e2e8f0" barSize={32} />
                <Bar dataKey="recycled" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Recovered" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-bold" />
              <input 
                type="text" 
                placeholder="Search period..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-slate-100 transition-all font-bold"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowForm(!showForm)} 
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4" /> Log Entry
              </button>
            </div>
          </div>
          
          {showForm && (
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              {submitted ? <p className="text-sm font-black text-emerald-600 uppercase tracking-widest py-2">✅ Synchronization Complete!</p> : (
                <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'plastic_kg', label: 'Plastic (kg)', placeholder: '200' },
                    { key: 'organic_kg', label: 'Organic (kg)', placeholder: '300' },
                    { key: 'paper_kg', label: 'Paper (kg)', placeholder: '150' },
                    { key: 'e_waste_kg', label: 'E-Waste (kg)', placeholder: '50' },
                    { key: 'recycled_kg', label: 'Total Recycled (kg)', placeholder: '400' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</label>
                      <input type="number" step="0.1" required value={(formData as any)[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} placeholder={placeholder} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-slate-400 transition-all bg-white" />
                    </div>
                  ))}
                  <div className="flex items-end gap-2">
                    <button type="submit" disabled={submitting} className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-slate-800 disabled:opacity-50 transition-all">{submitting ? 'LOGGING...' : 'Record Details'}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-slate-200 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">CANCEL</button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Generated</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Recycled</th>
                  <th className="px-6 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentRecords.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-medium italic">{loading ? "Synchronizing dataset..." : "No matching waste records found."}</td></tr>
                ) : currentRecords.map(r => {
                  const total = (Number(r.plastic_kg) || 0) + (Number(r.organic_kg) || 0) + (Number(r.paper_kg) || 0) + (Number(r.e_waste_kg) || 0);
                  const rate = total > 0 ? ((Number(r.recycled_kg) || 0) / total) * 100 : 0;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-700">{r.month} {r.year}</td>
                      <td className="px-6 py-4 text-right font-medium text-slate-400">{total.toFixed(0)}kg</td>
                      <td className="px-6 py-4 text-right text-emerald-600 font-black">{Number(r.recycled_kg).toFixed(0)}kg</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${rate > 60 ? 'bg-emerald-100 text-emerald-700' : rate > 40 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                          {rate.toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DATASET: {filteredRecords.length} LOGS</p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 uppercase disabled:opacity-30 hover:bg-white transition-all">PREV</button>
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 uppercase disabled:opacity-30 hover:bg-white transition-all">NEXT</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
