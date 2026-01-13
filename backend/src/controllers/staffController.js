import staffService from '../services/staffService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.getAllStaff(req.query);

  res.status(200).json({
    success: true,
    count: staff.length,
    data: staff,
  });
});

export const getStaffById = asyncHandler(async (req, res) => {
  const staff = await staffService.getStaffById(req.params.id);

  res.status(200).json({
    success: true,
    data: staff,
  });
});

export const createStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.createStaff(req.body);

  res.status(201).json({
    success: true,
    data: staff,
  });
});

export const updateStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.updateStaff(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: staff,
  });
});

export const deleteStaff = asyncHandler(async (req, res) => {
  await staffService.deleteStaff(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Staff member deleted successfully',
  });
});
