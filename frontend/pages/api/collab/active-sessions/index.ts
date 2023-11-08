import { HttpMethod, HttpStatus, jsonRequestHeaders } from "@/api/constants";
import { NextApiRequest, NextApiResponse } from "next";

const collabBaseUrl = process.env.COLLAB_API;
const activeSessionsUrl = `${collabBaseUrl}/pairing/getActiveSessions?userId=`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== HttpMethod.GET) {
    res.status(HttpStatus.NOT_FOUND).send("Bad request method");
    return;
  }

  const options = {
    method: "GET",
    headers: jsonRequestHeaders,
  };

  try {
    const userId = req.query["userId"];
    const response: Response = await fetch(activeSessionsUrl + userId, options);
    const responseJson = await response.json();

    const activeSessions = responseJson["activeSessions"];
    res.status(HttpStatus.OK).json({ activeSessions: activeSessions });
  } catch (e) {
    console.log(e);
    res.status(
      HttpStatus.INTERNAL_SERVER_ERROR
    ).send("Error fetching active sessions");
  }
}
