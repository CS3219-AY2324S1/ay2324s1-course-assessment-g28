import { HttpMethod, HttpStatus } from "@/api/constants";
import { RequestError } from "@/api/errors";
import { USER_API, getQuestionAttemptPath } from "@/api/routes";
import { AttemptedQuestionDetails, AttemptedQuestionDetailsZod, CreateUserRequestBody, User, UserZod } from "@/api/user/types";

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

export async function getQuestionAttempt(attemptId: number) {
  const res = await fetch(getQuestionAttemptPath(attemptId), {
    method: HttpMethod.GET,
  });
  if (res.status !== HttpStatus.OK) {
    throw new RequestError(res);
  }
  const body = await res.json();
  AttemptedQuestionDetailsZod.parse(body);
  return body as AttemptedQuestionDetails;
}

export async function deleteUser() {
  const res = await fetch(USER_API, {
    method: HttpMethod.DELETE,
  });
  if (res.status !== HttpStatus.OK_NO_CONTENT) {
    throw new RequestError(res);
  }
}

export async function deleteQuestionAttempt(attemptId: number) {
  const res = await fetch(getQuestionAttemptPath(attemptId), {
    method: HttpMethod.DELETE
  })
  if (res.status !== HttpStatus.OK_NO_CONTENT) {
    throw new RequestError(res);
  }
}

export async function addUser(userInfo: CreateUserRequestBody) {
  const res = await fetch(USER_API, {
    method: HttpMethod.POST,
    body: JSON.stringify(userInfo),
  });
  if (res.status !== HttpStatus.OK_NO_CONTENT) {
    throw new RequestError(res);
  }
}

export async function updateUser(userInfo: CreateUserRequestBody) {
  const res = await fetch(USER_API, {
    method: HttpMethod.PATCH,
    body: JSON.stringify(userInfo),
  });
  if (res.status !== HttpStatus.OK_NO_CONTENT) {
    throw new RequestError(res);
  } 
}
