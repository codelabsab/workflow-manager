import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import "styles/globals.css";
import AuthWrapper from "components/AuthWrapper";
import { trpc } from "utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AuthWrapper loginRedirectPath="/api/auth/signin?callbackUrl=%2F">
        <Component {...pageProps} />
      </AuthWrapper>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
