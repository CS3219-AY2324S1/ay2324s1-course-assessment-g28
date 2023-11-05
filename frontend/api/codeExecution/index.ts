import { CodeSubmissionResult, ProgrammingLanguage } from "@/api/codeExecution/type";
import { HttpMethod, jsonRequestHeaders } from "@/api/constants";
import { RequestError } from "@/api/errors";
import { EXECUTION_API, getRoute } from "@/api/routes";

export async function sendCodeForExecutionAndFetchResult(
  code: string,
  language: ProgrammingLanguage,
): Promise<CodeSubmissionResult> {
  const res = await fetch(getRoute(EXECUTION_API, false), {
    method: HttpMethod.POST,
    headers: jsonRequestHeaders,
    body: JSON.stringify({
      code,
      language,
    }),
  });
  if (!res.ok) {
    throw new RequestError(res);
  }
  const body = await res.json();
  return body;
}
