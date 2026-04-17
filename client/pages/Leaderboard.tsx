import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Medal,
  Star,
  Leaf,
  Zap,
  Droplets,
  Wind,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";

const departments = [
  {
    rank: 1,
    name: "Department of Environmental Sciences",
    shortName: "Env. Sciences",
    score: 94,
    energy: 96,
    carbon: 92,
    water: 95,
    waste: 93,
    trees: 280,
    events: 18,
    participants: 620,
    badge: "Platinum",
    trend: "+6",
  },
  {
    rank: 2,
    name: "Faculty of Engineering",
    shortName: "Engineering",
    score: 88,
    energy: 90,
    carbon: 85,
    water: 88,
    waste: 89,
    trees: 195,
    events: 15,
    participants: 540,
    badge: "Gold",
    trend: "+4",
  },
  {
    rank: 3,
    name: "School of Life Sciences",
    shortName: "Life Sciences",
    score: 82,
    energy: 79,
    carbon: 84,
    water: 83,
    waste: 82,
    trees: 165,
    events: 12,
    participants: 410,
    badge: "Gold",
    trend: "+3",
  },
  {
    rank: 4,
    name: "Department of Chemistry",
    shortName: "Chemistry",
    score: 76,
    energy: 78,
    carbon: 72,
    water: 77,
    waste: 77,
    trees: 120,
    events: 9,
    participants: 340,
    badge: "Silver",
    trend: "+2",
  },
  {
    rank: 5,
    name: "Department of Physics",
    shortName: "Physics",
    score: 71,
    energy: 74,
    carbon: 68,
    water: 72,
    waste: 70,
    trees: 95,
    events: 8,
    participants: 295,
    badge: "Silver",
    trend: "+1",
  },
  {
    rank: 6,
    name: "School of Commerce",
    shortName: "Commerce",
    score: 66,
    energy: 63,
    carbon: 67,
    water: 68,
    waste: 66,
    trees: 80,
    events: 7,
    participants: 250,
    badge: "Bronze",
    trend: "0",
  },
  {
    rank: 7,
    name: "Department of Humanities",
    shortName: "Humanities",
    score: 59,
    energy: 57,
    carbon: 60,
    water: 61,
    waste: 58,
    trees: 60,
    events: 6,
    participants: 200,
    badge: "Bronze",
    trend: "-1",
  },
  {
    rank: 8,
    name: "Management Studies",
    shortName: "Management",
    score: 52,
    energy: 50,
    carbon: 54,
    water: 53,
    waste: 51,
    trees: 40,
    events: 4,
    participants: 175,
    badge: "Participant",
    trend: "+2",
  },
];

const badgeColors: Record<string, string> = {
  Platinum: "bg-gradient-to-r from-violet-600 to-purple-600 text-white",
  Gold: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
  Silver: "bg-gradient-to-r from-slate-400 to-slate-500 text-white",
  Bronze: "bg-gradient-to-r from-orange-600 to-amber-700 text-white",
  Participant: "bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700",
};

const rankBgColors = [
  "from-violet-50 to-purple-50 border-violet-200",
  "from-amber-50 to-yellow-50 border-amber-200",
  "from-orange-50 to-amber-50 border-orange-200",
];

const rankIcons = [Crown, Trophy, Medal];

const radarData = departments.slice(0, 4).map((d) => ({
  dept: d.shortName,
  Energy: d.energy,
  Carbon: d.carbon,
  Water: d.water,
  Waste: d.waste,
}));

