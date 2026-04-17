import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Leaf, 
  Wind, 
  Zap, 
  Droplets, 
  Play, 
  Pause, 
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Journey() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (active && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 0.5, 100));
      }, 100);
    } else if (progress >= 100) {
      setActive(false);
    }
    return () => clearInterval(interval);
  }, [active, progress]);

  const resetJourney = () => {
    setProgress(0);
    setActive(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">EcoTrack</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Start Your Journey</h1>
          <p className="text-slate-600">
            Simulate your institution's progress toward carbon neutrality. 
            Activate the simulation to see real-time impact tracking.
          </p>
        </div>

        <Card className="p-8 mb-8 border-2 border-primary/20 bg-white">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Overall Progress</span>
              <span className="text-4xl font-black text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-4 bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Renewable Energy", icon: Zap, color: "text-amber-500", weight: 0.8 },
              { label: "Waste Reduction", icon: Wind, color: "text-blue-500", weight: 0.6 },
              { label: "Water Conservation", icon: Droplets, color: "text-teal-500", weight: 0.4 },
            ].map((item, idx) => {
              const Icon = item.icon;
              const itemProgress = Math.min(progress * (1 + (item.weight - 0.5)), 100);
              return (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span className="font-bold text-slate-800 text-sm">{item.label}</span>
                  </div>
                  <Progress value={itemProgress} className="h-1.5" />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!active ? (
              <Button 
                onClick={() => setActive(true)} 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-2xl text-lg font-bold"
                disabled={progress >= 100}
              >
                <Play className="w-5 h-5 mr-2" />
                {progress > 0 ? "Resume Journey" : "Begin Simulation"}
              </Button>
            ) : (
              <Button 
                onClick={() => setActive(false)} 
                variant="outline"
                className="border-slate-300 text-slate-700 px-8 py-6 rounded-2xl text-lg font-bold"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}
            <Button 
              onClick={resetJourney} 
              variant="ghost" 
              className="px-8 py-6 rounded-2xl text-lg font-bold text-slate-500 hover:text-slate-900"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </Card>

        {progress >= 100 && (
          <div className="bg-green-100 border border-green-200 p-6 rounded-2xl text-center animate-bounce">
            <h3 className="text-xl font-bold text-green-800 mb-2">Journey Complete!</h3>
            <p className="text-green-700">Congratulations! You've achieved carbon neutrality in this simulation.</p>
          </div>
        )}
      </main>
    </div>
  );
}
