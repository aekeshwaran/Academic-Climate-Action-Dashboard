import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, ArrowRight, Zap, Droplets, Wind, User, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";

export default function Initiatives() {
  const [projects, setProjects] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/research")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));

    const loggedIn = localStorage.getItem("user") === "loggedIn";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const userData = localStorage.getItem("userData");
      if (userData) setUser(JSON.parse(userData));
    }
  }, []);

  const handleJoinProject = async (projectId: number, title: string) => {
    if (!isLoggedIn) {
      toast.error("Please log in to join projects");
      navigate("/login");
      return;
    }

    try {
      const { data } = await api.post("/api/events", { title, projectId, userId: user?.id });
      toast.success(`Successfully joined: ${title}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to join project");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    navigate("/login");
  };

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
              <span className="font-bold text-xl text-slate-900">EcoTrack</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/projects" className="text-sm font-medium text-primary transition-colors">Projects</Link>
              <Link to="/reports" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Reports</Link>
              <Link to="/resources" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Resources</Link>
            </nav>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{user?.name}</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Sustainability Projects</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join hands with the community to accelerate our climate goals through active participation in specialized environmental programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="p-8 hover:shadow-xl transition-all duration-300 border-slate-200 bg-white group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  {project.icon === 'Zap' ? <Zap className="w-7 h-7 text-green-600" /> : 
                   project.icon === 'Wind' ? <Wind className="w-7 h-7 text-green-600" /> :
                   <Leaf className="w-7 h-7 text-green-600" />}
                </div>
                <Button 
                  onClick={() => handleJoinProject(project.id, project.title)}
                  className="bg-primary hover:bg-primary/90 rounded-xl"
                >
                  Join Project
                </Button>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{project.title}</h3>
              <p className="text-slate-600 mb-6 line-clamp-3">{project.description}</p>
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Target Impact</span>
                  <span className="text-primary font-bold">{project.target_impact}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center italic text-sm">
          © 2024 EcoTrack. Building a sustainable future together.
        </div>
      </footer>
    </div>
  );
}
