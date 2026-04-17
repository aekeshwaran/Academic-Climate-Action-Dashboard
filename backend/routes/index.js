import express from 'express';
import energy from './energy.js';
import carbon from './carbon.js';
import water from './water.js';
import waste from './waste.js';
import events from './events.js';
import research from './research.js';
import auth from './auth.js';
import buildings from './buildings.js';
import analytics from './analytics.js';
import score from './score.js';
import trees from './trees.js';
import insights from './insights.js';

const router = express.Router();

router.use('/energy', energy);
router.use('/carbon', carbon);
router.use('/water', water);
router.use('/waste', waste);
router.use('/events', events);
router.use('/research', research);
router.use('/auth', auth);
router.use('/buildings', buildings);
router.use('/analytics', analytics);
router.use('/sustainability/score', score);
router.use('/trees', trees);
router.use('/insights', insights);

export default router;
