import { HttpMethod, jsonRequestHeaders } from "../constants";
import { RequestError } from "../errors";
import { getActiveSessionsPath, getRoute } from "../routes";
import { GetActiveSessionsResponse } from "./types";

export async function getActiveSessions(
  userId: string,
): Promise<GetActiveSessionsResponse> {
  const path = getRoute(getActiveSessionsPath(userId), false);
  const res = await fetch(path, {
    method: HttpMethod.GET,
    headers: jsonRequestHeaders,
  });
  if (!res.ok) {
    throw new RequestError(res);
  }
  const body = await res.json();
  return body;
}
