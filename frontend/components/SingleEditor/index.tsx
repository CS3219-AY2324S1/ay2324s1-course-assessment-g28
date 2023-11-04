import { useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { PanelGroup, Panel } from "react-resizable-panels";
import HorizontalResizeHandle from "@/components/PanelResizeHandles/HorizontalResizeHandle";
import {
  CodeRunState,
  ProgrammingLanguage,
  programmingLanguageMonacoIdentifiers,
} from "@/components/SingleEditor/constants";
import { useTheme } from "next-themes";
import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";

export default function SingleEditor() {
  const editorRef = useRef(null);
  const { theme } = useTheme();
  const [codeRunState, setCodeRunState] = useState<CodeRunState>({
    result: 'Click "Run" to execute your code!',
    inProgress: false,
  });
  const [language, setLanguage] = useState<ProgrammingLanguage>("Java");

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
  }
  return (
    <PanelGroup direction="vertical" className="flex flex-grow">
      <Panel className="flex flex-col" defaultSize={80}>
        <div className="flex flex-col flex-grow">
          <div className="flex flex-row gap-2 items-center w-full pb-2">
            <Select
              size="sm"
              placeholder="Select Programming Langauge"
              selectedKeys={[language]}
              onChange={(e) => {
                if (!e.target.value) {
                  return;
                }
                setLanguage(e.target.value as ProgrammingLanguage);
              }}
            >
              {Object.keys(programmingLanguageMonacoIdentifiers).map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </Select>
            <Button disabled={codeRunState.inProgress} color="primary">
              Run Code
            </Button>
            <Button disabled={codeRunState.inProgress} color="secondary">
              Submit
            </Button>
          </div>
          <Editor
            theme={theme === "light" ? "light" : "vs-dark"}
            className="flex-grow"
            language={programmingLanguageMonacoIdentifiers[language]}
            defaultValue="// some comment"
            options={{ minimap: { enabled: false }, fontSize: 16 }}
            onMount={handleEditorDidMount}
          />
        </div>
      </Panel>
      <HorizontalResizeHandle />
      <Panel>
        {codeRunState.inProgress ? (
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
  );
}
