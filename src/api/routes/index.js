import express from 'express';
import documentRoutes from './document';

const router = express.Router(); // eslint-disable-line

router.use('/documents', documentRoutes);

export default router;
