export function getUserErrorMessageFromErrorCode(errorCode: number) {
  switch (errorCode) {
    case 1:
      return "A user with the given username already exists.";
    default:
      return "Something went wrong. Please try again.";
  }
}