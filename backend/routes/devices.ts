import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import { Options } from "better-sqlite3";
import validateDevice from "../utils/validatedevice";
import logClient from "../utils/logclient";

const router = express.Router();

dotenv.config();

// add the options for the database
// API docs: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
const options: Options = {
  verbose: console.log,
  fileMustExist: true,
  timeout: 50000,
};

router.post("/add", (req: Request, res: Response) => {
  const db = new Database("network.sqlite", options);
  db.pragma("journal_mode = WAL");

  console.log(req.body);
  if (!validateDevice(req.body)) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid device data" });
  }

  const query = `INSERT INTO device
    (type, ip_address, name, model, url, notes)
    VALUES (?, ?, ?, ?, ?, ?)`;

  try {
    db.prepare(query).run(
      req.body.type.trim(),
      req.body.ip_address.trim(),
      req.body.name.trim(),
      req.body.model.trim(),
      req.body.url.trim(),
      req.body.notes.trim(),
    );
    return res.status(200).json({
      success: true,
      messsage: "Device added to the database successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error adding to the database, re-check device values",
    });
  } finally {
    db.close();
  }
});

router.post("/remove/:id", (req: Request, res: Response) => {
  const db = new Database("network.sqlite", options);
  db.pragma("journal_mode = WAL");
  const deviceId = req.params.id;
  // prepare the query to prevent SQL injection
  const query = "DELETE FROM device WHERE id = ?";
  try {
    db.prepare(query).run(deviceId);
    res
      .status(200)
      .json({ success: true, message: "Device removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error removing device from database" });
  } finally {
    db.close();
  }
});

router
  .route("/:id")

  .get((req: Request, res: Response) => {
    const db = new Database("network.sqlite", options);
    db.pragma("journal_mode = WAL");
    // get the device data
    const deviceId = req.params.id;
    // prepare the query to prevent SQL injection
    const query = "SELECT * FROM device WHERE id = ?";
    // get the admin user from the database by inserting the username and password
    // into the query, safely
    const device = db.prepare(query).get(deviceId);
    db.close();
    if (!device) {
      return res.status(401).json({ error: "Device not found" });
    }
    res.status(200).json(device);
  })

  .post((req: Request, res: Response) => {
    const db = new Database("network.sqlite", options);
    db.pragma("journal_mode = WAL");
    // modify the device data
    const deviceId = req.params.id;
    console.log(deviceId);
    console.log(req.body);
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
        req.body.type.trim(),
        req.body.ip_address.trim(),
        req.body.name.trim(),
        req.body.model.trim(),
        req.body.url.trim(),
        req.body.notes.trim(),
        deviceId,
      );
      res.status(200).json({
        message: "Device information updated successfully",
      });
    } catch (error) {
      res
        .status(401)
        .json({ message: "Device couldn't be updated", error: error });
    } finally {
      db.close();
    }
  });

router.get("/", (req: Request, res: Response) => {
  const db = new Database("network.sqlite", options);
  db.pragma("journal_mode = WAL");
  // make the sql query here
  const row = db.prepare("SELECT * FROM device").all();
  logClient(db, req.ip);
  db.close();
  res.status(200).json(row);
});

export default router;
