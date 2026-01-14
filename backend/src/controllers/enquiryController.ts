import type { Request, Response } from "express";
import {
  createEnquiry,
  listEnquiries,
  updateEnquiry,
} from "../services/enquiryService.js";

export const getEnquiries = async (_req: Request, res: Response) => {
  const enquiries = await listEnquiries();
  res.json(enquiries);
};

export const postEnquiry = async (req: Request, res: Response) => {
  const created = await createEnquiry(req.body);
  res.status(201).json(created);
};

export const putEnquiry = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updated = await updateEnquiry(id, req.body);
  res.json(updated);
};
