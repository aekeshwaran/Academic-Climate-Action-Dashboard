import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Activity, Zap, Shield, AlertTriangle, Play, Pause, RefreshCw, 
  Cpu, Thermometer, Radio, ArrowUpRight, TrendingUp 
} from 'lucide-react';
import { MaglevSensorData, MaglevSystemState } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Custom Gauge Component
const RadialGauge = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const data = [
    { name: 'Value', value: value },
    { name: 'Remaining', value: 100 - value },
  ];
  return (
    <div className="relative flex flex-col items-center">
      <div className="h-32 w-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={45}
              outerRadius={60}
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill={color} />
              <Cell fill="#1e293b" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute top-16 text-center">
        <span className="text-2xl font-bold text-white">{value.toFixed(1)}%</span>
        <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
      </div>
    </div>
  );
};

const MaglevDashboard: React.FC = () => {
  const [dataHistory, setDataHistory] = useState<MaglevSensorData[]>([]);
  const [systemState, setSystemState] = useState<MaglevSystemState>({
    status: 'STABLE',
    stabilityScore: 98.5,
    aiOptimizationEnabled: true,
    predictedForce: 1250,
    actualForce: 1248,
  });
  const [targetForce, setTargetForce] = useState(1250);
  const [isConnected, setIsConnected] = useState(false);
  
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Start SSE stream
    const eventSource = new EventSource('/api/maglev/stream');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      toast.success("Real-time telemetry connected");
    };

    eventSource.onmessage = (event) => {
      const newData: MaglevSensorData = JSON.parse(event.data);
      setDataHistory(prev => [...prev.slice(-29), newData]);
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      setIsConnected(false);
      eventSource.close();
    };

    // Fetch initial state
    fetch('/api/maglev/state')
      .then(res => res.json())
      .then(setSystemState);

    return () => {
      eventSource.close();
    };
  }, []);

  const handleControl = async (type: string, value?: number) => {
    try {
      const res = await fetch('/api/maglev/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, targetForce: value || targetForce }),
      });
      const result = await res.json();
      if (result.success) {
        setSystemState(result.state);
        toast.info(`Command sent: ${type}`);
      }
    } catch (error) {
      toast.error("Failed to send command");
    }
  };

  const latestData = dataHistory[dataHistory.length - 1] || {
    acceleration: { x: 0, y: 0, z: 9.8 },
    magneticField: 1.2,
    temperature: 42,
    energyConsumption: 500,
    liftForce: 1248,
    gapDistance: 15,
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent italic">
            MAGLEV COMMAND CENTER
          </h1>
          <p className="text-slate-400 text-sm">Industrial Levitation Control & AI Optimization Interface</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-full border border-slate-800 backdrop-blur-md">
          <Badge className={cn(
            "px-3 py-1 rounded-full",
            isConnected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
          )}>
            <div className={cn("w-2 h-2 rounded-full mr-2", isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
            {isConnected ? "LIVE TELEMETRY" : "DISCONNECTED"}
          </Badge>
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 uppercase font-mono tracking-widest text-[10px]">
             Nodes: 04 ACTIVE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Column: Key Stats */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-slate-500 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> System Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadialGauge 
                value={systemState.stabilityScore} 
                label="Stability" 
                color={systemState.stabilityScore > 90 ? "#10b981" : "#f59e0b"} 
              />
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-800/40">
                  <p className="text-[10px] text-slate-500 uppercase">Temp</p>
                  <p className="text-lg font-bold text-slate-200">{latestData.temperature.toFixed(1)}°C</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/40">
                  <p className="text-[10px] text-slate-500 uppercase">Energy</p>
                  <p className="text-lg font-bold text-slate-200">{latestData.energyConsumption.toFixed(0)}W</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-slate-500 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" /> Power Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dataHistory}>
                    <defs>
                      <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="energyConsumption" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEnergy)" />
                  </AreaChart>
                </ResponsiveContainer>
               </div>
               <div className="flex justify-between items-center mt-2">
                 <span className="text-[10px] text-slate-500">CONSUMPTION RT</span>
                 <span className="text-xs font-mono text-blue-400 font-bold">{(latestData.energyConsumption / 1000).toFixed(2)} kW/h</span>
               </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xs uppercase text-slate-500">Control Interface</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">AI Optimization</span>
                  <Switch 
                    checked={systemState.aiOptimizationEnabled} 
                    onCheckedChange={(checked) => setSystemState({...systemState, aiOptimizationEnabled: checked})} 
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Continuous neural adjustments enabled for millisecond-level stability.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Target Lift Force</span>
                  <span className="text-xs font-mono text-cyan-400">{targetForce} N</span>
                </div>
                <Slider 
                  value={[targetForce]} 
                  min={500} 
                  max={2500} 
                  step={10} 
                  onValueChange={(val) => setTargetForce(val[0])}
                  onValueCommit={(val) => handleControl('ADJUST_FORCE', val[0])}
                  className="py-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" className="border-slate-800 text-xs h-8 bg-slate-800/20" onClick={() => handleControl('RECALIBRATE')}>
                  <RefreshCw className="w-3 h-3 mr-2" /> Recalibrate
                </Button>
                <Button variant="destructive" className="text-xs h-8 bg-red-500/20 hover:bg-red-500/40 border-red-500/20 text-red-400" onClick={() => handleControl('EMERGENCY_STOP')}>
                  <AlertTriangle className="w-3 h-3 mr-2" /> STOP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center/Right Column: Visualization & Detailed Charts */}
        <div className="md:col-span-3 space-y-6">
          {/* Main 3D Simulation / Hero Chart Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-[#0a0f1e] border-slate-800 overflow-hidden relative group">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
              <div className="absolute top-4 left-4 z-10">
                 <Badge variant="outline" className="bg-slate-900/80 backdrop-blur-sm border-slate-700 text-[10px]">
                   DIGITAL TWIN: ACTIVE SIMULATION
                 </Badge>
              </div>
              
              <CardContent className="h-[400px] flex items-center justify-center relative">
                {/* 3D Simulation Placeholder - Imagine a puck levitating */}
                <div className="relative">
                  {/* Outer Rings */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 -m-20 border border-cyan-500/10 rounded-full" 
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 -m-16 border border-blue-500/5 rounded-full" 
                  />
                  
                  {/* The Levitation "Puck" */}
                  <motion.div 
                    animate={{ 
                      y: [0, -10 * (latestData.gapDistance / 15), 0],
                      scale: [1, 1.02, 1],
                      filter: [
                        `drop-shadow(0 0 20px rgba(6, 182, 212, ${latestData.magneticField * 0.2}))`,
                        `drop-shadow(0 0 40px rgba(59, 130, 246, ${latestData.magneticField * 0.4}))`,
                        `drop-shadow(0 0 20px rgba(6, 182, 212, ${latestData.magneticField * 0.2}))`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-48 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl border border-slate-600 flex items-center justify-center relative z-10"
                  >
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Maglev Unit-01</span>
                  </motion.div>
                  
                  {/* Magnetic Flux Lines (Simulated) */}
                  <div className="absolute top-[40px] inset-x-0 flex justify-center gap-12 overflow-hidden pointer-events-none">
                    {[1,2,3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ 
                          height: [100, 140, 100],
                          opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-[1px] bg-gradient-to-b from-cyan-400 to-transparent"
                      />
                    ))}
                  </div>
                </div>

                {/* Overlay Telemetry */}
                <div className="absolute bottom-4 right-4 text-right font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800 backdrop-blur-sm">
                   <div className="text-[10px] text-slate-500">LIFT FORCE DELTA</div>
                   <div className={cn(
                     "text-lg font-bold",
                     Math.abs(latestData.liftForce - systemState.predictedForce) < 5 ? "text-emerald-400" : "text-amber-400"
                   )}>
                     {(latestData.liftForce - systemState.predictedForce).toFixed(2)} N
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase text-slate-500">Stability Vector</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis hide />
                    <YAxis domain={['auto', 'auto']} fontSize={10} stroke="#475569" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#94a3b8' }}
                    />
                    <Line type="monotone" dataKey="acceleration.z" stroke="#f59e0b" strokeWidth={2} dot={false} name="Z-Accel" />
                    <Line type="monotone" dataKey="magneticField" stroke="#06b6d4" strokeWidth={2} dot={false} name="Flux" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <div className="p-4 pt-0 border-t border-slate-800/50 mt-4">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 uppercase">Anomaly Detection</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                     <Play className="w-2 h-2 fill-emerald-400" /> NOMINAL
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" /> Forces: Predicted vs Actual
                </CardTitle>
                <CardDescription className="text-[10px] uppercase">Force response latency comparison</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dataHistory}>
                    <XAxis hide />
                    <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="liftForce" stroke="#06b6d4" fillOpacity={0.2} fill="#06b6d4" name="Actual" />
                    <Area type="monotone" dataKey="energyConsumption" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" name="Load" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xs uppercase text-slate-500 flex items-center justify-between">
                  <span>System Events</span>
                  <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    { time: 'T-0.5s', event: 'AI adjustment for magnetic drift', type: 'system' },
                    { time: 'T-2.1s', event: 'Gap distance maintained at 15mm', type: 'status' },
                    { time: 'T-5.4s', event: 'Control command: ADJUST_FORCE', type: 'user' },
                    { time: 'T-10s', event: 'Calibrating thermal threshold', type: 'system' }
                  ].map((e, i) => (
                    <div key={i} className="flex gap-3 text-[11px] items-start border-l border-slate-800 pl-3 py-1">
                      <span className="font-mono text-slate-500 whitespace-nowrap">{e.time}</span>
                      <span className={cn(
                        "font-medium",
                        e.type === 'system' ? "text-slate-300" : e.type === 'user' ? "text-cyan-400" : "text-slate-400"
                      )}>{e.event}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Simulation Overlay Comparison */}
      <AnimatePresence>
        {Math.abs(latestData.liftForce - systemState.predictedForce) > 20 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber-500/10 border border-amber-500/20 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-4 z-50"
          >
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping" />
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
              Performance Deviation Detected: {((latestData.liftForce / systemState.predictedForce - 1) * 100).toFixed(2)}%
            </span>
            <Button size="sm" variant="outline" className="h-7 text-[10px] bg-amber-500/20 border-amber-500/20 text-amber-500" onClick={() => handleControl('ADJUST_FORCE')}>
              RE-OPTIMIZE
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.1'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default MaglevDashboard;
