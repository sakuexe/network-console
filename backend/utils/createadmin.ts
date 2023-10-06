import Database from "better-sqlite3";
import { Options } from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

type Database = typeof Database;

const options: Options = {
  verbose: console.log,
  fileMustExist: true,
  timeout: 50000,
};

function ensureAdminTableExists(db: Database.Database) {
  const query = `CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`;
  db.prepare(query).run();
}

function adminUserExists(db: Database.Database) {
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
  const db = new Database("network.sqlite", options);
  db.pragma("journal_mode = WAL");

  ensureAdminTableExists(db);
  if (adminUserExists(db)) {
    return;
  }
  const query = "INSERT INTO admin (username, password) VALUES (?, ?)";
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  db.prepare(query).run(username, password);
  db.close();
}
