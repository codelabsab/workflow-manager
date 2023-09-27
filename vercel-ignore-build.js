const https = require("https");

const vercelEnv = process.env.VERCEL_ENV;

const HOOK_NAME = "Deploy from github";
const VERCEL_TARGET = "vercel-hook-only-deploy";
const VERCEL_TEAM_ID = "team_vB8B9iCJ4406ANNFh8JbXMZs";

const options = {
  hostname: "api.vercel.com",
  port: 443,
  path: `/v13/deployments/${process.env.VERCEL_URL}?teamId=${VERCEL_TEAM_ID}`,
  method: "GET",
  headers: {
    Authorization: `Bearer ${process.env.VERCEL_API_ACCESS_TOKEN}`,
  },
};

let data = "";

const req = https.request(options, (res) => {
  res.on("data", (d) => {
    data += d.toString();
  });
  res.on("end", (d) => {
    const parsedData = JSON.parse(data);
    console.log("parsedData", parsedData);
    let prodRunningFromDeployHook;

    prodRunningFromDeployHook =
      parsedData.target === VERCEL_TARGET &&
      parsedData.meta.deployHookName === HOOK_NAME;

    console.log({
      target: parsedData.target,
      hook: parsedData.meta.deployHookName,
    });

    if (vercelEnv === VERCEL_TARGET && !prodRunningFromDeployHook) {
      console.log("🛑 - Build cancelled");
      process.exit(0);
    } else {
      console.log("✅ - Build can proceed");
      process.exit(1);
    }
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.end();
