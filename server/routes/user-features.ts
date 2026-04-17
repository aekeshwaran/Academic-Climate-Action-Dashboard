import { RequestHandler } from "express";
import { pool } from "../db";

export const handleGetProjects: RequestHandler = async (_req, res) => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM projects");
    // If empty, return some defaults for demo
    if (rows.length === 0) {
      return res.json([
        { id: 1, title: "Tree Plantation", description: "Join us in planting 10,000 trees across the city.", category: "Nature", target_impact: "50 tons CO2/year", icon: "Leaf" },
        { id: 2, title: "Solar Adoption", description: "Helping households switch to solar energy.", category: "Energy", target_impact: "20% reduction in grid load", icon: "Zap" },
        { id: 3, title: "Zero Waste Initiative", description: "Community-led recycling and composting programs.", category: "Waste", target_impact: "30% less landfill waste", icon: "Wind" }
      ]);
    }
    res.json(rows);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleJoinProject: RequestHandler = async (req, res) => {
  const { userId, projectId } = req.body;

  if (!userId || !projectId) {
    return res.status(400).json({ error: "User ID and Project ID are required" });
  }

  try {
    // Check if already joined
    const [existing]: any = await pool.query("SELECT * FROM participants WHERE user_id = ? AND project_id = ?", [userId, projectId]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "You have already joined this project" });
    }

    await pool.query("INSERT INTO participants (user_id, project_id) VALUES (?, ?)", [userId, projectId]);
    
    // Update user progress (e.g., increase impact score)
    await pool.query(
      "INSERT INTO user_progress (user_id, metric_name, value) VALUES (?, 'projects_joined', 1) ON DUPLICATE KEY UPDATE value = value + 1",
      [userId]
    );

    res.json({ message: "Successfully joined project!" });
  } catch (error) {
    console.error("Error joining project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleGetUserProgress: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows]: any = await pool.query("SELECT * FROM user_progress WHERE user_id = ?", [userId]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
