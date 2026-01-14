import type { Request, Response } from "express";
import { HttpError } from "../middleware/errorHandler.js";
import {
  createVehicle,
  deleteVehicle,
  getVehicleById,
  listVehicles,
  partialVehicleSchema,
  updateVehicle,
  vehicleSchema,
} from "../services/vehicleService.js";

export const getVehicles = async (_req: Request, res: Response) => {
  const vehicles = await listVehicles();
  res.json(vehicles);
};

export const getVehicle = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const vehicle = await getVehicleById(id);
  if (!vehicle) {
    throw new HttpError(404, "Vehicle not found");
  }
  res.json(vehicle);
};

export const postVehicle = async (req: Request, res: Response) => {
  const payload = vehicleSchema.parse(req.body);
  const created = await createVehicle(payload);
  res.status(201).json(created);
};

export const putVehicle = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const payload = partialVehicleSchema.parse(req.body);
  const updated = await updateVehicle(id, payload);
  res.json(updated);
};

export const removeVehicle = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await deleteVehicle(id);
  res.status(204).send();
};
