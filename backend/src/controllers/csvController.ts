import type { Request, Response } from "express";
import { importInventoryFromCsv } from "../services/csvService.js";
import { HttpError } from "../middleware/errorHandler.js";

export const uploadInventory = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new HttpError(400, "CSV file is required");
  }

  const summary = await importInventoryFromCsv(req.file.buffer);
  res.json(summary);
};
