export type ProgrammingLanguage = "Javascript" | "Python" | "Java";

export interface CodeSubmissionResult {
  compileOutput: string;
  stdout: string;
  stderr: string;
}
