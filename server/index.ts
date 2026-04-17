import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleDashboardData } from "./routes/dashboard";
import { handleGetUsers, handlePostUser } from "./routes/users";
import { handleGetEmissions, handlePostClimateData } from "./routes/climate";
import { handleJoinInitiative } from "./routes/participation";
import { handleRegister, handleLogin } from "./routes/auth";
import { handleGetProjects, handleJoinProject, handleGetUserProgress } from "./routes/user-features";
import { getEnergy, postEnergy, getWater, postWater, getCarbon, postCarbon, getWaste, postWaste, getTrees, postTrees, getPrograms, postPrograms, getResearch, postResearch } from "./routes/api";
import connectDB from './config/db';
import climateRoutes from './routes/climateRoutes';
import { getAnalytics, downloadCSV, downloadPDF } from "./routes/reports";
import { authenticateToken } from "./middleware/auth";
import { 
  calculateCarbon, 
  calculateEnergy, 
  calculateWater,
  calculateWaste, 
  calculateActivities,
  calculateResearch,
  getOverallScore,
  calculateParticipants,
  getParticipants,
  manageBuildings,
  uploadEnvironmentalData,
  addResearchProject
} from "./routes/sustainability";
import { authRoutes } from "./routes/authRoutes";
import { energyRoutes } from "./routes/energyRoutes";
import { carbonRoutes } from "./routes/carbonRoutes";
import { waterRoutes } from "./routes/waterRoutes";
import { wasteRoutes } from "./routes/wasteRoutes";
import { register, login } from "./controllers/authController";
import { getInsights } from "./routes/insights";
import { errorHandler } from "./middleware/error";
import { handleGetMaglevData, handleGetMaglevState, handlePostMaglevControl, handleMaglevStream } from "./routes/maglev";

export function createServer() {
  const app = express();

  // Connect to MongoDB
  connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/dashboard", handleDashboardData);
  app.get("/api/emissions", handleGetEmissions);
  
  // Climate Data REST API (MongoDB backed)
  app.use("/api/data", climateRoutes);
  
  app.post("/api/join-initiative", handleJoinInitiative);
  app.get("/api/users", handleGetUsers);
  app.post("/api/users", handlePostUser);

  // Auth APIs
  app.use("/api/auth", authRoutes);
  
  // Keep legacy endpoints for frontend compatibility if needed, or update frontend. 
  // Let's assume frontend calls /api/login and /api/register directly for now.
  app.post("/api/register", register);
  app.post("/api/login", login);

  // New Modular APIs
  app.use("/api/energy", energyRoutes);
  app.use("/api/carbon", carbonRoutes);
  app.use("/api/water", waterRoutes);
  app.use("/api/waste", wasteRoutes);

  // Trees APIs
  app.get("/api/trees", getTrees);
  app.post("/api/trees", authenticateToken, postTrees);

  // Programs APIs
  app.get("/api/programs", getPrograms);
  app.post("/api/programs", authenticateToken, postPrograms);

  // Research APIs
  app.get("/api/research", getResearch);
  app.post("/api/research", authenticateToken, postResearch);

  // Activities APIs (Alias for legacy or specific requests)
  app.get("/api/activities", getPrograms);
  app.post("/api/activities", authenticateToken, postPrograms);

  // Reports & Analytics APIs
  app.get("/api/analytics", getAnalytics);
  app.get("/api/reports/csv", downloadCSV);
  app.get("/api/reports/pdf", downloadPDF);

  // Sustainability Calculation Routes (Updated to POST for inputs)
  app.post("/api/calculate/carbon", calculateCarbon);
  app.post("/api/calculate/energy", calculateEnergy);
  app.post("/api/calculate/water", calculateWater);
  app.post("/api/calculate/waste", calculateWaste);
  app.post("/api/calculate/activities", calculateActivities);
  app.post("/api/calculate/research", calculateResearch);
  app.post("/api/calculate/participants", calculateParticipants);
  app.get("/api/participants", getParticipants);
  app.get("/api/sustainability/score", getOverallScore);

  // AI Insights APIs
  app.get("/api/insights", getInsights);

  // Role-specific Routes
  app.post("/api/admin/buildings", manageBuildings);
  app.post("/api/officer/data", uploadEnvironmentalData);
  app.post("/api/faculty/research", addResearchProject);

  // Maglev System APIs
  app.get("/api/maglev/data", handleGetMaglevData);
  app.get("/api/maglev/state", handleGetMaglevState);
  app.post("/api/maglev/control", handlePostMaglevControl);
  app.get("/api/maglev/stream", handleMaglevStream);

  // Global Error Handling Middleware
  app.use(errorHandler);

  return app;
}
