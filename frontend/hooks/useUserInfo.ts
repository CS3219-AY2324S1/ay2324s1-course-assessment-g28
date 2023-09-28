import { useSession } from "next-auth/react";

export enum UserStatus {
  LOADING = "loading",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

export default function useUserInfo() {
  const { data, status } = useSession() ?? {};
  const { user } = data ?? {};
  const name = user?.name;
  const image = user?.image;
  const isLoading = status === UserStatus.LOADING;
  const isSignedIn = status === UserStatus.AUTHENTICATED;
  const isNotSignedIn = status === UserStatus.UNAUTHENTICATED;
  //@ts-ignore
  const username = user?.username;

  return { user, isLoading, isSignedIn, isNotSignedIn, image, name, username };
}
