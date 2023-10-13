import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import devicesRouter from "./routes/devices";
import authRouter from "./routes/auth";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app: Express = express();

// allow to parse json information from the request body
app.use(express.json());

// this is a way to use middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(500).send("Hello World!");
});

app.get("/ip", (req: Request, res: Response) => {
  res.status(200).json({ ip: req.ip });
});

app.use("/devices", devicesRouter);

app.use("/login", authRouter);

app.listen(PORT, () => {
  console.log(`[💾]: Server is running at http://localhost:${PORT}`);
});
