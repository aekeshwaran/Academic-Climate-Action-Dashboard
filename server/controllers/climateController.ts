import { Request, Response } from 'express';
import ClimateData from '../models/ClimateData';

// Add new climate data
export const postData = async (req: Request, res: Response) => {
  try {
    const { temperature, carbonEmission, energyUsage, waterUsage } = req.body;
    
    // Simple validation
    if (!temperature || !carbonEmission || !energyUsage || !waterUsage) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newData = new ClimateData({
      temperature,
      carbonEmission,
      energyUsage,
      waterUsage
    });

    await newData.save();
    res.status(201).json(newData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all data
export const getData = async (req: Request, res: Response) => {
  try {
    const data = await ClimateData.find().sort({ timestamp: -1 });
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete data by ID
export const deleteData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await ClimateData.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
