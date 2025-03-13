import express from "express";

import connectToDB from "./config/db";
import UserRoutes from "./routes/user.route";

const app = express();
const PORT = process.env.PORT ?? 3000;

connectToDB();

app.use(express.json());

app.use("/api/users", UserRoutes);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
