import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  res.json([
    { impact_level: 'High', message: 'Optimize HVAC in Research Wing', action_suggested: 'Adjust temperature setpoints by 2°C' },
    { impact_level: 'Medium', message: 'Increase Rainwater Harvesting', action_suggested: 'Check filtration efficiency' },
    { impact_level: 'Low', message: 'Switch to LED in Library', action_suggested: 'Replace 50 halogen bulbs' }
  ]);
});

export default router;
