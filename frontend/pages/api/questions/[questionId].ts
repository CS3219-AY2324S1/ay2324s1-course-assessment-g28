import {  HttpStatus } from "@/api/constants";
import {
  checkIfUserIsAdmin,
  forwardRequestAndGetResponse,
} from "@/api/server/serverConstants";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
