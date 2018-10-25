import express from 'express';
import documentRoutes from './document';

const router = express.Router(); // eslint-disable-line

router.get('/health-check', (_, res) => res.send('OK'));

router.use('/documents', documentRoutes);

export default router;
