import express from 'express';
import energy from './energy.js';
import carbon from './carbon.js';
import water from './water.js';
import waste from './waste.js';
import events from './events.js';
import research from './research.js';
import auth from './auth.js';
import buildings from './buildings.js';

const router = express.Router();

router.use('/energy', energy);
router.use('/carbon', carbon);
router.use('/water', water);
router.use('/waste', waste);
router.use('/events', events);
router.use('/research', research);
router.use('/auth', auth);
router.use('/buildings', buildings);

export default router;
