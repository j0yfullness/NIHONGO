import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;

const adapter = new PrismaLibSql({
  url,
  ...(authToken ? { authToken } : {}),
});
const prisma = new PrismaClient({ adapter });

export default prisma;
