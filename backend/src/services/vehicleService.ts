import { VehicleStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/db.js";

export const vehicleSchema = z.object({
  vin: z.string().min(3).optional(),
  stockNumber: z.string().min(2).optional(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().int().min(1885),
  price: z.coerce.number().positive(),
  mileage: z.coerce.number().int().nonnegative().optional(),
  status: z
    .enum(["AVAILABLE", "RESERVED", "SOLD", "IN_TRANSIT"])
    .default("AVAILABLE")
    .optional(),
  bodyType: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  color: z.string().optional(),
  dealerId: z.coerce.number().int().optional(),
});

export const partialVehicleSchema = vehicleSchema.partial();

export const listVehicles = async () =>
  prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: { dealer: true },
  });

export const getVehicleById = async (id: number) =>
  prisma.vehicle.findUnique({
    where: { id },
    include: { dealer: true, sales: true },
  });

export const createVehicle = async (
  data: z.infer<typeof vehicleSchema> & { status?: string }
) =>
  prisma.vehicle.create({
    data: {
      ...data,
      status: (data.status as VehicleStatus | undefined) ?? VehicleStatus.AVAILABLE,
    },
  });

export const updateVehicle = async (
  id: number,
  data: z.infer<typeof partialVehicleSchema> & { status?: string }
) =>
  prisma.vehicle.update({
    where: { id },
    data: {
      ...data,
      status: data.status
        ? (data.status as VehicleStatus)
        : undefined,
    },
  });

export const deleteVehicle = async (id: number) =>
  prisma.vehicle.delete({ where: { id } });
