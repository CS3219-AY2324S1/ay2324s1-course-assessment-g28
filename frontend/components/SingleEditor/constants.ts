export type ProgrammingLanguage = "Javascript" | "Python" | "Java";

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
}
