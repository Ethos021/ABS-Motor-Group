import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  searchEnquiries
} from '../controllers/enquiryController.js';
import { optionalAuth, authenticate } from '../middleware/auth.js';
import { publicLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes (can create enquiries without auth) with rate limiting
router.post('/', publicLimiter, optionalAuth, createEnquiry);

// Protected routes
router.get('/', authenticate, getEnquiries);
router.get('/search', authenticate, searchEnquiries);
router.get('/:id', authenticate, getEnquiryById);
router.put('/:id', authenticate, updateEnquiry);
router.delete('/:id', authenticate, deleteEnquiry);

export default router;
