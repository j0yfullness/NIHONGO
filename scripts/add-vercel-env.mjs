import { execSync } from "child_process";

const vercelCmd =
  "C:\\Users\\User\\AppData\\Roaming\\npm\\vercel.cmd";
const cwd = "C:\\Users\\User\\Documents\\codingan\\HANYU";
const token = process.env.TURSO_AUTH_TOKEN;

try {
  const result = execSync(
    `"${vercelCmd}" env add TURSO_AUTH_TOKEN production --sensitive`,
    {
      cwd,
      input: token + "\ny\n",
      encoding: "utf8",
      timeout: 15000,
      env: { ...process.env, PATH: process.env.PATH },
    }
  );
  console.log("Output:", result);
} catch (e) {
  console.log("Error:", e.message);
  if (e.stdout) console.log("stdout:", e.stdout);
  if (e.stderr) console.log("stderr:", e.stderr);
}
