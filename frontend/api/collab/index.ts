import { HttpMethod, jsonRequestHeaders } from "../constants";
import { RequestError } from "../errors";
import { getActiveSessionsPath, getRoute } from "../routes";
import { GetActiveSessionsResponse } from "./types";

export async function getActiveSessions(
  userId: string
): Promise<GetActiveSessionsResponse> {
  console.log("Fetching active sessions for userId:", userId);
  const path = getRoute(getActiveSessionsPath(userId), false);
  console.log("Nextjs API path:", path)
  const res = await fetch(path, {
    method: HttpMethod.GET,
    headers: jsonRequestHeaders
  });
  if (!res.ok) {
    throw new RequestError(res);
  }
  const body = await res.json();
  console.log("Active sessions:", body);
  return body;
}