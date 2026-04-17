import express from 'express';
import Waste from '../models/Waste.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await Waste.find().sort({ createdAt: -1 });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { type, generated_kg, recycled_kg, month, year } = req.body;
  try {
    const record = new Waste({ type, generated_kg, recycled_kg, month, year });
    await record.save();
    res.json({ id: record._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
