/**
 * Exports the paths for api requests.
 */
export const API_PREFIX = "/api"; // api prefix for nextjs
export const getRoute = (
  route: string,
  isServerSide: boolean,
  serverUrl?: string,
) => (isServerSide ? serverUrl : API_PREFIX) + route;

export const QUESTION_API = "/questions";
export const getQuestionByIdPath = (id: number) =>
  `${QUESTION_API}/${id.toString()}`;
export const getQuestionAttemptPath = (attemptId: number) =>
  `${USER_API}/question-attempt/${attemptId.toString()}`;

export const USER_API = "/users";
export const getIsUsernameExistsPath = (username: string) =>
  `${USER_API}/exists/${username}`;

export const EXECUTION_API = "/execution";
