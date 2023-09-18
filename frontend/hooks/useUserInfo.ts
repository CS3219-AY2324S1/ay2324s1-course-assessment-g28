import { useSession } from "next-auth/react";

export default function useUserInfo() {
  return useSession().data?.user;
}
