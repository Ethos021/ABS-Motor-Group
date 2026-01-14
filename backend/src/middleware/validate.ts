import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { HttpError } from "./errorHandler.js";

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new HttpError(400, result.error.issues.map((i) => i.message).join(", "))
      );
    }

    req.body = result.data;
    return next();
  };
