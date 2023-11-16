import { HttpMethod, HttpStatus, jsonRequestHeaders } from "@/api/constants";
import { RequestError } from "@/api/errors";
import {
  QUESTION_ATTEMPT_API,
  QUESTION_ATTEMPT_API_DIRECTORY,
  USER_API,
  getIsUsernameExistsPath,
  getQuestionAttemptPath,
  getRoute,
  getUserPublicInfoPath,
} from "@/api/routes";
import {
  AttemptedQuestionDetails,
  AttemptedQuestionDetailsZod,
  CreateQuestionAttemptRequestBody,
  CreateUserRequestBody,
  User,
  UserExists,
  UserExistsZod,
  UserPublic,
  UserPublicZod,
  UserZod,
} from "@/api/user/types";

/**
 * Returns info for the logged in user.
 */
export async function getOwnUserInfo() {
  const res = await fetch(getRoute(USER_API, false), {
    method: HttpMethod.GET,
    headers: jsonRequestHeaders,
  });
  if (res.status !== HttpStatus.OK) {
    throw new RequestError(res);
  }
  const body = await res.json();
  UserZod.parse(body);
  return body as User;
}

/**
 * Fetch publicly available info on a user.
 */
export async function getPublicUserInfo(email: string) {
  const res = await fetch(getUserPublicInfoPath(email), {
    method: HttpMethod.GET,
    headers: jsonRequestHeaders,
  });
  if (res.status !== HttpStatus.OK) {
    throw new RequestError(res);
  }
  const body = await res.json();
  UserPublicZod.parse(body);
  return body as UserPublic;
}

export async function getQuestionAttempt(
  attemptId: number,
  isServerSide?: boolean,
  email?: string, // user email for serverside
) {
  let res;
  if (isServerSide) {
    // get the user email from the session
    res = await fetch(
      `${
        process.env.USER_API
      }${USER_API}/${email}${QUESTION_ATTEMPT_API_DIRECTORY}/${attemptId.toString()}`,
      {
        method: HttpMethod.GET,
        headers: jsonRequestHeaders,
      },
    );
  } else {
    res = await fetch(getQuestionAttemptPath(attemptId), {
      method: HttpMethod.GET,
      headers: jsonRequestHeaders,
    });
  }

  if (res.status !== HttpStatus.OK) {
    throw new RequestError(res);
  }
  const body = await res.json();
  AttemptedQuestionDetailsZod.parse(body);
  return body as AttemptedQuestionDetails;
}

export async function deleteUser() {
  const res = await fetch(getRoute(USER_API, false), {
    method: HttpMethod.DELETE,
    headers: jsonRequestHeaders,
  });
  if (res.status !== HttpStatus.OK_NO_CONTENT) {
    throw new RequestError(res);
  }
}

export async function deleteQuestionAttempt(attemptId: number) {
  const res = await fetch(getRoute(getQuestionAttemptPath(attemptId), false), {
    method: HttpMethod.DELETE,
    headers: jsonRequestHeaders,
  });
  if (res.status !== HttpStatus.OK_NO_CONTENT) {
    throw new RequestError(res);
  }
}

export async function addUser(userInfo: CreateUserRequestBody) {
  const res = await fetch(getRoute(USER_API, false), {
    method: HttpMethod.POST,
    body: JSON.stringify(userInfo),
    headers: jsonRequestHeaders,
  });
  if (res.status !== HttpStatus.OK_NO_CONTENT) {
    throw new RequestError(res);
  }
}

export async function getIsUsernameExists(username: string) {
  const res = await fetch(getRoute(getIsUsernameExistsPath(username), false), {
    method: HttpMethod.GET,
    headers: jsonRequestHeaders,
  });
  if (res.status !== HttpStatus.OK) {
    throw new RequestError(res);
  }
  const body = await res.json();
  UserExistsZod.parse(body);
  return body as UserExists;
}

export async function updateUser(userInfo: CreateUserRequestBody) {
  const res = await fetch(getRoute(USER_API, false), {
    method: HttpMethod.PATCH,
    body: JSON.stringify(userInfo),
    headers: jsonRequestHeaders,
  });
  if (res.status !== HttpStatus.OK_NO_CONTENT) {
    throw new RequestError(res);
  }
}

export async function createQuestionAttempt(
  attemptedQuestionDetails: CreateQuestionAttemptRequestBody,
) {
  const res = await fetch(getRoute(QUESTION_ATTEMPT_API, false), {
    method: HttpMethod.POST,
    body: JSON.stringify(attemptedQuestionDetails),
    headers: jsonRequestHeaders,
  });
  if (res.status !== HttpStatus.OK_NO_CONTENT) {
    throw new RequestError(res);
  }
}
