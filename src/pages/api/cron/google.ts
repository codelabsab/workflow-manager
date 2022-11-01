import type { NextApiRequest, NextApiResponse } from "next";

import { env } from "env/server.mjs";
import runScheduled from "server/utils/runScheduled";

const GoogleCron = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestSecret = req.headers["cron-shared-secret"];
  if (requestSecret !== env.GOOGLE_CLOUD_SCHEDULER_AUTH_SECRET) {
    res.status(401).end("Access denied, please supply the correct header");
  }
  if (req.method === "POST") {
    try {
      await runScheduled();

      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ statusCode: 500, message: (err as Error).message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default GoogleCron;
