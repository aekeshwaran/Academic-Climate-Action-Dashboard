import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { 
  getCarbon, 
  postCarbon, 
  getCarbonTotals, 
  getCarbonTrends 
} from "../controllers/carbonController";

export const carbonRoutes = Router();

carbonRoutes.get("/", getCarbon);
carbonRoutes.post("/", authenticateToken, postCarbon);
carbonRoutes.get("/total", getCarbonTotals);
carbonRoutes.get("/trends", getCarbonTrends);
