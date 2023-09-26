import CodeWindow from "@/components/Editor/CodeWindow";
import ConsoleWindow from "@/components/Editor/ConsoleWIndow";
import MessageWindow from "@/components/Editor/MessageWindow";
import QuestionWindow from "@/components/Editor/QuestionWindow";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ResizeHandleHorizontal from "@/components/Editor/ResizeHandleHorizontal";
import ResizeHandleVertical from "@/components/Editor/ResizeHandleVertical";
import { Button, Dropdown, DropdownItem } from "@nextui-org/react";

export default function EditorPage() {
  return (
    <div className="flex flex-col h-full w-full flex-grow border-8 rounded-xl border-gray-300 border-solid bg-gray-300">
      <PanelGroup direction="horizontal" className="grow">
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
