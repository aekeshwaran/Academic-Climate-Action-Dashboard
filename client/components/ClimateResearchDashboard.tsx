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
} from 'recharts';

const researchData = [
  { year: '2020', publications: 12, projects: 5, theses: 18 },
  { year: '2021', publications: 18, projects: 7, theses: 24 },
  { year: '2022', publications: 24, projects: 10, theses: 31 },
  { year: '2023', publications: 32, projects: 14, theses: 40 },
  { year: '2024', publications: 45, projects: 18, theses: 55 },
];

const projects = [
  { id: 1, title: 'Carbon Sequestration in Campus Greenbelt', lead: 'Dr. Ramesh Kumar', status: 'active', funding: 850000, year: 2024, type: 'Research', sdg: 'SDG-13' },
  { id: 2, title: 'IoT-based Smart Energy Monitoring', lead: 'Prof. Ananya Singh', status: 'active', funding: 650000, year: 2024, type: 'Applied', sdg: 'SDG-7' },
  { id: 3, title: 'Wetland Biodiversity Study', lead: 'Dr. Priya Nair', status: 'completed', funding: 420000, year: 2023, type: 'Field', sdg: 'SDG-15' },
  { id: 4, title: 'Solar Panel Efficiency Optimization', lead: 'Prof. Vikram Shah', status: 'active', funding: 980000, year: 2024, type: 'Technology', sdg: 'SDG-7' },
  { id: 5, title: 'Microplastics in Campus Water Bodies', lead: 'Dr. Sarah Mathew', status: 'ongoing', funding: 350000, year: 2024, type: 'Environment', sdg: 'SDG-6' },
  { id: 6, title: 'Urban Heat Island Effect Study', lead: 'Prof. A. Krishnaswamy', status: 'completed', funding: 510000, year: 2023, type: 'Climate', sdg: 'SDG-11' },
];

const publications = [
  { id: 1, title: 'Renewable Energy Transition in Academic Campuses', journal: 'Renewable & Sustainable Energy Reviews', year: 2024, citations: 31, faculty: 'Prof. V. Shah' },
  { id: 2, title: 'Carbon Footprint Benchmarking for Universities', journal: 'Journal of Cleaner Production', year: 2024, citations: 24, faculty: 'Dr. R. Kumar' },
  { id: 3, title: 'Student-led Sustainability Initiatives: Impact Analysis', journal: 'International Journal of Sustainability', year: 2023, citations: 18, faculty: 'Dr. P. Nair' },
  { id: 4, title: 'IoT Integration in Campus Resource Management', journal: 'Smart Cities Journal', year: 2024, citations: 12, faculty: 'Prof. A. Singh' },
];

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  ongoing: 'bg-blue-100 text-blue-700',
  completed: 'bg-slate-100 text-slate-600',
  planned: 'bg-amber-100 text-amber-700',
};

export default function ClimateResearchDashboard() {
  const [activeTab, setActiveTab] = useState<'projects' | 'publications'>('projects');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ title: '', lead: '', type: 'Research', sdg: 'SDG-13', funding: '' });

  const totalFunding = projects.reduce((s, p) => s + p.funding, 0);
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'ongoing').length;
  const totalPublications = researchData[researchData.length - 1].publications;
  const totalTheses = researchData[researchData.length - 1].theses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setForm({ title: '', lead: '', type: 'Research', sdg: 'SDG-13', funding: '' });
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-2xl font-bold text-slate-800">Climate Research Tracker 🔬</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition">
          + Add Project
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: activeProjects, icon: '🔬', color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
          { label: 'Publications (2024)', value: totalPublications, icon: '📄', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Student Theses', value: totalTheses, icon: '🎓', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
          { label: 'Total Funding (₹)', value: `${(totalFunding / 100000).toFixed(1)}L`, icon: '💰', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
        ].map((item, i) => (
          <div key={i} className={`p-5 rounded-xl border ${item.bg} text-center`}>
            <div className="text-2xl mb-1">{item.icon}</div>
            <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wide">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Add Project Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in slide-in-from-top-4">
          <h3 className="font-bold text-slate-800 mb-4">Add New Research Project</h3>
          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 font-medium">✅ Project added successfully! (preview)</div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Carbon Sequestration Study" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lead Faculty</label>
                <input required value={form.lead} onChange={e => setForm({...form, lead: e.target.value})} placeholder="Dr. Firstname Lastname" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Research Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none">
                  <option>Research</option>
                  <option>Applied</option>
                  <option>Field</option>
                  <option>Technology</option>
                  <option>Climate</option>
                  <option>Environment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SDG Alignment</label>
                <select value={form.sdg} onChange={e => setForm({...form, sdg: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none">
                  <option>SDG-6 (Clean Water)</option>
                  <option>SDG-7 (Clean Energy)</option>
                  <option>SDG-11 (Sustainable Cities)</option>
                  <option>SDG-13 (Climate Action)</option>
                  <option>SDG-15 (Life on Land)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Funding Amount (₹)</label>
                <input type="number" value={form.funding} onChange={e => setForm({...form, funding: e.target.value})} placeholder="500000" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div className="md:col-span-2 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-sm">Add Project</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Research Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Research Output Trend (2020–2024)</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={researchData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" style={{ fontSize: 11 }} />
              <YAxis style={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="publications" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Publications" />
              <Line type="monotone" dataKey="projects" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} name="Projects" />
              <Line type="monotone" dataKey="theses" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Theses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('projects')} className={`px-5 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'projects' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-900'}`}>
          Research Projects
        </button>
        <button onClick={() => setActiveTab('publications')} className={`px-5 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'publications' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-900'}`}>
          Publications
        </button>
      </div>

      {activeTab === 'projects' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase">Project Title</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase">Lead</th>
                  <th className="px-4 py-3 text-center text-xs text-slate-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-center text-xs text-slate-500 uppercase">SDG</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-500 uppercase">Funding</th>
                  <th className="px-4 py-3 text-center text-xs text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-xs">{p.title}</td>
                    <td className="px-4 py-3 text-slate-500">{p.lead}</td>
                    <td className="px-4 py-3 text-center"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{p.type}</span></td>
                    <td className="px-4 py-3 text-center"><span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">{p.sdg}</span></td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">₹{(p.funding / 100000).toFixed(1)}L</td>
                    <td className="px-4 py-3 text-center"><span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[p.status]}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'publications' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="space-y-4">
            {publications.map(pub => (
              <div key={pub.id} className="p-4 border border-slate-100 rounded-lg hover:border-primary/30 hover:shadow-sm transition">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{pub.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 italic">{pub.journal}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{pub.faculty} · {pub.year}</p>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className="text-xl font-black text-primary">{pub.citations}</div>
                    <div className="text-xs text-slate-400">citations</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
