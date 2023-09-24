/**
 * Exports the paths for api requests.
 */
export const API_PREFIX = "/api"; // api prefix for nextjs
export const getRoute = (route: string, isServerSide: boolean, serverUrl?: string) =>
  (isServerSide ? serverUrl : API_PREFIX) + route;
export const QUESTION_API = "/questions";
export const USER_API = "/user";
export const getQuestionByIdPath = (id: number) =>
  QUESTION_API + "/" + id.toString();
