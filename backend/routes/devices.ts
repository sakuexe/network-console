import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import { Options } from "better-sqlite3";

const router = express.Router();

dotenv.config();

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

router.post("/add", (req: Request, res: Response) => {
  // add a new device
  // prepare the query to prevent SQL injection
  const query = `INSERT INTO device
    (type, ip_address, name, model, url, notes)
    VALUES (?, ?, ?, ?, ?, ?)`;
  try {
    db.prepare(query).run(
      req.body.type,
      req.body.ip_address,
      req.body.name,
      req.body.model,
      req.body.url,
      req.body.notes,
    );
    res.status(200).redirect(frontendUrl);
  } catch (error) {
    res.status(401).redirect(frontendUrl + "/manage/add?error=true");
  }
});

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
    if (!device) {
      return res.status(401).json({ error: "Device not found" });
    }
    res.status(200).json(device);
  })

  .post((req: Request, res: Response) => {
    // modify the device data
    const deviceId = req.params.id;
    // prepare the query to prevent SQL injection
    const query = `UPDATE device 
      SET type = ? ,
      ip_address = ?, 
      name = ?, 
      model = ?,
      url = ?,
      notes = ?
      WHERE id = ?`;
    try {
      db.prepare(query).run(
        req.body.type,
        req.body.ip_address,
        req.body.name,
        req.body.model,
        req.body.url,
        req.body.notes,
        deviceId,
      );
      res.status(200).json({
        message: "Device information updated successfully",
        form: req.body,
      });
    } catch (error) {
      res
        .status(401)
        .json({ message: "Device couldn't be updated", error: error });
    }
  });

router.get("/", (req: Request, res: Response) => {
  // make the sql query here
  const row = db.prepare("SELECT * FROM device").all();
  res.status(200).json(row);
});

export default router;
