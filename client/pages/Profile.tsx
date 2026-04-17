import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  User, 
  Settings, 
  ArrowLeft, 
  Award, 
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Fetch user progress
      fetch(`/api/user-progress/${parsedUser.id}`)
        .then(res => res.json())
        .then(data => setProgress(data))
        .catch(err => console.error("Error fetching progress:", err));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">EcoTrack</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-lg">
            <User className="w-12 h-12 text-primary" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-slate-600">@{user.username} • Climate Advocate</p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <Award className="w-8 h-8 text-amber-500 mx-auto mb-4" />
            <p className="text-2xl font-bold text-slate-900">Gold</p>
            <p className="text-sm text-slate-500 font-medium">Badge Level</p>
          </Card>
          <Card className="p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <p className="text-2xl font-bold text-slate-900">42 Days</p>
            <p className="text-sm text-slate-500 font-medium">Activity Streak</p>
          </Card>
          <Card className="p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-4" />
            <p className="text-2xl font-bold text-slate-900">{progress.find(p => p.metric_name === 'projects_joined')?.value || 0}</p>
            <p className="text-sm text-slate-500 font-medium">Projects Joined</p>
          </Card>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Contribution Progress</h2>
        <Card className="p-8 mb-8">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-700">Carbon Reduction Contribution</span>
                <span className="text-primary font-bold">125 kg CO2e</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-green-500 h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-700">Sustainability Impact Score</span>
                <span className="text-primary font-bold">850 / 1000</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
