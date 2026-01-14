import { Router } from "express";
import multer from "multer";
import { uploadInventory } from "../controllers/csvController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const csvRouter = Router();

csvRouter.post(
  "/inventory",
  upload.single("file"),
  asyncHandler(uploadInventory)
);
