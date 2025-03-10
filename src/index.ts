import express from "express";

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
