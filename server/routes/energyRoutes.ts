import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { 
  getEnergy, 
  postEnergy, 
  getEnergySummary, 
  getBuildingEnergy 
} from "../controllers/energyController";

export const energyRoutes = Router();

energyRoutes.get("/", getEnergy);
energyRoutes.post("/", authenticateToken, postEnergy);
energyRoutes.get("/summary", getEnergySummary);
energyRoutes.get("/buildings", getBuildingEnergy);
