import express from 'express';
import Building from '../models/Building.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await Building.find();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, location, area } = req.body;
  try {
    const record = new Building({ name, location: location || '', area: area || null });
    await record.save();
    res.json({ id: record._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
