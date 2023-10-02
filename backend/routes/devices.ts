import express from "express";
import { Request, Response } from "express";
import Database from "better-sqlite3";
import { Options } from "better-sqlite3";

const router = express.Router();

// add the options for the database
// API docs: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
const options: Options = {
  verbose: console.log,
  fileMustExist: true,
  timeout: 50000,
};
const db = new Database("network.sqlite", options);
db.pragma("journal_mode = WAL");

router.get("/", (req: Request, res: Response) => {
  // make the sql query here
  const row = db.prepare("SELECT * FROM device").all();
  res.status(200).json(row);
});

export default router;
