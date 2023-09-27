import { HttpMethod, HttpStatus } from "@/api/constants";
import { forwardRequestAndGetResponse } from "@/api/server/serverConstants";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (process.env.BACKEND_MODE === "LOCAL") {
    if (req.method === HttpMethod.GET) {
      res.status(HttpStatus.OK).json({
        id: 1,
        title: "First Question",
        category: ["great question", "tag"],
        complexity: 0,
        description: "Fabulous Question!",
      });
    } else if (req.method === HttpMethod.PATCH) {
      res.status(HttpStatus.OK_NO_CONTENT);
    } else if (req.method === HttpMethod.DELETE) {
      res.status(HttpStatus.OK);
    }
    return;
  }

  await forwardRequestAndGetResponse(
    req,
    res,
    process.env.QUESTIONS_API as string,
  );
}
