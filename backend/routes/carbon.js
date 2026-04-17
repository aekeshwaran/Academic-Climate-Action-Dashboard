import express from 'express';
import Carbon from '../models/Carbon.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await Carbon.find().sort({ createdAt: -1 });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { source, emission_tons, month, year } = req.body;
  try {
    const record = new Carbon({ source, emission_tons, month, year });
    await record.save();
    res.json({ id: record._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
