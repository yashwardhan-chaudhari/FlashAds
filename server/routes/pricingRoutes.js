import express from 'express';
import { getPriceQuote } from '../controllers/pricingController.js';

const router = express.Router();

router.post('/quote', getPriceQuote);

export default router;
