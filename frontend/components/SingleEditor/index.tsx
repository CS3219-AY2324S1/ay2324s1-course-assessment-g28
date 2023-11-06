import { useCallback, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { PanelGroup, Panel } from "react-resizable-panels";
import HorizontalResizeHandle from "@/components/PanelResizeHandles/HorizontalResizeHandle";
import {
  CodeRunState,
  ProgrammingLanguageEditorStates,
  defaultProgrammingLanguageEditorContents,
  programmingLanguageMonacoIdentifiers,
} from "@/components/SingleEditor/constants";
import { useTheme } from "next-themes";
import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import { ProgrammingLanguage } from "@/api/codeExecution/type";
import { sendCodeForExecutionAndFetchResult } from "@/api/codeExecution";
import { Question } from "@/api/questions/types";
import EditorSubmissionModalButton from "@/components/SingleEditor/EditorSubmissionModalButton";

interface SingleEditorProps {
  question: Question;
}

export default function SingleEditor({ question }: SingleEditorProps) {
  const { theme } = useTheme();
  const [codeRunState, setCodeRunState] = useState<CodeRunState>({
    result: 'Click "Run" to execute your code!',
    inProgress: false,
    error: false,
  });
  const [language, setLanguage] = useState<ProgrammingLanguage>("Java");

  const [editorState, setEditorState] =
    useState<ProgrammingLanguageEditorStates>({
      Java: {
        editorContent: defaultProgrammingLanguageEditorContents.Java,
      },
      Python: {
        editorContent: defaultProgrammingLanguageEditorContents.Python,
      },
      Javascript: {
        editorContent: defaultProgrammingLanguageEditorContents.Javascript,
      },
    });

  const handleCodeRun = useCallback(async () => {
    setCodeRunState((prvState) => ({ ...prvState, inProgress: true }));
    try {
      const result = await sendCodeForExecutionAndFetchResult(
        editorState[language].editorContent,
        language,
      );
      let executionResult = "";
      if (result.compileOutput) {
        executionResult += result.compileOutput + "\n";
      }
      if (result.stdout) {
        executionResult += result.stdout;
      }
      setCodeRunState({
        result: executionResult,
        inProgress: false,
        error: false,
      });
    } catch (e) {
      setCodeRunState({
        result: "",
        inProgress: false,
        error: true,
      });
    }
  }, [editorState, language]);

  return (
    <>
      <PanelGroup direction="vertical" className="flex flex-grow">
        <Panel className="flex flex-col" defaultSize={80}>
          <div className="flex flex-col flex-grow">
            <div className="flex flex-row gap-2 items-center w-full pb-2">
              <Select
                size="sm"
                className="max-w-sm"
                placeholder="Select Programming Langauge"
                selectedKeys={[language]}
                onChange={(e) => {
                  if (!e.target.value) {
                    return;
                  }
                  setLanguage(e.target.value as ProgrammingLanguage);
                }}
              >
                {Object.keys(programmingLanguageMonacoIdentifiers).map(
                  (lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ),
                )}
              </Select>
              <Button
                disabled={codeRunState.inProgress}
                color="primary"
                className="ml-auto"
                onPress={handleCodeRun}
              >
                Run Code
              </Button>
              <EditorSubmissionModalButton
                question={question}
                editorContent={editorState[language].editorContent}
                language={language}
              />
            </div>
            <Editor
              theme={theme === "light" ? "light" : "vs-dark"}
              className="flex-grow"
              language={programmingLanguageMonacoIdentifiers[language]}
              defaultValue="// some comment"
              options={{ minimap: { enabled: false }, fontSize: 16 }}
              value={editorState[language].editorContent}
              onChange={(newEditorContent) => {
                setEditorState((prvState) => ({
                  ...prvState,
                  [language]: {
                    editorContent: newEditorContent,
                  },
                }));
              }}
            />
          </div>
        </Panel>
        <HorizontalResizeHandle />
        <Panel>
          {codeRunState.error ? (
            <div className="h-full w-full bg-content1 rounded-md p-4 text-red-700 dark:text-red-400">
              There was an error executing your code. Please try again.
            </div>
          ) : codeRunState.inProgress ? (
            <div className="w-full h-full grid content-center bg-content1 rounded-md">
              <Spinner label="Executing code..." color="secondary"></Spinner>
            </div>
          ) : (
            <div className="h-full w-full bg-content1 rounded-md p-4">
              {codeRunState.result}
            </div>
          )}
        </Panel>
      </PanelGroup>
    </>
  );
}
