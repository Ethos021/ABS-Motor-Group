import { Router } from "express";
import { getSales, postSale } from "../controllers/salesController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const salesRouter = Router();

salesRouter.get("/", asyncHandler(getSales));
salesRouter.post("/", asyncHandler(postSale));
