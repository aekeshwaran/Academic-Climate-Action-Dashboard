import express from 'express';
import Energy from '../models/Energy.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await Energy.find().sort({ period_date: -1 });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { building_name, consumption_kwh, solar_kwh, period_date } = req.body;
  try {
    const record = new Energy({
      building_name,
      electricity_kwh: consumption_kwh,
      solar_kwh: solar_kwh || 0,
      period_date: period_date || new Date()
    });
    await record.save();
    res.json({ id: record._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
