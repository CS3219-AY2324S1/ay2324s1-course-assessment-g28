/**
 * Exports the paths for api requests.
 */
export const API_PREFIX = "/api" // api prefix for nextjs
export const QUESTION_API = API_PREFIX + "/questions";
export const USER_API = API_PREFIX + "/user";
export const getQuestionByIdPath = (id: number) =>
  QUESTION_API + "/" + id.toString();
