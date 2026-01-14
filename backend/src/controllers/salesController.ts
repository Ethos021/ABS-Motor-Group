import type { Request, Response } from "express";
import { saleSchema, createSale, listSales } from "../services/salesService.js";

export const getSales = async (_req: Request, res: Response) => {
  const sales = await listSales();
  res.json(sales);
};

export const postSale = async (req: Request, res: Response) => {
  const payload = saleSchema.parse(req.body);
  const created = await createSale(payload);
  res.status(201).json(created);
};
