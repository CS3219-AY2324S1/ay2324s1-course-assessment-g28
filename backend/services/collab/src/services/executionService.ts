export async function runCode(code: string, language: string): Promise<string> {
  let result = "";

  switch (language) {
    case "JavaScript":
      result = await runJavaScriptCode(code);
      break;
    case "Java":
      result = await runJavaCode(code);
      break;
  }

  return result === "" ? "No output" : result;
}

export async function runJavaScriptCode(code: string): Promise<string> {
  let result = eval(code);
  return result;
}

export async function runJavaCode(code: string): Promise<string> {
  let result = eval(code);
  return result;
}