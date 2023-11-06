import { sendCodeForExecutionAndFetchResult } from "@/api/codeExecution";
import { ProgrammingLanguage } from "@/api/codeExecution/type";
import { getQuestion } from "@/api/questions";
import { Question } from "@/api/questions/types";
import { getQuestionAttempt } from "@/api/user";
import { AttemptedQuestionDetails } from "@/api/user/types";
import HorizontalResizeHandle from "@/components/PanelResizeHandles/HorizontalResizeHandle";
import VerticalResizeHandle from "@/components/PanelResizeHandles/VerticalResizeHandle";
import QuestionDetailsCard from "@/components/QuestionDetailsCard.tsx";
import {
  CodeRunState,
  programmingLanguageMonacoIdentifiers,
} from "@/components/SingleEditor/constants";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Editor } from "@monaco-editor/react";
import { Chip, Spinner } from "@nextui-org/react";
import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { getServerSession } from "next-auth";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PanelGroup, Panel } from "react-resizable-panels";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

export const getServerSideProps = (async ({ params, req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  const attemptData = await getQuestionAttempt(
    Number(params?.attemptId),
    true,
    session?.user.email,
  );
  const questionData = await getQuestion(Number(attemptData.questionId), true);
  return {
    props: {
      attempt: attemptData,
      question: questionData,
    },
  };
}) satisfies GetServerSideProps<{
  attempt: AttemptedQuestionDetails;
  question: Question;
}>;

export default function QuestionAttemptPage({
  attempt,
  question,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const { theme } = useTheme();
  const [codeRunState, setCodeRunState] = useState<CodeRunState>({
    result: "",
    inProgress: true,
    error: false,
  });
  // code exectution result on first load
  useEffect(() => {
    const callingFunc = async () => {
      const result = await sendCodeForExecutionAndFetchResult(
        attempt.attemptDetails,
        attempt.attemptLanguage as ProgrammingLanguage,
      );
      try {
        let executionResult = "";
        if (result.compileOutput) {
          executionResult += result.compileOutput + "\n";
        }
        if (result.stdout) {
          executionResult += result.stdout;
        }
        setCodeRunState({
          result: executionResult,
          inProgress: false,
          error: false,
        });
      } catch (e) {
        setCodeRunState({
          result: "",
          inProgress: false,
          error: true,
        });
      }
    };
    callingFunc();
  }, [attempt]);

  return (
    <div className="flex flex-grow overflow-auto">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={40}>
          <QuestionDetailsCard
            question={question}
            className="max-h-full overflow-auto"
          />
        </Panel>
        <VerticalResizeHandle />
        <Panel>
          <PanelGroup direction="vertical" className="flex flex-grow">
            <Panel className="flex flex-col" defaultSize={80}>
              <div className="flex flex-col flex-grow">
                <div className="flex flex-row gap-2 items-center justify-start w-full pb-2">
                  <Chip color="secondary">{attempt.attemptLanguage}</Chip>
                  <div>
                    <h3 className="text-lg">
                      Submitted on{" "}
                      {dayjs(attempt.attemptDate).format("YYYY-MM-DD, LTS")}
                    </h3>
                  </div>
                </div>
                <Editor
                  theme={theme === "light" ? "light" : "vs-dark"}
                  className="flex-grow"
                  language={
                    programmingLanguageMonacoIdentifiers[
                      attempt.attemptLanguage as ProgrammingLanguage
                    ]
                  }
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    readOnly: true,
                  }}
                  value={attempt.attemptDetails}
                />
              </div>
            </Panel>
            <HorizontalResizeHandle />
            <Panel>
              <div className="h-full w-full rounded-md flex flex-col gap-y-1">
                <div>
                  <h2 className="text-lg">Execution Output</h2>
                </div>
                {codeRunState.error ? (
                  <div className="h-full w-full bg-content1 rounded-md p-4 text-red-700 dark:text-red-400">
                    There was an error executing your code. Please try again.
                  </div>
                ) : codeRunState.inProgress ? (
                  <div className="w-full h-full grid content-center bg-content1 rounded-md">
                    <Spinner
                      label="Executing code..."
                      color="secondary"
                    ></Spinner>
                  </div>
                ) : (
                  <div className="h-full w-full bg-content1 rounded-md p-4">
                    {codeRunState.result}
                  </div>
                )}
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}
