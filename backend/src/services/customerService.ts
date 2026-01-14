import { z } from "zod";
import { prisma } from "../config/db.js";

export const customerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const partialCustomerSchema = customerSchema.partial();

export const listCustomers = async () =>
  prisma.customer.findMany({ orderBy: { createdAt: "desc" } });

export const getCustomerById = async (id: number) =>
  prisma.customer.findUnique({
    where: { id },
    include: { sales: true },
  });

export const createCustomer = async (
  data: z.infer<typeof customerSchema>
): Promise<unknown> => prisma.customer.create({ data });

export const updateCustomer = async (
  id: number,
  data: z.infer<typeof partialCustomerSchema>
) => prisma.customer.update({ where: { id }, data });

export const deleteCustomer = async (id: number) =>
  prisma.customer.delete({ where: { id } });
