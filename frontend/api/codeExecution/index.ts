import { judge0LanguageIds } from "@/api/codeExecution/constants";
import {
  CodeSubmissionResult,
  ProgrammingLanguage,
} from "@/api/codeExecution/type";
import { HttpMethod, jsonRequestHeaders } from "@/api/constants";
import { RequestError } from "@/api/errors";
import { EXECUTION_API, getRoute } from "@/api/routes";

export const judge0HostnameAndPort = process.env.JUDGE0_URL;
export const submissionUrl = judge0HostnameAndPort + "/submissions?wait=true";

export async function sendCodeForExecutionAndFetchResult(
  code: string,
  language: ProgrammingLanguage,
  isServerSide?: boolean,
): Promise<CodeSubmissionResult> {
  let res;
  if (isServerSide) {
    const options = {
      method: "POST",
      headers: jsonRequestHeaders,
      body: JSON.stringify({
        language_id: judge0LanguageIds[language],
        source_code: code,
      }),
    };
    res = await fetch(submissionUrl, options);
  } else {
    res = await fetch(getRoute(EXECUTION_API, false), {
      method: HttpMethod.POST,
      headers: jsonRequestHeaders,
      body: JSON.stringify({
        code,
        language,
      }),
    });
  }
  if (!res.ok) {
    throw new RequestError(res);
  }
  const body = await res.json();
  return body;
}
