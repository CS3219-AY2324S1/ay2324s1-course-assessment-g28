import { getQuestion } from "@/api/questions";
import { Question } from "@/api/questions/types";
import VerticalResizeHandle from "@/components/PanelResizeHandles/VerticalResizeHandle";
import QuestionDetailsCard from "@/components/QuestionDetailsCard.tsx";
import SingleEditor from "@/components/SingleEditor";
import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { PanelGroup, Panel } from "react-resizable-panels";

export const getServerSideProps = (async ({ params }) => {
  const data = await getQuestion(Number(params?.questionId), true);
  return { props: { question: data } };
}) satisfies GetServerSideProps<{
  question: Question;
}>;

export default function SingleEditorPage({
  question,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-grow overflow-auto">
      <PanelGroup direction="horizontal">
        <Panel>
          <QuestionDetailsCard
            question={question}
            className="max-h-full overflow-auto"
          />
        </Panel>
        <VerticalResizeHandle />
        <Panel>
          <SingleEditor question={question} />
        </Panel>
      </PanelGroup>
    </div>
  );
}
