import { App } from "octokit";

import { env } from "../../env/server.mjs";

export const app = new App({
  appId: env.GITHUB_APP_ID,
  privateKey: Buffer.from(env.GITHUB_APP_PRIVATE_KEY, "base64").toString(
    "utf8"
  ),
  oauth: {
    clientId: env.GITHUB_APP_CLIENT_ID,
    clientSecret: env.GITHUB_APP_CLIENT_SECRET,
  },
});
