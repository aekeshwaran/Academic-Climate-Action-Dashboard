import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM research_projects ORDER BY start_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, lead, start_date, end_date, description, funding } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO research_projects (title, lead, start_date, end_date, description, funding) VALUES (?, ?, ?, ?, ?, ?)',
      [title, lead, start_date, end_date, description || '', funding || 0]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
