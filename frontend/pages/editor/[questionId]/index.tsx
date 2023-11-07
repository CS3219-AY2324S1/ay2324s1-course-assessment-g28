import CodeWindow from "@/components/Editor/CodeWindow";
import MessageWindow from "@/components/Editor/MessageWindow";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ResizeHandleHorizontal from "@/components/Editor/ResizeHandleHorizontal";
import ResizeHandleVertical from "@/components/Editor/ResizeHandleVertical";
import { getQuestion } from "@/api/questions";
import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { Question } from "@/api/questions/types";
import QuestionDetailsCard from "@/components/QuestionDetailsCard.tsx";
import { useRouter } from "next/router";

export const getServerSideProps = (async ({ params }) => {
  const data = await getQuestion(Number(params?.questionId), true);
  return { props: { question: data } };
}) satisfies GetServerSideProps<{
  question: Question;
}>;

export default function EditorPage({
  question,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [websocketUrl, setWebsocketUrl] = useState<string>("");

  // Obtain the WebSocket link from query and get the first question
  useEffect(() => {
    const wsUrl = (router.query["wsUrl"] ?? "") as string;
    // The pairId and userId are appended into the encoded wsUrl
    // Test using this url (replace pairId with generated one):
    // http://localhost:3000/editor?wsUrl=ws://localhost:8888?pairId=2d902ca5-cba7-4050-a40e-c216d7115002&user=jhghf874
    setWebsocketUrl(wsUrl);
  }, [router]);
  /**
   * Called when a user clicks "Next Question" AND the other user approves
   */
  function nextQuestion() {
    // TODO: Get a new random qn id and call getQuestionData
  }

  /**
   * Called to save submission when user moves to next question or exits
   * NOT the same as running the code
   *
   * Should this be here (using some other service?) or in CodeWindow (using the WebSocket)
   * @param questionId
   * @param code
   * @param score
   */
  function saveSubmission(
    questionId: number,
    code: string,
    score: number | null,
  ) {
    // TODO
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
    <div className="flex flex-col w-full h-full mb-[-100px] flex-grow border-8 rounded-xl border-[#d1d5db] bg-[#d1d5db] relative">
      <PanelGroup direction="horizontal" className="grow">
        <Panel defaultSize={40} minSize={25}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={60}>
              <QuestionDetailsCard question={question} />
            </Panel>
            <PanelResizeHandle>{ResizeHandleHorizontal()}</PanelResizeHandle>
            <Panel minSize={15}>
              {websocketUrl && (
                <MessageWindow websocketUrl={websocketUrl}></MessageWindow>
              )}
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle>{ResizeHandleVertical()}</PanelResizeHandle>
        <Panel minSize={40}>
          {websocketUrl && (
            <CodeWindow websocketUrl={websocketUrl}></CodeWindow>
          )}
        </Panel>
      </PanelGroup>
    </div>
  );
}
