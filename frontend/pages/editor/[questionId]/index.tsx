import CodeWindow from "@/components/Editor/CodeWindow";
import MessageWindow from "@/components/Editor/MessageWindow";
import { Panel, PanelGroup } from "react-resizable-panels";
import { getQuestion } from "@/api/questions";
import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { Question } from "@/api/questions/types";
import QuestionDetailsCard from "@/components/QuestionDetailsCard.tsx";
import { useRouter } from "next/router";
import { SubmissionContextProvider } from "@/components/Editor/Submission/SubmissionContext";
import { SubmissionModal } from "@/components/Editor/Submission/SubmissionModal";
import VerticalResizeHandle from "@/components/PanelResizeHandles/VerticalResizeHandle";
import HorizontalResizeHandle from "@/components/PanelResizeHandles/HorizontalResizeHandle";
import {
  ErrorScreenText,
  LoadingScreenText,
  PartnerDetailsType,
} from "@/components/Editor/constants";
import LoadingScreen from "@/components/Editor/LoadingScreen";
import ErrorScreen from "@/components/Editor/ErrorScreen";
import PartnerDetails from "@/components/Editor/PartnerDetails";

// indicates if only one person in collab session or both.
enum CollabStatus {
  SINGLE,
  DOUBLE,
}

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

  const [partnerDetails, setPartnerDetails] = useState<PartnerDetailsType>({
    email: "",
    username: "",
    favouriteProgrammingLanguage: "Python",
  });

  const [loadingScreenText, setLoadingScreenText] = useState<LoadingScreenText>(
    LoadingScreenText.INITIALIZING_EDITOR,
  );

  // Set to false if cannot connect OR WS returns INVALID_WSURL_PARAMS status
  // If false, don't show editor and show error screen
  const [errorScreenText, setErrorScreenText] = useState<ErrorScreenText>(
    ErrorScreenText.NO_ERROR,
  );

  // Obtain the WebSocket link from query and get the first question
  useEffect(() => {
    if (question === undefined) {
      return;
    }
    // The pairId and userId are already appended into the encoded wsUrl
    // Append questionId into wsUrl for service to store and allow retrieval upon reconnection
    const wsUrl = (router.query["wsUrl"] as string) ?? "";
    setWebsocketUrl(wsUrl);
  }, [router, question]);

  // WebSocket URL obtained from path but is invalid
  if (errorScreenText !== ErrorScreenText.NO_ERROR)
    return <ErrorScreen displayText={errorScreenText} />;

  return (
    <SubmissionContextProvider websocketUrl={websocketUrl}>
      <div className="flex w-full grow rounded-xl relative">
        {
          // Event 1: Initializing editor (waiting for WS to send READY_FOR_MESSAGES)
          // Event 2: WS closed due to disconnection (handled in onClose)
          // Event 3: Fetching next question (handled in onClose)
          loadingScreenText !== LoadingScreenText.FINISHED_LOADING && (
            <LoadingScreen displayText={loadingScreenText} />
          )
        }
        <PartnerDetails partnerDetails={partnerDetails} />
        <PanelGroup direction="horizontal" className="grow">
          <Panel defaultSize={40} minSize={25}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={80}>
                <QuestionDetailsCard
                  question={question}
                  className="max-h-full overflow-auto"
                />
              </Panel>
              <HorizontalResizeHandle />
              <Panel>
                <div className="h-full w-full flex flex-col gap-y-1">
                  {websocketUrl && (
                    <MessageWindow websocketUrl={websocketUrl}></MessageWindow>
                  )}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
          <VerticalResizeHandle />
          <Panel minSize={40}>
            {websocketUrl && (
              <CodeWindow
                websocketUrl={websocketUrl}
                question={question}
                partnerDetails={partnerDetails}
                setPartnerDetails={setPartnerDetails}
                setErrorScreenText={setErrorScreenText}
                setLoadingScreenText={setLoadingScreenText}
              ></CodeWindow>
            )}
          </Panel>
        </PanelGroup>
      </div>
      <SubmissionModal />
    </SubmissionContextProvider>
  );
}
