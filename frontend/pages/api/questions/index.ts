import { HttpMethod, HttpStatus } from "@/api/constants";
import { checkIfUserIsAdmin, forwardRequestAndGetResponse } from "@/api/server/serverConstants";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //TODO: remove this block when not needed for local dev anymore
  if (process.env.QUESTIONS_BACKEND_MODE === "LOCAL") {
    // TODO: add actual fetch to backend service here, for now just returning dummy data
    if (req.method === HttpMethod.GET) {
      res.status(HttpStatus.OK).json({
        content: [
          {
            id: 1,
            title: "First Question",
            category: ["great question", "tag"],
            complexity: 0,
          },
        ],
        total: 1,
      });
    } else if (req.method === HttpMethod.POST) {
      res.status(HttpStatus.RESOURCE_CREATED);
    }
    return;
  }
  // if edit question or create question, need check for admin
  if (req.method === "POST" || req.method === "PATCH") {
    const isAdmin = await checkIfUserIsAdmin(req, res);
    // if edit question or create question, need check for admin
    if (!isAdmin) {
      res.status(HttpStatus.FORBIDDEN).send("");
      return;
    }
  }

  await forwardRequestAndGetResponse(
    req,
    res,
    process.env.QUESTIONS_API as string,
  );
}
