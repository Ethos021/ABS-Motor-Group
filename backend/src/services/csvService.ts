import { VehicleStatus } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { prisma } from "../config/db.js";

const csvVehicleSchema = z.object({
  vin: z.string().optional(),
  stockNumber: z.string().optional(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().int().min(1885),
  price: z.coerce.number().positive(),
  mileage: z.coerce.number().int().nonnegative().optional(),
  status: z
    .enum(["AVAILABLE", "RESERVED", "SOLD", "IN_TRANSIT"])
    .default("AVAILABLE")
    .optional(),
  dealerId: z.coerce.number().int().optional(),
  dealerName: z.string().optional(),
  bodyType: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  color: z.string().optional(),
});

type CsvVehicle = z.infer<typeof csvVehicleSchema>;

const getDealerId = async (row: CsvVehicle) => {
  if (row.dealerId) return row.dealerId;
  if (!row.dealerName) return undefined;

  const existing = await prisma.dealer.findFirst({
    where: { name: row.dealerName },
  });
  if (existing) return existing.id;

  const created = await prisma.dealer.create({
    data: { name: row.dealerName },
  });

  return created.id;
};

const upsertVehicle = async (data: CsvVehicle, dealerId?: number) => {
  const baseData = {
    ...data,
    dealerId,
    status: (data.status as VehicleStatus | undefined) ?? VehicleStatus.AVAILABLE,
  };

  if (data.vin) {
    const existing = await prisma.vehicle.findUnique({ where: { vin: data.vin } });
    const vehicle = await prisma.vehicle.upsert({
      where: { vin: data.vin },
      update: baseData,
      create: baseData,
    });
    return { vehicle, existed: Boolean(existing) };
  }

  if (data.stockNumber) {
    const existing = await prisma.vehicle.findUnique({
      where: { stockNumber: data.stockNumber },
    });
    const vehicle = await prisma.vehicle.upsert({
      where: { stockNumber: data.stockNumber },
      update: baseData,
      create: baseData,
    });
    return { vehicle, existed: Boolean(existing) };
  }

  const vehicle = await prisma.vehicle.create({ data: baseData });
  return { vehicle, existed: false };
};

export const importInventoryFromCsv = async (fileBuffer: Buffer) => {
  const rows = parse(fileBuffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, unknown>[];

  const summary = {
    processed: rows.length,
    inserted: 0,
    updated: 0,
    errors: [] as string[],
  };

  for (const [index, row] of rows.entries()) {
    const parsed = csvVehicleSchema.safeParse(row);

    if (!parsed.success) {
      summary.errors.push(
        `Row ${index + 1}: ${parsed.error.issues
          .map((issue) => issue.message)
          .join(", ")}`
      );
      continue;
    }

    const dealerId = await getDealerId(parsed.data);
    const { existed } = await upsertVehicle(parsed.data, dealerId);

    if (existed) summary.updated += 1;
    else summary.inserted += 1;

    summary.processed = index + 1;
  }

  return summary;
};
