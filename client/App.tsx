import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// Configure axios for production API
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "";

// Public pages (keep static if needed quickly, but lazy loading is better)
const Index = lazy(() => import("./pages/Index"));
const Initiatives = lazy(() => import("./pages/Initiatives"));
const Resources = lazy(() => import("./pages/Resources"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));

// Old standalone pages (public access)
const Reports = lazy(() => import("./pages/Reports"));

// New sidebar-layout protected pages
const MainDashboard = lazy(() => import("./pages/MainDashboard"));
const EnergyMonitoring = lazy(() => import("./pages/EnergyMonitoring"));
const CarbonTracker = lazy(() => import("./pages/CarbonTracker"));
const WaterManagement = lazy(() => import("./pages/WaterManagement"));
const WasteManagement = lazy(() => import("./pages/WasteManagement"));
const GreenActivities = lazy(() => import("./pages/GreenActivities"));
const ResearchTracker = lazy(() => import("./pages/ResearchTracker"));
const UsersAndRoles = lazy(() => import("./pages/UsersAndRoles"));
const SustainabilityInsights = lazy(() => import("./pages/SustainabilityInsights"));
const EnvironmentalImpactMonitoring = lazy(() => import("./pages/EnvironmentalImpactMonitoring"));
const ClimateActionDashboard = lazy(() => import("./pages/ClimateActionDashboard"));
const MaglevDashboard = lazy(() => import("./pages/MaglevDashboard"));

// Legacy protected pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Journey = lazy(() => import("./pages/Journey"));
const Profile = lazy(() => import("./pages/Profile"));



// Loading Fallback Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-slate-500 animate-pulse">Loading modules...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();



const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("user") === "loggedIn";
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Root: redirect to /login if not authenticated, /dashboard if authenticated
const RootRedirect = () => {
  const isLoggedIn = localStorage.getItem("user") === "loggedIn";
  return <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Root — always go to /login first */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/home" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/initiatives" element={<Initiatives />} />
            <Route path="/projects" element={<Initiatives />} />
            <Route path="/resources" element={<Resources />} />

            {/* Public (no auth required) — standalone layout */}
            <Route path="/reports" element={<Reports />} />

            {/* Protected — New sidebar dashboard routes */}
            <Route path="/dashboard" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />
            <Route path="/energy-monitoring" element={<ProtectedRoute><EnergyMonitoring /></ProtectedRoute>} />
            <Route path="/carbon-tracker" element={<ProtectedRoute><CarbonTracker /></ProtectedRoute>} />
            <Route path="/water-management" element={<ProtectedRoute><WaterManagement /></ProtectedRoute>} />
            <Route path="/waste-management" element={<ProtectedRoute><WasteManagement /></ProtectedRoute>} />
            <Route path="/green-activities" element={<ProtectedRoute><GreenActivities /></ProtectedRoute>} />
            <Route path="/research-tracker" element={<ProtectedRoute><ResearchTracker /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UsersAndRoles /></ProtectedRoute>} />
            <Route path="/environmental-impact" element={<ProtectedRoute><EnvironmentalImpactMonitoring /></ProtectedRoute>} />
            <Route path="/sustainability-insights" element={<ProtectedRoute><SustainabilityInsights /></ProtectedRoute>} />
            <Route path="/climate-dashboard" element={<ProtectedRoute><ClimateActionDashboard /></ProtectedRoute>} />
            <Route path="/maglev-dashboard" element={<ProtectedRoute><MaglevDashboard /></ProtectedRoute>} />

            {/* Legacy protected routes */}
            <Route path="/legacy-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/journey" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
