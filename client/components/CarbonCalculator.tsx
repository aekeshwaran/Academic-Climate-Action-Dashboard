import React, { useState } from 'react';
import { Calculator, Zap, Wind, TrendingUp, Info } from 'lucide-react';

export default function CarbonCalculator() {
  const [electricity, setElectricity] = useState<string>('');
  const [emissionFactor] = useState(0.85); // 1 kWh = 0.85 kg CO2

  const electricityNum = parseFloat(electricity) || 0;
  const carbonKg = electricityNum * emissionFactor;
  const carbonTons = carbonKg / 1000;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800">Carbon Footprint Calculator</h3>
          <p className="text-xs text-slate-400 font-medium">Estimate emissions based on institutional electricity consumption</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
              Electricity Usage (kWh)
            </label>
            <div className="relative">
              <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
              <input
                type="number"
                value={electricity}
                onChange={(e) => setElectricity(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              Academic institutions use the standard emission factor of <span className="font-bold">0.85 kg CO₂ per kWh</span> for grid electricity calculations.
            </p>
          </div>
        </div>

        {/* Result Section */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wind className="w-24 h-24" />
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Estimated Footprint</p>
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-4xl font-black">{carbonKg.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h2>
            <span className="text-lg font-bold text-slate-400">kg CO₂</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">In Metric Tons</p>
              <p className="text-xl font-black text-emerald-400">{carbonTons.toFixed(4)} t</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">Equivalent Trees</p>
              <p className="text-xl font-black text-teal-400">{Math.ceil(carbonKg / 22)} 🌳</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>Based on IPCC emission standards</span>
          </div>
        </div>
      </div>
    </div>
  );
}
