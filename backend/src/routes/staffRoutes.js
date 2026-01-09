import express from 'express';
import {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff
} from '../controllers/staffController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All staff routes require authentication
router.post('/', authenticate, createStaff);
router.get('/', authenticate, getStaff);
router.get('/:id', authenticate, getStaffById);
router.put('/:id', authenticate, updateStaff);
router.delete('/:id', authenticate, deleteStaff);

export default router;
