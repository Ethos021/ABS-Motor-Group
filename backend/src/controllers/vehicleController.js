import vehicleService from '../services/vehicleService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import fs from 'fs/promises';

export const getAllVehicles = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getAllVehicles(req.query);

  res.status(200).json({
    success: true,
    count: vehicles.length,
    data: vehicles,
  });
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id);

  res.status(200).json({
    success: true,
    data: vehicle,
  });
});

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.body);

  res.status(201).json({
    success: true,
    data: vehicle,
  });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: vehicle,
  });
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  await vehicleService.deleteVehicle(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Vehicle deleted successfully',
  });
});

export const importVehiclesFromCSV = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No CSV file uploaded',
    });
  }

  const result = await vehicleService.importFromCSV(req.file.path);

  // Clean up uploaded file
  await fs.unlink(req.file.path);

  res.status(200).json({
    success: true,
    message: `Imported ${result.imported} vehicles, ${result.failed} failed`,
    data: result,
  });
});

export const exportVehiclesToCSV = asyncHandler(async (req, res) => {
  const csv = await vehicleService.exportToCSV();

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=vehicles-${Date.now()}.csv`);
  res.status(200).send(csv);
});
