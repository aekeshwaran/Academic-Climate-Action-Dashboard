import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Trophy, Medal, Star, Zap, Droplets, Wind, TrendingUp, Users, Award, Crown,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
} from "recharts";

const departments = [
  { rank: 1, name: "Department of Environmental Sciences", shortName: "Env. Sciences", score: 94, energy: 96, carbon: 92, water: 95, waste: 93, trees: 280, events: 18, participants: 620, badge: "Platinum", trend: "+6" },
  { rank: 2, name: "Faculty of Engineering", shortName: "Engineering", score: 88, energy: 90, carbon: 85, water: 88, waste: 89, trees: 195, events: 15, participants: 540, badge: "Gold", trend: "+4" },
  { rank: 3, name: "School of Life Sciences", shortName: "Life Sciences", score: 82, energy: 79, carbon: 84, water: 83, waste: 82, trees: 165, events: 12, participants: 410, badge: "Gold", trend: "+3" },
  { rank: 4, name: "Department of Chemistry", shortName: "Chemistry", score: 76, energy: 78, carbon: 72, water: 77, waste: 77, trees: 120, events: 9, participants: 340, badge: "Silver", trend: "+2" },
  { rank: 5, name: "Department of Physics", shortName: "Physics", score: 71, energy: 74, carbon: 68, water: 72, waste: 70, trees: 95, events: 8, participants: 295, badge: "Silver", trend: "+1" },
  { rank: 6, name: "School of Commerce", shortName: "Commerce", score: 66, energy: 63, carbon: 67, water: 68, waste: 66, trees: 80, events: 7, participants: 250, badge: "Bronze", trend: "0" },
  { rank: 7, name: "Department of Humanities", shortName: "Humanities", score: 59, energy: 57, carbon: 60, water: 61, waste: 58, trees: 60, events: 6, participants: 200, badge: "Bronze", trend: "-1" },
  { rank: 8, name: "Management Studies", shortName: "Management", score: 52, energy: 50, carbon: 54, water: 53, waste: 51, trees: 40, events: 4, participants: 175, badge: "Participant", trend: "+2" },
];

const badgeColors: Record<string, string> = {
  Platinum: "bg-gradient-to-r from-violet-600 to-purple-600 text-white",
  Gold: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
  Silver: "bg-gradient-to-r from-slate-400 to-slate-500 text-white",
  Bronze: "bg-gradient-to-r from-orange-600 to-amber-700 text-white",
  Participant: "bg-slate-200 text-slate-700",
};

