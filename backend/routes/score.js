import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  res.json({
    score: 78,
    energy_subscore: 82,
    carbon_subscore: 74,
    water_subscore: 88,
    waste_subscore: 68
  });
});

export default router;
