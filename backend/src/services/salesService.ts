import { z } from "zod";
import { prisma } from "../config/db.js";

export const saleSchema = z.object({
  vehicleId: z.coerce.number().int(),
  customerId: z.coerce.number().int(),
  dealerId: z.coerce.number().int().optional(),
  saleDate: z.coerce.date().optional(),
  salePrice: z.coerce.number().positive(),
  notes: z.string().optional(),
});

export const listSales = async () =>
  prisma.sale.findMany({
    include: { vehicle: true, customer: true, dealer: true },
    orderBy: { saleDate: "desc" },
  });

export const createSale = async (data: z.infer<typeof saleSchema>) =>
  prisma.sale.create({
    data: {
      ...data,
      saleDate: data.saleDate ?? new Date(),
    },
    include: { vehicle: true, customer: true, dealer: true },
  });
