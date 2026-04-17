import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM carbon_emission ORDER BY period_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { building_id, co2_kg, period_date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO carbon_emission (building_id, co2_kg, period_date) VALUES (?, ?, ?)',
      [building_id || null, co2_kg, period_date]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simple linear regression predictor for next month CO2 based on last N months
router.get('/predict', async (req, res) => {
  try {
    const months = parseInt(req.query.months || '12', 10);
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(period_date, '%Y-%m-01') as month, SUM(co2_kg) as total FROM carbon_emission GROUP BY month ORDER BY month DESC LIMIT ?`,
      [months]
    );
    if (!rows.length) return res.json({ prediction: 0 });
    // rows are in DESC order, reverse to chronological
    const data = rows.reverse();
    const xs = data.map((_, i) => i + 1);
    const ys = data.map(r => Number(r.total));
    const n = xs.length;
    const sumX = xs.reduce((a, b) => a + b, 0);
    const sumY = ys.reduce((a, b) => a + b, 0);
    const sumXY = xs.reduce((s, xi, i) => s + xi * ys[i], 0);
    const sumX2 = xs.reduce((s, xi) => s + xi * xi, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
    const intercept = (sumY - slope * sumX) / n;
    const nextX = n + 1;
    const prediction = intercept + slope * nextX;
    res.json({ prediction: Math.max(0, Number(prediction.toFixed(2))) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
