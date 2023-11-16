/**
 * This is a test page to verify question apis only
 */

import { getQuestion } from "@/api/questions";
import { Question } from "@/api/questions/types";
import QuestionCreationForm from "@/components/QuestionCreationForm";
import { GetServerSideProps, InferGetStaticPropsType } from "next";

export const getServerSideProps = (async ({ params }) => {
  const data = await getQuestion(Number(params?.questionId), true);
  return { props: { question: data } };
}) satisfies GetServerSideProps<{
  question: Question;
}>;

export default function QuestionTestPage({
  question,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  return <QuestionCreationForm originalQuestion={question} />;
}
