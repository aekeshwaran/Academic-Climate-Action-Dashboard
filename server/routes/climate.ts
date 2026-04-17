import { RequestHandler } from "express";
import { pool } from "../db";

export const handleGetEmissions: RequestHandler = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM emissions ORDER BY recorded_at DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching emissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handlePostClimateData: RequestHandler = async (req, res) => {
  const { region, data_value, data_type, recorded_at } = req.body;
  if (!region || !data_value || !data_type) {
    return res.status(400).json({ error: "Region, data_value, and data_type are required" });
  }

  try {
    await pool.query(
      "INSERT INTO climate_data (region, data_value, data_type, recorded_at) VALUES (?, ?, ?, ?)",
      [region, data_value, data_type, recorded_at || new Date()]
    );
    res.status(201).json({ message: "Climate data recorded successfully" });
  } catch (error) {
    console.error("Error recording climate data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
