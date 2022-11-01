import type { Account } from "next-auth";

import { prisma } from "../db/client";

export default async function getGithubAccount(userId: string) {
  const dbUser = await prisma.user.findFirstOrThrow({
    where: { id: userId },
    include: { accounts: true },
  });

  const githubAccounts =
    (dbUser?.accounts as Account[]).filter(
      (account) => account.provider === "github" && account.access_token
    ) || [];

  if (!githubAccounts.length) {
    throw new Error("Could not retrieve account!");
  }

  const account = githubAccounts[0] ? githubAccounts[0] : null;
  if (!account?.access_token) {
    throw new Error("Access token missing!");
  }
  if (!account?.refresh_token) {
    throw new Error("refresh_token missing!");
  }

  return account as Account & {
    id: string;
    access_token: string;
    refresh_token: string;
  };
}
