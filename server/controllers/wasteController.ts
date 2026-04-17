import { Request, Response } from "express";
import { WasteModel } from "../models/Waste";

export const getWaste = async (req: Request, res: Response) => {
  try {
    const data = await WasteModel.getAll();
    res.json(data);
  } catch (error) {
    console.error("Error fetching waste:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postWaste = async (req: Request, res: Response) => {
  try {
    const { user_id, month, year, plastic_kg, organic_kg, paper_kg, e_waste_kg, recycled_kg } = req.body;
    const result = await WasteModel.create({
      user_id: user_id || 1,
      month,
      year: year || new Date().getFullYear(),
      plastic_kg: Number(plastic_kg) || 0,
      organic_kg: Number(organic_kg) || 0,
      paper_kg: Number(paper_kg) || 0,
      e_waste_kg: Number(e_waste_kg) || 0,
      recycled_kg: Number(recycled_kg) || 0
    });
    res.status(201).json({ id: result.insertId, message: "Waste data added" });
  } catch (error) {
    console.error("Error adding waste data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
