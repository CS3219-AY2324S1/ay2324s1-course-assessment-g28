/**
 * This file contains all routes of the webpage as constants.
 */

export const HOME = "/";
export const LOGIN = "/login";
export const LOGOUT = "/api/auth/signout";
const QUESTION_DIRECTORY = "/question";
export const CREATE_QUESTION = QUESTION_DIRECTORY + "/create";
export const getUpdateQuestionPath = (questionId: number) => QUESTION_DIRECTORY + "/" + questionId.toString() + "/update";
