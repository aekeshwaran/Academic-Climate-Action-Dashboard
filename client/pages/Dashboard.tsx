import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
import {
  Leaf,
  TrendingUp,
  Users,
  Zap,
  Award,
  Droplets,
  User,
  Wind,
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  CheckCircle2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import EnergyDashboard from "../components/EnergyDashboard";
import CarbonDashboard from "../components/CarbonDashboard";
import WaterDashboard from "../components/WaterDashboard";
import WasteManagementDashboard from "../components/WasteManagementDashboard";
import GreenCampusDashboard from "../components/GreenCampusDashboard";
import ClimateResearchDashboard from "../components/ClimateResearchDashboard";

interface DashboardData {
  climate_data: any[];
  emissions: any[];
  energy_usage: any[];
  initiatives: any[];
  metrics: any[];
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [overallScore, setOverallScore] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>({
    carbonFootprint: 0,
    energyConsumption: 0,
    waterUsage: 0,
    wasteRecyclingPercentage: 0,
    treesPlanted: 0
  });

  // Input states
  const [inputs, setInputs] = useState({
    electricity: "",
    diesel: "",
    petrol: "",
    solarEnergy: "",
    totalEnergy: "",
    students: "",
    faculty: "",
    staff: "",
    volunteers: "",
    windEnergy: "",
    totalProjects: "",
    completedProjects: "",
    ongoingProjects: "",
    plannedProjects: "",
    totalWaste: "",
    recycledWaste: "",
    organicWaste: "",
    waterConsumption: "",
    rainwaterHarvested: "",
    recycledWater: "",
    treesPlanted: "",
    greenEvents: "",
    researchProjects: "",
    facultyPublications: "",
    studentPapers: "",
    plasticWaste: "",
    paperWaste: "",
    e_waste: ""
  });

  const fetchOverallScore = async () => {
    try {
      const response = await fetch("/api/sustainability/score");
      const data = await response.json();
      setOverallScore(data);
    } catch (err) {
      console.error("Failed to fetch score");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics");
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchOverallScore();
    fetchAnalytics();
  }, []);

  const handleCalculate = async (type: string) => {
    setLoading(true);
    setCalculationResult(null);
    try {
      const payload: any = { buildingId: 1, userId: 1 };
      
      if (type === 'carbon') {
        payload.electricity = parseFloat(inputs.electricity);
        payload.diesel = parseFloat(inputs.diesel);
        payload.transport = parseFloat(inputs.petrol);
      } else if (type === 'energy') {
        payload.electricity = parseFloat(inputs.electricity);
        payload.solar = parseFloat(inputs.solarEnergy);
        payload.wind = parseFloat(inputs.windEnergy);
      } else if (type === 'water') {
        payload.consumption = parseFloat(inputs.waterConsumption);
        payload.rainwater = parseFloat(inputs.rainwaterHarvested);
        payload.recycled = parseFloat(inputs.recycledWater);
      } else if (type === 'waste') {
        payload.plastic = parseFloat(inputs.plasticWaste);
        payload.organic = parseFloat(inputs.organicWaste);
        payload.paper = parseFloat(inputs.paperWaste);
        payload.recycled = parseFloat(inputs.recycledWaste);
      } else if (type === 'activities') {
        payload.trees = parseInt(inputs.treesPlanted);
        payload.events = parseInt(inputs.greenEvents);
        payload.participants = parseInt(inputs.students);
      } else if (type === 'research') {
        payload.publications = parseInt(inputs.facultyPublications);
        payload.projects = parseInt(inputs.researchProjects);
        payload.theses = parseInt(inputs.studentPapers);
      }

      const response = await fetch(`/api/calculate/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setCalculationResult(data);
      toast.success(`${data.title} updated`);
      setActiveModule(null);
      fetchOverallScore(); // Refresh global score
    } catch (err) {
      toast.error("Failed to run calculation");
    } finally {
      setLoading(false);
    }
  };

  const calculateCarbonEmission = () => {
    const elec = parseFloat(inputs.electricity) || 0;
    const diesel = parseFloat(inputs.diesel) || 0;
    const transport = parseFloat(inputs.petrol) || 0;

    const elecCO2 = (elec * 0.82) / 1000;
    const dieselCO2 = (diesel * 2.68) / 1000;
    const transportCO2 = (transport * 2.31) / 1000;
    const totalCO2 = elecCO2 + dieselCO2 + transportCO2;

    const reduction = totalCO2 * 0.1;
    const score = Math.max(0, 100 - (totalCO2 / 100));

    setCalculationResult({
      title: "Carbon Emission Analysis",
      type: 'carbon-detail',
      data: {
        electricity: elecCO2,
        diesel: dieselCO2,
        transport: transportCO2,
        total: totalCO2,
        reduction: reduction,
        score: score
      }
    });
    
    toast.success("Carbon Emission analysis completed");
    setActiveModule(null);
  };

  const calculateEnergyMonitoring = () => {
    const elec = parseFloat(inputs.electricity) || 0;
    const solar = parseFloat(inputs.solarEnergy) || 0;
    const wind = parseFloat(inputs.windEnergy) || 0;

    const totalEnergy = elec;
    const renewableEnergy = solar + wind;
    const percentage = totalEnergy > 0 ? (renewableEnergy / totalEnergy) * 100 : 0;
    const efficiencyScore = Math.min(100, (percentage * 0.8) + 20);

    setCalculationResult({
      title: "Energy Monitoring Analysis",
      type: 'energy-monitor-detail',
      data: {
        totalEnergy,
        renewableEnergy,
        percentage,
        score: efficiencyScore
      }
    });
    toast.success("Energy monitoring analysis completed");
    setActiveModule(null);
  };

  const calculateWaterManagement = () => {
    const consumption = parseFloat(inputs.waterConsumption) || 0;
    const rainwater = parseFloat(inputs.rainwaterHarvested) || 0;
    const recycled = parseFloat(inputs.recycledWater) || 0;

    const totalUsed = consumption;
    const saved = rainwater + recycled;
    const rate = totalUsed > 0 ? (saved / totalUsed) * 100 : 0;

    setCalculationResult({
      title: "Water Management Analysis",
      type: 'water-detail',
      data: {
        totalUsed,
        saved,
        rate
      }
    });
    toast.success("Water analysis completed");
    setActiveModule(null);
  };

  const calculateWasteManagementDetail = () => {
    const total = parseFloat(inputs.totalWaste) || 0;
    const recycled = parseFloat(inputs.recycledWaste) || 0;
    const organic = parseFloat(inputs.organicWaste) || 0;

    const recyclingRate = total > 0 ? (recycled / total) * 100 : 0;
    const organicRate = total > 0 ? (organic / total) * 100 : 0;

    setCalculationResult({
      title: "Waste Management Analysis",
      type: 'waste-detail-new',
      data: {
        recycled,
        organic,
        recyclingRate,
        organicRate
      }
    });
    toast.success("Waste analysis completed");
    setActiveModule(null);
  };

  const calculateProjectPerformance = () => {
    const total = parseInt(inputs.totalProjects) || 1;
    const completed = parseInt(inputs.completedProjects) || 0;
    const ongoing = parseInt(inputs.ongoingProjects) || 0;
    const planned = parseInt(inputs.plannedProjects) || 0;

    const rate = (completed / total) * 100;

    setCalculationResult({
      title: "Project Progress Analysis",
      type: 'project-detail',
      data: {
        total,
        completed,
        ongoing,
        planned,
        rate
      }
    });
    toast.success("Project analysis completed");
    setActiveModule(null);
  };

  const calculateParticipationRate = () => {
    const students = parseInt(inputs.students) || 0;
    const faculty = parseInt(inputs.faculty) || 0;
    const staff = parseInt(inputs.staff) || 0;
    const volunteers = parseInt(inputs.volunteers) || 0;
    
    const campusPopulation = 5000; // Example institutional constant
    const total = students + faculty + staff + volunteers;
    const participationRate = (total / campusPopulation) * 100;
    const engagementScore = Math.min(100, participationRate * 5);

    setCalculationResult({
      title: "Participation Analysis",
      type: 'participation-detail',
      data: {
        students,
        faculty,
        staff,
        volunteers,
        total,
        rate: participationRate,
        score: engagementScore
      }
    });
    toast.success("Participation analysis completed");
    setActiveModule(null);
  };

  const calculateGreenImpact = () => {
    const trees = parseInt(inputs.treesPlanted) || 0;
    const events = parseInt(inputs.greenEvents) || 0;
    const participants = parseInt(inputs.students) || 0;

    const score = (trees * 2) + events + participants;

    setCalculationResult({
      title: "Green Campus Activities Analysis",
      type: 'green-detail',
      data: {
        trees,
        events,
        score
      }
    });
    toast.success("Green impact analysis completed");
    setActiveModule(null);
  };

  const calculateResearchImpact = () => {
    const projects = parseInt(inputs.researchProjects) || 0;
    const publications = parseInt(inputs.facultyPublications) || 0;
    const papers = parseInt(inputs.studentPapers) || 0;

    const score = (projects * 3) + publications + papers;

    setCalculationResult({
      title: "Climate Research Tracking",
      type: 'research-detail',
      data: {
        total: projects + publications + papers,
        score
      }
    });
    toast.success("Research impact analysis completed");
    setActiveModule(null);
  };

  const handleParticipants = async () => {
    handleCalculate('participants');
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const modules = [
    { id: 'energy', label: "Energy Monitoring", icon: Zap, color: "bg-amber-100 text-amber-700", description: "Monitor building-level consumption and renewable sources." },
    { id: 'carbon', label: "Carbon Footprint Tracker", icon: Leaf, color: "bg-emerald-100 text-emerald-700", description: "Analyze Scope 1, 2, and 3 emissions for the campus." },
    { id: 'water', label: "Water Management", icon: Droplets, color: "bg-blue-100 text-blue-700", description: "Track water usage and recycling efficiency." },
    { id: 'waste', label: "Waste Management", icon: Wind, color: "bg-slate-100 text-slate-700", description: "Monitor recycling rates and total waste generation." },
    { id: 'campus', label: "Green Campus Activities", icon: Users, color: "bg-purple-100 text-purple-700", description: "Participate and track university-wide green events." },
    { id: 'research', label: "Climate Research Tracker", icon: TrendingUp, color: "bg-red-100 text-red-700", description: "View and contribute to ongoing sustainability research." },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar/Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">EcoTrack</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              {user?.role || 'Student'}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/leaderboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Leaderboard</Link>
              <Link to="/reports" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Reports</Link>
            </nav>
            <span className="text-sm font-medium text-slate-600 hidden md:block">Welcome, {user?.name}</span>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 italic">Academic Climate Action Dashboard</h1>
          <p className="text-slate-600">Analyze institutional climate impact through interactive calculation modules.</p>
        </div>

        {/* Overall Score Card */}
        {overallScore && (
          <Card className="mb-8 p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative border-0 shadow-xl ring-1 ring-white/10">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <span className="text-4xl font-black text-emerald-400 leading-none">{Math.round(overallScore.score)}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Institutional Green Score</h2>
                  <p className="text-slate-400 text-sm max-w-xs mt-1">Overall sustainability rating based on energy, carbon, water, and waste indicators.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
                {[
                  { label: "Energy", score: overallScore.energy_subscore },
                  { label: "Carbon", score: overallScore.carbon_subscore },
                  { label: "Water", score: overallScore.water_subscore },
                  { label: "Waste", score: overallScore.waste_subscore },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-xl font-black text-white">{Math.round(item.score)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          </Card>
        )}

        {/* 1. First Page Metrics Section (Buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button onClick={() => setActiveModule('carbon-calc')} className="h-24 bg-white hover:bg-emerald-50 text-slate-900 border border-emerald-100 shadow-sm flex flex-col items-center justify-center gap-1 group">
            <Leaf className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Carbon Reduction</span>
          </Button>
          <Button onClick={() => setActiveModule('energy-calc')} className="h-24 bg-white hover:bg-amber-50 text-slate-900 border border-amber-100 shadow-sm flex flex-col items-center justify-center gap-1 group">
            <Zap className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Renewable Energy</span>
          </Button>
          <Button onClick={() => setActiveModule('projects-calc')} className="h-24 bg-white hover:bg-blue-50 text-slate-900 border border-blue-100 shadow-sm flex flex-col items-center justify-center gap-1 group">
            <TrendingUp className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Active Projects</span>
          </Button>
          <Button onClick={() => setActiveModule('participants-calc')} className="h-24 bg-white hover:bg-purple-50 text-slate-900 border border-purple-100 shadow-sm flex flex-col items-center justify-center gap-1 group">
            <Users className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Participants</span>
          </Button>
        </div>

        {/* Calculation Forms */}
        {activeModule && (
          <Card className="mb-8 p-6 bg-white border-primary shadow-lg animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {activeModule === 'carbon-calc' && "Carbon Footprint Tracker"}
                {activeModule === 'energy-calc' && "Energy Monitoring Analysis"}
                {activeModule === 'water-calc' && "Water Management Tracker"}
                {activeModule === 'waste-calc' && "Waste Management Calculator"}
                {activeModule === 'campus-calc' && "Green Campus Initiative Tracking"}
                {activeModule === 'research-calc' && "Climate Research Impact Tracker"}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setActiveModule(null)}>Cancel</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeModule === 'carbon-calc' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="electricity">Electricity Consumption (kWh)</Label>
                    <Input id="electricity" type="number" value={inputs.electricity} onChange={handleInputChange} placeholder="e.g. 5000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diesel">Diesel Usage (liters)</Label>
                    <Input id="diesel" type="number" value={inputs.diesel} onChange={handleInputChange} placeholder="e.g. 200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="petrol">Transport Fuel (liters)</Label>
                    <Input id="petrol" type="number" value={inputs.petrol} onChange={handleInputChange} placeholder="e.g. 150" />
                  </div>
                </>
              )}

              {activeModule === 'energy-calc' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="electricity">Electricity Consumption (kWh)</Label>
                    <Input id="electricity" type="number" value={inputs.electricity} onChange={handleInputChange} placeholder="e.g. 5000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="solarEnergy">Solar Energy Generated (kWh)</Label>
                    <Input id="solarEnergy" type="number" value={inputs.solarEnergy} onChange={handleInputChange} placeholder="e.g. 2000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="windEnergy">Wind Energy Generated (kWh)</Label>
                    <Input id="windEnergy" type="number" value={inputs.windEnergy} onChange={handleInputChange} placeholder="e.g. 1000" />
                  </div>
                </>
              )}

              {activeModule === 'water-calc' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="waterConsumption">Daily Water Consumption (liters)</Label>
                    <Input id="waterConsumption" type="number" value={inputs.waterConsumption} onChange={handleInputChange} placeholder="5000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rainwaterHarvested">Rainwater Harvested (liters)</Label>
                    <Input id="rainwaterHarvested" type="number" value={inputs.rainwaterHarvested} onChange={handleInputChange} placeholder="1200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recycledWater">Recycled Water (liters)</Label>
                    <Input id="recycledWater" type="number" value={inputs.recycledWater} onChange={handleInputChange} placeholder="800" />
                  </div>
                </>
              )}

              {activeModule === 'waste-calc' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="plasticWaste">Plastic Waste (kg)</Label>
                    <Input id="plasticWaste" type="number" value={inputs.plasticWaste} onChange={handleInputChange} placeholder="300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organicWaste">Organic Waste (kg)</Label>
                    <Input id="organicWaste" type="number" value={inputs.organicWaste} onChange={handleInputChange} placeholder="450" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paperWaste">Paper Waste (kg)</Label>
                    <Input id="paperWaste" type="number" value={inputs.paperWaste} onChange={handleInputChange} placeholder="250" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recycledWaste">Recycled Waste (kg)</Label>
                    <Input id="recycledWaste" type="number" value={inputs.recycledWaste} onChange={handleInputChange} placeholder="600" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="e_waste">E-Waste (kg)</Label>
                    <Input id="e_waste" type="number" value={inputs.e_waste} onChange={handleInputChange} placeholder="50" />
                  </div>
                </>
              )}

              {activeModule === 'campus-calc' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="treesPlanted">Trees Planted</Label>
                    <Input id="treesPlanted" type="number" value={inputs.treesPlanted} onChange={handleInputChange} placeholder="150" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="greenEvents">Green Events Conducted</Label>
                    <Input id="greenEvents" type="number" value={inputs.greenEvents} onChange={handleInputChange} placeholder="12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="students">Students Participated</Label>
                    <Input id="students" type="number" value={inputs.students} onChange={handleInputChange} placeholder="450" />
                  </div>
                </>
              )}

              {activeModule === 'participants-calc' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="students">Students Participated</Label>
                    <Input id="students" type="number" value={inputs.students} onChange={handleInputChange} placeholder="300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty">Faculty Participated</Label>
                    <Input id="faculty" type="number" value={inputs.faculty} onChange={handleInputChange} placeholder="40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff">Staff Participated</Label>
                    <Input id="staff" type="number" value={inputs.staff} onChange={handleInputChange} placeholder="60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volunteers">Campus Volunteers</Label>
                    <Input id="volunteers" type="number" value={inputs.volunteers} onChange={handleInputChange} placeholder="25" />
                  </div>
                </>
              )}

              {activeModule === 'projects-calc' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="totalProjects">Total Campus Projects</Label>
                    <Input id="totalProjects" type="number" value={inputs.totalProjects} onChange={handleInputChange} placeholder="25" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="completedProjects">Completed Projects</Label>
                    <Input id="completedProjects" type="number" value={inputs.completedProjects} onChange={handleInputChange} placeholder="15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ongoingProjects">Ongoing Projects</Label>
                    <Input id="ongoingProjects" type="number" value={inputs.ongoingProjects} onChange={handleInputChange} placeholder="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plannedProjects">Planned Projects</Label>
                    <Input id="plannedProjects" type="number" value={inputs.plannedProjects} onChange={handleInputChange} placeholder="5" />
                  </div>
                </>
              )}

              {activeModule === 'research-calc' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="researchProjects">Research Projects</Label>
                    <Input id="researchProjects" type="number" value={inputs.researchProjects} onChange={handleInputChange} placeholder="8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facultyPublications">Faculty Publications</Label>
                    <Input id="facultyPublications" type="number" value={inputs.facultyPublications} onChange={handleInputChange} placeholder="15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentPapers">Student Research Papers</Label>
                    <Input id="studentPapers" type="number" value={inputs.studentPapers} onChange={handleInputChange} placeholder="24" />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => {
                    if (activeModule === 'carbon-calc') {
                      handleCalculate('carbon');
                    } else if (activeModule === 'energy-calc') {
                      handleCalculate('energy');
                    } else if (activeModule === 'water-calc') {
                      handleCalculate('water');
                    } else if (activeModule === 'waste-calc') {
                      handleCalculate('waste');
                    } else if (activeModule === 'campus-calc') {
                      handleCalculate('activities');
                    } else if (activeModule === 'research-calc') {
                      handleCalculate('research');
                    } else if (activeModule === 'projects-calc') {
                      calculateProjectPerformance();
                    } else if (activeModule === 'participants-calc') {
                      calculateParticipationRate();
                    } else {
                      handleCalculate(activeModule.split('-')[0]);
                    }
                  }} 
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 px-8"
                >
                  {loading ? "Calculating..." : "Run Analysis"}
                </Button>
              </div>
          </Card>
        )}

        {/* Result Panel Display */}
        {calculationResult && !activeModule && (
          <Card className="mb-8 p-6 bg-white border-l-4 border-primary shadow-md animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="text-primary" />
                {calculationResult.title}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setCalculationResult(null)}>Close</Button>
            </div>

            {calculationResult.type === 'carbon-detail' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider text-xs">Electricity Emissions</p>
                    <p className="text-2xl font-black text-slate-900">{calculationResult.data.electricity.toFixed(2)} <span className="text-sm font-normal text-slate-500">tons CO₂</span></p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider text-xs">Diesel Emissions</p>
                    <p className="text-2xl font-black text-slate-900">{calculationResult.data.diesel.toFixed(2)} <span className="text-sm font-normal text-slate-500">tons CO₂</span></p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider text-xs">Transport Emissions</p>
                    <p className="text-2xl font-black text-slate-900">{calculationResult.data.transport.toFixed(2)} <span className="text-sm font-normal text-slate-500">tons CO₂</span></p>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <p className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">Total Carbon Emissions</p>
                    <p className="text-4xl font-black text-primary leading-none">{calculationResult.data.total.toFixed(2)} <span className="text-lg font-normal">tons CO₂</span></p>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reduction Potential</p>
                      <p className="text-xl font-black text-emerald-600">{calculationResult.data.reduction.toFixed(2)} tons</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sustainability Score</p>
                      <p className="text-xl font-black text-blue-600">{calculationResult.data.score.toFixed(1)}/100</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {calculationResult.type === 'energy-monitor-detail' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider text-xs">Total Consumption</p>
                    <p className="text-2xl font-black text-slate-900">{calculationResult.data.totalEnergy.toLocaleString()} <span className="text-sm font-normal text-slate-500">kWh</span></p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider text-xs">Renewable Produced</p>
                    <p className="text-2xl font-black text-slate-900">{calculationResult.data.renewableEnergy.toLocaleString()} <span className="text-sm font-normal text-slate-500">kWh</span></p>
                  </div>
                </div>
                <div className="bg-amber-100/50 p-6 rounded-2xl border border-amber-200 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <p className="text-sm font-bold text-amber-700 mb-1 uppercase tracking-wider">Renewable Percentage</p>
                    <p className="text-4xl font-black text-amber-600 leading-none">{calculationResult.data.percentage.toFixed(1)}%</p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Efficiency Score</p>
                    <p className="text-2xl font-black text-emerald-600">{calculationResult.data.score.toFixed(1)}/100</p>
                  </div>
                </div>
              </div>
            )}

            {calculationResult.type === 'water-detail' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Water Saved</p>
                    <p className="text-2xl font-black text-slate-900">{calculationResult.data.saved.toLocaleString()} <span className="text-sm font-normal text-slate-500">liters</span></p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Water Used</p>
                    <p className="text-2xl font-black text-slate-900">{calculationResult.data.totalUsed.toLocaleString()} <span className="text-sm font-normal text-slate-500">liters</span></p>
                  </div>
                </div>
                <div className="bg-blue-600 p-6 rounded-2xl text-white flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold uppercase opacity-80">Conservation Percentage</p>
                    <p className="text-4xl font-black leading-none">{calculationResult.data.rate.toFixed(1)}%</p>
                  </div>
                  <Droplets className="w-12 h-12 opacity-30" />
                </div>
              </div>
            )}

            {calculationResult.type === 'waste-detail-new' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recycled Waste</p>
                    <p className="text-2xl font-black text-slate-900">{calculationResult.data.recycled.toLocaleString()} <span className="text-sm font-normal text-slate-500">kg</span></p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Organic Waste</p>
                    <p className="text-2xl font-black text-slate-900">{calculationResult.data.organic.toLocaleString()} <span className="text-sm font-normal text-slate-500">kg</span></p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-500 p-6 rounded-2xl text-white">
                    <p className="text-sm font-bold uppercase opacity-80">Recycling Rate</p>
                    <p className="text-4xl font-black leading-none">{calculationResult.data.recyclingRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-amber-500 p-6 rounded-2xl text-white">
                    <p className="text-sm font-bold uppercase opacity-80">Organic Waste Rate</p>
                    <p className="text-4xl font-black leading-none">{calculationResult.data.organicRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            )}

            {calculationResult.type === 'green-detail' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Total Trees Planted</p>
                    <p className="text-2xl font-black text-slate-900">{calculationResult.data.trees.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Total Events</p>
                    <p className="text-2xl font-black text-slate-900">{calculationResult.data.events.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-emerald-600 p-6 rounded-2xl text-white flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold uppercase opacity-80">Green Impact Score</p>
                    <p className="text-4xl font-black leading-none">{calculationResult.data.score}</p>
                  </div>
                  <Award className="w-12 h-12 opacity-30" />
                </div>
              </div>
            )}

            {calculationResult.type === 'research-detail' && (
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Research Contributions</p>
                  <p className="text-2xl font-black text-slate-900">{calculationResult.data.total.toLocaleString()}</p>
                </div>
                <div className="bg-red-600 p-6 rounded-2xl text-white flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold uppercase opacity-80">Climate Research Score</p>
                    <p className="text-4xl font-black leading-none">{calculationResult.data.score}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 opacity-30" />
                </div>
              </div>
            )}

            {calculationResult.type === 'participation-detail' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-[10px] font-bold text-purple-600 uppercase">Students</p>
                    <p className="text-lg font-black">{calculationResult.data.students}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Faculty</p>
                    <p className="text-lg font-black">{calculationResult.data.faculty}</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-[10px] font-bold text-amber-600 uppercase">Staff</p>
                    <p className="text-lg font-black">{calculationResult.data.staff}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-[10px] font-bold text-slate-600 uppercase">Volunteers</p>
                    <p className="text-lg font-black">{calculationResult.data.volunteers}</p>
                  </div>
                </div>
                <div className="bg-purple-600 p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase opacity-80">Total Community Participants</p>
                    <p className="text-4xl font-black leading-none">{calculationResult.data.total.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-8 text-center" />
                </div>
              </div>
            )}

            {calculationResult.type === 'project-detail' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Total</p>
                    <p className="text-xl font-black">{calculationResult.data.total}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Completed</p>
                    <p className="text-xl font-black">{calculationResult.data.completed}</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-600 uppercase">Ongoing</p>
                    <p className="text-xl font-black">{calculationResult.data.ongoing}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Planned</p>
                    <p className="text-xl font-black">{calculationResult.data.planned}</p>
                  </div>
                </div>
                <div className="bg-emerald-500 p-6 rounded-2xl text-white flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold uppercase opacity-80">Project Completion Rate</p>
                    <p className="text-4xl font-black leading-none">{calculationResult.data.rate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            )}

            {!['carbon-detail', 'energy-monitor-detail', 'water-detail', 'waste-detail-new', 'green-detail', 'research-detail', 'participation-detail', 'project-detail'].includes(calculationResult.type) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {calculationResult.metrics ? calculationResult.metrics.map((m: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-500 mb-1">{m.label}</p>
                    <p className="text-2xl font-black text-primary">{m.value}</p>
                  </div>
                )) : (
                  <div className="col-span-3 p-4 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-black text-primary">{calculationResult.value}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. Environmental Insights (Calculation Buttons) */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Environmental Insights
            </h2>
            <Card className="p-4 space-y-3">
              <Button variant="outline" onClick={() => setActiveModule('carbon-calc')} className="w-full justify-start gap-3 h-12 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                <Leaf className="w-4 h-4 text-emerald-500" />
                Calculate Carbon Emissions
              </Button>
              <Button variant="outline" onClick={() => setActiveModule('energy-calc')} className="w-full justify-start gap-3 h-12 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200">
                <Zap className="w-4 h-4 text-amber-500" />
                Calculate Energy Usage
              </Button>
              <Button variant="outline" onClick={() => setActiveModule('waste-calc')} className="w-full justify-start gap-3 h-12 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                <Wind className="w-4 h-4 text-red-500" />
                Calculate Waste Reduction
              </Button>
            </Card>

            {/* Role-specific Quick Actions */}
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Role Settings</h2>
            <Card className="p-6 bg-slate-900 text-white">
              <p className="text-sm text-slate-400 mb-4 font-semibold uppercase tracking-wider">Capabilities: {user?.role || 'Guest'}</p>
              
              {user?.role === 'Admin' && (
                <div className="space-y-3">
                  <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-between">
                    <span>Manage Buildings</span>
                    <LayoutDashboard className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 flex items-center justify-between">
                    <span>Generate Reports</span>
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {user?.role === 'Officer' && (
                <div className="space-y-3">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-between">
                    <span>Upload Env. Data</span>
                    <Wind className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800">Review Metrics</Button>
                </div>
              )}

              {user?.role === 'Faculty' && (
                <div className="space-y-3">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-between">
                    <span>Add Research Project</span>
                    <Award className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800">Resource Tracking</Button>
                </div>
              )}

              {user?.role === 'Student' && (
                <div className="space-y-3">
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 flex items-center justify-between">
                    <span>Join Initiatives</span>
                    <Users className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800">My Participation</Button>
                </div>
              )}

              {!user?.role && (
                <p className="text-xs text-slate-400 italic">Please log in to see your role-specific tools.</p>
              )}
              
              <p className="text-[10px] text-slate-500 italic mt-6 text-center border-t border-slate-800 pt-4">
                Powered by EcoTrack Sustainability Intelligence Engine v2.0
              </p>
            </Card>
          </div>

          {/* 6. Modules to Implement */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-2">
                 Interactive Analytics
                 {user?.role === 'Admin' && (
                   <div className="ml-auto flex gap-2">
                     <Button 
                       size="sm" 
                       variant="outline" 
                       className="border-primary text-primary hover:bg-primary/10"
                       onClick={() => window.open('/api/reports/csv', '_blank')}
                     >
                       <TrendingUp className="w-4 h-4 mr-2" />
                       CSV Report
                     </Button>
                     <Button 
                       size="sm" 
                       variant="default"
                       className="bg-primary hover:bg-primary/90"
                       onClick={() => window.open('/api/reports/pdf', '_blank')}
                     >
                       <Award className="w-4 h-4 mr-2" />
                       PDF Report
                     </Button>
                   </div>
                 )}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module) => (
                  <Card key={module.id} className="p-5 border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveModule(`${module.id}-calc`)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${module.color}`}>
                        <module.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{module.label}</h3>
                    <p className="text-xs text-slate-500 mt-1">{module.description}</p>
                    <Button variant="ghost" size="sm" className="mt-4 p-0 text-primary font-bold group-hover:translate-x-1 transition-transform">
                      Run Module Analysis →
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-12 mb-6">Real-Time Data Visualizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 shadow-sm border-slate-200">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  Carbon Emissions Overview
                </h3>
                <div className="h-[250px] flex flex-col items-center justify-center">
                   <p className="text-4xl font-black text-slate-800 mb-2">{analyticsData.carbonFootprint.toFixed(1)} <span className="text-sm font-normal text-slate-500">tons CO₂</span></p>
                   <p className="text-sm text-slate-500 mb-4">Total Campus Carbon Footprint</p>
                  <div className="w-full flex-1 min-h-0">
                    <Pie 
                      data={{
                        labels: ['Carbon Base', 'Reduction Target'],
                        datasets: [{
                          data: [analyticsData.carbonFootprint, Math.max(10, 100 - analyticsData.carbonFootprint)],
                          backgroundColor: ['#10b981', '#f1f5f9'],
                          borderWidth: 0
                        }]
                      }}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4 shadow-sm border-slate-200">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Energy Consumption Profile
                </h3>
                <div className="h-[250px] flex flex-col items-center justify-center">
                   <p className="text-4xl font-black text-amber-600 mb-2">{analyticsData.energyConsumption.toLocaleString()} <span className="text-sm font-normal text-amber-700/60">kWh</span></p>
                   <p className="text-sm text-slate-500 mb-4">Total Energy Consumed</p>
                  <div className="w-full flex-1">
                    <Bar 
                      data={{
                        labels: ['Energy Usage'],
                        datasets: [
                          { label: 'Total Grid Energy', data: [analyticsData.energyConsumption], backgroundColor: '#f59e0b' }
                        ]
                      }} 
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4 shadow-sm border-slate-200">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  Water Utilization
                </h3>
                <div className="h-[250px] flex flex-col justify-center items-center">
                  <p className="text-4xl font-black text-blue-600 mb-2">{analyticsData.waterUsage.toLocaleString()} <span className="text-sm font-normal text-blue-700/60">Liters</span></p>
                  <p className="text-sm text-slate-500 mb-4">Total Water Consumption</p>
                  <div className="w-full flex-1">
                    <Bar 
                      data={{
                        labels: ['Water Used'],
                        datasets: [
                          { label: 'Water Consumed', data: [analyticsData.waterUsage], backgroundColor: '#3b82f6' }
                        ]
                      }} 
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4 shadow-sm border-slate-200">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-slate-500" />
                  Waste Recycling Rate
                </h3>
                <div className="h-[250px] flex flex-col items-center justify-center relative">
                   <div className="absolute inset-0 flex items-center justify-center mt-6">
                      <p className="text-3xl font-black text-slate-800">{analyticsData.wasteRecyclingPercentage.toFixed(1)}%</p>
                   </div>
                  <Doughnut 
                    data={{
                      labels: ['Recycled', 'General Waste'],
                      datasets: [{
                        data: [analyticsData.wasteRecyclingPercentage, Math.max(0, 100 - analyticsData.wasteRecyclingPercentage)],
                        backgroundColor: ['#10b981', '#cbd5e1'],
                        borderWidth: 0
                      }]
                    }}
                    options={{ maintainAspectRatio: false, cutout: '75%' }}
                  />
                </div>
              </Card>
            </div>

            {/* Novel Features Mockup */}
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-12 mb-6">Innovative Campus Initiatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-5 border-emerald-200 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
                <h3 className="font-bold text-emerald-800 mb-2">AI Carbon Predictor</h3>
                <p className="text-sm text-slate-600 mb-3">Machine learning forecast for next month.</p>
                <div className="text-2xl font-black text-emerald-600">-12% <span className="text-sm font-normal">Expected</span></div>
              </Card>
              <Card className="p-5 border-blue-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
                <h3 className="font-bold text-blue-800 mb-2">Climate Leaderboard</h3>
                <p className="text-sm text-slate-600 mb-3">Top Department: Science</p>
                <div className="text-2xl font-black text-blue-600">8,500 <span className="text-sm font-normal">pts</span></div>
              </Card>
              <Card className="p-5 border-amber-200 shadow-sm bg-gradient-to-br from-amber-50 to-white">
                <h3 className="font-bold text-amber-800 mb-2">Student Green Credits</h3>
                <p className="text-sm text-slate-600 mb-3">Earned from participation.</p>
                <div className="text-2xl font-black text-amber-600">450 <span className="text-sm font-normal">Active Users</span></div>
              </Card>
              <Card className="p-5 border-purple-200 shadow-sm bg-gradient-to-br from-purple-50 to-white">
                <h3 className="font-bold text-purple-800 mb-2">Tree Monitoring</h3>
                <p className="text-sm text-slate-600 mb-3">Geo-tagged active campus trees.</p>
                <div className="text-2xl font-black text-purple-600">850 <span className="text-sm font-normal">Tracked</span></div>
              </Card>
            </div>

            {/* In-depth Modular Dashboards */}
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-16 mb-8">Departmental Modular Dashboards</h2>
            <div className="space-y-16">
              <EnergyDashboard />
              <div className="border-t border-slate-200 my-8"></div>
              <CarbonDashboard />
              <div className="border-t border-slate-200 my-8"></div>
              <WaterDashboard />
              <div className="border-t border-slate-200 my-8"></div>
              <WasteManagementDashboard />
              <div className="border-t border-slate-200 my-8"></div>
              <GreenCampusDashboard />
              <div className="border-t border-slate-200 my-8"></div>
              <ClimateResearchDashboard />
            </div>

          </div>
        </div>

        {/* Action Bar (Refined) */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white border-0 shadow-2xl overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-tighter">Sustainability Intelligence Engine</h2>
              <p className="text-emerald-100/70 max-w-xl">Deep dive into university environmental data to drive institutional change.</p>
            </div>
            <div className="flex gap-4">
              <Link to="/journey">
                <Button variant="outline" className="border-emerald-600 text-white hover:bg-emerald-900/50 px-8 py-7 rounded-2xl font-black">
                  EXPLORE DASHBOARD
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        </Card>
      </main>
    </div>
  );
}
