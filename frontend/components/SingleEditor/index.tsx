import { useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { PanelGroup, Panel } from "react-resizable-panels";
import HorizontalResizeHandle from "@/components/PanelResizeHandles/HorizontalResizeHandle";
import { ProgrammingLanguage } from "@/components/SingleEditor/constants";
import { useTheme } from "next-themes";

export default function SingleEditor() {
  const editorRef = useRef(null);
  const { theme } = useTheme();
  const [codeRunResult, setCodeRunResult] = useState<string>(
    'Click "Run" to execute your code!',
  );
  const [language, setLanguage] = useState<ProgrammingLanguage>("java");

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
  }
  return (
    <PanelGroup direction="vertical" className="flex flex-grow">
      <Panel className="flex flex-col" defaultSize={80}>
        <div className="flex flex-col flex-grow">
          <div></div>
          <Editor
            theme={theme === "light" ? "light" : "vs-dark"}
            className="flex-grow"
            language={language}
            defaultValue="// some comment"
            options={{ minimap: { enabled: false }, fontSize: 18 }}
            onMount={handleEditorDidMount}
          />
        </div>
      </Panel>
      <HorizontalResizeHandle />
      <Panel className="p-2">{codeRunResult}</Panel>
    </PanelGroup>
  );
}
