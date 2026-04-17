import express from 'express';
import Energy from '../models/Energy.js';
import Carbon from '../models/Carbon.js';
import Water from '../models/Water.js';
import Waste from '../models/Waste.js';
import Event from '../models/Event.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const energyData = await Energy.find();
    const carbonData = await Carbon.find();
    const waterData = await Water.find();
    const wasteData = await Waste.find();
    const eventData = await Event.find();

    const energyConsumption = energyData.reduce((s, r) => s + (r.electricity_kwh || 0), 0);
    const carbonFootprint = carbonData.reduce((s, r) => s + (r.emission_tons || 0), 0);
    const waterUsage = waterData.reduce((s, r) => s + (r.daily_consumption_liters || 0), 0);
    const treesPlanted = eventData.reduce((s, r) => s + (r.trees_planted || 0), 0);
    
    const wasteTotal = wasteData.reduce((s, r) => s + (r.generated_kg || 0), 0);
    const wasteRecycled = wasteData.reduce((s, r) => s + (r.recycled_kg || 0), 0);
    const wasteRecyclingPercentage = wasteTotal > 0 ? (wasteRecycled / wasteTotal) * 100 : 0;

    res.json({
      energyConsumption,
      carbonFootprint,
      waterUsage,
      treesPlanted,
      wasteRecyclingPercentage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
