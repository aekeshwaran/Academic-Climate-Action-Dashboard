import { Request, Response } from "express";
import { CarbonModel } from "../models/Carbon";

export const getCarbon = async (req: Request, res: Response) => {
  try {
    const data = await CarbonModel.getAll();
    res.json(data);
  } catch (error) {
    console.error("Error fetching carbon emissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postCarbon = async (req: Request, res: Response) => {
  try {
    const { source, emission_tons, month, year, building_name } = req.body;
    
    // Validation
    if (!source || emission_tons === undefined || !month || !year) {
      return res.status(400).json({ error: "Missing required fields: source, emission_tons, month, year" });
    }

    const result = await CarbonModel.create({
      source,
      emission_tons: Number(emission_tons) || 0,
      month,
      year: Number(year),
      building_name
    });

    res.status(201).json({ id: result.insertId, message: "Carbon emission data added" });
  } catch (error) {
    console.error("Error adding carbon data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCarbonTotals = async (req: Request, res: Response) => {
  try {
    const data = await CarbonModel.getTotals();
    res.json(data);
  } catch (error) {
    console.error("Error fetching carbon total:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCarbonTrends = async (req: Request, res: Response) => {
  try {
    const data = await CarbonModel.getTrends();
    res.json(data);
  } catch (error) {
    console.error("Error fetching carbon trends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
