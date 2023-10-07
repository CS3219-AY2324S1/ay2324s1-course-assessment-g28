import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import util from "util";
import { exec } from "child_process";
const execPromise = util.promisify(exec);

export async function runCode(code: string, language: string): Promise<string> {
  let result = "";

  switch (language) {
    case "JavaScript":
      result = await runJavaScriptCode(code);
      break;
    case "Java":
      result = await runJavaCode(code);
      break;
    case "Python":
      result = await runPythonCode(code);
      break;
  }

  return result === "" ? "No output" : result;
}

export async function runJavaScriptCode(code: string): Promise<string> {
  // TODO
  let result = eval(code);
  return result;
}

export async function runJavaCode(code: string): Promise<string> {
  // TODO
  execPromise("javac test.java", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
  });
  return "";
}

export async function runPythonCode(code: string): Promise<string> {
  const fileName = uuidv4();
  const filePath = `sandbox/${fileName}.py`;
  
  fs.writeFileSync(filePath, code, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });

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
  } catch (error) {
    console.log("ERROR", error.toString());
    result = error.toString();
  }

  fs.unlinkSync(filePath);

  return result;
}