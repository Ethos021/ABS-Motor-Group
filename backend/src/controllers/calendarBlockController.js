import calendarBlockService from '../services/calendarBlockService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllCalendarBlocks = asyncHandler(async (req, res) => {
  const blocks = await calendarBlockService.getAllCalendarBlocks(req.query);

  res.status(200).json({
    success: true,
    count: blocks.length,
    data: blocks,
  });
});

export const getCalendarBlockById = asyncHandler(async (req, res) => {
  const block = await calendarBlockService.getCalendarBlockById(req.params.id);

  res.status(200).json({
    success: true,
    data: block,
  });
});

export const createCalendarBlock = asyncHandler(async (req, res) => {
  const block = await calendarBlockService.createCalendarBlock(req.body);

  res.status(201).json({
    success: true,
    data: block,
  });
});

export const updateCalendarBlock = asyncHandler(async (req, res) => {
  const block = await calendarBlockService.updateCalendarBlock(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: block,
  });
});

export const deleteCalendarBlock = asyncHandler(async (req, res) => {
  await calendarBlockService.deleteCalendarBlock(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Calendar block deleted successfully',
  });
});
