import express from 'express';
import Event from '../models/Event.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ trees_planted: { $gt: 0 } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
