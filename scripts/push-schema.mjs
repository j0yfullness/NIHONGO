import { execSync } from "child_process";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const sql = execSync(
  "npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script",
  { encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } }
);

const sqlStart = sql.indexOf("-- CreateTable");
const cleanSql = sqlStart >= 0 ? sql.slice(sqlStart) : sql;

const client = createClient({ url, authToken });

const tables = await client.execute(
  "SELECT name FROM sqlite_master WHERE type='table'"
);
const existing = tables.rows.map((r) => r.name);
console.log("Existing tables:", existing);

if (existing.length === 0) {
  const sqlStmts = cleanSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const s of sqlStmts) {
    const execSql = s + ";";
    console.log(">", execSql.slice(0, 70));
    await client.execute(execSql);
  }
  console.log("Schema pushed successfully!");
} else {
  console.log("Tables already exist, skipping schema push");
}

await client.close();
