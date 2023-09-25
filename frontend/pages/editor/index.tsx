import CodeWindow from "@/components/Editor/CodeWindow";
import ConsoleWindow from "@/components/Editor/ConsoleWIndow";
import MessageWindow from "@/components/Editor/MessageWindow";
import QuestionWindow from "@/components/Editor/QuestionWindow";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import styles from "./editor.module.css";
import ResizeHandleHorizontal from "@/components/Editor/ResizeHandleHorizontal";
import ResizeHandleVertical from "@/components/Editor/ResizeHandleVertical";

export default function EditorPage() {
  return (
    <div className={`flex flex-col ${styles["editor-page"]}`}>
      <PanelGroup direction="horizontal" className={`${styles["editor-panel"]}`}>
        <Panel defaultSize={40}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={60}>
              <QuestionWindow></QuestionWindow>
            </Panel>
            <PanelResizeHandle children={ResizeHandleHorizontal()}/>
            <Panel>
              <MessageWindow></MessageWindow>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle children={ResizeHandleVertical()} />
        <Panel>
          <PanelGroup direction="vertical">
            <Panel defaultSize={60}>
              <CodeWindow></CodeWindow>
            </Panel>
            <PanelResizeHandle children={ResizeHandleHorizontal()} />
            <Panel>
              <ConsoleWindow></ConsoleWindow>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  )
}
