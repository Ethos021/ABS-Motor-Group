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

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getMe);

// Admin routes
router.get('/users', authenticate, requireAdmin, getUsers);
router.put('/users/:id', authenticate, requireAdmin, updateUser);
router.delete('/users/:id', authenticate, requireAdmin, deleteUser);

export default router;
