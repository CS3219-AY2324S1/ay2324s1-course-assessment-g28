import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import util from "util";
import { exec } from "child_process";
import { toBase64 } from "../utils/formatUtil";
import { LANGUAGE_IDS } from "../constants";
import { RequestInfo, RequestInit } from "node-fetch";
const fetch = (url: RequestInfo, init?: RequestInit) =>  import("node-fetch").then(({ default: fetch }) => fetch(url, init));
const execPromise = util.promisify(exec);

export async function runCode(code: string, language: string): Promise<string> {
  console.log(`Running ${language} code: `, code);

  const url = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*";

  const apiKey = process.env.JUDGE0_API_KEY;
  const languageId = LANGUAGE_IDS[language];
  const codeBase64 = toBase64(code);

  console.log(apiKey);

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
    },
    body: {
      language_id: languageId,
      source_code: codeBase64,
      //stdin: ""
    }
  };

  let result = "";

  try {
    const response = await fetch(url, options);
    result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  return result === "" ? "No output" : result;
}

export async function runJavaScriptCode(code: string): Promise<string> {
  // TODO: Does not work either, time to use Judge0

  const fileName = uuidv4();
  const filePath = `sandbox/${fileName}.js`;
  
  try {
    fs.writeFileSync(filePath, code);
  } catch (err) {
    console.error(err);
  }


  let result = "";

  try {
    const { stdout, stderr } = await execPromise(`node ${filePath}`);
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      result = stderr;
    } else {
      console.log(`stdout: ${stdout}`);
      result =  stdout;
    }
  } catch (error: any) {
    console.log("ERROR", error.toString());
    result = error.toString();
  }

  fs.unlinkSync(filePath);

  return result;
}

export async function runJavaCode(code: string): Promise<string> {
  // TODO: May have to use Judge0 API if can't compile using shell command
  const fileName = uuidv4();
  const filePath = `sandbox/${fileName}.java`;
  const compiledFilePath = `sandbox/${fileName}`;
  
  try {
    fs.writeFileSync(filePath, code);
  } catch (err) {
    console.error(err);
  }

  let result = "";
  let isCompiled = false;

  try {
    const { stdout, stderr } = await execPromise(`javac ${filePath}`);
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      result = stderr;
    } else {
      isCompiled = true;
    }
  } catch (error: any) {
    console.log("ERROR", error.toString());
    result = error.toString();
  }

  if (isCompiled) {
    try {
      const { stdout, stderr } = await execPromise(`java ${compiledFilePath}`);
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        result = stderr;
      } else {
        console.log(`stdout: ${stdout}`);
        result =  stdout;
      }
    } catch (error: any) {
      console.log("ERROR", error.toString());
      result = error.toString();
    }
  }

  fs.unlinkSync(filePath);
  fs.unlinkSync(compiledFilePath);

  return result;
}

export async function runPythonCode(code: string): Promise<string> {
  const fileName = uuidv4();
  const filePath = `sandbox/${fileName}.py`;
  
  try {
    fs.writeFileSync(filePath, code);
  } catch (err) {
    console.error(err);
  }

  let result = "";

  try {
    const { stdout, stderr } = await execPromise(`python ${filePath}`);
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      result = stderr;
    } else {
      console.log(`stdout: ${stdout}`);
      result =  stdout;
    }
  } catch (error: any) {
    console.log("ERROR", error.toString());
    result = error.toString();
  }

  fs.unlinkSync(filePath);

  return result;
}