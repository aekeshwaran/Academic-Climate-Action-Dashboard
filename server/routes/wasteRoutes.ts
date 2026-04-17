import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getWaste, postWaste } from "../controllers/wasteController";

export const wasteRoutes = Router();

wasteRoutes.get("/", getWaste);
wasteRoutes.post("/", authenticateToken, postWaste);
