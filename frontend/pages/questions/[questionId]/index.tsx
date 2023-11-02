import { getQuestion } from "@/api/questions";
import { Question } from "@/api/questions/types";
import QuestionActionsCard from "@/components/QuestionActionsCard";
import QuestionDetailsCard from "@/components/QuestionDetailsCard.tsx";
import { GetServerSideProps, InferGetStaticPropsType } from "next";

export const getServerSideProps = (async ({ params }) => {
  const data = await getQuestion(Number(params?.questionId), true);
  return { props: { question: data } };
}) satisfies GetServerSideProps<{
  question: Question;
}>;

export default function QuestionPage({
  question,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  return (
    <div>
      <QuestionActionsCard question={question} />
      <QuestionDetailsCard question={question}  />
    </div>
  );
}
