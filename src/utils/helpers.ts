import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { PaginationRequest } from "../types/requestTypes";

const saltRounds = 10;

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const verifyPassword = (plain: string, hashed: string) => {
  return bcrypt.compareSync(plain, hashed);
};

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }
  next();
};

export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id && req.user?.id !== req.params.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
};

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
