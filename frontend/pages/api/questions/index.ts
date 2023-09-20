import { HttpMethod, HttpStatus } from "@/api/constants";
import { forwardRequestAndGetResponse } from "@/api/serverConstants";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //TODO: remove this block when not needed for local dev anymore
  if (process.env.BACKEND_MODE === "LOCAL") {
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
        size: 10,
        offset: 0,
      });
    } else if (req.method === HttpMethod.POST) {
      res.status(HttpStatus.RESOURCE_CREATED);
    }
    return;
  }

  forwardRequestAndGetResponse(req, res, process.env.QUESTIONS_API as string);
}