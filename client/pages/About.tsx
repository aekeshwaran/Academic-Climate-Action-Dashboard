import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  MapPin, 
  FileText, 
  Target, 
  ArrowLeft 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
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
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">About EcoTrack</h1>
        
        <div className="space-y-8">
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Description</h2>
                <p className="text-slate-600 leading-relaxed">
                  EcoTrack is an advanced climate action dashboard designed for academic institutions. 
                  It provides a central hub for tracking, measuring, and reporting environmental impact 
                  across campus. By consolidating data on carbon emissions, energy consumption, and 
                  waste management, EcoTrack empowers decision-makers to implement effective 
                  sustainability strategies.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Location Information</h2>
                <p className="text-slate-600 mb-4">
                  EcoTrack is currently implemented at:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900">University Headquarters</p>
                  <p className="text-slate-600 italic">Global Sustainability Center, Suite 101, Science Park</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">License Information</h2>
                <p className="text-slate-600">
                  EcoTrack is released under the <strong>Academic Sustainability License (ASL) v1.0</strong>. 
                  This software is provided "as is" for use by educational institutions to promote 
                  environmental awareness and action.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Sustainability Goals</h2>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  <li>Achieve Net-Zero carbon emissions by 2030.</li>
                  <li>Transition to 100% renewable energy for all campus facilities.</li>
                  <li>Reduce campus-wide waste generation by 50% within five years.</li>
                  <li>Incorporate sustainability into 100% of academic departments.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
