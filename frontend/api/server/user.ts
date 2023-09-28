/**
 * Some functions to interface with user api from frontend server.
 */

import { HttpStatus } from "@/api/constants";
import { USER_API } from "@/api/routes";
import { User, UserZod } from "@/api/user/types";

class UserDoesNotExist extends Error {}

export async function getUserInfoServerSide(userEmail: string) {
  //TODO: Remove when finished dev
  if (process.env.USER_BACKEND_MODE === "LOCAL") {
    return { isAdmin: true };
  }
  try {
    const res = await fetch(
      `${process.env.USER_API as string}${USER_API}/${userEmail}`,
    );
    if (res.status === HttpStatus.NOT_FOUND) {
      throw new UserDoesNotExist();
    }
    const userData = await res.json();
    UserZod.parse(userData);
    return userData as User;
  } catch (e) {
    console.log(e);
  }
}
