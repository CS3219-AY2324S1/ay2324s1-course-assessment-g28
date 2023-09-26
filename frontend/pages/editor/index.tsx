import CodeWindow from "@/components/Editor/CodeWindow";
import ConsoleWindow from "@/components/Editor/ConsoleWIndow";
import MessageWindow from "@/components/Editor/MessageWindow";
import QuestionWindow from "@/components/Editor/QuestionWindow";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import styles from "./editor.module.css";
import ResizeHandleHorizontal from "@/components/Editor/ResizeHandleHorizontal";
import ResizeHandleVertical from "@/components/Editor/ResizeHandleVertical";
import { Button, Dropdown, DropdownItem } from "@nextui-org/react";

export default function EditorPage() {
  return (
    <div className={`flex flex-col ${styles["editor-page"]}`}>
      <PanelGroup direction="horizontal" className={`${styles["editor-panel"]}`}>
        <Panel defaultSize={40}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={10}>
              <div className={styles["question-header"]}>
                <div className={styles["question-header-text"]}>
                  A2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut
                </div>
              </div>
            </Panel>
            <Panel defaultSize={50}>
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
            <Panel defaultSize={10} maxSize={10}>
              <div className={styles["code-header"]}>
                <div className={styles["code-buttons"]}>
                  <Dropdown>
                    <DropdownItem defaultChecked>Java</DropdownItem>
                    <DropdownItem>JavaScript</DropdownItem>
                    <DropdownItem>Python</DropdownItem>
                  </Dropdown>
                  <Button color="success">
                    Run Code
                  </Button>
                </div>
                <div className={styles["navigation-buttons"]}>
                  <Button color="warning">
                    Next Question
                  </Button>
                  <Button color="default">
                    Exit
                  </Button>
                </div>
              </div>
            </Panel>
            <Panel defaultSize={50}>
              <CodeWindow readOnly={false}></CodeWindow>
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
