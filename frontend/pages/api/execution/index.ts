import { submissionUrl } from "@/api/codeExecution";
import { judge0LanguageIds } from "@/api/codeExecution/constants";
import { ProgrammingLanguage } from "@/api/codeExecution/type";
import { HttpMethod, HttpStatus, jsonRequestHeaders } from "@/api/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== HttpMethod.POST) {
    res.status(HttpStatus.NOT_FOUND).send("Bad request method");
    return;
  }
  const options = {
    method: "POST",
    headers: jsonRequestHeaders,
    body: JSON.stringify({
      language_id: judge0LanguageIds[req.body.language as ProgrammingLanguage],
      source_code: req.body.code,
    }),
  };
  try {
    const response: Response = await fetch(submissionUrl, options);
    const submissionResult = await response.json();

    const compileOutput = submissionResult["compile_output"];
    const stdout = submissionResult["stdout"];
    const stderr = submissionResult["stderr"];

    res.status(HttpStatus.OK).json({ compileOutput, stdout, stderr });
  } catch (e) {
    console.log(e);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Problem executing code");
  }
}
