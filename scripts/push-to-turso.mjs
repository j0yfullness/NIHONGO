import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

console.log("Connecting to:", url);

const client = createClient({ url, authToken });

const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
const existing = tables.rows.map(r => r.name);
console.log("Existing tables:", existing);

if (existing.length === 0) {
  const sql = readFileSync(resolve("prisma/schema.sql"), "utf-8");
  const statements = sql.split(";").map(s => s.trim()).filter(s => s.length > 0);
  for (const stmt of statements) {
    console.log("Executing:", stmt.slice(0, 60) + "...");
    await client.execute(stmt + ";");
  }
  console.log("Schema pushed successfully");
} else {
  console.log("Tables already exist, skipping schema push");
}

await client.close();
