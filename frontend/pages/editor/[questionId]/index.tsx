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
import { SubmissionContextProvider } from "@/components/Editor/Submission/SubmissionContext";
import { SubmissionModal } from "@/components/Editor/Submission/SubmissionModal";
import { Spinner } from "@nextui-org/react";

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
    // The pairId and userId are already appended into the encoded wsUrl
    // Append questionId into wsUrl for service to store and allow retrieval upon reconnection
    const wsUrl = `${router.query["wsUrl"] ?? ""}?questionId=${question.id}`;
    setWebsocketUrl(wsUrl);
  }, [router]);

  if (!websocketUrl)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner color="secondary" />
      </div>
    );

  return (
    <SubmissionContextProvider websocketUrl={websocketUrl}>
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
      <SubmissionModal />
    </SubmissionContextProvider>
  );
}
