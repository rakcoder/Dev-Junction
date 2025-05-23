import { asyncHandler } from '../middleware/asyncHandler.js';
import Booking from '../models/Booking.js';
import { ApiError } from '../utils/ApiError.js';

class BookingController {
  createBooking = asyncHandler(async (req, res) => {
    const {
      developerId,
      customerId,
      date,
      time,
      duration,
      totalAmount,
      txHash
    } = req.body;

    if (!developerId || !customerId || !date || !time || !duration || !totalAmount || !txHash) {
      throw new ApiError(400, 'Missing required fields');
    }

    const booking = await Booking.create({
      developer: developerId,
      customer: customerId,
      date,
      time,
      duration,
      totalAmount,
      paymentTxHash: txHash,
      status: 'confirmed'
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  });
}

export default new BookingController();