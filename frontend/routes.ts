/**
 * This file contains all routes of the webpage as constants.
 */

export const HOME = "/";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const LOGOUT = "/api/auth/signout";
export const PROFILE = "/profile";
const QUESTION_DIRECTORY = "/questions";
export const CREATE_QUESTION = QUESTION_DIRECTORY + "/create";
export const UPDATE_PATH_SEGMENT = "/update";
export const getQuestionPath = (questionId: number) =>
  QUESTION_DIRECTORY + "/" + questionId.toString();
export const getUpdateQuestionPath = (questionId: number) =>
  QUESTION_DIRECTORY + "/" + questionId.toString() + UPDATE_PATH_SEGMENT;

export const PAIRING_DIRECTORY = "/pairing";
export const EDITOR_DIRECTORY = "/editor";
export const getEditorPath = (questionId: number, wsUrl: string) =>
  EDITOR_DIRECTORY + "/" + questionId.toString() + "?wsUrl=" + wsUrl;
export const SINGLE_EDITOR_DIRECTORY = "/singleEditor";
export const getSingleEditorPath = (questionId: number) =>
  SINGLE_EDITOR_DIRECTORY + "/" + questionId.toString();
export const UNAUTHORIZED_PAGE = "/error/unauthorized";

export const QUESTION_ATTEMPT_DIRECTORY = "/questionAttempt";
export const getQuestionAttemptPath = (attemptId: number) =>
  `${QUESTION_ATTEMPT_DIRECTORY}/${attemptId.toString()}`;
