import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Resources() {
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
                to="/"
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/initiatives"
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                Initiatives
              </Link>
              <Link
                to="/reports"
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                Reports
              </Link>
              <Link
                to="/resources"
                className="text-sm font-medium text-primary transition-colors"
              >
                Resources
              </Link>
            </nav>
            <Button className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
          Learning Resources
        </h1>
        <Card className="max-w-2xl mx-auto p-12 border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="space-y-6">
            <p className="text-lg text-slate-600">
              This page is ready to provide educational materials and resources
              for your community to learn about climate action.
            </p>
            <p className="text-slate-600">
              Tell us what resources you'd like to feature:
            </p>
            <ul className="text-left space-y-2 text-slate-600 max-w-sm mx-auto">
              <li>• Climate change educational guides</li>
              <li>• How-to articles and tutorials</li>
              <li>• Video content and webinars</li>
              <li>• Case studies from other institutions</li>
              <li>• Tools and calculators</li>
            </ul>
            <p className="text-sm text-slate-500 italic">
              Continue chatting with the assistant to build this page with
              specific features!
            </p>
          </div>
        </Card>
        <div className="mt-8">
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Back to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
