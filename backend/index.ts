import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import devicesRouter from "./routes/devices";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.status(500).send("Hello World!");
});

app.use("/devices", devicesRouter);

app.listen(port, () => {
  console.log(`[💾]: Server is running at http://localhost:${port}`);
});
