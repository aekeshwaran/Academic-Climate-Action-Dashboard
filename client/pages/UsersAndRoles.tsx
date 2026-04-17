import DashboardLayout from "../components/DashboardLayout";
import { useState } from "react";
import { Users, Shield, GraduationCap, Briefcase, FlaskConical, Plus, Search } from "lucide-react";

const roleConfig: Record<string, { icon: any; color: string; bg: string; permissions: string[] }> = {
  admin: {
    icon: Shield,
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    permissions: ["Manage Dashboard", "Add Buildings", "Generate Reports", "Manage Users", "View All Modules"],
  },
  officer: {
    icon: Briefcase,
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    permissions: ["Upload Environmental Data", "Track Sustainability Progress", "View Reports", "Manage Activities"],
  },
  faculty: {
    icon: FlaskConical,
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    permissions: ["Add Research Projects", "Report Climate Activities", "View Own Data", "Submit Publications"],
  },
  student: {
    icon: GraduationCap,
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    permissions: ["Participate in Green Initiatives", "View Sustainability Progress", "Earn Green Credits", "View Leaderboard"],
  },
};

const sampleUsers = [
  { id: 1, name: "Dr. Ramesh Kumar", email: "ramesh@campus.edu", role: "admin", joined: "2024-01-15", status: "active" },
  { id: 2, name: "Prof. Ananya Singh", email: "ananya@campus.edu", role: "faculty", joined: "2024-02-01", status: "active" },
  { id: 3, name: "Mr. Vijay Menon", email: "vijay@campus.edu", role: "officer", joined: "2024-02-10", status: "active" },
  { id: 4, name: "Priya Nair", email: "priya.s@campus.edu", role: "student", joined: "2024-06-01", status: "active" },
  { id: 5, name: "Arjun Dev", email: "arjun.d@campus.edu", role: "student", joined: "2024-06-01", status: "active" },
  { id: 6, name: "Dr. Sarah Mathew", email: "sarah@campus.edu", role: "faculty", joined: "2024-03-05", status: "active" },
  { id: 7, name: "Kiran Patel", email: "kiran.p@campus.edu", role: "student", joined: "2024-06-01", status: "inactive" },
  { id: 8, name: "Ms. Deepa Rao", email: "deepa@campus.edu", role: "officer", joined: "2024-04-15", status: "active" },
];

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  officer: "bg-blue-100 text-blue-700",
  faculty: "bg-purple-100 text-purple-700",
  student: "bg-emerald-100 text-emerald-700",
};

export default function UsersAndRoles() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student" });
  const [addSuccess, setAddSuccess] = useState(false);

  const filtered = sampleUsers.filter(u =>
    (filterRole === "all" || u.role === filterRole) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddSuccess(true);
    setTimeout(() => { setAddSuccess(false); setShowAddForm(false); setNewUser({ name: "", email: "", role: "student" }); }, 2500);
  };

  return (
    <DashboardLayout title="Users & Roles">
      {/* Role Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(roleConfig).map(([role, config]) => {
          const Icon = config.icon;
          const count = sampleUsers.filter(u => u.role === role).length;
          return (
            <div key={role} className={`rounded-2xl border p-5 ${config.bg}`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-5 h-5 ${config.color}`} />
                <span className={`font-black capitalize text-sm ${config.color}`}>{role === "officer" ? "Sustainability Officer" : role}</span>
              </div>
              <p className={`text-3xl font-black ${config.color}`}>{count}</p>
              <p className="text-xs text-slate-500 font-bold mt-1">Users in this role</p>
              <div className="mt-3 space-y-1">
                {config.permissions.slice(0, 2).map((p, j) => (
                  <p key={j} className="text-[10px] text-slate-500 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                    {p}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Management */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="text-sm outline-none flex-1 placeholder-slate-400"
            />
          </div>
          <div className="flex gap-2">
            {["all", "admin", "officer", "faculty", "student"].map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize ${filterRole === role ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:border-slate-400"}`}
              >
                {role}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition ml-auto"
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>

        {showAddForm && (
          <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
            {addSuccess ? (
              <p className="text-emerald-700 font-bold text-sm">✅ User invitation sent successfully!</p>
            ) : (
              <form onSubmit={handleAddUser} className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                  <input required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Dr. Full Name" className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none w-44" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                  <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="user@campus.edu" className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none w-44" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Role</label>
                  <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none">
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="officer">Sustainability Officer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700">Invite</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50">Cancel</button>
              </form>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-black text-slate-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-black text-slate-500 uppercase">Email</th>
                <th className="px-6 py-3 text-center text-xs font-black text-slate-500 uppercase">Role</th>
                <th className="px-6 py-3 text-center text-xs font-black text-slate-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-center text-xs font-black text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-black">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{u.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${roleColors[u.role]}`}>{u.role === "officer" ? "Officer" : u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500">{u.joined}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {sampleUsers.length} users
        </div>
      </div>
    </DashboardLayout>
  );
}
