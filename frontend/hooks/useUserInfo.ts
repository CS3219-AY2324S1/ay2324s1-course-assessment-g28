import { useSession } from "next-auth/react";

export enum UserStatus {
  LOADING = "loading",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

export default function useUserInfo() {
  const { data, status } = useSession() ?? {};
  const { user } = data ?? {};
  const isSignedIn = status === UserStatus.AUTHENTICATED;

  return { user, isSignedIn };
}
