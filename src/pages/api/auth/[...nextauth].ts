// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { Octokit } from "octokit";

import { env } from "env/server.mjs";
import { prisma } from "server/db/client";
import getGithubAccount from "server/utils/getGithubAccount";
import refreshAndStoreNewAccessToken from "server/utils/refreshAndStoreNewAccessToken";
import remapAllInstallsToMembers from "server/utils/remapAllInstallsToMembers";

export const authOptions: NextAuthOptions = {
  debug: false,
  // Include user.id on session
  callbacks: {
    async session({ session, user }) {
      const account = await getGithubAccount(user.id);

      const now = Date.now();
      const accessTokenExpiresAt =
        account?.expires_at && account.expires_at * 1000;

      const accessTokenHasExpired =
        accessTokenExpiresAt && now > accessTokenExpiresAt;
      if (accessTokenHasExpired) {
        await refreshAndStoreNewAccessToken(user.id);
      }
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_APP_CLIENT_ID,
      clientSecret: env.GITHUB_APP_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  events: {
    linkAccount: async (message) => {
      console.log("linkAccount", message);
      // Attache the githubId to the user
      const octokit = new Octokit({ auth: message.account.access_token });
      const response = await octokit.request("GET /user", {});
      await prisma.user.update({
        where: { id: message.user.id },
        data: {
          github_id: Number(message.profile.id),
          github_username: response.data.login,
        },
      });
      await remapAllInstallsToMembers();
    },
    signIn: async () => {
      // If another user of the same organization installs the app, the new install will be linked at signIn
      await remapAllInstallsToMembers();
    },
  },
};

export default NextAuth(authOptions);
