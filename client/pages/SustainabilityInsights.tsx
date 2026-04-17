import DashboardLayout from "../components/DashboardLayout";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight,
  Zap,
  Droplets,
  Wind,
  Recycle,
  Sparkles
} from "lucide-react";

interface Insight {
  id: number;
  type: string;
  message: string;
  impact_level: 'Low' | 'Medium' | 'High';
  action_suggested: string;
  created_at: string;
}

export default function SustainabilityInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      setInsights(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const filteredInsights = filter === "All" 
    ? insights 
    : insights.filter(i => i.impact_level === filter);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'energy': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'water': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'carbon': return <Wind className="w-5 h-5 text-emerald-500" />;
      case 'waste': return <Recycle className="w-5 h-5 text-purple-500" />;
      default: return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <DashboardLayout title="AI Sustainability Insights ✨">
      <div className="max-w-5xl mx-auto py-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 mb-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-primary-foreground mb-4 backdrop-blur-md">
                <Sparkles className="w-3 h-3" />
                Powered by Smart Analytics
              </div>
              <h1 className="text-3xl font-black mb-2">Campus Optimization Recommendations</h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                Our AI analyzes campus resource consumption patterns to suggest high-impact actions for environmental score improvement.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={fetchInsights}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <RefreshCw className={`w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -ml-32 -mb-32" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          {["All", "High", "Medium", "Low"].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border ${
                filter === level 
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
                : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
              }`}
            >
              {level} Impact
            </button>
          ))}
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-200">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Analyzing campus data...</p>
              </div>
            ) : filteredInsights.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-20" />
                <p className="text-slate-500 font-bold">No insights matches your filter.</p>
              </div>
            ) : (
              filteredInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="p-4 rounded-2xl bg-slate-50 group-hover:bg-primary/5 transition-colors">
                      {getIcon(insight.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider border ${getImpactColor(insight.impact_level)}`}>
                          {insight.impact_level} Impact
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {new Date(insight.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-black text-slate-800 mb-2 truncate">
                        {insight.message}
                      </h3>
                      
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold text-primary uppercase">Action Suggested</span>
                        </div>
                        <p className="text-slate-600 font-medium">
                          {insight.action_suggested}
                        </p>
                      </div>
                    </div>
                    
                    <button className="self-center p-4 rounded-full bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Stats Card */}
        {!loading && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-3xl text-white shadow-lg">
              <TrendingUp className="w-8 h-8 mb-4 opacity-80" />
              <h4 className="text-3xl font-black">15%</h4>
              <p className="text-indigo-100 text-sm font-bold uppercase tracking-wide">Potential Carbon Reduction</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-3xl text-white shadow-lg">
              <Zap className="w-8 h-8 mb-4 opacity-80" />
              <h4 className="text-3xl font-black">1.2k</h4>
              <p className="text-emerald-100 text-sm font-bold uppercase tracking-wide">Monthly kWh Savings</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl text-white shadow-lg">
              <AlertTriangle className="w-8 h-8 mb-4 text-amber-500" />
              <h4 className="text-3xl font-black">2</h4>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wide">Critical System Latencies</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
