import express from "express";
import { Request, Response } from "express";
import Database from "better-sqlite3";
import { Options } from "better-sqlite3";
import createAdmin from "../utils/createadmin";
/*
 * Documentation for the better-sqlite3 library:
 * API docs: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
 * Safe queries: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#getbindparameters---row
 */

// create a new admin user if one doesn't exist
// with the username and password from the .env file
// or the env variables
createAdmin();

const router = express.Router();

const options: Options = {
  verbose: console.log,
  fileMustExist: true,
  timeout: 50000,
};

type LoginRequest = {
  username: string;
  password: string;
};

// Login authentication
router.post("/", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  // allow the dev user to login without a password
  // in development mode
  if (process.env.NODE_ENV === "dev" && req.body.username === "dev") {
    return res
      .status(200)
      .json({ success: true, message: "Login successful, redirecting..." });
  }
  // check if the username is provided
  if (!req.body.username) {
    return res.status(400).json({ success: false, message: "No username" });
  }
  // check if the password is provided
  if (!req.body.password) {
    return res.status(400).json({ success: false, message: "No password" });
  }
  // if all guard clauses pass, continue the authentication
  const db = new Database("network.sqlite", options);
  db.pragma("journal_mode = WAL");

  const { username, password }: LoginRequest = req.body;
  const query = "SELECT * FROM admin WHERE username = ? AND password = ?";
  let adminUser;

  try {
    adminUser = db.prepare(query).get(username, password);
    db.close();
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
  if (!adminUser) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials provided" });
  }
  return res
    .status(200)
    .json({ success: true, message: "Login successful, redirecting..." });
});

export default router;
