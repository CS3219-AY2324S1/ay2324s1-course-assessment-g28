export class RequestError extends Error {
  constructor(fetchResponse: Response) {
    super(`
API request error:
Status: ${fetchResponse.status}
Status Message: ${fetchResponse.statusText}
`);
  }
}
