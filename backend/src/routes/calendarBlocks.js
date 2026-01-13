import express from 'express';
import { body } from 'express-validator';
import * as calendarBlockController from '../controllers/calendarBlockController.js';
import { validate } from '../middlewares/validator.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Protected routes (staff/admin only)
router.get(
  '/',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  calendarBlockController.getAllCalendarBlocks
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  calendarBlockController.getCalendarBlockById
);

router.post(
  '/',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  [
    body('blockType').isIn(['holiday', 'sick', 'meeting', 'busy', 'unavailable']).withMessage('Valid block type is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('endTime').isISO8601().withMessage('Valid end time is required'),
    validate,
  ],
  calendarBlockController.createCalendarBlock
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  calendarBlockController.updateCalendarBlock
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  calendarBlockController.deleteCalendarBlock
);

export default router;
