import { z } from "zod";

export enum HttpStatus {
  OK = 200,
  RESOURCE_CREATED = 201,
  OK_NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export const PagedResponse = z.object({
  total: z.number().nonnegative().int()
});

// headers to use for json requests
export const jsonRequestHeaders = {
  "Content-Type": "application/json",
}