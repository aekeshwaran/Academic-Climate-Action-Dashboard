import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const monthlyActivities = [
  { month: 'Sep', trees: 80, events: 3, participants: 220 },
  { month: 'Oct', trees: 120, events: 4, participants: 310 },
  { month: 'Nov', trees: 95, events: 3, participants: 280 },
  { month: 'Dec', trees: 60, events: 2, participants: 150 },
  { month: 'Jan', trees: 180, events: 5, participants: 480 },
  { month: 'Feb', trees: 215, events: 6, participants: 560 },
];

const activities = [
  { id: 1, title: 'World Environment Day Tree Plantation', date: '2024-06-05', trees: 150, participants: 320, category: 'Tree Plantation', status: 'completed' },
  { id: 2, title: 'Plastic-Free Campus Campaign', date: '2024-07-15', trees: 0, participants: 480, category: 'Awareness', status: 'completed' },
  { id: 3, title: 'Solar Energy Awareness Workshop', date: '2024-08-10', trees: 0, participants: 210, category: 'Workshop', status: 'completed' },
  { id: 4, title: 'Monsoon Tree Plantation Drive', date: '2024-09-20', trees: 200, participants: 560, category: 'Tree Plantation', status: 'completed' },
  { id: 5, title: 'Eco-Club Annual Event', date: '2024-11-22', trees: 75, participants: 350, category: 'Eco-Club', status: 'completed' },
  { id: 6, title: 'Zero-Waste Food Festival', date: '2025-01-15', trees: 0, participants: 420, category: 'Awareness', status: 'upcoming' },
];

const categoryColors: Record<string, string> = {
  'Tree Plantation': 'bg-emerald-100 text-emerald-700',
  'Awareness': 'bg-blue-100 text-blue-700',
  'Workshop': 'bg-amber-100 text-amber-700',
  'Eco-Club': 'bg-purple-100 text-purple-700',
};

export default function GreenCampusDashboard() {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', date: '', trees: '', participants: '', category: 'Tree Plantation' });
  const [submitted, setSubmitted] = useState(false);

  const totalTrees = activities.filter(a => a.status === 'completed').reduce((s, a) => s + a.trees, 0);
  const totalParticipants = activities.filter(a => a.status === 'completed').reduce((s, a) => s + a.participants, 0);
  const totalEvents = activities.filter(a => a.status === 'completed').length;
  const co2Absorbed = (totalTrees * 21.77).toFixed(0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormVisible(false);
      setNewActivity({ title: '', date: '', trees: '', participants: '', category: 'Tree Plantation' });
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-2xl font-bold text-slate-800">Green Campus Activities 🌳</h2>
        <button
          onClick={() => setFormVisible(!formVisible)}
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition"
        >
          + Log Activity
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Trees Planted', value: totalTrees.toLocaleString(), icon: '🌳', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'CO₂ Absorbed', value: `${Number(co2Absorbed).toLocaleString()} kg`, icon: '🌿', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-100' },
          { label: 'Total Participants', value: totalParticipants.toLocaleString(), icon: '👥', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Events Conducted', value: totalEvents.toString(), icon: '📅', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' },
        ].map((item, i) => (
          <div key={i} className={`p-5 rounded-xl border ${item.bg} text-center`}>
            <div className="text-2xl mb-1">{item.icon}</div>
            <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wide">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Log Form */}
      {formVisible && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in slide-in-from-top-4">
          <h3 className="font-bold text-slate-800 mb-4">Log New Green Activity</h3>
          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 font-medium">
              ✅ Activity logged successfully! (Frontend preview)
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Activity Title</label>
                <input type="text" required value={newActivity.title} onChange={e => setNewActivity({...newActivity, title: e.target.value})} placeholder="e.g. Tree Plantation Drive" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={newActivity.category} onChange={e => setNewActivity({...newActivity, category: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option>Tree Plantation</option>
                  <option>Awareness</option>
                  <option>Workshop</option>
                  <option>Eco-Club</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" required value={newActivity.date} onChange={e => setNewActivity({...newActivity, date: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trees Planted</label>
                <input type="number" min="0" value={newActivity.trees} onChange={e => setNewActivity({...newActivity, trees: e.target.value})} placeholder="0" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Participants</label>
                <input type="number" min="0" required value={newActivity.participants} onChange={e => setNewActivity({...newActivity, participants: e.target.value})} placeholder="0" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="md:col-span-2 flex gap-2 justify-end">
                <button type="button" onClick={() => setFormVisible(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition text-sm">Record Activity</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Monthly Tree Plantation</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivities}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" style={{ fontSize: 11 }} />
                <YAxis style={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="trees" fill="#10b981" radius={[6, 6, 0, 0]} name="Trees Planted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Participation Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyActivities}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" style={{ fontSize: 11 }} />
                <YAxis style={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="participants" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} name="Participants" />
                <Line type="monotone" dataKey="events" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} name="Events" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Activity Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase">Activity</th>
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase">Category</th>
                <th className="px-4 py-3 text-center text-xs text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-center text-xs text-slate-500 uppercase">Trees</th>
                <th className="px-4 py-3 text-center text-xs text-slate-500 uppercase">Participants</th>
                <th className="px-4 py-3 text-center text-xs text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activities.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedActivity(a)}>
                  <td className="px-4 py-3 font-medium text-slate-800">{a.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${categoryColors[a.category] || 'bg-slate-100 text-slate-600'}`}>
                      {a.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500">{a.date}</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-700">{a.trees > 0 ? a.trees : '—'}</td>
                  <td className="px-4 py-3 text-center">{a.participants.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${a.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
