import { prisma } from "../db/client";

import getGithubAccount from "./getGithubAccount";
import { refreshAccessToken } from "./refreshAccessToken";

export default async function refreshAndStoreNewAccessToken(userId: string) {
  const account = await getGithubAccount(userId);
  const newToken = await refreshAccessToken(account.refresh_token);

  if (newToken.error) {
    throw new Error(newToken.error);
  }

  const data = {
    access_token: newToken.accessToken,
    expires_at: Math.floor(Date.now() / 1000) + newToken.accessTokenExpiresIn,
    refresh_token: newToken.refreshToken,
    refresh_token_expires_in: newToken.refreshTokenExpiresIn,
  };

  const updated = await prisma.account.update({
    where: { id: account.id },
    data,
  });

  return updated;
}
