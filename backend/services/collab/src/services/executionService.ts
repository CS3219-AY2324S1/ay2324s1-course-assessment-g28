const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

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
  let result = eval(code);
  return result;
}

export async function runJavaCode(code: string): Promise<string> {
  exec("javac test.java", (error, stdout, stderr) => {
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
  fs.writeFileSync('sandbox/test.py', code, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
  const { stdout, stderr } = await exec("python sandbox/test.py");
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return stderr;
  }
  console.log(`stdout: ${stdout}`);
  return stdout;
}