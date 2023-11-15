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
export const USER_API = "/users";
export const getQuestionByIdPath = (id: number) =>
  `${QUESTION_API}/${id.toString()}`;

export const USER_PUBLIC_API = "/users/public";
export const getUserPublicInfoPath = (userEmail: string) =>
  `${API_PREFIX}/${USER_PUBLIC_API}/${userEmail}`;
export const getIsUsernameExistsPath = (username: string) =>
  `${USER_API}/exists/${username}`;

