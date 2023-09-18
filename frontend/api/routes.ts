/**
 * Exports the paths for api requests.
 */
export const QUESTION_API = "/question"
export const USER_API = "/user"
export const getQuestionByIdPath = (id: number) => QUESTION_API + "/" + id.toString();