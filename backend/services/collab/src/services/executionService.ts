import { fromBase64, toBase64 } from "../utils/formatUtil";
import { LANGUAGE_IDS } from "../constants";
// @ts-ignore
import * as fetch from "node-fetch";
import { sleep } from "../utils/asyncUtil";

const judge0HostnameAndPort = process.env.JUDGE0_URL;

export async function runCode(code: string, language: string): Promise<string> {
  // This url is for public API only
  // const url = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*";
  const url = judge0HostnameAndPort + "/submissions?base64_encoded=true&fields=*";

  const languageId = LANGUAGE_IDS[language];
  const codeBase64 = toBase64(code);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language_id: languageId,
      source_code: codeBase64,
    }) 
  }

  const getSubmissionOptions = {
    method: "GET",
  }

  let result = "";
  let isInQueue = true;

  try {
    const response: Response = await fetch(url, options);
    const submissionToken = (await response.json())["token"];

    while (isInQueue) {
      sleep(2000);
      const getSubmissionUrl = `${judge0HostnameAndPort}/submissions/${submissionToken}?base64_encoded=true&fields=*`; 
      //const getSubmissionUrl = `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}?base64_encoded=true&fields=*`;
      const submissionResponse: Response = await fetch(getSubmissionUrl, getSubmissionOptions);
      const submissionDetails = await submissionResponse.json();

      const status = submissionDetails["status"]["id"];

      if (status === 1 || status === 2) {   // description: 'In Queue' or 'Processing'
        isInQueue = true;
      } else {
        isInQueue = false
      }

      const compileOutput = submissionDetails["compile_output"];
      const stdout = submissionDetails["stdout"];
      const stderr = submissionDetails["stderr"];

      if (compileOutput !== null) {
        result = fromBase64(compileOutput);
      }
      
      if (stderr !== null) {
        result += fromBase64(stderr);
      } else if (stdout !== null) {
        result += fromBase64(stdout);
      }
    }

  } catch (error) {
    console.error("ERROR:", error);
  }

  return result === "" ? "No output" : result;
}