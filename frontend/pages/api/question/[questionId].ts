import { HttpMethod, HttpStatus } from "@/api/constants";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: add actual fetch to backend service here
  if (req.method === HttpMethod.GET) {
    res.status(HttpStatus.OK).json({
      id: 1,
      title: "First Question",
      category: ["great question", "tag"],
      complexity: 0,
      description: "Fabulous Question!"
    });
  } else if (req.method === HttpMethod.PATCH) {
    res.status(HttpStatus.OK_NO_CONTENT)
  } else if (req.method === HttpMethod.DELETE) {
    res.status(HttpStatus.RESOURCE_CREATED)
  }
  res.status(200).json({
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
}
