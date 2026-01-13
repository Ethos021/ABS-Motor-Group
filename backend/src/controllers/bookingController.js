import bookingService from '../services/bookingService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getAllBookings(req.query);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);

  res.status(200).json({
    success: true,
    data: booking,
  });
});

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body);

  res.status(201).json({
    success: true,
    data: booking,
  });
});

export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBooking(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: booking,
  });
});

export const deleteBooking = asyncHandler(async (req, res) => {
  await bookingService.deleteBooking(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Booking deleted successfully',
  });
});
