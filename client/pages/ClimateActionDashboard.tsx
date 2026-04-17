import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Thermometer, Wind, Zap, Droplets, Plus, Trash2, 
  AlertTriangle, Lightbulb, CheckCircle, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { RecordButton } from '@/components/RecordButton';
import { Loader2 } from 'lucide-react';

interface ClimateData {
  _id: string;
  temperature: number;
  carbonEmission: number;
  energyUsage: number;
  waterUsage: number;
  timestamp: string;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const ClimateActionDashboard: React.FC = () => {
  const [data, setData] = useState<ClimateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  
  // Admin logic
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : { role: "user" };
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [formData, setFormData] = useState({
    temperature: '',
    carbonEmission: '',
    energyUsage: '',
    waterUsage: ''
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch climate data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const t = parseFloat(formData.temperature);
    const c = parseFloat(formData.carbonEmission);
    const e_usage = parseFloat(formData.energyUsage);
    const w = parseFloat(formData.waterUsage);

    if (isNaN(t) || t < -50 || t > 60) {
      toast.error('Please enter a valid temperature (-50 to 60°C)');
      return;
    }
    if (isNaN(c) || c < 0) {
      toast.error('Carbon emission must be a non-negative number');
      return;
    }
    if (isNaN(e_usage) || e_usage < 0) {
      toast.error('Energy usage must be a non-negative number');
      return;
    }
    if (isNaN(w) || w < 0) {
      toast.error('Water usage must be a non-negative number');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        temperature: t,
        carbonEmission: c,
        energyUsage: e_usage,
        waterUsage: w,
        hasRecording: !!mediaBlob
      };

      // In a real app we'd upload the mediaBlob here too
      // if (mediaBlob) { await uploadMedia(mediaBlob); }

      await axios.post('/api/data', payload);
      toast.success('Climate data and metrics archived successfully');
      setFormData({ temperature: '', carbonEmission: '', energyUsage: '', waterUsage: '' });
      setMediaBlob(null);
      fetchData();
    } catch (error) {
      console.error('Error adding data:', error);
      toast.error('Critical failure: Could not synchronize data with backend');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`/api/data/${id}`);
      toast.success('Data deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Failed to delete data');
    }
  };

  // Logic-based insights
  const getInsights = () => {
    if (data.length === 0) return [];
    const latest = data[0];
    const insights = [];

    if (latest.energyUsage > 500) {
      insights.push({
        type: 'warning',
        title: 'High Energy Usage Detected',
        message: 'Energy consumption is above the recommended threshold. Consider optimizing HVAC systems.',
        icon: AlertTriangle,
        color: 'text-amber-600 bg-amber-50 border-amber-200'
      });
    }

    if (latest.carbonEmission > 100) {
      insights.push({
        type: 'solution',
        title: 'Carbon Reduction Suggestion',
        message: 'Carbon emissions are increasing. Transitioning to renewable energy sources like solar can reduce impact by 40%.',
        icon: Lightbulb,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
      });
    }

    if (latest.waterUsage > 1000) {
      insights.push({
        type: 'info',
        title: 'Water Conservation Alert',
        message: 'Water usage is peaking. Check for leaks in the primary distribution lines.',
        icon: Droplets,
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      });
    }

    return insights;
  };

