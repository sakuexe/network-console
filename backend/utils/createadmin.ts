import Database from "better-sqlite3";
import { Options } from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const options: Options = {
  verbose: console.log,
  fileMustExist: true,
  timeout: 50000,
};

const db = new Database("network.sqlite", options);
db.pragma("journal_mode = WAL");

function adminUserExists() {
  let adminUser;
  try {
    const query = "SELECT * FROM admin";
    adminUser = db.prepare(query).get();
  } catch (error: unknown) {
    console.error(error);
  }
  return adminUser;
}

export default function createAdmin() {
  if (adminUserExists()) {
    return;
  }
  if (process.env.NODE_ENV === "dev") {
    return;
  }
  const query = "INSERT INTO admin (username, password) VALUES (?, ?)";
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  db.prepare(query).run(username, password);
}
