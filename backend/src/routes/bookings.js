import express from 'express';
import { body } from 'express-validator';
import * as bookingController from '../controllers/bookingController.js';
import { validate } from '../middlewares/validator.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Public route - create booking
router.post(
  '/',
  [
    body('bookingType').isIn(['test_drive', 'service', 'consultation', 'viewing']).withMessage('Valid booking type is required'),
    body('scheduledDatetime').isISO8601().withMessage('Valid date/time is required'),
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('customerPhone').trim().notEmpty().withMessage('Customer phone is required'),
    body('customerEmail').isEmail().normalizeEmail().withMessage('Valid customer email is required'),
    validate,
  ],
  bookingController.createBooking
);

// Protected routes (staff/admin only)
router.get(
  '/',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  bookingController.getAllBookings
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  bookingController.getBookingById
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  bookingController.updateBooking
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  bookingController.deleteBooking
);

export default router;
