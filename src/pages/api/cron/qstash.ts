import { verifySignature } from "@upstash/qstash/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

import runScheduled from "server/utils/runScheduled";

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
