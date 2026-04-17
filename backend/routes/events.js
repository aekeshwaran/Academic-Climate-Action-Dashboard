import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM green_events ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, date, trees_planted, participants, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO green_events (title, date, trees_planted, participants, description) VALUES (?, ?, ?, ?, ?)',
      [title, date, trees_planted || 0, participants || 0, description || '']
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
