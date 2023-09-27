import { HttpMethod, HttpStatus } from "@/api/constants";
import { USER_API } from "@/api/routes";
import { forwardRequestAndGetResponse } from "@/api/server/serverConstants";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // get the user email from the session
  const session = await getServerSession();
  if (session === null || !session.user?.email) {
    res.status(HttpStatus.FORBIDDEN).send("");
    return;
  }
  // TODO: add actual fetch to backend service here, for now just returning dummy data
  if (process.env.BACKEND_MODE === "LOCAL") {
    if (req.method === HttpMethod.GET) {
    } else if (req.method === HttpMethod.POST) {
    } else if (req.method === HttpMethod.DELETE) {
    }
  }

  if (req.method === HttpMethod.POST) {
    forwardRequestAndGetResponse(
      req,
      res,
      process.env.USER_API as string,
      `${USER_API}/${session.user.email}/question-attempt`,
    );
  } else {
    forwardRequestAndGetResponse(
      req,
      res,
      process.env.USER_API as string,
      `${USER_API}/${session.user.email}/question-attempt/${req.url!.substring(
        req.url!.lastIndexOf("/") + 1,
      )}`,
    );
  }
}
