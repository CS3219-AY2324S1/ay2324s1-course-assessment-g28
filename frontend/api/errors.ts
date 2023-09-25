export class RequestError extends Error {
  response: Response;
  constructor(fetchResponse: Response) {
    super(`
API request error:
Status: ${fetchResponse.status}
Status Message: ${fetchResponse.statusText}
`);
    this.response = fetchResponse;
  }
}
