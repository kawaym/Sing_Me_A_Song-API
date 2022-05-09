import { NextFunction, Request, Response } from "express";
import errorUtils from "../utils/errorUtils.js";
import { AppError } from "../utils/errorUtils.js";

export function errorHandlerMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (errorUtils.isAppError(err)) {
    return res
      .status(errorUtils.errorTypeToStatusCode(err.type))
      .send(err.message);
  }

  return res.sendStatus(500);
}
