import path from "path";
import { fileURLToPath } from "url";

import axios from "axios";
import dotenv from "dotenv";
import cron from "node-cron";
import z from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const envSchema = z.object({
  BASE_URL: z.string().url(),
  GENERIC_SCHEDULER_AUTH_SECRET: z.string(),
});
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:\n", _env.error.format());
  throw new Error("Invalid environment variables");
}

const env = _env.data;

const EVERY_MINUTE = "* * * * *";

cron.schedule(EVERY_MINUTE, async () => {
  console.log("running");

  const url = `${env.BASE_URL}/api/cron/generic`;
  console.log(`Executing ${url}`);

  const response = await axios.post(
    url,
    {},
    {
      headers: {
        "cron-shared-secret": env.GENERIC_SCHEDULER_AUTH_SECRET,
      },
    }
  );
  console.log(`response.status: ${response.status}`);
});
