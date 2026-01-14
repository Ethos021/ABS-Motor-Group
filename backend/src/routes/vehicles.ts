import { Router } from "express";
import {
  getVehicle,
  getVehicles,
  postVehicle,
  putVehicle,
  removeVehicle,
} from "../controllers/vehicleController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const vehicleRouter = Router();

vehicleRouter.get("/", asyncHandler(getVehicles));
vehicleRouter.get("/:id", asyncHandler(getVehicle));
vehicleRouter.post("/", asyncHandler(postVehicle));
vehicleRouter.put("/:id", asyncHandler(putVehicle));
vehicleRouter.delete("/:id", asyncHandler(removeVehicle));
