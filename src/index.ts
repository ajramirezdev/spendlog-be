import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import { connectToDB, mongooseConnection } from "./config/db";
import MongoStore from "connect-mongo";

import AuthRoutes from "./routes/auth.route";
import ExpenseRoutes from "./routes/expense.route";

const app = express();
const PORT = process.env.PORT ?? 3000;

connectToDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? true,
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // expires in 1 day
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
    store: MongoStore.create({
      client: mongooseConnection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", AuthRoutes);
app.use("/api/expenses", ExpenseRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to SpendLog BE!");
});

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
