import express from 'express';
import {
  createCalendarBlock,
  getCalendarBlocks,
  getCalendarBlockById,
  updateCalendarBlock,
  deleteCalendarBlock,
  getBlocksByDateRange
} from '../controllers/calendarBlockController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All calendar block routes require authentication
router.post('/', authenticate, createCalendarBlock);
router.get('/', authenticate, getCalendarBlocks);
router.get('/date-range', authenticate, getBlocksByDateRange);
router.get('/:id', authenticate, getCalendarBlockById);
router.put('/:id', authenticate, updateCalendarBlock);
router.delete('/:id', authenticate, deleteCalendarBlock);

export default router;
