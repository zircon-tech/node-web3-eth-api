import express from 'express';
import thingRoutes from './thing';

const router = express.Router(); // eslint-disable-line

router.use('/things', thingRoutes);

export default router;
