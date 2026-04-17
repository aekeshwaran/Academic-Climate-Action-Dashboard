import { RequestHandler } from "express";
import { pool } from "../db";

const FACTORS = {
  ELECTRICITY: 0.82, // kg CO2 per kWh
  PETROL: 2.31,      // kg CO2 per liter
  DIESEL: 2.68       // kg CO2 per liter
};

// Helper: Update Overall Score
async function updateOverallScore() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const [energy]: any = await pool.query("SELECT * FROM energy_usage ORDER BY created_at DESC LIMIT 1");
    const [carbon]: any = await pool.query("SELECT SUM(emission_tons) as total_c FROM carbon_emissions WHERE month=? AND year=?", [month, year]);
    const [water]: any = await pool.query("SELECT * FROM water_management ORDER BY created_at DESC LIMIT 1");
    const [waste]: any = await pool.query("SELECT * FROM waste_management ORDER BY created_at DESC LIMIT 1");

    const eScore = energy[0] ? (Number(energy[0].solar_kwh) / Math.max(Number(energy[0].electricity_kwh), 1)) * 100 : 0;
    const totalCarbon = carbon[0]?.total_c ? Number(carbon[0].total_c) : 1000;
    const cScore = Math.max(0, Math.min(100, 100 - (totalCarbon / 100)));
    const wScore = water[0] ? (Number(water[0].rainwater_harvested_liters) / Math.max(Number(water[0].daily_consumption_liters), 1)) * 100 : 0;
    
    let wsScore = 0;
    if (waste[0]) {
      const wTotal = Number(waste[0].plastic_kg) + Number(waste[0].organic_kg) + Number(waste[0].paper_kg) + Number(waste[0].e_waste_kg);
      wsScore = (Number(waste[0].recycled_kg) / Math.max(wTotal, 1)) * 100;
    }

    const overallScore = (eScore + cScore + wScore + wsScore) / 4;

    await pool.query(
      "INSERT INTO sustainability_scores (score, period_month, period_year, energy_subscore, carbon_subscore, water_subscore, waste_subscore) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [overallScore, month, year, eScore, cScore, wScore, wsScore]
    );
  } catch (error) {
    console.error("Failed to update overall score:", error);
  }
}

