import { getQuestion } from "@/api/questions";
import { Question } from "@/api/questions/types";
import QuestionDetailsCard from "@/components/QuestionDetailsCard.tsx";
import { GetServerSideProps, InferGetStaticPropsType } from "next";

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
    <div>
      <QuestionDetailsCard question={question}  />
    </div>
  );
}
