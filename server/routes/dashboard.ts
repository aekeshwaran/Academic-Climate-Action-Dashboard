import { RequestHandler } from "express";
import { pool } from "../db";

export const handleDashboardData: RequestHandler = async (req, res) => {
  try {
    let energy_data: any[] = [];
    let carbon_data: any[] = [];
    let water_data: any[] = [];
    let waste_data: any[] = [];
    let trees_data: any[] = [];
    let programs_data: any[] = [];
    let score_data: any[] = [];

    try {
      const [r] = await pool.query("SELECT * FROM energy_usage ORDER BY created_at DESC LIMIT 10");
      energy_data = r as any[];
    } catch (_) {}

    try {
      const [r] = await pool.query("SELECT * FROM carbon_emissions ORDER BY created_at DESC LIMIT 10");
      carbon_data = r as any[];
    } catch (_) {}

    try {
      const [r] = await pool.query("SELECT * FROM water_management ORDER BY created_at DESC LIMIT 10");
      water_data = r as any[];
    } catch (_) {}

    try {
      const [r] = await pool.query("SELECT * FROM waste_management ORDER BY created_at DESC LIMIT 10");
      waste_data = r as any[];
    } catch (_) {}

    try {
      const [r] = await pool.query("SELECT * FROM tree_plantation ORDER BY created_at DESC LIMIT 10");
      trees_data = r as any[];
    } catch (_) {}

    try {
      const [r] = await pool.query("SELECT * FROM sustainability_programs ORDER BY created_at DESC LIMIT 10");
      programs_data = r as any[];
    } catch (_) {}

    try {
      const [r] = await pool.query("SELECT * FROM sustainability_scores ORDER BY created_at DESC LIMIT 1");
      score_data = r as any[];
    } catch (_) {}

    res.json({
      energy_data,
      carbon_data,
      water_data,
      waste_data,
      trees_data,
      programs_data,
      latest_score: score_data[0] || null,
      // Legacy fields for backward compatibility
      climate_data: carbon_data,
      emissions: carbon_data,
      energy_usage: energy_data,
      initiatives: programs_data,
      metrics: [],
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return empty but valid response instead of 500
    res.json({
      energy_data: [],
      carbon_data: [],
      water_data: [],
      waste_data: [],
      trees_data: [],
      programs_data: [],
      latest_score: null,
      climate_data: [],
      emissions: [],
      energy_usage: [],
      initiatives: [],
      metrics: [],
    });
  }
};
