import { prisma } from "../db/client";

import { app } from "./octokit";

export default async function remapAllInstallsToMembers() {
  const allOrgInstalls = await prisma.installation.findMany({
    where: { installed_on_organization: true },
  });

  await Promise.all(
    allOrgInstalls.map(async (install) => {
      const octokit = await app.getInstallationOctokit(install.id);
      const { data: orgMembers } = await octokit.request(
        "GET /orgs/{org}/members{?filter,role,per_page,page}",
        {
          org: install.installed_on_login,
        }
      );
      await Promise.all(
        orgMembers.map(async ({ id: memberGithubId }: { id: number }) => {
          const user = await prisma.user.findFirst({
            where: { github_id: memberGithubId },
            include: {
              usersToInstallations: { include: { installation: true } },
            },
          });
          if (user) {
            // see if the connection has been made to the install
            const userMatchingInstalls = user.usersToInstallations
              .flatMap((i) => i.installation)
              .filter((installation) => installation.id === install.id);
            const userHasConnection = Boolean(userMatchingInstalls.length);
            if (!userHasConnection) {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  usersToInstallations: {
                    create: [{ installationId: install.id }],
                  },
                },
              });
            }
          }
        })
      );
    })
  );
}
