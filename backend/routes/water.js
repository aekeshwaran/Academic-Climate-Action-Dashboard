import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM water_usage ORDER BY period_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { building_id, consumption_liters, period_date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO water_usage (building_id, consumption_liters, period_date) VALUES (?, ?, ?)',
      [building_id || null, consumption_liters, period_date]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
