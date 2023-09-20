import { HttpMethod, HttpStatus } from "@/api/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: add actual fetch to backend service here, for now just returning dummy data
  if (req.method === HttpMethod.GET) {
    res.status(HttpStatus.OK).json({
      email: "abc@gmail.com",
      isAdmin: true,
    });
  }
}
