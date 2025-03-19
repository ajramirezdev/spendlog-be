import { Request, Response, NextFunction } from "express";
import { PaginationRequest } from "../types/requestTypes";

export const paginate = (
  req: PaginationRequest,
  res: Response,
  next: NextFunction
) => {
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const skip = (page - 1) * limit;

  req.pagination = { page, limit, skip };
  next();
};
