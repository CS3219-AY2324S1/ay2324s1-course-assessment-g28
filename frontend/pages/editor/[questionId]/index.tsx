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
import { Spinner } from "@nextui-org/react";
import VerticalResizeHandle from "@/components/PanelResizeHandles/VerticalResizeHandle";
import HorizontalResizeHandle from "@/components/PanelResizeHandles/HorizontalResizeHandle";
import useSWR from "swr";
import { getPublicUserInfo } from "@/api/user";
import { Users, User as UserIcon } from "lucide-react";

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

//TODO: remove when done
// fill in with appropriate data
const mock_collab_data = {
  status: CollabStatus,
  otherUserEmail: "ghjben@gmail.com",
};

export default function EditorPage({
  question,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [websocketUrl, setWebsocketUrl] = useState<string>("");
  //TODO: set this variable to be the actual user email
  const otherUserEmail = mock_collab_data.otherUserEmail;
  const { data: otherUser } = useSWR(
    { otherUserEmail, getPublicUserInfo },
    () => getPublicUserInfo(otherUserEmail),
  );

  // TODO: set this approriately based on the collab state
  const [collabStatus, setCollabStatus] = useState<CollabStatus>(
    CollabStatus.DOUBLE,
  );
  // Obtain the WebSocket link from query and get the first question
  useEffect(() => {
    if (question === undefined) {
      return;
    }
    console.log(process.env);
    console.log(process.env.COLLAB_API);
    // The pairId and userId are already appended into the encoded wsUrl
    // Append questionId into wsUrl for service to store and allow retrieval upon reconnection
    const oldWsUrl = (router.query["wsUrl"] as string) ?? "";
    console.log("Old wsUrl:", oldWsUrl);
    const wsUrl = `${oldWsUrl}&questionId=${question.id}`;
    console.log("Connecting to WS:", wsUrl);
    setWebsocketUrl(wsUrl);
  }, [router, question]);

  if (!websocketUrl)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner color="secondary" />
      </div>
    );

  return (
    <SubmissionContextProvider websocketUrl={websocketUrl}>
      <div className="flex w-full grow rounded-xl relative">
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
                  <div className="flex flex-row gap-x-2">
                    {collabStatus === CollabStatus.DOUBLE ? (
                      <Users fill="purple"/>
                    ) : (
                      <UserIcon fill="gray"/>
                    )}
                    <h2 className="text-lg">
                      Session Status:{" "}
                      {collabStatus === CollabStatus.DOUBLE ? (
                        <span>
                          Coding with{" "}
                          <span className="text-purple-400">
                            {otherUser?.username}
                          </span>
                        </span>
                      ) : (
                        "Coding alone"
                      )}
                    </h2>
                  </div>
                  {websocketUrl && collabStatus === CollabStatus.DOUBLE && (
                    <MessageWindow websocketUrl={websocketUrl}></MessageWindow>
                  )}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
          <VerticalResizeHandle />
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
