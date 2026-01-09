import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByDateRange
} from '../controllers/bookingController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { publicLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes (can create bookings without auth) with rate limiting
router.post('/', publicLimiter, optionalAuth, createBooking);

// Protected routes
router.get('/', authenticate, getBookings);
router.get('/date-range', authenticate, getBookingsByDateRange);
router.get('/:id', authenticate, getBookingById);
router.put('/:id', authenticate, updateBooking);
router.delete('/:id', authenticate, deleteBooking);

export default router;
