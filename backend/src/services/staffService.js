import prisma from '../config/database.js';
import ApiError from '../middlewares/errorHandler.js';

class StaffService {
  async getAllStaff(filters = {}) {
    const { isActive, department } = filters;

    const where = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (department) where.department = department;

    const staff = await prisma.staff.findMany({
      where,
      orderBy: { firstName: 'asc' },
    });

    return staff;
  }

  async getStaffById(id) {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        bookings: {
          take: 10,
          orderBy: { scheduledDatetime: 'desc' },
        },
        calendarBlocks: {
          where: {
            endTime: { gte: new Date() },
          },
          orderBy: { startTime: 'asc' },
        },
      },
    });

    if (!staff) {
      throw new ApiError(404, 'Staff member not found');
    }

    return staff;
  }

  async createStaff(staffData) {
    const staff = await prisma.staff.create({
      data: staffData,
    });

    return staff;
  }

  async updateStaff(id, staffData) {
    const staff = await prisma.staff.update({
      where: { id },
      data: staffData,
    });

    return staff;
  }

  async deleteStaff(id) {
    await prisma.staff.delete({
      where: { id },
    });

    return { message: 'Staff member deleted successfully' };
  }
}

export default new StaffService();
