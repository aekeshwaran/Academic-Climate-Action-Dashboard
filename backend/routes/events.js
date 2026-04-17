import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await Event.find().sort({ date: -1 });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, date, trees_planted, participants, description } = req.body;
  try {
    const record = new Event({
      title,
      date: date || new Date(),
      trees_planted: trees_planted || 0,
      participants: participants || 0,
      description: description || ''
    });
    await record.save();
    res.json({ id: record._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
