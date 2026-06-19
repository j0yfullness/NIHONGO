import { createClient } from "@libsql/client";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log("Testing direct libsql client...");
const direct = createClient({ url, authToken });
const r = await direct.execute("SELECT 1 as test");
console.log("  Direct libsql works:", r.rows);
await direct.close();

console.log("Testing Prisma adapter...");
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });
const result = await prisma.$queryRawUnsafe("SELECT 1 as test");
console.log("  Prisma adapter works:", result);
await prisma.$disconnect();
