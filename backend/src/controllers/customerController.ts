import type { Request, Response } from "express";
import { HttpError } from "../middleware/errorHandler.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  listCustomers,
  partialCustomerSchema,
  updateCustomer,
  customerSchema,
} from "../services/customerService.js";

export const getCustomers = async (_req: Request, res: Response) => {
  const customers = await listCustomers();
  res.json(customers);
};

export const getCustomer = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const customer = await getCustomerById(id);
  if (!customer) {
    throw new HttpError(404, "Customer not found");
  }
  res.json(customer);
};

export const postCustomer = async (req: Request, res: Response) => {
  const payload = customerSchema.parse(req.body);
  const created = await createCustomer(payload);
  res.status(201).json(created);
};

export const putCustomer = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const payload = partialCustomerSchema.parse(req.body);
  const updated = await updateCustomer(id, payload);
  res.json(updated);
};

export const removeCustomer = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await deleteCustomer(id);
  res.status(204).send();
};
