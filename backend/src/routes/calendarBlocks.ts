import { Router } from "express";
import {
  getCalendarBlocks,
  postCalendarBlock,
  putCalendarBlock,
  removeCalendarBlock,
} from "../controllers/calendarBlockController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const calendarBlockRouter = Router();

calendarBlockRouter.get("/", asyncHandler(getCalendarBlocks));
calendarBlockRouter.post("/", asyncHandler(postCalendarBlock));
calendarBlockRouter.put("/:id", asyncHandler(putCalendarBlock));
calendarBlockRouter.delete("/:id", asyncHandler(removeCalendarBlock));
