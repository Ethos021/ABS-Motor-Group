import prisma from '../config/database.js';
import ApiError from '../middlewares/errorHandler.js';

class EnquiryService {
  async getAllEnquiries(filters = {}) {
    const { status, enquiryType, assignedTo, sortBy = '-createdAt' } = filters;

    const where = {};
    if (status) where.status = status;
    if (enquiryType) where.enquiryType = enquiryType;
    if (assignedTo) where.assignedTo = assignedTo;

    const orderBy = this.parseSortBy(sortBy);

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy,
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            price: true,
          },
        },
      },
    });

    return enquiries;
  }

  async getEnquiryById(id) {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!enquiry) {
      throw new ApiError(404, 'Enquiry not found');
    }

    return enquiry;
  }

  async createEnquiry(enquiryData) {
    const enquiry = await prisma.enquiry.create({
      data: enquiryData,
      include: {
        vehicle: true,
      },
    });

    return enquiry;
  }

  async updateEnquiry(id, enquiryData) {
    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: enquiryData,
      include: {
        vehicle: true,
      },
    });

    return enquiry;
  }

  async deleteEnquiry(id) {
    await prisma.enquiry.delete({
      where: { id },
    });

    return { message: 'Enquiry deleted successfully' };
  }

  parseSortBy(sortBy) {
    const field = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;
    const order = sortBy.startsWith('-') ? 'desc' : 'asc';

    const validFields = ['createdAt', 'status', 'priority', 'enquiryType'];
    if (!validFields.includes(field)) {
      return { createdAt: 'desc' };
    }

    return { [field]: order };
  }
}

export default new EnquiryService();