const barData = departments.map(d => ({ name: d.shortName, score: d.score }));

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"overall" | "energy" | "carbon" | "water" | "waste">("overall");

  const sortedDepts = [...departments].sort((a, b) => {
    if (activeTab === "energy") return b.energy - a.energy;
    if (activeTab === "carbon") return b.carbon - a.carbon;
    if (activeTab === "water") return b.water - a.water;
    if (activeTab === "waste") return b.waste - a.waste;
    return a.rank - b.rank;
  });

  return (
    <DashboardLayout title="Campus Green Leaderboard">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-bold mb-3">
          <Trophy className="w-4 h-4" /> SDG-13 Climate Action Rankings
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Campus <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Green Leaderboard</span>
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">Departments ranked by overall Green Score encompassing energy, carbon, water, and waste metrics.</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3 mb-8 items-end">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5 text-center">
          <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center"><Trophy className="w-7 h-7 text-amber-500" /></div>
          <div className="text-3xl font-black text-amber-600 mb-1">{departments[1].score}</div>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${badgeColors.Gold}`}>GOLD</span>
          <p className="text-sm font-bold text-slate-800">{departments[1].shortName}</p>
          <p className="text-xs text-slate-500 mt-1">{departments[1].participants} participants</p>
          <p className="text-2xl font-black text-slate-400 mt-2">#2</p>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-7 text-center shadow-lg -mt-4">
          <Crown className="w-7 h-7 mx-auto mb-1 text-violet-600" />
          <div className="w-18 h-18 mx-auto mb-2 rounded-full bg-violet-100 flex items-center justify-center w-16 h-16"><Star className="w-9 h-9 text-violet-600" fill="currentColor" /></div>
          <div className="text-4xl font-black text-violet-700 mb-1">{departments[0].score}</div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${badgeColors.Platinum}`}>PLATINUM</span>
          <p className="text-sm font-bold text-slate-900">{departments[0].shortName}</p>
          <p className="text-xs text-slate-500 mt-1">{departments[0].participants} participants</p>
          <p className="text-2xl font-black text-violet-400 mt-2">#1 🏆</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 text-center">
          <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center"><Medal className="w-7 h-7 text-orange-600" /></div>
          <div className="text-3xl font-black text-orange-600 mb-1">{departments[2].score}</div>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${badgeColors.Gold}`}>GOLD</span>
          <p className="text-sm font-bold text-slate-800">{departments[2].shortName}</p>
          <p className="text-xs text-slate-500 mt-1">{departments[2].participants} participants</p>
          <p className="text-2xl font-black text-slate-400 mt-2">#3</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Overall Green Score</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} style={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={85} style={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="score" fill="#10b981" radius={[0, 6, 6, 0]} name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-violet-500" /> Top 4 — Radar Analysis</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={[
              { category: "Energy", "Env. Sci": 96, Engineering: 90, "Life Sci": 79, Chemistry: 78 },
              { category: "Carbon", "Env. Sci": 92, Engineering: 85, "Life Sci": 84, Chemistry: 72 },
              { category: "Water", "Env. Sci": 95, Engineering: 88, "Life Sci": 83, Chemistry: 77 },
              { category: "Waste", "Env. Sci": 93, Engineering: 89, "Life Sci": 82, Chemistry: 77 },
            ]}>
              <PolarGrid /><PolarAngleAxis dataKey="category" style={{ fontSize: 11 }} />
              <Radar name="Env. Sci" dataKey="Env. Sci" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
              <Radar name="Engineering" dataKey="Engineering" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
              <Radar name="Life Sci" dataKey="Life Sci" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tab filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["overall", "energy", "carbon", "water", "waste"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${activeTab === tab ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300"}`}>
            {tab === "overall" && "🌍 "}{tab === "energy" && "⚡ "}{tab === "carbon" && "🌿 "}{tab === "water" && "💧 "}{tab === "waste" && "♻️ "}{tab}
          </button>
        ))}
      </div>

      {/* Ranking Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-black text-slate-500 uppercase">Rank</th>
                <th className="px-5 py-3 text-left text-xs font-black text-slate-500 uppercase">Department</th>
                <th className="px-5 py-3 text-center text-xs font-black text-slate-500 uppercase">Badge</th>
                <th className="px-5 py-3 text-center text-xs font-black text-slate-500 uppercase">{activeTab === "overall" ? "Score" : activeTab}</th>
                <th className="px-5 py-3 text-center text-xs font-black text-slate-500 uppercase">🌳 Trees</th>
                <th className="px-5 py-3 text-center text-xs font-black text-slate-500 uppercase">Participants</th>
                <th className="px-5 py-3 text-center text-xs font-black text-slate-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedDepts.map((dept, i) => {
                const score = activeTab === "energy" ? dept.energy : activeTab === "carbon" ? dept.carbon : activeTab === "water" ? dept.water : activeTab === "waste" ? dept.waste : dept.score;
                return (
                  <tr key={dept.rank} className={`hover:bg-slate-50 transition-colors ${i < 3 ? "bg-violet-50/20" : ""}`}>
                    <td className="px-5 py-3">
                      {i === 0 && <Crown className="w-5 h-5 text-violet-600" />}
                      {i === 1 && <Trophy className="w-5 h-5 text-amber-500" />}
                      {i === 2 && <Medal className="w-5 h-5 text-orange-500" />}
                      {i >= 3 && <span className="text-slate-400 font-bold">{i + 1}</span>}
                    </td>
                    <td className="px-5 py-3"><p className="font-bold text-slate-900 text-sm">{dept.name}</p><p className="text-xs text-slate-400">{dept.events} events</p></td>
                    <td className="px-5 py-3 text-center"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeColors[dept.badge]}`}>{dept.badge}</span></td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-lg font-black text-emerald-600">{score}</span>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 mx-auto"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${score}%` }} /></div>
                    </td>
                    <td className="px-5 py-3 text-center font-bold text-emerald-700">{dept.trees}</td>
                    <td className="px-5 py-3 text-center text-slate-600 font-semibold">{dept.participants.toLocaleString()}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`font-bold text-sm ${dept.trend.startsWith("+") ? "text-emerald-600" : dept.trend === "0" ? "text-slate-400" : "text-red-500"}`}>
                        {dept.trend.startsWith("+") ? "↑" : dept.trend === "0" ? "→" : "↓"} {dept.trend}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Green Credits */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-7 h-7 text-amber-400" fill="currentColor" />
          <h2 className="text-xl font-black">Student Green Credits</h2>
        </div>
        <p className="text-emerald-200 mb-5 text-sm">Students earn Green Credits by participating in eco-initiatives, tree plantations, and sustainability events.</p>
        <div className="grid grid-cols-3 gap-4">
          {[{ label: "Active Earners", value: "1,240+", icon: "👤" }, { label: "Credits Awarded", value: "48,500", icon: "⭐" }, { label: "Events Monthly", value: "23", icon: "🌿" }].map((item, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-2xl font-black">{item.value}</div>
              <div className="text-xs text-emerald-300">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
