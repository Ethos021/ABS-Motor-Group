import { Router } from "express";
import {
  getCustomer,
  getCustomers,
  postCustomer,
  putCustomer,
  removeCustomer,
} from "../controllers/customerController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const customerRouter = Router();

customerRouter.get("/", asyncHandler(getCustomers));
customerRouter.get("/:id", asyncHandler(getCustomer));
customerRouter.post("/", asyncHandler(postCustomer));
customerRouter.put("/:id", asyncHandler(putCustomer));
customerRouter.delete("/:id", asyncHandler(removeCustomer));
