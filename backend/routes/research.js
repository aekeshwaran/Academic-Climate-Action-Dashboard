import express from 'express';
import Research from '../models/Research.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await Research.find().sort({ start_date: -1 });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, lead, start_date, end_date, description, funding } = req.body;
  try {
    const record = new Research({
      title,
      lead,
      start_date: start_date || null,
      end_date: end_date || null,
      description: description || '',
      funding: funding || 0
    });
    await record.save();
    res.json({ id: record._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
