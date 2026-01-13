import express from 'express';
import { body } from 'express-validator';
import * as enquiryController from '../controllers/enquiryController.js';
import { validate } from '../middlewares/validator.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Public route - create enquiry
router.post(
  '/',
  [
    body('enquiryType').isIn(['general', 'vehicle', 'finance', 'trade_in', 'service']).withMessage('Valid enquiry type is required'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('mobile').trim().notEmpty().withMessage('Mobile number is required'),
    validate,
  ],
  enquiryController.createEnquiry
);

// Protected routes (staff/admin only)
router.get(
  '/',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  enquiryController.getAllEnquiries
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  enquiryController.getEnquiryById
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  enquiryController.updateEnquiry
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  enquiryController.deleteEnquiry
);

export default router;
