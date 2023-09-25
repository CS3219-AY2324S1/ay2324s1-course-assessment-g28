// base error class
export class QuestionError extends Error {
  errorCode: number;
  constructor(message: string, errorCode: number) {
    super(message);
    this.errorCode = errorCode;
  }
}

// custom error codes to be used
export const UNKNOWN_ERROR_CODE = 0;
export const QUESTION_TITLE_EXISTS_ERROR_CODE = 1;
export const QUESTION_NOT_FOUND_ERROR_CODE = 2;
