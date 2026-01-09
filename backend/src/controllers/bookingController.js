import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      created_by: req.user?.id || null
    };
    
    const booking = await Booking.create(bookingData);
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      booking_type: req.query.booking_type,
      staff_id: req.query.staff_id,
      enquiry_id: req.query.enquiry_id,
      limit: parseInt(req.query.limit) || undefined
    };

    const bookings = await Booking.findAll(filters);
    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.update(req.params.id, req.body);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: error.message
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.delete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: error.message
    });
  }
};

export const getBookingsByDateRange = async (req, res) => {
  try {
    const { start_date, end_date, staff_id } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'start_date and end_date are required'
      });
    }

    const bookings = await Booking.findByDateRange(start_date, end_date, staff_id);
    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings by date range:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};
