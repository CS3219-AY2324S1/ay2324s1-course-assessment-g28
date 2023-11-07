import { HttpMethod, HttpStatus } from "@/api/constants";
import { USER_API } from "@/api/routes";
import { forwardRequestAndGetResponse } from "@/api/server/serverConstants";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // get the user email from the session
  const session = await getServerSession(req, res, authOptions);
  if (session === null || !session.user?.email) {
    res.status(HttpStatus.FORBIDDEN).send("");
    return;
  }
  if (req.method === HttpMethod.POST) {
    forwardRequestAndGetResponse(req, res, process.env.USER_API as string, {
      customPath: `${USER_API}/${session.user.email}/question-attempt`,
    });
  } else {
    forwardRequestAndGetResponse(req, res, process.env.USER_API as string, {
      customPath: `${USER_API}/${
        session.user.email
      }/question-attempt/${req.url!.substring(req.url!.lastIndexOf("/") + 1)}`,
    });
  }
}
