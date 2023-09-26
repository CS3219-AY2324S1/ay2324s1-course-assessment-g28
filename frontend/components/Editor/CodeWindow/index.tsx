import React, { useCallback, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { Button, Select, SelectItem } from '@nextui-org/react';

interface CodeWindowProps {
  template?: string,
  language?: string,
  readOnly: boolean, // Might use this for viewing code history
}

const LANGUAGES = ["Java", "JavaScript", "Python"];
const LANGUAGE_SUPPORT = {"Java": java(), "JavaScript": javascript({ jsx: true }), "Python": python()};

export default function CodeWindow(props: CodeWindowProps) {
  const [code, setCode] = useState("// Enter your code here");
  const [language, setLanguage] = useState<string>(props.language ?? "Java");
  
  const onChange = useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setCode(val);
  }, []);

  /**
   * Sends the code through WebSocket to CollabService which will run the compiler / interpreter
   * WebSocket will inform both users of the result
   */
  function runCode() {

  }

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-auto rounded-xl">
      <div className="w-full flex flex-row p-1">
        <div className="flex flex-row w-1/2 gap-2">
          <Select
            placeholder={language}
            classNames={{
              mainWrapper: "h-fit",
              base: "h-fit",
              trigger: "py-1 px-3 h-8 min-h-1",
              value: "text-sm"
            }}
            defaultValue={language}
            disableSelectorIconRotation
            onChange={e => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </Select>
          <Button size="sm" color="success" className='text-white h-8 font-bold px-5'>
            Run Code
          </Button>
        </div>
        <div className="w-1/2 grow flex flex-row justify-end gap-2">
          <Button size="sm" color="warning" className='text-white h-8 font-bold'>
            Next Question
          </Button>
          <Button size="sm" color="default" className='h-8 font-bold'>
            Exit
          </Button>
        </div>
      </div>
      <CodeMirror
        className="h-full w-full"
        editable={!props.readOnly} 
        value={code} 
        height="100%" 
        extensions={[LANGUAGE_SUPPORT[language]]} 
        onChange={onChange}
        lang={language}
      />
    </div>
  );
}
