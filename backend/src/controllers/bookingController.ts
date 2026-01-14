import type { Request, Response } from "express";
import {
  createBooking,
  listBookings,
  updateBooking,
} from "../services/bookingService.js";

export const getBookings = async (_req: Request, res: Response) => {
  const bookings = await listBookings();
  res.json(bookings);
};

export const postBooking = async (req: Request, res: Response) => {
  const created = await createBooking(req.body);
  res.status(201).json(created);
};

export const putBooking = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updated = await updateBooking(id, req.body);
  res.json(updated);
};
