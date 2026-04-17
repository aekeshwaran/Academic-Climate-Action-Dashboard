import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Leaf,
  TrendingUp,
  Users,
  Zap,
  Award,
  BookOpen,
  ArrowRight,
  Droplets,
  User,
  Wind,
  Flame,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface DashboardData {
  analytics: any[];
  activities: any[];
  initiatives: any[];
  metrics: any[];
}

const emissionData = [
  { month: "Jan", emissions: 4200, target: 4200 },
  { month: "Feb", emissions: 4100, target: 4150 },
  { month: "Mar", emissions: 3900, target: 4100 },
  { month: "Apr", emissions: 3700, target: 4050 },
  { month: "May", emissions: 3500, target: 4000 },
  { month: "Jun", emissions: 3300, target: 3950 },
];

const energyData = [
  { name: "Renewable", value: 65, color: "#10b981" },
  { name: "Natural Gas", value: 20, color: "#3b82f6" },
  { name: "Other", value: 15, color: "#f3f4f6" },
];

const wasteReductionData = [
  { year: 2020, waste: 8500 },
  { year: 2021, waste: 7800 },
  { year: 2022, waste: 6900 },
  { year: 2023, waste: 5200 },
  { year: 2024, waste: 3800 },
];

const metrics = [
  {
    label: "Carbon Reduced",
    value: "2,450 MT",
    change: "+18%",
    icon: Leaf,
    color: "from-emerald-50 to-teal-50",
  },
  {
    label: "Renewable Energy",
    value: "65%",
    change: "+12%",
    icon: Zap,
    color: "from-amber-50 to-orange-50",
  },
  {
    label: "Active Projects",
    value: "23",
    change: "+5",
    icon: TrendingUp,
    color: "from-blue-50 to-cyan-50",
  },
  {
    label: "Participants",
    value: "1,250+",
    change: "+340",
    icon: Users,
    color: "from-purple-50 to-pink-50",
  },
];



const initiatives = [
  {
    title: "Net-Zero by 2030",
    description: "Campus-wide commitment to achieve carbon neutrality",
    progress: 65,
    icon: Award,
  },
  {
    title: "Renewable Transition",
    description: "Installing solar panels across all facilities",
    progress: 48,
    icon: Zap,
  },
  {
    title: "Green Building Retrofit",
    description: "Upgrading existing structures for energy efficiency",
    progress: 72,
    icon: Droplets,
  },
  {
    title: "Zero Waste Program",
    description: "Comprehensive waste reduction and recycling initiative",
    progress: 81,
    icon: Wind,
  },
];

export default function Index() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching dashboard data:", err));

    const loggedIn = localStorage.getItem("user") === "loggedIn";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const userData = localStorage.getItem("userData");
      if (userData) setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">
                EcoTrack
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/projects"
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/leaderboard"
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                Leaderboard
              </Link>
              <Link
                to="/reports"
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                Reports
              </Link>
              <Link
                to="/resources"
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                Resources
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <Link to="/profile">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{user?.name}</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-slate-600 font-semibold">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-primary hover:bg-primary/90 font-semibold px-6">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            Academic{" "}
            <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Climate Action
            </span>{" "}
            Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Track, measure, and accelerate your institution's sustainability
            goals. Real-time insights into carbon emissions, energy usage, and
            environmental impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                  Join the Movement
                </Button>
              </Link>
            )}
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 w-full sm:w-auto">
                Explore Data
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card
                key={index}
                className={`bg-gradient-to-br ${metric.color} border-slate-200 p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                    {metric.change}
                  </span>
                </div>
                <p className="text-sm text-slate-600 font-medium mb-1">
                  {metric.label}
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {metric.value}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Charts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          Environmental Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Carbon Emissions Chart */}
          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Carbon Emissions vs Target
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emissionData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Bar dataKey="emissions" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Energy Mix Chart */}
          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Energy Mix by Source
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={energyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {energyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Waste Reduction Chart */}
        <Card className="p-6 border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Waste Reduction Progress (2020-2024)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={wasteReductionData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="waste"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* Initiatives Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          Active Initiatives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initiatives.map((initiative, index) => {
            const Icon = initiative.icon;
            return (
              <Card
                key={index}
                className="border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {initiative.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {initiative.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {initiative.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${initiative.progress}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-primary to-teal-600 rounded-3xl my-12 text-white">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to transform your campus?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join hundreds of institutions making measurable progress toward
            climate action. Start tracking and optimizing your environmental
            impact today.
          </p>
          <Link to="/journey">
            <Button className="bg-white text-primary hover:bg-slate-100 font-semibold">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">EcoTrack</span>
              </div>
              <p className="text-sm text-slate-400">
                Empowering academic institutions to lead climate action.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/initiatives"
                    className="hover:text-white transition-colors"
                  >
                    Initiatives
                  </Link>
                </li>
                <li>
                  <Link
                    to="/reports"
                    className="hover:text-white transition-colors"
                  >
                    Reports
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Learn</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-white transition-colors"
                  >
                    Resources
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8">
            <p className="text-center text-sm text-slate-400">
              © 2024 EcoTrack. All rights reserved. | Building a sustainable
              future together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
