import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  res.status(200).json(req.user);
};

export const logout = (req: Request, res: Response) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  req.logOut((error) => {
    if (error) {
      res.sendStatus(401);
    }
    res.sendStatus(200);
  });
};

export const getStatus = (req: Request, res: Response) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  res.status(200).json(req.user);
};
