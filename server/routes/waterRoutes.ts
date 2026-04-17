import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { 
  getWater, 
  postWater, 
  getWaterSummary, 
  getWaterLeaks, 
  getWaterTrends, 
  getBuildingWater 
} from "../controllers/waterController";

export const waterRoutes = Router();

waterRoutes.get("/", getWater);
waterRoutes.post("/", authenticateToken, postWater);
waterRoutes.get("/summary", getWaterSummary);
waterRoutes.get("/leaks", getWaterLeaks);
waterRoutes.get("/trends", getWaterTrends);
waterRoutes.get("/buildings", getBuildingWater);
