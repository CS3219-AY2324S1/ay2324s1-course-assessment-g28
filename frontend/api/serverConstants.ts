import { NextApiRequest, NextApiResponse } from "next";

/**
 * Forwards the given request to the backend server, and sends that back to the client.
 */
export async function forwardRequestAndGetResponse(req: NextApiRequest, res: NextApiResponse, apiAddr: string) {
  console.log(getBackendUrl(apiAddr, req));
  const backendResponse = await fetch(getBackendUrl(apiAddr, req), {
    method: req.method,
    body: req.body? req.body : undefined
  })
  
  if (!backendResponse.ok) {
    throw new Error(`Error in response from backend: ${backendResponse}`);
  }
  res.status(backendResponse.status).send(backendResponse.body); 
}

export function getBackendUrl(apiAddr: string, req: NextApiRequest) {
  const origPath = req.url as string;
  const path = origPath.slice(origPath.indexOf("/", 1)); // slice away the first '/api'
  return apiAddr + path;
}