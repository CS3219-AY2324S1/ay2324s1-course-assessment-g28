/**
 * Some functions to interface with user api from frontend server.
 */

import { USER_API } from "@/api/routes";
import { User, UserZod } from "@/api/user/types";

export async function getUserInfoServerSide(userEmail: string) {
  try {
    const res = await fetch(
      `${process.env.USER_API as string}${USER_API}/${userEmail}`,
    );
    const userData = await res.json();
    UserZod.parse(userData);
    return userData as User;
  } catch (e) {
    console.log(e);
    // TODO: should not be necessary when use api is up, just throw the error
    return {isAdmin: false}
  }
}
