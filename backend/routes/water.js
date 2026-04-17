import express from 'express';
import Water from '../models/Water.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await Water.find().sort({ date: -1 });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { building_name, daily_consumption_liters, rainwater_harvested_liters, date } = req.body;
  try {
    const record = new Water({ building_name, daily_consumption_liters, rainwater_harvested_liters, date: date || new Date() });
    await record.save();
    res.json({ id: record._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
