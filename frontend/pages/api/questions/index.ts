import { HttpStatus } from "@/api/constants";
import {
  checkIfUserIsAdmin,
  forwardRequestAndGetResponse,
} from "@/api/server/serverConstants";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

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

  const session = await getServerSession(req, res, authOptions);
  if (session === null || !session.user?.email) {
    res.status(HttpStatus.FORBIDDEN).send("");
    return;
  }

  // add email to query params for GET
  if (req.method === "GET") {
    req.url += `&user=${session.user.email}`;
  }

  await forwardRequestAndGetResponse(
    req,
    res,
    process.env.QUESTIONS_API as string,
  );
}
