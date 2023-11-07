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
const questionAttemptSubDirectory = "/question-attempt";
export const getQuestionAttemptPath = (attemptId: number) =>
  `${USER_API}${questionAttemptSubDirectory}/${attemptId.toString()}`;

export const USER_API = "/users";
export const USER_PUBLIC_API = "/users/public";
export const getUserPublicInfoPath = (userEmail: string) =>
  `${API_PREFIX}/${USER_PUBLIC_API}/${userEmail}`;
export const getIsUsernameExistsPath = (username: string) =>
  `${USER_API}/exists/${username}`;

export const QUESTION_ATTEMPT_API = USER_API + questionAttemptSubDirectory;
export const EXECUTION_API = "/execution";

export const COLLAB_PATH = "/collab";
export const getActiveSessionsPath = (userId: string) =>
  `${COLLAB_PATH}/active-sessions?userId=${userId}`;
