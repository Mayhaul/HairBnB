import express from 'express';
const router = express.Router();

import ListingRoutes from './listing.routes.js';

router.use('/listings',ListingRoutes);


export default router;
