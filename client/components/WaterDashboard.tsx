import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function WaterDashboard() {
  const [waterData, setWaterData] = useState([]);
  const [trends, setTrends] = useState([]);
  const [leaks, setLeaks] = useState([]);
  const [summary, setSummary] = useState({ total_consumption: 0, total_rainwater: 0, total_groundwater: 0, conservation_score: 0 });
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    building_name: '',
    daily_consumption_liters: '',
    rainwater_harvested_liters: '',
    groundwater_used_liters: '',
    leak_detected: false,
    date: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    try {
      const [dataRes, sumRes, leaksRes, trendsRes] = await Promise.all([
        fetch('/api/water'),
        fetch('/api/water/summary'),
        fetch('/api/water/leaks'),
        fetch('/api/water/trends'),
      ]);
      const data = await dataRes.json();
      const sum = await sumRes.json();
      const lks = await leaksRes.json();
      const trs = await trendsRes.json();
      
      setWaterData(data);
      setSummary(sum);
      setLeaks(lks);
      setTrends(trs);
    } catch (error) {
      console.error('Error fetching water data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      fetchData();
      setFormData({ ...formData, building_name: '', daily_consumption_liters: '', rainwater_harvested_liters: '', groundwater_used_liters: '', leak_detected: false });
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  // Trends Line Chart
  const lineData = {
    labels: trends.map((t: any) => t.month),
    datasets: [
      {
        label: 'Monthly Consumption (Liters)',
        data: trends.map((t: any) => t.consumption),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.5)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  // Sources Bar Chart
  const barData = {
    labels: ['Rainwater Harvested', 'Groundwater Used'],
    datasets: [
      {
        label: 'Volume (Liters)',
        data: [summary.total_rainwater, summary.total_groundwater],
        backgroundColor: ['#3b82f6', '#8b5cf6'],
      }
    ]
  };

  if (loading) return <div className="p-4 text-center">Loading Water Module...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Water Management 💧</h2>

      {/* Leaks Alert */}
      {leaks.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="text-red-800 font-bold mb-1">Leak Detected Alert</h3>
            <p className="text-red-700 text-sm">Potential water leaks have been reported in: {leaks.map((l:any) => l.building_name).join(', ')}.</p>
          </div>
        </div>
      )}

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
          <p className="text-slate-500 font-medium mb-1">Total Consumption</p>
          <span className="text-3xl font-black text-cyan-700">{summary.total_consumption.toLocaleString()} <span className="text-sm font-normal">Liters</span></span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
          <p className="text-slate-500 font-medium mb-1">Rainwater Harvested</p>
          <span className="text-3xl font-black text-blue-600">{summary.total_rainwater.toLocaleString()} <span className="text-sm font-normal">Liters</span></span>
        </div>
        <div className="bg-cyan-50 p-6 rounded-xl shadow-sm border border-cyan-100 flex flex-col justify-center items-center">
          <p className="text-cyan-700 font-medium mb-1">Conservation Score</p>
          <span className="text-4xl font-black text-cyan-800">{summary.conservation_score.toFixed(1)}%</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Water Consumption Trend</h3>
          <div className="h-64">
             <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Sourcing & Harvesting</h3>
          <div className="h-64">
             <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Data Entry & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Log Water Usage</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Building Name</label>
              <input type="text" required value={formData.building_name} onChange={e => setFormData({...formData, building_name: e.target.value})} className="w-full p-2 border border-slate-200 rounded focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="e.g. Admin Block" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Consumption (Liters)</label>
              <input type="number" required min="0" value={formData.daily_consumption_liters} onChange={e => setFormData({...formData, daily_consumption_liters: e.target.value})} className="w-full p-2 border border-slate-200 rounded focus:ring-2 focus:ring-cyan-500 outline-none" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Rainwater (L)</label>
                <input type="number" required min="0" value={formData.rainwater_harvested_liters} onChange={e => setFormData({...formData, rainwater_harvested_liters: e.target.value})} className="w-full p-2 border border-slate-200 rounded focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Groundwater (L)</label>
                <input type="number" required min="0" value={formData.groundwater_used_liters} onChange={e => setFormData({...formData, groundwater_used_liters: e.target.value})} className="w-full p-2 border border-slate-200 rounded focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 border border-slate-200 p-2 rounded">
              <input type="checkbox" id="leak" checked={formData.leak_detected} onChange={e => setFormData({...formData, leak_detected: e.target.checked})} className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded" />
              <label htmlFor="leak" className="text-sm font-medium text-slate-700">Report Leak Detected</label>
            </div>
            <button type="submit" className="w-full bg-cyan-600 text-white font-medium py-2 rounded hover:bg-cyan-700 transition">Save Log</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2 overflow-x-auto">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Water Operations Log</h3>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Building</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Consumption (L)</th>
                <th className="px-4 py-3 text-center">Leak Status</th>
              </tr>
            </thead>
            <tbody>
              {waterData.slice(0, 5).map((row: any) => (
                <tr key={row.id} className="border-b">
                  <td className="px-4 py-3 font-medium text-slate-700">{row.building_name}</td>
                  <td className="px-4 py-3">{new Date(row.date || row.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right font-mono">{Number(row.daily_consumption_liters).toLocaleString()}</td>
                  <td className="px-4 py-3 flex justify-center">
                    {row.leak_detected ? <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold">Yes</span> : <span className="text-slate-400">-</span>}
                  </td>
                </tr>
              ))}
              {waterData.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
