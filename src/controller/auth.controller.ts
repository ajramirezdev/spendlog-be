import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { hashPassword } from "../utils/helpers";

import User from "../model/user.model";

export const login = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
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
    console.log(validatedData);
    validatedData.password = hashPassword(validatedData.password);
    console.log(validatedData);

    const user = new User(validatedData);
    const newUser = await user.save();

    req.logIn(newUser, (error) => {
      if (error) {
        res.status(500).json({ error: "Login failed after signup." });
        return;
      }
      res.status(201).json(newUser);
    });
  } catch (error) {
    res.status(500).json({ error: "User creation failed." });
  }
};
