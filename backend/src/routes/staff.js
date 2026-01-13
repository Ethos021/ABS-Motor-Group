import express from 'express';
import { body } from 'express-validator';
import * as staffController from '../controllers/staffController.js';
import { validate } from '../middlewares/validator.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Public route - get all active staff
router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);

// Protected routes (admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    validate,
  ],
  staffController.createStaff
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  staffController.updateStaff
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  staffController.deleteStaff
);

export default router;
