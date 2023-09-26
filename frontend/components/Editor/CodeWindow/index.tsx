import React, { useCallback, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import styles from "./codeWindow.module.css"

interface CodeWindowProps {
  template?: string,
  readOnly: boolean, // Might use this for viewing code history
}

export default function CodeWindow(props: CodeWindowProps) {
  const [code, setCode] = useState("// Enter your code here");
  
  const onChange = useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setCode(val);
  }, []);

  function getCode() {
    return code;
  }

  return <CodeMirror id={styles["codemirror"]} editable={!props.readOnly} value={code} height="100%" extensions={[javascript({ jsx: true })]} onChange={onChange} />;
}
