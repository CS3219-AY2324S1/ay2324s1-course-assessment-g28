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
  // TODO: add actual fetch to backend service here, for now just returning dummy data
  if (process.env.USER_BACKEND_MODE === "LOCAL") {
    if (req.method === HttpMethod.GET) {
    } else if (req.method === HttpMethod.POST) {
    } else if (req.method === HttpMethod.DELETE) {
    }
  }

  if (req.method === HttpMethod.POST) {
    forwardRequestAndGetResponse(req, res, process.env.USER_API as string, {
      appendBody: { email: session.user.email },
    });
  } else {
    forwardRequestAndGetResponse(req, res, process.env.USER_API as string, {
      customPath: `${USER_API}/${session.user.email}`,
    });
  }
}
