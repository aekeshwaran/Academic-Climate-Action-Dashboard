import DashboardLayout from "../components/DashboardLayout";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { useEffect, useState, useMemo } from "react";
import { 
  Zap, Droplets, Wind, Recycle, 
  Target, Info, MapPin, AlertTriangle, CheckCircle2,
  TrendingUp, TrendingDown, Download, Search, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

// Types for our monitoring data
interface BuildingData {
  name: string;
  electricity: number;
  solar: number;
  water: number;
  waste: number;
  compliance: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function EnvironmentalImpactMonitoring() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [buildings, setBuildings] = useState<BuildingData[]>([
    { name: "Main Block", electricity: 4500, solar: 1200, water: 8500, waste: 240, compliance: 95 },
    { name: "Science Lab", electricity: 6800, solar: 500, water: 12400, waste: 410, compliance: 82 },
    { name: "Boys Hostel", electricity: 3200, solar: 1800, water: 15600, waste: 580, compliance: 75 },
    { name: "Girls Hostel", electricity: 3400, solar: 2000, water: 16200, waste: 620, compliance: 78 },
    { name: "Library", electricity: 2100, solar: 800, water: 1200, waste: 45, compliance: 98 },
    { name: "Auditorium", electricity: 1500, solar: 300, water: 2500, waste: 110, compliance: 90 },
    { name: "Sports Complex", electricity: 2800, solar: 1200, water: 4500, waste: 180, compliance: 88 },
    { name: "Canteen", electricity: 3800, solar: 400, water: 9200, waste: 850, compliance: 65 },
  ]);

  const [sdgProgress, setSdgProgress] = useState({
    target: 25, 
    current: 14.2, 
    lastYear: 12.5,
    status: "On Track"
  });

  const [insights, setInsights] = useState([
    { 
      type: "alert", 
      title: "High Water Usage", 
      desc: "Anomalous water flow detected in Science Lab after 8 PM. Possible leak.", 
      building: "Science Lab",
      severity: "high"
    },
    { 
      type: "tip", 
      title: "Energy Efficiency", 
      desc: "Switching to LED lighting in Main Block could save 15% monthly electricity.", 
      building: "Main Block",
      severity: "low"
    },
    { 
      type: "success", 
      title: "Recycling Peak", 
      desc: "Waste recycling rate reached 68% this week, a new campus record!", 
      building: "Campus Wide",
      severity: "normal"
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [energyRes, waterRes, treeRes] = await Promise.all([
          axios.get("/api/energy/buildings"),
          axios.get("/api/water/buildings"),
          axios.get("/api/trees")
        ]);

        if (Array.isArray(energyRes.data) && energyRes.data.length > 0) {
          const merged = energyRes.data.map((e: any) => {
            const w = Array.isArray(waterRes.data) ? waterRes.data.find((wb: any) => wb.name === e.name) : null;
            return {
              ...e,
              water: w ? w.water : Math.floor(Math.random() * 5000),
              waste: Math.floor(Math.random() * 500) + 50,
              compliance: Math.floor(Math.random() * 30) + 70
            };
          });
          setBuildings(merged);
        }

        const totalTrees = Array.isArray(treeRes.data) ? treeRes.data.reduce((s: number, r: any) => s + (Number(r.trees_planted) || 0), 0) : 0;
        
        setSdgProgress(prev => ({
          ...prev,
          current: Math.min(25, 10 + (totalTrees / 100))
        }));

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalEmissions = useMemo(() => buildings.reduce((acc, b) => acc + (b.electricity * 0.85) / 1000, 0), [buildings]);

  // Filtering Buildings
  const filteredBuildings = useMemo(() => {
    return buildings.filter(b => 
      b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [buildings, searchTerm]);

  // Pagination for building list
  const totalPages = Math.ceil(filteredBuildings.length / itemsPerPage);
  const currentBuildings = filteredBuildings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout title="Environmental Impact Monitoring">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Carbon Footprint" 
          value={`${totalEmissions.toFixed(1)}t`} 
          subValue="CO₂e Monthly" 
          icon={Wind} 
          trend="-2.4%" 
          positive={true}
          color="emerald"
        />
        <StatCard 
          title="Energy Consumption" 
          value={`${buildings.reduce((a, b) => a + b.electricity, 0).toLocaleString()}`} 
          subValue="Total kWh" 
          icon={Zap} 
          trend="+1.2%" 
          positive={false}
          color="amber"
        />
        <StatCard 
          title="Water Usage" 
          value={`${(buildings.reduce((a, b) => a + b.water, 0) / 1000).toFixed(1)}k`} 
          subValue="Total Liters" 
          icon={Droplets} 
          trend="-5.8%" 
          positive={true}
          color="blue"
        />
        <StatCard 
          title="Campus Sustainability" 
          value={`${Math.round(buildings.reduce((a, b) => a + b.compliance, 0) / buildings.length)}%`} 
          subValue="Overall Compliance" 
          icon={Target} 
          trend="+4.1%" 
          positive={true}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Monitoring Section */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Building-wise Electricity Analytics */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-800">Building-wise Energy Analytics</h3>
                <p className="text-xs text-slate-500 font-medium tracking-tight uppercase">Grid vs Solar Comparison</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-xl transition text-slate-400">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buildings}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" style={{ fontSize: 10, fontWeight: 700 }} stroke="#94a3b8" />
                  <YAxis style={{ fontSize: 10, fontWeight: 700 }} stroke="#94a3b8" />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }} />
                  <Bar dataKey="electricity" name="Grid Input (kWh)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="solar" name="Renewable (kWh)" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Interactive Searchable Building List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Building Sustainability Metrics</h3>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-bold" />
                <input 
                  type="text" 
                  placeholder="Filter building..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-100 transition-all font-bold"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Building Name</th>
                    <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Liters/Day</th>
                    <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Waste Output</th>
                    <th className="px-6 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentBuildings.map((b, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-6 rounded-full bg-slate-200" />
                          <span className="font-black text-slate-700">{b.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-blue-600">{b.water.toLocaleString()} L</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-500">{b.waste} kg</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                b.compliance > 90 ? "bg-emerald-500" : b.compliance > 80 ? "bg-blue-500" : "bg-amber-500"
                              )}
                              style={{ width: `${b.compliance}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-slate-400">{b.compliance}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase">Records: {filteredBuildings.length}</p>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-1 border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 hover:bg-white disabled:opacity-30 transition-all uppercase"
                >
                  Prev
                </button>
                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-3 py-1 border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 hover:bg-white disabled:opacity-30 transition-all uppercase"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Insights & Goals */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SDG-13 Tracking */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
            <Target className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight">SDG-13 Progress</h3>
                  <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-widest">Global Climate Action</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest border-b border-white/10 pb-1">
                    <span>Emission Reduction Goal</span>
                    <span>{sdgProgress.current.toFixed(1)}% / {sdgProgress.target}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      style={{ width: `${(sdgProgress.current / sdgProgress.target) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <p className="text-2xl font-black tracking-tighter">{sdgProgress.status}</p>
                    <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-widest mt-1 opacity-70">Status</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-300" />
                      <p className="text-2xl font-black tracking-tighter">+{((sdgProgress.current - sdgProgress.lastYear)).toFixed(1)}%</p>
                    </div>
                    <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-widest mt-1 opacity-70">Annual Growth</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Insights */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Smart Recommendations
              </h3>
              <Filter className="w-3 h-3 text-slate-300" />
            </div>
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "p-4 rounded-2xl border flex gap-3 transition-all hover:translate-x-1 duration-300 cursor-pointer shadow-sm shadow-slate-100",
                    insight.type === "alert" ? "bg-rose-50 border-rose-100" : 
                    insight.type === "tip" ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm",
                    insight.type === "alert" ? "bg-rose-100 text-rose-600" : 
                    insight.type === "tip" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {insight.type === "alert" ? <AlertTriangle className="w-4 h-4" /> : 
                     insight.type === "tip" ? <Zap className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className={cn(
                      "text-sm font-black tracking-tight",
                      insight.type === "alert" ? "text-rose-900" : 
                      insight.type === "tip" ? "text-amber-900" : "text-emerald-900"
                    )}>{insight.title}</h4>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-1">{insight.desc}</p>
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-200/50">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{insight.building}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, subValue, icon: Icon, trend, positive, color }: any) {
  const colors: any = {
    emerald: "from-emerald-500 to-teal-600 bg-emerald-50 text-emerald-700",
    amber: "from-amber-500 to-orange-600 bg-amber-50 text-amber-700",
    blue: "from-blue-500 to-cyan-600 bg-blue-50 text-blue-700",
    purple: "from-purple-500 to-indigo-600 bg-purple-50 text-purple-700",
  };

  return (
    <div className={cn("p-6 rounded-3xl border border-slate-100 shadow-sm bg-white relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-slate-200/50")}>
      <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500", colors[color].split(' ')[0], colors[color].split(' ')[1])}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h2>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subValue}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-50">
          <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter", positive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600")}>
            {positive ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />}
            {trend}
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-auto">Last Month</span>
        </div>
      </div>
    </div>
  );
}
