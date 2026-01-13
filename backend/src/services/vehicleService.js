import prisma from '../config/database.js';
import ApiError from '../middlewares/errorHandler.js';
import Papa from 'papaparse';
import fs from 'fs/promises';

class VehicleService {
  async getAllVehicles(filters = {}) {
    const { status, make, model, minPrice, maxPrice, minYear, maxYear, sortBy = '-createdAt' } = filters;

    const where = {};
    if (status) where.status = status;
    if (make) where.make = { contains: make, mode: 'insensitive' };
    if (model) where.model = { contains: model, mode: 'insensitive' };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year.gte = parseInt(minYear);
      if (maxYear) where.year.lte = parseInt(maxYear);
    }

    const orderBy = this.parseSortBy(sortBy);

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy,
    });

    return vehicles;
  }

  async getVehicleById(id) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        enquiries: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          take: 5,
          orderBy: { scheduledDatetime: 'desc' },
        },
      },
    });

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    // Increment view count
    await prisma.vehicle.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return vehicle;
  }

  async createVehicle(vehicleData) {
    const vehicle = await prisma.vehicle.create({
      data: vehicleData,
    });

    return vehicle;
  }

  async updateVehicle(id, vehicleData) {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: vehicleData,
    });

    return vehicle;
  }

  async deleteVehicle(id) {
    await prisma.vehicle.delete({
      where: { id },
    });

    return { message: 'Vehicle deleted successfully' };
  }

  parseSortBy(sortBy) {
    const field = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;
    const order = sortBy.startsWith('-') ? 'desc' : 'asc';

    const validFields = ['createdAt', 'price', 'year', 'mileage', 'make', 'model'];
    if (!validFields.includes(field)) {
      return { createdAt: 'desc' };
    }

    return { [field]: order };
  }

  async importFromCSV(filePath) {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            try {
              const vehicles = [];
              const errors = [];

              for (let i = 0; i < results.data.length; i++) {
                const row = results.data[i];
                
                try {
                  // Map CSV columns to database fields
                  const vehicleData = {
                    make: row.make || row.Make,
                    model: row.model || row.Model,
                    year: parseInt(row.year || row.Year),
                    price: parseFloat(row.price || row.Price),
                    mileage: parseInt(row.mileage || row.Mileage || row.km || row.KM),
                    bodyType: row.bodyType || row.BodyType || row.body_type,
                    fuelType: row.fuelType || row.FuelType || row.fuel_type,
                    transmission: row.transmission || row.Transmission,
                    color: row.color || row.Color || row.colour || row.Colour,
                    engineSize: row.engineSize || row.EngineSize || row.engine_size,
                    doors: row.doors ? parseInt(row.doors) : null,
                    seats: row.seats ? parseInt(row.seats) : null,
                    vin: row.vin || row.VIN,
                    registrationNo: row.registrationNo || row.RegistrationNo || row.registration_no || row.rego,
                    description: row.description || row.Description,
                    features: row.features ? JSON.stringify(row.features.split('|')) : null,
                    images: row.images ? JSON.stringify(row.images.split('|')) : null,
                    status: row.status || row.Status || 'available',
                    isFeatured: row.isFeatured === 'true' || row.is_featured === 'true' || false,
                  };

                  // Validate required fields
                  if (!vehicleData.make || !vehicleData.model || !vehicleData.year || !vehicleData.price) {
                    errors.push({
                      row: i + 2, // +2 because row 1 is header and arrays start at 0
                      error: 'Missing required fields (make, model, year, price)',
                      data: row
                    });
                    continue;
                  }

                  const vehicle = await prisma.vehicle.create({
                    data: vehicleData,
                  });

                  vehicles.push(vehicle);
                } catch (error) {
                  errors.push({
                    row: i + 2,
                    error: error.message,
                    data: row
                  });
                }
              }

              resolve({
                success: true,
                imported: vehicles.length,
                failed: errors.length,
                vehicles,
                errors
              });
            } catch (error) {
              reject(error);
            }
          },
          error: (error) => {
            reject(new ApiError(400, `CSV parsing error: ${error.message}`));
          }
        });
      });
    } catch (error) {
      throw new ApiError(400, `Failed to read CSV file: ${error.message}`);
    }
  }

  async exportToCSV() {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Convert vehicles to CSV format
    const csvData = vehicles.map(vehicle => ({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      mileage: vehicle.mileage,
      bodyType: vehicle.bodyType || '',
      fuelType: vehicle.fuelType || '',
      transmission: vehicle.transmission || '',
      color: vehicle.color || '',
      engineSize: vehicle.engineSize || '',
      doors: vehicle.doors || '',
      seats: vehicle.seats || '',
      vin: vehicle.vin || '',
      registrationNo: vehicle.registrationNo || '',
      description: vehicle.description || '',
      features: vehicle.features ? JSON.parse(vehicle.features).join('|') : '',
      images: vehicle.images ? JSON.parse(vehicle.images).join('|') : '',
      status: vehicle.status,
      isFeatured: vehicle.isFeatured,
      viewCount: vehicle.viewCount,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    }));

    const csv = Papa.unparse(csvData);
    return csv;
  }
}

export default new VehicleService();
