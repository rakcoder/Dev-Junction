import express from 'express';
import bookingController from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', bookingController.createBooking);

export default router;