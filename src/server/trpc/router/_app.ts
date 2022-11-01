import { router } from "../trpc";

import { authRouter } from "./auth";
import { githubRouter } from "./github";

export const appRouter = router({
  auth: authRouter,
  github: githubRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
