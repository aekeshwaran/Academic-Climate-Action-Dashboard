import { Request, Response } from "express";
import { WaterModel } from "../models/Water";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../middleware/error";

export const getWater = catchAsync(async (req: Request, res: Response) => {
  const data = await WaterModel.getAll();
  res.json(data);
});

export const postWater = catchAsync(async (req: Request, res: Response) => {
  const { building_name, daily_consumption_liters, rainwater_harvested_liters, groundwater_used_liters, leak_detected, date } = req.body;
  
  if (!building_name || !daily_consumption_liters || !date) {
    throw new AppError("Missing required water data fields", 400);
  }

  const result = await WaterModel.create({
    building_name,
    daily_consumption_liters: Number(daily_consumption_liters) || 0,
    rainwater_harvested_liters: Number(rainwater_harvested_liters) || 0,
    groundwater_used_liters: Number(groundwater_used_liters) || 0,
    leak_detected: !!leak_detected,
    date
  });
  res.status(201).json({ id: result.insertId, message: "Water management data added" });
});

export const getWaterSummary = catchAsync(async (req: Request, res: Response) => {
  const totals = await WaterModel.getSummary();
  const totalConsumption = totals?.total_consumption || 0;
  const totalRainwater = totals?.total_rainwater || 0;
  const totalGroundwater = totals?.total_groundwater || 0;
  const conservationScore = totalConsumption > 0 ? (totalRainwater / totalConsumption) * 100 : 0;

  res.json({
    total_consumption: totalConsumption,
    total_rainwater: totalRainwater,
    total_groundwater: totalGroundwater,
    conservation_score: conservationScore
  });
});

export const getWaterLeaks = catchAsync(async (req: Request, res: Response) => {
  const data = await WaterModel.getLeaks();
  res.json(data);
});

export const getWaterTrends = catchAsync(async (req: Request, res: Response) => {
  const data = await WaterModel.getTrends();
  res.json(data);
});

export const getBuildingWater = catchAsync(async (req: Request, res: Response) => {
  const data = await WaterModel.getBuildings();
  res.json(data);
});