const barData = departments.map((d) => ({
  name: d.shortName,
  score: d.score,
}));

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<"overall" | "energy" | "carbon" | "water" | "waste">("overall");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("user") === "loggedIn");
  }, []);

  const getSortedByCategory = () => {
    const sorted = [...departments];
    if (activeTab === "energy") sorted.sort((a, b) => b.energy - a.energy);
    else if (activeTab === "carbon") sorted.sort((a, b) => b.carbon - a.carbon);
    else if (activeTab === "water") sorted.sort((a, b) => b.water - a.water);
    else if (activeTab === "waste") sorted.sort((a, b) => b.waste - a.waste);
    return sorted;
  };

  const sortedDepts = getSortedByCategory();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-violet-50/20 to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">EcoTrack</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Home</Link>
              <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/leaderboard" className="text-sm font-medium text-primary transition-colors">Leaderboard</Link>
              <Link to="/reports" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Reports</Link>
            </nav>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90">Dashboard</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="bg-primary hover:bg-primary/90">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <Trophy className="w-4 h-4" />
            SDG-13 Climate Action Rankings
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Campus{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Green Leaderboard
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Track and compare departmental sustainability performance. Departments are ranked by their overall Green Score encompassing energy, carbon, water, and waste metrics.
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-12 items-end">
          {/* 2nd place */}
          <div className={`bg-gradient-to-br ${rankBgColors[1]} border rounded-2xl p-6 text-center`}>
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600 mb-1">{departments[1].score}</div>
            <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${badgeColors.Gold}`}>GOLD</div>
            <p className="text-sm font-bold text-slate-800">{departments[1].shortName}</p>
            <p className="text-xs text-slate-500 mt-1">{departments[1].participants} participants</p>
            <div className="mt-3 text-center text-2xl font-black text-slate-400">#2</div>
          </div>
          {/* 1st place */}
          <div className={`bg-gradient-to-br ${rankBgColors[0]} border rounded-2xl p-8 text-center shadow-lg -mt-6`}>
            <Crown className="w-8 h-8 mx-auto mb-2 text-violet-600" />
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-violet-100 flex items-center justify-center">
              <Star className="w-10 h-10 text-violet-600" fill="currentColor" />
            </div>
            <div className="text-4xl font-black text-violet-700 mb-1">{departments[0].score}</div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${badgeColors.Platinum}`}>PLATINUM</div>
            <p className="text-sm font-bold text-slate-900">{departments[0].shortName}</p>
            <p className="text-xs text-slate-500 mt-1">{departments[0].participants} participants</p>
            <div className="mt-3 text-center text-2xl font-black text-violet-400">#1 🏆</div>
          </div>
          {/* 3rd place */}
          <div className={`bg-gradient-to-br ${rankBgColors[2]} border rounded-2xl p-6 text-center`}>
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-orange-100 flex items-center justify-center">
              <Medal className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-black text-orange-600 mb-1">{departments[2].score}</div>
            <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${badgeColors.Gold}`}>GOLD</div>
            <p className="text-sm font-bold text-slate-800">{departments[2].shortName}</p>
            <p className="text-xs text-slate-500 mt-1">{departments[2].participants} participants</p>
            <div className="mt-3 text-center text-2xl font-black text-slate-400">#3</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Overall Green Score Comparison
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={90} style={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-600" />
              Top 4 Departments — Radar Analysis
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={[
                { category: "Energy", "Env. Sci": 96, "Engineering": 90, "Life Sci": 79, "Chemistry": 78 },
                { category: "Carbon", "Env. Sci": 92, "Engineering": 85, "Life Sci": 84, "Chemistry": 72 },
                { category: "Water", "Env. Sci": 95, "Engineering": 88, "Life Sci": 83, "Chemistry": 77 },
                { category: "Waste", "Env. Sci": 93, "Engineering": 89, "Life Sci": 82, "Chemistry": 77 },
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <Radar name="Env. Sci" dataKey="Env. Sci" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
                <Radar name="Engineering" dataKey="Engineering" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                <Radar name="Life Sci" dataKey="Life Sci" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["overall", "energy", "carbon", "water", "waste"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
              }`}
            >
              {tab === "overall" && "🌍 "}
              {tab === "energy" && "⚡ "}
              {tab === "carbon" && "🌿 "}
              {tab === "water" && "💧 "}
              {tab === "waste" && "♻️ "}
              {tab}
            </button>
          ))}
        </div>

        {/* Full Leaderboard Table */}
        <Card className="overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Badge</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">
                    {activeTab === "overall" ? "Green Score" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Trees</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedDepts.map((dept, index) => {
                  const displayScore = activeTab === "energy" ? dept.energy
                    : activeTab === "carbon" ? dept.carbon
                    : activeTab === "water" ? dept.water
                    : activeTab === "waste" ? dept.waste
                    : dept.score;
                  return (
                    <tr key={dept.rank} className={`hover:bg-slate-50 transition-colors ${index < 3 ? 'bg-violet-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Crown className="w-5 h-5 text-violet-600" />}
                          {index === 1 && <Trophy className="w-5 h-5 text-amber-500" />}
                          {index === 2 && <Medal className="w-5 h-5 text-orange-500" />}
                          {index >= 3 && <span className="text-slate-400 font-bold w-5 text-center">{index + 1}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{dept.name}</div>
                        <div className="text-xs text-slate-400">{dept.events} events conducted</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${badgeColors[dept.badge]}`}>
                          {dept.badge}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xl font-black text-primary">{displayScore}</span>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${displayScore}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-emerald-700">{dept.trees} 🌳</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-slate-700">{dept.participants.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-bold text-sm ${
                          dept.trend.startsWith('+') ? 'text-emerald-600' : dept.trend === '0' ? 'text-slate-400' : 'text-red-500'
                        }`}>
                          {dept.trend.startsWith('+') ? '↑' : dept.trend === '0' ? '→' : '↓'} {dept.trend}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Student Green Credits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2 p-8 bg-gradient-to-br from-emerald-900 to-teal-900 text-white border-0 overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-amber-400" fill="currentColor" />
                <h2 className="text-2xl font-black">Student Green Credits</h2>
              </div>
              <p className="text-emerald-200 mb-6 max-w-xl">
                Students earn Green Credits by participating in eco-initiatives, tree plantations, and sustainability events. Credits can be redeemed for certificates, recognition, and campus perks.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Active Credit Earners", value: "1,240+", icon: "👤" },
                  { label: "Credits Awarded", value: "48,500", icon: "⭐" },
                  { label: "Events This Month", value: "23", icon: "🌿" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-2xl font-black">{item.value}</div>
                    <div className="text-xs text-emerald-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl" />
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-lg mb-4">SDG-13 Progress</h3>
              <div className="space-y-4">
                {[
                  { label: "Climate Education", percent: 78 },
                  { label: "Carbon Neutrality", percent: 54 },
                  { label: "Renewable Energy", percent: 65 },
                  { label: "Zero Waste Goal", percent: 42 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-slate-600">{item.label}</span>
                      <span className="text-xs font-black text-primary">{item.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full">
                      <div className="h-full bg-gradient-to-r from-primary to-teal-500 rounded-full transition-all" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/dashboard" className="mt-6">
              <Button className="w-full bg-primary hover:bg-primary/90">
                View Full Analytics <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">EcoTrack</span>
            </div>
            <p className="text-center text-sm text-slate-400">
              © 2024 EcoTrack. Leaderboard resets monthly. Scores based on submitted environmental data.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
