import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function WasteManagementDashboard() {
  const [wasteData, setWasteData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ plastic: 0, organic: 0, paper: 0, eWaste: 0, recycled: 0 });
  const [formData, setFormData] = useState({
    plastic_kg: '',
    organic_kg: '',
    paper_kg: '',
    e_waste_kg: '',
    recycled_kg: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/waste');
      const data = await res.json();
      setWasteData(Array.isArray(data) ? data : []);
      const agg = (Array.isArray(data) ? data : []).reduce(
        (acc: any, row: any) => ({
          plastic: acc.plastic + (Number(row.plastic_kg) || 0),
          organic: acc.organic + (Number(row.organic_kg) || 0),
          paper: acc.paper + (Number(row.paper_kg) || 0),
          eWaste: acc.eWaste + (Number(row.e_waste_kg) || 0),
          recycled: acc.recycled + (Number(row.recycled_kg) || 0),
        }),
        { plastic: 0, organic: 0, paper: 0, eWaste: 0, recycled: 0 }
      );
      setTotals(agg);
    } catch (e) {
      console.error('Waste fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_id: 1 }),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({ plastic_kg: '', organic_kg: '', paper_kg: '', e_waste_kg: '', recycled_kg: '' });
      fetchData();
    } catch (e) {
      console.error('Waste submit error', e);
    } finally {
      setSubmitting(false);
    }
  };

  const totalGenerated = totals.plastic + totals.organic + totals.paper + totals.eWaste;
  const recyclingRate = totalGenerated > 0 ? (totals.recycled / totalGenerated) * 100 : 0;

  const barData = {
    labels: ['Plastic', 'Organic', 'Paper', 'E-Waste'],
    datasets: [
      {
        label: 'Generated (kg)',
        data: [totals.plastic, totals.organic, totals.paper, totals.eWaste],
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'],
        borderRadius: 6,
      },
      {
        label: 'Recycled (kg)',
        data: [
          Math.min(totals.recycled * 0.4, totals.plastic),
          Math.min(totals.recycled * 0.35, totals.organic),
          Math.min(totals.recycled * 0.2, totals.paper),
          Math.min(totals.recycled * 0.05, totals.eWaste),
        ],
        backgroundColor: ['#fca5a5', '#fde68a', '#93c5fd', '#c4b5fd'],
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ['Recycled', 'Landfill'],
    datasets: [{
      data: [recyclingRate, Math.max(0, 100 - recyclingRate)],
      backgroundColor: ['#10b981', '#e2e8f0'],
      borderWidth: 0,
    }],
  };

  if (loading) return <div className="p-6 text-slate-400 text-center animate-pulse">Loading Waste Module...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Waste Management Module ♻️</h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Plastic Waste', value: `${totals.plastic.toFixed(1)} kg`, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
          { label: 'Organic Waste', value: `${totals.organic.toFixed(1)} kg`, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Paper Waste', value: `${totals.paper.toFixed(1)} kg`, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { label: 'E-Waste', value: `${totals.eWaste.toFixed(1)} kg`, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-xl border ${item.bg} text-center`}>
            <p className="text-xs text-slate-500 font-medium uppercase mb-1">{item.label}</p>
            <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Recycling Rate Banner */}
      <div className={`p-5 rounded-xl text-white flex items-center justify-between ${recyclingRate >= 60 ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : recyclingRate >= 40 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
        <div>
          <p className="text-sm font-bold uppercase opacity-80">Overall Recycling Rate</p>
          <p className="text-4xl font-black leading-none mt-1">{recyclingRate.toFixed(1)}%</p>
          <p className="text-sm opacity-70 mt-1">
            {recyclingRate >= 60 ? '✅ Excellent performance!' : recyclingRate >= 40 ? '⚠️ Good, room for improvement' : '🔴 Needs urgent attention'}
          </p>
        </div>
        <div className="w-32 h-32">
          <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '65%' }} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Waste by Category</h3>
          <div className="h-64">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Waste Data Log</h3>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs text-slate-500 uppercase">Month</th>
                  <th className="px-3 py-2 text-right text-xs text-slate-500 uppercase">Recycled</th>
                  <th className="px-3 py-2 text-right text-xs text-slate-500 uppercase">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {wasteData.slice(0, 8).map((r: any) => {
                  const total = (Number(r.plastic_kg) || 0) + (Number(r.organic_kg) || 0) + (Number(r.paper_kg) || 0) + (Number(r.e_waste_kg) || 0);
                  const rate = total > 0 ? ((Number(r.recycled_kg) || 0) / total) * 100 : 0;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-medium">{r.month} {r.year}</td>
                      <td className="px-3 py-2 text-right">{Number(r.recycled_kg).toFixed(1)} kg</td>
                      <td className="px-3 py-2 text-right">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${rate > 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {rate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {wasteData.length === 0 && (
                  <tr><td colSpan={3} className="px-3 py-6 text-center text-slate-400">No records yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log New Entry */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Log Waste Data</h3>
        {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium">✅ Waste data recorded successfully!</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: 'plastic_kg', label: 'Plastic (kg)', placeholder: '200' },
            { key: 'organic_kg', label: 'Organic (kg)', placeholder: '300' },
            { key: 'paper_kg', label: 'Paper (kg)', placeholder: '150' },
            { key: 'e_waste_kg', label: 'E-Waste (kg)', placeholder: '50' },
            { key: 'recycled_kg', label: 'Recycled (kg)', placeholder: '400' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input
                type="number"
                min="0"
                required
                value={(formData as any)[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          ))}
          <div className="col-span-2 md:col-span-5 flex justify-end">
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition text-sm">
              {submitting ? 'Saving...' : 'Record Waste Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
