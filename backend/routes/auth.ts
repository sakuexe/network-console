import express from "express";
import { Request, Response } from "express";
import Database from "better-sqlite3";
import { Options } from "better-sqlite3";
/*
 * Documentation for the better-sqlite3 library:
 * API docs: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
 * Safe queries: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#getbindparameters---row
 */

const router = express.Router();

const options: Options = {
  verbose: console.log,
  fileMustExist: true,
  timeout: 50000,
};

const db = new Database("network.sqlite", options);
db.pragma("journal_mode = WAL");

type LoginRequest = {
  username: string;
  password: string;
};

// POST login request
router.post("/", (req: Request, res: Response) => {
  const { username, password }: LoginRequest = req.body;
  console.log(req.body);
  // prepare the query to prevent SQL injection
  const query = "SELECT * FROM admin WHERE username = ? AND password = ?";
  // get the admin user from the database by inserting the username and password
  // into the query, safely
  const adminUser = db.prepare(query).get(username, password);
  if (!adminUser) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.status(200).json({ message: "Login successful" });
});

export default router;
