import { Router } from "express";
import {
  getBookings,
  postBooking,
  putBooking,
} from "../controllers/bookingController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const bookingRouter = Router();

bookingRouter.get("/", asyncHandler(getBookings));
bookingRouter.post("/", asyncHandler(postBooking));
bookingRouter.put("/:id", asyncHandler(putBooking));
