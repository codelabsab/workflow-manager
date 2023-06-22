import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "styles/globals.css";
import AuthWrapper from "components/AuthWrapper";
import { trpc } from "utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <ToastContainer />
      <SessionProvider session={session}>
        <AuthWrapper loginRedirectPath="/api/auth/signin?callbackUrl=%2F">
          <Component {...pageProps} />
        </AuthWrapper>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
