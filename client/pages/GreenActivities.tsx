import DashboardLayout from "../components/DashboardLayout";
import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Leaf, Award, Calendar, Users, Plus, RefreshCw, HandHeart, Search, Filter, MapPin, Map as MapIcon, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import axios from "axios";
import { toast } from "sonner";
import { RecordButton } from "../components/RecordButton";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface GreenEvent {
  id: number;
  title: string;
  category: string;
  date: string;
  trees_planted: number;
  participants: number;
  status: string;
  lat?: number;
  lng?: number;
  image?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Tree Plantation': 'bg-emerald-100 text-emerald-700',
  'Awareness': 'bg-blue-100 text-blue-700',
  'Workshop': 'bg-amber-100 text-amber-700',
  'Eco-Club': 'bg-purple-100 text-purple-700',
};

export default function GreenActivities() {
  const [activities, setActivities] = useState<GreenEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const itemsPerPage = 5;
  
  const [newActivity, setNewActivity] = useState({ 
    title: '', date: '', trees: '', participants: '', category: 'Tree Plantation', lat: '', lng: '', imageFile: null as File | null
  });
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Promise.all([
        fetch('/api/trees').then(r => r.json()),
        fetch('/api/programs').then(r => r.json())
      ]);
      const [trees, programs] = res;
      
      const mappedTrees = (Array.isArray(trees) ? trees : []).map(t => ({
        id: t.id + 10000, title: t.title || 'Tree Plantation Drive', category: 'Tree Plantation',
        date: t.date || t.created_at.split('T')[0], trees_planted: t.trees_planted || 0,
        participants: t.participants || Math.floor((t.trees_planted || 0) * 1.5), status: 'completed'
      }));
      
      const mappedPrograms = (Array.isArray(programs) ? programs : []).map(p => ({
        id: p.id, title: p.title, category: p.type || 'Awareness', date: p.created_at.split('T')[0],
        trees_planted: 0, participants: p.participants || 0, status: p.status || 'completed'
      }));

      setActivities([...mappedTrees, ...mappedPrograms].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const totalTrees = activities.reduce((s, a) => s + (a.trees_planted || 0), 0);
  const totalParticipants = activities.reduce((s, a) => s + (Number(a.participants) || 0), 0);
  const totalEvents = activities.length;
  const co2Absorbed = (totalTrees * 21.77).toFixed(0);

  const monthlyMap: Record<string, { trees: number, events: number, participants: number }> = {};
  activities.forEach(a => {
    const key = a.date ? new Date(a.date).toLocaleDateString('en', { month: 'short' }) : 'Unknown';
    if (!monthlyMap[key]) monthlyMap[key] = { trees: 0, events: 0, participants: 0 };
    monthlyMap[key].trees += (a.trees_planted || 0);
    monthlyMap[key].events += 1;
    monthlyMap[key].participants += (Number(a.participants) || 0);
  });
  const monthlyActivities = Object.entries(monthlyMap).slice(-6).map(([month, data]) => ({ month, ...data }));

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const treesNum = Number(newActivity.trees);
    const partNum = Number(newActivity.participants);

    if (!newActivity.title.trim()) {
      toast.error('Activity title is required');
      return;
    }
    if (!newActivity.date) {
      toast.error('Date of activity is required');
      return;
    }
    if (newActivity.category === 'Tree Plantation' && (isNaN(treesNum) || treesNum <= 0)) {
      toast.error('Number of trees must be a positive number');
      return;
    }
    if (isNaN(partNum) || partNum < 0) {
      toast.error('Number of participants must be non-negative');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      if (newActivity.category === 'Tree Plantation') {
        await axios.post('/api/trees', { 
          title: newActivity.title, 
          trees_planted: treesNum, 
          date: newActivity.date, 
          user_id: 1,
          hasMedia: !!mediaBlob
        }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('/api/programs', { 
          title: newActivity.title, 
          description: 'Campus Activity Logged', 
          participants: partNum, 
          type: newActivity.category, 
          status: 'completed', 
          user_id: 1,
          hasMedia: !!mediaBlob
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      
      toast.success('Activity synchronized with academic records');
      setSubmitted(true);
      await loadData();
      setTimeout(() => {
        setSubmitted(false); 
        setFormVisible(false);
        setNewActivity({ title: '', date: '', trees: '', participants: '', category: 'Tree Plantation', lat: '', lng: '', imageFile: null });
        setMediaBlob(null);
      }, 2000);
    } catch (error) { 
      toast.error('Critical failure: Could not record activity. Ensure authorization.'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  // Search & Filter Logic
  const filteredActivities = activities.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "All" || a.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Default campus coordinates (e.g., placeholder coordinates)
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  return (
    <DashboardLayout title="Green Campus Activities 🌳">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-slate-400 font-medium">Record and track campus eco-initiatives</p>
        <button onClick={() => setFormVisible(!formVisible)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition shadow-sm">
          <Plus className="w-4 h-4" /> Log Activity
        </button>
      </div>

      {formVisible && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><HandHeart className="w-4 h-4 text-emerald-600" /> Log New Green Activity</h3>
          </div>
          {submitted ? (
             <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 font-bold text-sm">✅ Activity logged successfully!</div>
          ) : (
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Activity Title</label>
                <input type="text" required value={newActivity.title} onChange={e => setNewActivity({...newActivity, title: e.target.value})} placeholder="e.g. Tree Plantation Drive" className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                <select value={newActivity.category} onChange={e => setNewActivity({...newActivity, category: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Tree Plantation</option><option>Awareness</option><option>Workshop</option><option>Eco-Club</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
                <input type="date" required value={newActivity.date} onChange={e => setNewActivity({...newActivity, date: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Participants</label>
                <input type="number" min="0" required value={newActivity.participants} onChange={e => setNewActivity({...newActivity, participants: e.target.value})} placeholder="0" className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              {newActivity.category === 'Tree Plantation' && (
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Trees Planted</label>
                  <input type="number" min="0" required value={newActivity.trees} onChange={e => setNewActivity({...newActivity, trees: e.target.value})} placeholder="0" className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              )}
              {newActivity.category === 'Tree Plantation' && (
                <div className="md:col-span-2 flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Latitude (Opt)</label>
                    <input type="text" value={newActivity.lat} onChange={e => setNewActivity({...newActivity, lat: e.target.value})} placeholder="12.9716" className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Longitude (Opt)</label>
                    <input type="text" value={newActivity.lng} onChange={e => setNewActivity({...newActivity, lng: e.target.value})} placeholder="77.5946" className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
              )}
              <div className={newActivity.category === 'Tree Plantation' ? 'md:col-span-1' : 'md:col-span-3'}>
                <label className="block text-xs font-bold text-slate-600 mb-1">Upload Image (Optional)</label>
                <div className="flex items-center gap-2 w-full p-1 border border-slate-200 rounded-lg bg-slate-50 cursor-pointer">
                  <input type="file" id="imageUpload" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setNewActivity({...newActivity, imageFile: e.target.files[0]});
                  }} />
                  <label htmlFor="imageUpload" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition">
                    <ImageIcon className="w-3 h-3" /> Choose File
                  </label>
                  <span className="text-xs text-slate-500 truncate flex-1 pr-2">
                    {newActivity.imageFile ? newActivity.imageFile.name : 'No file chosen'}
                  </span>
                </div>
              </div>

              <div className="md:col-span-5 pt-4 border-t border-slate-100 mt-2 mb-2">
                <label className="block text-center mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Video Evidence (Optional)</label>
                <RecordButton 
                  type="video" 
                  onRecordingComplete={(blob) => setMediaBlob(blob)} 
                />
              </div>

              <div className="md:col-span-5 flex gap-2 justify-end mt-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setFormVisible(false)} className="px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition text-sm disabled:opacity-60">
                  {submitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                  {submitting ? 'Archiving...' : 'Record Details'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Trees Planted', value: totalTrees.toLocaleString(), icon: Leaf, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'CO₂ Absorbed', value: `${Number(co2Absorbed).toLocaleString()} kg`, icon: Award, color: 'text-teal-700', bg: 'bg-teal-50 border-teal-100' },
          { label: 'Total Participants', value: totalParticipants.toLocaleString(), icon: Users, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Events Conducted', value: totalEvents.toString(), icon: Calendar, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' },
        ].map((item, i) => { const Icon = item.icon; return (
          <div key={i} className={`p-5 rounded-2xl border ${item.bg} text-center shadow-sm`}>
            <Icon className={`w-8 h-8 mx-auto mb-2 opacity-60 ${item.color}`} />
            <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wide">{item.label}</p>
          </div>
        )})}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase mb-4">Plantation Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivities}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" style={{ fontSize: 11 }} />
                <YAxis style={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Bar dataKey="trees" fill="#10b981" radius={[4, 4, 0, 0]} name="Trees Planted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase mb-4">Event & Participation Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyActivities}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" style={{ fontSize: 11 }} />
                <YAxis style={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="participants" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} name="Participants" />
                <Line type="monotone" dataKey="events" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} name="Events" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2">
            Activity Log
          </h3>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input 
                type="text" 
                placeholder="Search activities..." 
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="relative">
              <Filter className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
              <select 
                value={filterCategory}
                onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                className="pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white font-medium"
              >
                <option value="All">All Categories</option>
                <option value="Tree Plantation">Tree Plantation</option>
                <option value="Awareness">Awareness</option>
                <option value="Workshop">Workshop</option>
                <option value="Eco-Club">Eco-Club</option>
              </select>
            </div>
            <button onClick={() => setShowMap(!showMap)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition border ${showMap ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              <MapIcon className="w-3.5 h-3.5" /> {showMap ? 'Hide Map' : 'View Map'}
            </button>
            <button onClick={loadData} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
          </div>
        </div>

        {showMap && (
          <div className="h-64 md:h-80 w-full border-b border-slate-100 relative z-0">
            <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Plotting completed tree plantation activities on the map */}
              {activities.filter(a => a.category === 'Tree Plantation').map((a, idx) => (
                <Marker key={idx} position={a.lat && a.lng ? [a.lat, a.lng] : [defaultCenter[0] + (Math.random() - 0.5) * 0.05, defaultCenter[1] + (Math.random() - 0.5) * 0.05]}>
                  <Popup>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm text-slate-800">{a.title}</span>
                      <span className="text-xs text-emerald-600 font-bold">{a.trees_planted} Trees Planted</span>
                      <span className="text-[10px] text-slate-500">{a.date}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Activity</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Trees</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Participants</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedActivities.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400 font-medium">{loading ? "Loading..." : "No activities found matching filters."}</td></tr>
              ) : paginatedActivities.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-800">
                    {a.title}
                    {a.category === 'Tree Plantation' && <MapPin className="inline ml-2 w-3 h-3 text-emerald-500" />}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-extrabold ${CATEGORY_COLORS[a.category] || 'bg-slate-100 text-slate-600'}`}>
                      {a.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center text-slate-500 text-xs font-medium">{a.date}</td>
                  <td className="px-5 py-3.5 text-center font-black text-emerald-600">{a.trees_planted > 0 ? a.trees_planted : <span className="text-slate-300 font-normal">—</span>}</td>
                  <td className="px-5 py-3.5 text-center text-slate-700 font-bold">{Number(a.participants).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of {filteredActivities.length}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-xs font-bold text-slate-700 px-2">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
