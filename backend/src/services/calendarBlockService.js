import prisma from '../config/database.js';
import ApiError from '../middlewares/errorHandler.js';

class CalendarBlockService {
  async getAllCalendarBlocks(filters = {}) {
    const { staffId, startDate, endDate, blockType } = filters;

    const where = {};
    if (staffId) where.staffId = staffId;
    if (blockType) where.blockType = blockType;

    if (startDate || endDate) {
      where.OR = [
        {
          startTime: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
        {
          endTime: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
      ];
    }

    const blocks = await prisma.calendarBlock.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
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

    return blocks;
  }

  async getCalendarBlockById(id) {
    const block = await prisma.calendarBlock.findUnique({
      where: { id },
      include: {
        staff: true,
      },
    });

    if (!block) {
      throw new ApiError(404, 'Calendar block not found');
    }

    return block;
  }

  async createCalendarBlock(blockData) {
    const block = await prisma.calendarBlock.create({
      data: blockData,
      include: {
        staff: true,
      },
    });

    return block;
  }

  async updateCalendarBlock(id, blockData) {
    const block = await prisma.calendarBlock.update({
      where: { id },
      data: blockData,
      include: {
        staff: true,
      },
    });

    return block;
  }

  async deleteCalendarBlock(id) {
    await prisma.calendarBlock.delete({
      where: { id },
    });

    return { message: 'Calendar block deleted successfully' };
  }
}

export default new CalendarBlockService();
