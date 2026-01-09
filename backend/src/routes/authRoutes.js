import express from 'express';
import {
  register,
  login,
  getMe,
  getUsers,
  updateUser,
  deleteUser
} from '../controllers/authController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes with strict rate limiting
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Protected routes
router.get('/me', authenticate, getMe);

// Admin routes
router.get('/users', authenticate, requireAdmin, getUsers);
router.put('/users/:id', authenticate, requireAdmin, updateUser);
router.delete('/users/:id', authenticate, requireAdmin, deleteUser);

export default router;
