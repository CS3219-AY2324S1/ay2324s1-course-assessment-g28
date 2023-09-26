import CodeWindow from "@/components/Editor/CodeWindow";
import ConsoleWindow from "@/components/Editor/ConsoleWindow";
import MessageWindow from "@/components/Editor/MessageWindow";
import QuestionWindow from "@/components/Editor/QuestionWindow";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ResizeHandleHorizontal from "@/components/Editor/ResizeHandleHorizontal";
import ResizeHandleVertical from "@/components/Editor/ResizeHandleVertical";
import { useSearchParams } from 'next/navigation'
import { getQuestion } from "@/api/questions";
import toast from "react-hot-toast";
import { useState } from "react";
import LoadingScreen from "@/components/Editor/LoadingScreen";

export default function EditorPage() {

  // To pass WebSocket url
  // Question data will be fetched 
  const data = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questionData, setQuestionData] = useState<any>(null);

  /**
   * Called when first mounted and and the end of nextQuestion()
   */
  async function getQuestionData() {
    setIsLoading(true);
    const questionData = getQuestion(parseInt(data.get("id") ?? "1"), false).then(res => {
      setIsLoading(false);
      setQuestionData(res);
    }, err => {
      // TODO: Handle error
    });
  }

  /**
   * Called when a user clicks "Next Question" AND the other user approves
   */
  function nextQuestion() {
    // TODO: Get a new random qn id and call getQuestionData
  }

  /**
   * Called in the following scenarios:
   * 1. The user clicks "Exit"
   * 2. Other user clicks "Exit" and the current user is informed via WebSocket
   * 3. Other user clicks "Next Question" but the current user rejects
   * 4. Scenario 3 informed via WebSocket
   */
  function exitEditor() {
    // TODO
  }

  return (
    <div className="flex flex-col h-full w-full flex-grow border-8 rounded-xl border-gray-300 border-solid bg-gray-300 relative">
      {(() => {
        if (isLoading) {
          return (
            <LoadingScreen displayText="Fetching question data ..."></LoadingScreen>
          );
        }
      })()}
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
              <CodeWindow language readOnly={false}></CodeWindow>
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
