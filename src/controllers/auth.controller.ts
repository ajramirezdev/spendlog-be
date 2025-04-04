import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { hashPassword } from "../utils/auth.helpers";

import User from "../models/user.model";

export const login = (req: Request, res: Response) => {
  res.sendStatus(200);
};

export const logout = (req: Request, res: Response) => {
  req.logOut((error) => {
    if (error) {
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
};

export const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const validatedData = matchedData(req);
    validatedData.password = hashPassword(validatedData.password);

    const user = new User({ ...validatedData, provider: "local" });
    const newUser = await user.save();

    req.logIn(newUser, (error) => {
      if (error) {
        res.status(500).json({ error: "Login failed after signup." });
        return;
      }
      res.sendStatus(201);
    });
  } catch (error) {
    res.status(500).json({ error: "User creation failed." });
  }
};

export const getCurrentUser = (req: Request, res: Response) => {
  res.status(200).json(req.user);
};

export const redirectToHomepage = (req: Request, res: Response) => {
  res.redirect(process.env.FRONTEND_URL ?? "");
};
