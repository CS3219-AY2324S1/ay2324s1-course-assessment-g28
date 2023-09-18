import { HttpMethod, HttpStatus } from "@/api/constants";
import { RequestError } from "@/api/errors";
import { USER_API } from "@/api/routes";
import { User, UserZod } from "@/api/user/types";

/**
 * Returns info for the logged in user.
 */
export async function getOwnUserInfo() {
  const res = await fetch(USER_API, {
    method: HttpMethod.GET,
  });
  if (res.status !== HttpStatus.OK) {
    throw new RequestError(res);
  }
  const body = await res.json();
  UserZod.parse(body);
  return body as User;
}