  const formatChartData = () => {
    return [...data].reverse().map(item => ({
      ...item,
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  };

  const pieData = data.length > 0 ? [
    { name: 'Latest Emission', value: data[0].carbonEmission },
    { name: 'Average Emission', value: data.reduce((acc, curr) => acc + curr.carbonEmission, 0) / data.length }
  ] : [];

  return (
    <DashboardLayout title="Academic Climate Action Dashboard">
      <div className="space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data[0]?.temperature || '--'}°C</div>
              <p className="text-xs text-muted-foreground">Current Campus Temp</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Carbon Emission</CardTitle>
              <Wind className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data[0]?.carbonEmission || '--'} tons</div>
              <p className="text-xs text-muted-foreground">Latest CO2 output</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
              <Zap className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data[0]?.energyUsage || '--'} kWh</div>
              <p className="text-xs text-muted-foreground">Total consumption</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
              <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data[0]?.waterUsage || '--'} L</div>
              <p className="text-xs text-muted-foreground">Daily usage</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Collection Form - Admin Only */}
          {isAdmin ? (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Add Climate Data
                </CardTitle>
                <CardDescription>Input new environmental metrics for tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input 
                      id="temperature" 
                      name="temperature" 
                      type="number" 
                      step="0.1"
                      placeholder="25.5" 
                      value={formData.temperature} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbonEmission">Carbon Emission (Tons)</Label>
                    <Input 
                      id="carbonEmission" 
                      name="carbonEmission" 
                      type="number" 
                      placeholder="12.4" 
                      value={formData.carbonEmission} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="energyUsage">Energy Usage (kWh)</Label>
                    <Input 
                      id="energyUsage" 
                      name="energyUsage" 
                      type="number" 
                      placeholder="450" 
                      value={formData.energyUsage} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waterUsage">Water Usage (L)</Label>
                    <Input 
                      id="waterUsage" 
                      name="waterUsage" 
                      type="number" 
                      placeholder="800" 
                      value={formData.waterUsage} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 pb-4">
                    <Label className="block text-center mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Audio Testimony / Verification</Label>
                    <RecordButton 
                      type="audio" 
                      onRecordingComplete={(blob) => setMediaBlob(blob)} 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-2xl bg-primary hover:bg-emerald-600 shadow-lg text-sm font-black uppercase tracking-widest"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </div>
                    ) : "Record Details"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="lg:col-span-1 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
               <CardHeader>
                 <CardTitle className="text-emerald-800">Welcome, Student/Faculty!</CardTitle>
                 <CardDescription className="text-emerald-600">You are viewing real-time campus climate data.</CardDescription>
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-emerald-700 font-medium">Monitoring campus sustainability metrics helps our institution reach net-zero goals. Check back regularly for updates.</p>
                 <div className="mt-4 p-3 bg-white/50 rounded-lg border border-emerald-200 text-[11px] font-bold text-emerald-800 uppercase tracking-widest text-center italic">
                   "Action is the antidote to climate anxiety."
                 </div>
               </CardContent>
            </Card>
          )}

          {/* Insights & Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Actionable Insights
              </CardTitle>
              <CardDescription>AI-driven recommendations based on recent data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getInsights().length > 0 ? getInsights().map((insight, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border flex gap-4 ${insight.color}`}>
                    <div className="mt-1">
                      <insight.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider">{insight.title}</h4>
                      <p className="text-sm opacity-90">{insight.message}</p>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground italic">
                    <CheckCircle className="h-10 w-10 mb-2 text-emerald-500 opacity-20" />
                    <p>Metrics are currently within normal ranges. No immediate actions required.</p>
                  </div>
                )}

                {/* Sustainability Tips */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Sustainability Awareness
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Switch off unused lights and computers",
                      "Optimize air conditioning temperature to 24°C",
                      "Ensure water taps are fully closed",
                      "Support internal campus greening initiatives",
                      "Reduce paper usage by going digital",
                      "Use renewable energy sources wherever possible"
                    ].map((tip, i) => (
                      <li key={i} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-600 flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Visualization Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Temperature Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Energy Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Energy Usage Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatChartData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="energyUsage" name="Energy (kWh)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Carbon Emission Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Carbon Emission Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Data Management Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Recent Records (Admin)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-widest">
                      <th className="px-4 py-3 text-left">Time</th>
                      <th className="px-4 py-3 text-right">Temp</th>
                      <th className="px-4 py-3 text-right">Carbon</th>
                      <th className="px-4 py-3 text-right">Energy</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.slice(0, 5).map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-600">{new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td className="px-4 py-3 text-right font-medium">{item.temperature}°</td>
                        <td className="px-4 py-3 text-right font-medium">{item.carbonEmission}t</td>
                        <td className="px-4 py-3 text-right font-medium">{item.energyUsage}k</td>
                        <td className="px-4 py-3 text-right">
                          {isAdmin && (
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(item._id)} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 h-auto">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClimateActionDashboard;
