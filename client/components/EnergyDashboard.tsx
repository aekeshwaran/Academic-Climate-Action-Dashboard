import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function EnergyDashboard() {
  const [energyData, setEnergyData] = useState([]);
  const [summary, setSummary] = useState({ total_electricity: 0, total_solar: 0, efficiency_score: 0 });
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    building_name: '',
    electricity_kwh: '',
    solar_kwh: '',
    month: new Date().toLocaleString('default', { month: 'short' }),
    year: new Date().getFullYear(),
  });

  const fetchData = async () => {
    try {
      const [dataRes, summaryRes] = await Promise.all([
        fetch('/api/energy'),
        fetch('/api/energy/summary')
      ]);
      const data = await dataRes.json();
      const sum = await summaryRes.json();
      setEnergyData(data);
      setSummary(sum);
    } catch (error) {
      console.error('Error fetching energy data:', error);
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
      await fetch('/api/energy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_id: 1 })
      });
      fetchData(); // Refresh
      setFormData({ ...formData, building_name: '', electricity_kwh: '', solar_kwh: '' });
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  // Prepare chart data
  const monthlyData = energyData.reduce((acc: any, row: any) => {
    const key = `${row.month} ${row.year}`;
    if (!acc[key]) acc[key] = { electricity: 0, solar: 0 };
    acc[key].electricity += Number(row.electricity_kwh);
    acc[key].solar += Number(row.solar_kwh);
    return acc;
  }, {});

  const labels = Object.keys(monthlyData).slice(0, 6).reverse(); // Last 6 months
  const electricityArr = labels.map(l => monthlyData[l].electricity);
  const solarArr = labels.map(l => monthlyData[l].solar);

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Electricity (kWh)',
        data: electricityArr,
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // Red
      },
      {
        label: 'Solar (kWh)',
        data: solarArr,
        backgroundColor: 'rgba(34, 197, 94, 0.7)', // Green
      }
    ]
  };

  const pieChartData = {
    labels: ['Electricity Sourced', 'Solar Sourced'],
    datasets: [
      {
        data: [summary.total_electricity, summary.total_solar],
        backgroundColor: ['#ef4444', '#22c55e'],
        borderWidth: 1,
      }
    ]
  };

  if (loading) return <div className="p-4 text-center">Loading Energy Module...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Energy Monitoring Module 🌱</h2>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
          <p className="text-slate-500 font-medium mb-1">Total Electricity Use</p>
          <span className="text-3xl font-black text-slate-700">{summary.total_electricity.toFixed(1)} <span className="text-sm font-normal">kWh</span></span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
          <p className="text-slate-500 font-medium mb-1">Total Solar Generation</p>
          <span className="text-3xl font-black text-green-600">{summary.total_solar.toFixed(1)} <span className="text-sm font-normal">kWh</span></span>
        </div>
        <div className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-100 flex flex-col justify-center items-center">
          <p className="text-emerald-600 font-medium mb-1">Efficiency Score</p>
          <span className="text-4xl font-black text-emerald-700">{summary.efficiency_score.toFixed(1)}%</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Monthly Energy Comparison</h3>
          <div className="h-64">
             <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Solar vs Electricity Ratio</h3>
          <div className="h-64 flex justify-center">
             <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Data Entry & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Log Energy Data</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Building Name</label>
              <input type="text" required value={formData.building_name} onChange={e => setFormData({...formData, building_name: e.target.value})} className="w-full p-2 border border-slate-200 rounded focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Science Block" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Electricity (kWh)</label>
              <input type="number" required min="0" value={formData.electricity_kwh} onChange={e => setFormData({...formData, electricity_kwh: e.target.value})} className="w-full p-2 border border-slate-200 rounded focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Solar (kWh)</label>
              <input type="number" required min="0" value={formData.solar_kwh} onChange={e => setFormData({...formData, solar_kwh: e.target.value})} className="w-full p-2 border border-slate-200 rounded focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-medium py-2 rounded hover:bg-slate-800 transition">Submit Record</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2 overflow-x-auto">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Energy Monitoring Log</h3>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Building</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Electricity</th>
                <th className="px-4 py-3">Solar</th>
                <th className="px-4 py-3">Savings %</th>
              </tr>
            </thead>
            <tbody>
              {energyData.slice(0, 5).map((row: any) => (
                <tr key={row.id} className="border-b">
                  <td className="px-4 py-3 font-medium text-slate-700">{row.building_name || 'N/A'}</td>
                  <td className="px-4 py-3">{row.month} {row.year}</td>
                  <td className="px-4 py-3">{row.electricity_kwh} kWh</td>
                  <td className="px-4 py-3">{row.solar_kwh} kWh</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.savings_percentage > 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {Number(row.savings_percentage).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
              {energyData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
