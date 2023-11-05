import { ProgrammingLanguage } from "@/api/codeExecution/type";

export const programmingLanguageMonacoIdentifiers: Record<
  ProgrammingLanguage,
  string
> = {
  Java: "java",
  Python: "python",
  Javascript: "javascript",
};

export interface CodeRunState {
  inProgress: boolean;
  result: string;
  error: boolean;
}

export interface ProgrammingLanguageEditorState {
  editorContent: string;
}

export type ProgrammingLanguageEditorStates = Record<
  ProgrammingLanguage,
  ProgrammingLanguageEditorState
>;

export const defaultProgrammingLanguageEditorContents: Record<
  ProgrammingLanguage,
  string
> = {
  Java: `class Main {
  public static void main(String[] args) {
    // Write your code here
  }
}`,
  Python: "# Write your code here",
  Javascript: "// Write your code here",
};

