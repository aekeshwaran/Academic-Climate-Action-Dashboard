import { Request, Response } from "express";
import { EnergyModel } from "../models/Energy";
import { pool } from "../db";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../middleware/error";

export const getEnergy = catchAsync(async (req: Request, res: Response) => {
  const data = await EnergyModel.getAll();
  res.json(data);
});

export const postEnergy = catchAsync(async (req: Request, res: Response) => {
  const { building_name, electricity_kwh, solar_kwh, month, year, user_id } = req.body;
  
  if (!building_name || !electricity_kwh || !month || !year) {
    throw new AppError("Missing required energy data fields", 400);
  }

  const elec = Number(electricity_kwh) || 0;
  const solar = Number(solar_kwh) || 0;
  const savings_percentage = elec > 0 ? (solar / elec) * 100 : 0;

  const result = await EnergyModel.create({
    building_name,
    electricity_kwh: elec,
    solar_kwh: solar,
    savings_percentage,
    month,
    year,
    user_id
  });

  // Auto-Calculate Carbon Emission (1 kWh = 0.85 kg CO2)
  const emissionTons = (elec * 0.85) / 1000;
  await pool.query(
    `INSERT INTO carbon_emissions (building_name, source, emission_tons, month, year) 
     VALUES (?, ?, ?, ?, ?)`,
    [building_name || 'Campus', 'Electricity', emissionTons, month, year]
  );

  res.status(201).json({ 
    id: result.insertId, 
    message: "Energy data added & carbon footprint calculated", 
    savings_percentage 
  });
});

export const getEnergySummary = catchAsync(async (req: Request, res: Response) => {
  const totals = await EnergyModel.getSummary();
  const totalElectricity = totals?.total_electricity || 0;
  const totalSolar = totals?.total_solar || 0;
  const efficiencyScore = totalElectricity > 0 ? (totalSolar / totalElectricity) * 100 : 0;

  res.json({
    total_electricity: totalElectricity,
    total_solar: totalSolar,
    efficiency_score: efficiencyScore
  });
});

export const getBuildingEnergy = catchAsync(async (req: Request, res: Response) => {
  const data = await EnergyModel.getBuildings();
  res.json(data);
});
