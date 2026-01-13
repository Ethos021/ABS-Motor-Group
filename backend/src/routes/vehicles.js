import express from 'express';
import { body } from 'express-validator';
import * as vehicleController from '../controllers/vehicleController.js';
import { validate } from '../middlewares/validator.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';
import { uploadCSV } from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);

// CSV Export (public or can be protected)
router.get('/export/csv', vehicleController.exportVehiclesToCSV);

// Protected routes (admin/staff only)
router.post(
  '/',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  [
    body('make').trim().notEmpty().withMessage('Make is required'),
    body('model').trim().notEmpty().withMessage('Model is required'),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('mileage').isInt({ min: 0 }).withMessage('Valid mileage is required'),
    validate,
  ],
  vehicleController.createVehicle
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin', 'staff'),
  vehicleController.updateVehicle
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  vehicleController.deleteVehicle
);

// CSV Import (admin only)
router.post(
  '/import/csv',
  authenticateToken,
  authorizeRole('admin'),
  uploadCSV.single('file'),
  vehicleController.importVehiclesFromCSV
);

export default router;
