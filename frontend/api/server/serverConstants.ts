import { HttpStatus } from "@/api/constants";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Forwards the given request to the backend server, and sends that back to the client.
 */
export async function forwardRequestAndGetResponse(
  req: NextApiRequest,
  res: NextApiResponse,
  apiAddr: string,
  options?: {
    customPath?: string,
    appendBody?: Record<string, string>
  }
) {
  try {
    let url = getBackendUrl(apiAddr, req);
    if (options?.customPath) {
      url = apiAddr + options.customPath;
    }
    let newBody;
    if (req.headers["content-type"] == "application/json") {
      newBody = req.body;
      if (options?.appendBody) {
        for (const field in options.appendBody) {
          newBody[field] = options.appendBody[field];
        }
      }
    }
    newBody = req.body;
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
          //"Content-Length": JSON.stringify(newBody).length.toString(),
        },
        body: JSON.stringify(newBody),
      });
    }

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      console.log(error)
      res.status(backendResponse.status).json(error);
      return;
    }
    if (backendResponse.status === HttpStatus.OK_NO_CONTENT) {
      res.status(backendResponse.status).send("");
    } else {
      const data = await backendResponse.json();
      res.status(backendResponse.status).json(data);
    }
  } catch (e) {
    console.log(e);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 0 });
  }
}

export function getBackendUrl(apiAddr: string, req: NextApiRequest) {
  const origPath = req.url as string;
  const path = origPath.slice(origPath.indexOf("/", 1)); // slice away the first '/api'
  return apiAddr + path;
}
