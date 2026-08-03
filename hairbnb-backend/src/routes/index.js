import express from 'express';
const router = express.Router();
import path from 'path';
import ListingRoutes from './listing.routes.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.use(express.static(path.join(__dirname, "public")));

router.use('/listings',ListingRoutes);


export default router;
