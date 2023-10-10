import { Database } from "better-sqlite3";

export default function logClient(db: Database, ip: string) {
  const clientIp: string | null = ip.split(":").pop() || null;
  try {
    const createQuery = `CREATE TABLE IF NOT EXISTS client (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    db.prepare(createQuery).run();

    const query = `INSERT INTO client (ip_address) VALUES (?)`;
    db.prepare(query).run(clientIp);
  } catch (error) {
    console.log(error);
  }
}
