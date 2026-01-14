import { Router } from "express";
import {
  getEnquiries,
  postEnquiry,
  putEnquiry,
} from "../controllers/enquiryController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const enquiryRouter = Router();

enquiryRouter.get("/", asyncHandler(getEnquiries));
enquiryRouter.post("/", asyncHandler(postEnquiry));
enquiryRouter.put("/:id", asyncHandler(putEnquiry));
