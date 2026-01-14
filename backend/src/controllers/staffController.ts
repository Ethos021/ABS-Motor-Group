import type { Request, Response } from "express";
import {
  createStaff,
  listStaff,
  updateStaff,
} from "../services/staffService.js";

export const getStaff = async (_req: Request, res: Response) => {
  const staff = await listStaff();
  res.json(staff);
};

export const postStaff = async (req: Request, res: Response) => {
  const created = await createStaff(req.body);
  res.status(201).json(created);
};

export const putStaff = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updated = await updateStaff(id, req.body);
  res.json(updated);
};