export const calculateEnergy: RequestHandler = async (req, res) => {
  try {
    const { electricity = 0, solar = 0, building_name = 'Campus', userId = 1 } = req.body;
    const percentage = electricity > 0 ? (Number(solar) / Number(electricity)) * 100 : 0;
    const efficiencyScore = Math.min(100, (percentage * 0.8) + 20);

    await pool.query(
      "INSERT INTO energy_usage (building_name, user_id, electricity_kwh, solar_kwh, savings_percentage, month, year) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [building_name, userId, electricity, solar, percentage, (new Date().getMonth() + 1).toString(), new Date().getFullYear()]
    );

    await updateOverallScore();

    res.json({
      title: "Energy Monitoring Analysis",
      type: "energy-monitor-detail",
      data: {
        totalEnergy: Number(electricity),
        renewableEnergy: Number(solar),
        percentage,
        score: efficiencyScore
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Energy calculation failed" });
  }
};

export const calculateCarbon: RequestHandler = async (req, res) => {
  try {
    const { electricity = 0, transport = 0, diesel = 0 } = req.body;
    
    const eEmis = (Number(electricity) * FACTORS.ELECTRICITY) / 1000;
    const tEmis = (Number(transport) * FACTORS.PETROL) / 1000;
    const dEmis = (Number(diesel) * FACTORS.DIESEL) / 1000;
    const total = eEmis + tEmis + dEmis;
    const reduction = total * 0.1;
    const score = Math.max(0, 100 - (total / 100));

    const monthStr = (new Date().getMonth() + 1).toString();
    const curYear = new Date().getFullYear();

    await pool.query("INSERT INTO carbon_emissions (source, emission_tons, month, year) VALUES (?, ?, ?, ?)", ['Electricity', eEmis, monthStr, curYear]);
    await pool.query("INSERT INTO carbon_emissions (source, emission_tons, month, year) VALUES (?, ?, ?, ?)", ['Transport', tEmis, monthStr, curYear]);
    await pool.query("INSERT INTO carbon_emissions (source, emission_tons, month, year) VALUES (?, ?, ?, ?)", ['Diesel', dEmis, monthStr, curYear]);

    await updateOverallScore();

    res.json({
      title: "Carbon Emission Analysis",
      type: "carbon-detail",
      data: {
        electricity: eEmis,
        diesel: dEmis,
        transport: tEmis,
        total,
        reduction,
        score
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Carbon calculation failed" });
  }
};

export const calculateWater: RequestHandler = async (req, res) => {
  try {
    const { consumption = 0, rainwater = 0, recycled = 0, building_name = 'Campus' } = req.body;
    const rate = consumption > 0 ? (Number(rainwater) / Number(consumption)) * 100 : 0;

    await pool.query(
      "INSERT INTO water_management (building_name, daily_consumption_liters, rainwater_harvested_liters, groundwater_used_liters, leak_detected, date) VALUES (?, ?, ?, ?, ?, ?)",
      [building_name, consumption, rainwater, recycled, false, new Date()]
    );

    await updateOverallScore();

    res.json({
      title: "Water Management Analysis",
      type: "water-detail",
      data: {
        totalUsed: Number(consumption),
        saved: Number(rainwater),
        rate
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Water calculation failed" });
  }
};

export const calculateWaste: RequestHandler = async (req, res) => {
  try {
    const { plastic = 0, organic = 0, paper = 0, e_waste = 0, recycled = 0, userId = 1 } = req.body;
    const total = Number(plastic) + Number(organic) + Number(paper) + Number(e_waste);
    const recyclingRate = total > 0 ? (Number(recycled) / total) * 100 : 0;
    const organicRate = total > 0 ? (Number(organic) / total) * 100 : 0;

    await pool.query(
      "INSERT INTO waste_management (user_id, month, year, plastic_kg, organic_kg, paper_kg, e_waste_kg, recycled_kg) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, (new Date().getMonth() + 1).toString(), new Date().getFullYear(), plastic, organic, paper, e_waste, recycled]
    );

    await updateOverallScore();

    res.json({
      title: "Waste Management Analysis",
      type: "waste-detail-new",
      data: {
        recycled: Number(recycled),
        organic: Number(organic),
        recyclingRate,
        organicRate
      }
    });
  } catch (error) {
    console.error("Waste calculation error:", error);
    res.status(500).json({ error: "Waste calculation failed" });
  }
};

export const calculateActivities: RequestHandler = async (req, res) => {
  try {
    const { trees = 0, events = 0, participants = 0, userId = 1 } = req.body;
    const score = (Number(trees) * 2) + Number(events) + Number(participants);

    await pool.query(
      "INSERT INTO green_events (title, participants_count, user_id, date) VALUES (?, ?, ?, ?)",
      [`Green Activity Set`, Number(participants), userId, new Date()]
    );

    res.json({
      title: "Green Campus Activities Analysis",
      type: "green-detail",
      data: {
        trees: Number(trees),
        events: Number(events),
        score
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Activity calculation failed" });
  }
};

export const calculateResearch: RequestHandler = async (req, res) => {
  try {
    const { publications = 0, projects = 0, theses = 0, userId = 1 } = req.body;
    const score = (Number(projects) * 3) + Number(publications) + Number(theses);

    await pool.query(
      "INSERT INTO research_projects (title, lead_faculty_id) VALUES (?, ?)",
      [`Research Batch`, userId]
    );

    res.json({
      title: "Climate Research Tracking",
      type: "research-detail",
      data: {
        total: Number(publications) + Number(projects) + Number(theses),
        score
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Research calculation failed" });
  }
};

export const getOverallScore: RequestHandler = async (req, res) => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM sustainability_scores ORDER BY created_at DESC LIMIT 1");
    res.json(rows[0] || { score: 75, energy_subscore: 80, carbon_subscore: 70, water_subscore: 85, waste_subscore: 65 });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch overall score" });
  }
};

export const calculateParticipants = async (req: any, res: any) => res.json({ title: "Participation", metrics: [] });
export const getParticipants = async (req: any, res: any) => res.json({ value: 1250 });
export const manageBuildings = async (req: any, res: any) => res.json({});
export const uploadEnvironmentalData = async (req: any, res: any) => res.json({});
export const addResearchProject = async (req: any, res: any) => res.json({});
