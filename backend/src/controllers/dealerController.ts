import type { Request, Response } from "express";
import { HttpError } from "../middleware/errorHandler.js";
import {
  createDealer,
  deleteDealer,
  getDealerById,
  listDealers,
  partialDealerSchema,
  updateDealer,
  dealerSchema,
} from "../services/dealerService.js";

export const getDealers = async (_req: Request, res: Response) => {
  const dealers = await listDealers();
  res.json(dealers);
};

export const getDealer = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const dealer = await getDealerById(id);
  if (!dealer) {
    throw new HttpError(404, "Dealer not found");
  }
  res.json(dealer);
};

export const postDealer = async (req: Request, res: Response) => {
  const payload = dealerSchema.parse(req.body);
  const created = await createDealer(payload);
  res.status(201).json(created);
};

export const putDealer = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const payload = partialDealerSchema.parse(req.body);
  const updated = await updateDealer(id, payload);
  res.json(updated);
};

export const removeDealer = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await deleteDealer(id);
  res.status(204).send();
};
