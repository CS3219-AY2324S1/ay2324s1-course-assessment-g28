// base error class
export class UserError extends Error {
  errorCode: number;
  constructor(message: string, errorCode: number) {
    super(message);
    this.errorCode = errorCode;
  }
}

// custom error codes to be used
export const UNKNOWN_ERROR_CODE = 0;
export const USERNAME_ALREADY_EXISTS_CODE = 1;
