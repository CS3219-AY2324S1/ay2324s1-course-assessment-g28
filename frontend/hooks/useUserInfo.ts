import { useSession } from "next-auth/react";

export enum UserStatus {
  LOADING = "loading",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

export default function useUserInfo() {
  const { data, status } = useSession() ?? {};
  const { name, image, username, email } = data?.user ?? {};

  const isLoading = status === UserStatus.LOADING;
  const isSignedIn = status === UserStatus.AUTHENTICATED;
  const isNotSignedIn = status === UserStatus.UNAUTHENTICATED;

  return {
    isLoading,
    isSignedIn,
    isNotSignedIn,
    image,
    name,
    username,
    email,
  };
}
