import { Router } from "express";
import {
  getDealer,
  getDealers,
  postDealer,
  putDealer,
  removeDealer,
} from "../controllers/dealerController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dealerRouter = Router();

dealerRouter.get("/", asyncHandler(getDealers));
dealerRouter.get("/:id", asyncHandler(getDealer));
dealerRouter.post("/", asyncHandler(postDealer));
dealerRouter.put("/:id", asyncHandler(putDealer));
dealerRouter.delete("/:id", asyncHandler(removeDealer));
