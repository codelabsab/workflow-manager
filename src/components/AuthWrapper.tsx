import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

type AuthWrapperProps = {
  loginRedirectPath: string;
  children: React.ReactNode;
};

const AuthWrapper = ({
  children,
  loginRedirectPath,
}: AuthWrapperProps): JSX.Element | null => {
  const { status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && router.pathname !== loginRedirectPath) {
      router.push(loginRedirectPath);
    }
  }, [loginRedirectPath, router, status]);

  if (router.pathname === loginRedirectPath || status === "authenticated") {
    return <>{children}</>;
  }

  return null;
};

export default AuthWrapper;
