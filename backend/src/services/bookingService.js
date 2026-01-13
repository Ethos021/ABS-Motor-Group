import prisma from '../config/database.js';
import ApiError from '../middlewares/errorHandler.js';

class BookingService {
  async getAllBookings(filters = {}) {
    const { status, bookingType, staffId, date, sortBy = '-scheduledDatetime' } = filters;

    const where = {};
    if (status) where.status = status;
    if (bookingType) where.bookingType = bookingType;
    if (staffId) where.staffId = staffId;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      where.scheduledDatetime = {
        gte: startDate,
        lte: endDate,
      };
    }

    const orderBy = this.parseSortBy(sortBy);

    const bookings = await prisma.booking.findMany({
      where,
      orderBy,
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
          },
        },
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
          },
        },
      },
    });

    return bookings;
  }

  async getBookingById(id) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        vehicle: true,
        staff: true,
      },
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    return booking;
  }

  async createBooking(bookingData) {
    // Check for scheduling conflicts
    if (bookingData.staffId) {
      const conflicts = await this.checkScheduleConflicts(
        bookingData.staffId,
        new Date(bookingData.scheduledDatetime),
        bookingData.durationMinutes || 60
      );

      if (conflicts.length > 0) {
        throw new ApiError(409, 'Staff member has a scheduling conflict at this time');
      }
    }

    const booking = await prisma.booking.create({
      data: bookingData,
      include: {
        vehicle: true,
        staff: true,
      },
    });

    return booking;
  }

  async updateBooking(id, bookingData) {
    const booking = await prisma.booking.update({
      where: { id },
      data: bookingData,
      include: {
        vehicle: true,
        staff: true,
      },
    });

    return booking;
  }

  async deleteBooking(id) {
    await prisma.booking.delete({
      where: { id },
    });

    return { message: 'Booking deleted successfully' };
  }

  async checkScheduleConflicts(staffId, scheduledDatetime, durationMinutes) {
    const startTime = new Date(scheduledDatetime);
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    // Check for booking conflicts
    const bookingConflicts = await prisma.booking.findMany({
      where: {
        staffId,
        status: { not: 'cancelled' },
        OR: [
          {
            scheduledDatetime: {
              gte: startTime,
              lt: endTime,
            },
          },
          {
            AND: [
              { scheduledDatetime: { lte: startTime } },
              {
                scheduledDatetime: {
                  gte: new Date(startTime.getTime() - 60 * 60000), // 1 hour buffer
                },
              },
            ],
          },
        ],
      },
    });

    // Check for calendar block conflicts
    const calendarConflicts = await prisma.calendarBlock.findMany({
      where: {
        staffId,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gte: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lte: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    return [...bookingConflicts, ...calendarConflicts];
  }

  parseSortBy(sortBy) {
    const field = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;
    const order = sortBy.startsWith('-') ? 'desc' : 'asc';

    const validFields = ['scheduledDatetime', 'createdAt', 'status', 'bookingType'];
    if (!validFields.includes(field)) {
      return { scheduledDatetime: 'desc' };
    }

    return { [field]: order };
  }
}

export default new BookingService();
