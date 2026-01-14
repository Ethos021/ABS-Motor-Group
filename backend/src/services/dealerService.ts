import { z } from "zod";
import { prisma } from "../config/db.js";

export const dealerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export const partialDealerSchema = dealerSchema.partial();

export const listDealers = async () =>
  prisma.dealer.findMany({ orderBy: { name: "asc" } });

export const getDealerById = async (id: number) =>
  prisma.dealer.findUnique({
    where: { id },
    include: { vehicles: true },
  });

export const createDealer = async (data: z.infer<typeof dealerSchema>) =>
  prisma.dealer.create({ data });

export const updateDealer = async (
  id: number,
  data: z.infer<typeof partialDealerSchema>
) => prisma.dealer.update({ where: { id }, data });

export const deleteDealer = async (id: number) =>
  prisma.dealer.delete({ where: { id } });
