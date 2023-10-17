import { HttpMethod, HttpStatus } from "@/api/constants";
import { forwardRequestAndGetResponse } from "@/api/server/serverConstants";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (process.env.QUESTIONS_BACKEND_MODE === "LOCAL") {
    // if (req.method === HttpMethod.GET) {
    //   res.status(HttpStatus.OK).json({
    //     exists: false,
    //   });
    // }
    // return;
  }
  await forwardRequestAndGetResponse(req, res, process.env.USER_API as string);
}
