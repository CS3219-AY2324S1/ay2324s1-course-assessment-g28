import { HttpStatus } from "@/api/constants";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Forwards the given request to the backend server, and sends that back to the client.
 */
export async function forwardRequestAndGetResponse(
  req: NextApiRequest,
  res: NextApiResponse,
  apiAddr: string,
  customPath?: string // custom path to use. do not use path from client inside req
) {
  try {
    let url = getBackendUrl(apiAddr, req);
    if(customPath) {
      url = apiAddr + customPath
    }
    let backendResponse;
    if (req.method === "GET" || req.method === "DELETE") {
      backendResponse = await fetch(url, {
        method: req.method,
      });
    } else {
      backendResponse = await fetch(url, {
        method: req.method,
        headers: {
          "Content-Type": req.headers["content-type"] ?? "",
          //"Content-Length": JSON.stringify(req.body).length.toString(),
        },
        body: JSON.stringify(req.body),
      });
    }
    if (!backendResponse.ok) {
      console.log((await backendResponse.json()));
    }
    if (backendResponse.status === HttpStatus.OK_NO_CONTENT) {
      res.status(backendResponse.status).send("");
    } else {
      const data = await backendResponse.json();
      res.status(backendResponse.status).json(data);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export function getBackendUrl(apiAddr: string, req: NextApiRequest) {
  const origPath = req.url as string;
  const path = origPath.slice(origPath.indexOf("/", 1)); // slice away the first '/api'
  return apiAddr + path;
}
