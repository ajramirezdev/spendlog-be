import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";

import User from "../model/user.model";

export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const validatedData = matchedData(req);
  const user = new User(validatedData);

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.sendStatus(400);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.sendStatus(400);
  }
};
