import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import util from "util";
import { exec } from "child_process";
import { fromBase64, toBase64 } from "../utils/formatUtil";
import { LANGUAGE_IDS } from "../constants";
import * as fetch from "node-fetch";
import { sleep } from "../utils/asyncUtil";

const execPromise = util.promisify(exec);

export async function runCode(code: string, language: string): Promise<string> {
  console.log(`Running ${language} code: `, code);

  const url = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*";

  const apiKey = process.env.JUDGE0_API_KEY;
  const languageId = LANGUAGE_IDS[language];
  const codeBase64 = toBase64(code);

  console.log("API key:", apiKey);
  console.log("Code:", codeBase64);
  console.log("languageId:", languageId);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "Host": "judge0-ce.p.rapidapi.com"
    },
    body: JSON.stringify({
      language_id: languageId,
      source_code: codeBase64,
      //stdin: ""
    })
  };

  const getSubmissionOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"      
    }
  }

  let result = "";
  let isInQueue = true;

  try {
    const response: Response = await fetch(url, options);
    console.log("Response:", response);
    const submissionToken = (await response.json())["token"];
    console.log("Submission Token:", submissionToken);

    while (isInQueue) {
      sleep(2000);

      const getSubmissionUrl = `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}?base64_encoded=true&fields=*`;
      const submissionResponse: Response = await fetch(getSubmissionUrl, getSubmissionOptions);
      const submissionDetails = await submissionResponse.json();

      console.log("Your submission details:", submissionDetails);

      const status = submissionDetails["status"]["id"];

      if (status === 1 || status === 2) {   // description: 'In Queue' or 'Processing'
        isInQueue = true;
      } else {
        isInQueue = false
      }

      // TODO: Enforce class Main for Java
      const compileOutput = submissionDetails["compile_output"];
      const stdout = submissionDetails["stdout"];
      const stderr = submissionDetails["stderr"];

      if (compileOutput !== null) {
        result = fromBase64(compileOutput);
        console.log("compile_output:", result);
      }
      
      if (stderr !== null) {
        result += fromBase64(stderr);
        console.log("stderr:", result);
      } else if (stdout !== null) {
        result += fromBase64(stdout);
        console.log("stdout:", result);
      }
    }

  } catch (error) {
    console.error("ERROR:", error);
  }

  return result === "" ? "No output" : result;
}