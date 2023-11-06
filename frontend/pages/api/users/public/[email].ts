import { forwardRequestAndGetResponse } from "@/api/server/serverConstants";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await forwardRequestAndGetResponse(req, res, process.env.USER_API as string);
}
