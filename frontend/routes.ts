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
export const UPDATE_PATH_SEGMENT = "/update"
export const getQuestionPath = (questionId: number) =>
  QUESTION_DIRECTORY + "/" + questionId.toString();
export const getUpdateQuestionPath = (questionId: number) =>
  QUESTION_DIRECTORY + "/" + questionId.toString() + UPDATE_PATH_SEGMENT;

export const PAIRING_DIRECTORY = "/pairing";
