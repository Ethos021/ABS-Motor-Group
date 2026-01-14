import { Router } from "express";
import {
  getStaff,
  postStaff,
  putStaff,
} from "../controllers/staffController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const staffRouter = Router();

staffRouter.get("/", asyncHandler(getStaff));
staffRouter.post("/", asyncHandler(postStaff));
staffRouter.put("/:id", asyncHandler(putStaff));
