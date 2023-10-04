import express from "express";
import { Request, Response } from "express";
import Database from "better-sqlite3";
import { Options } from "better-sqlite3";
import dotenv from "dotenv";
/*
 * Documentation for the better-sqlite3 library:
 * API docs: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
 * Safe queries: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#getbindparameters---row
 */

dotenv.config();

const frontendUrl = `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`;

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

// ensure that the user is logged in
router.use((req, res, next) => {
  console.log(req.body);
  const { username, password }: LoginRequest = req.body;
  // prepare the query to prevent SQL injection
  const query = "SELECT * FROM admin WHERE username = ? AND password = ?";
  // get the admin user from the database by inserting the username and password
  // into the query, safely
  const adminUser = db.prepare(query).get(username, password);
  if (!adminUser) {
    return res.status(401).redirect(`${frontendUrl}/login?success=false`);
  }
  next();
});

// POST login request
router.post("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  return;
});

export default router;
