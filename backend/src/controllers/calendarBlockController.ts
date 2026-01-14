import type { Request, Response } from "express";
import {
  createCalendarBlock,
  deleteCalendarBlock,
  listCalendarBlocks,
  updateCalendarBlock,
} from "../services/calendarBlockService.js";

export const getCalendarBlocks = async (_req: Request, res: Response) => {
  const blocks = await listCalendarBlocks();
  res.json(blocks);
};

export const postCalendarBlock = async (req: Request, res: Response) => {
  const created = await createCalendarBlock(req.body);
  res.status(201).json(created);
};

export const putCalendarBlock = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updated = await updateCalendarBlock(id, req.body);
  res.json(updated);
};

export const removeCalendarBlock = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await deleteCalendarBlock(id);
  res.status(204).send();
};
