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

export default function QuestionPage({
  question,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <QuestionDetailsCard question={question} className="row-span-1" />
    </div>
  );
}
