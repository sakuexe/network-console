import express from "express";
import { Request, Response } from "express";
import Database from "better-sqlite3";
import { Options } from "better-sqlite3";

const router = express.Router();
const frontendUrl = `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`;

// add the options for the database
// API docs: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
const options: Options = {
  verbose: console.log,
  fileMustExist: true,
  timeout: 50000,
};

const db = new Database("network.sqlite", options);
db.pragma("journal_mode = WAL");

router
  .route("/:id")

  .get((req: Request, res: Response) => {
    // get the device data
    const deviceId = req.params.id;
    // prepare the query to prevent SQL injection
    const query = "SELECT * FROM device WHERE id = ?";
    // get the admin user from the database by inserting the username and password
    // into the query, safely
    const device = db.prepare(query).get(deviceId);
    console.log(device);
    if (!device) {
      return res.status(401).json({ error: "Device not found" });
    }
    res.status(200).json(device);
  })

  .post((req: Request, res: Response) => {
    // modify the device data
    const deviceId = req.params.id;
    res
      .status(200)
      .json({
        message: "Device information updated successfully",
        form: req.body,
      });
  });

router.get("/", (req: Request, res: Response) => {
  // make the sql query here
  const row = db.prepare("SELECT * FROM device").all();
  res.status(200).json(row);
});

export default router;
