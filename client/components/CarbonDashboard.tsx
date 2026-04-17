import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function CarbonDashboard() {
  const [carbonData, setCarbonData] = useState([]);
  const [trends, setTrends] = useState([]);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    source: 'Electricity',
    emission_tons: '',
    month: new Date().toLocaleString('default', { month: 'short' }),
    year: new Date().getFullYear(),
  });

  const fetchData = async () => {
    try {
      const [dataRes, trendsRes] = await Promise.all([
        fetch('/api/carbon'),
        fetch('/api/carbon/trends')
      ]);
      const data = await dataRes.json();
      const tr = await trendsRes.json();
      setCarbonData(data);
      setTrends(tr);

      // Calculate total emissions from all records
      const total = data.reduce((acc: number, row: any) => acc + Number(row.emission_tons), 0);
      setTotalEmissions(total);
    } catch (error) {
      console.error('Error fetching carbon data:', error);
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
      await fetch('/api/carbon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      fetchData();
      setFormData({ ...formData, emission_tons: '' });
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  // Group by source for Doughnut Chart
  const sourceGroups = carbonData.reduce((acc: any, row: any) => {
    if (!acc[row.source]) acc[row.source] = 0;
    acc[row.source] += Number(row.emission_tons);
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(sourceGroups),
    datasets: [
      {
        data: Object.values(sourceGroups),
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'],
        borderWidth: 1,
      }
    ]
  };

  // Group by month for Line Chart
  const monthlyTotals = trends.reduce((acc: any, row: any) => {
    const key = `${row.month} ${row.year}`;
    if (!acc[key]) acc[key] = 0;
    acc[key] += Number(row.emission_tons);
    return acc;
  }, {});

  const lineLabels = Object.keys(monthlyTotals);
  const lineValues = Object.values(monthlyTotals);

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Total Emissions (Tons)',
        data: lineValues,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  if (loading) return <div className="p-4 text-center">Loading Carbon Tracker...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Carbon Footprint Tracker ☁️</h2>

      {/* Score Cards */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-sm flex flex-col justify-center items-center">
        <p className="text-slate-300 font-medium tracking-wide uppercase text-sm mb-2">Total Historic CO₂ Emissions</p>
        <span className="text-5xl font-black">{totalEmissions.toFixed(2)} <span className="text-lg text-slate-400 font-normal">Tons</span></span>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Monthly Emission Trend</h3>
          <div className="h-64">
             <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Emission Source Breakdown</h3>
          <div className="h-64 flex justify-center">
             <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Data Entry & Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Log Emission Data</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Emission Source</label>
              <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full p-2 border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Electricity">Electricity</option>
                <option value="Transport">Transport</option>
                <option value="Diesel Generator">Diesel Generator</option>
                <option value="Waste">Waste</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Emission Amount (Tons)</label>
              <input type="number" required step="0.01" min="0" value={formData.emission_tons} onChange={e => setFormData({...formData, emission_tons: e.target.value})} className="w-full p-2 border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition">Record Emission</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2 overflow-x-auto">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Recent Emission Logs</h3>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3 text-right">Amount (Tons)</th>
              </tr>
            </thead>
            <tbody>
              {carbonData.slice(0, 5).map((row: any) => (
                <tr key={row.id} className="border-b">
                  <td className="px-4 py-3 font-medium text-slate-700">{row.source}</td>
                  <td className="px-4 py-3">{row.month} {row.year}</td>
                  <td className="px-4 py-3 text-right font-mono">{Number(row.emission_tons).toFixed(2)}</td>
                </tr>
              ))}
              {carbonData.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-400">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
