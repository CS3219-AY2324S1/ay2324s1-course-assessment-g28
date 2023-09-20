/**
 * This is a test page to verify question apis only
 */

import { getQuestions } from "@/api/questions";
import { QUESTION_API } from "@/api/routes";
import useSWR from "swr";

export default function QuestionTestPage() {
  const options = {
    size: 10,
    offset: 0
  }
  const { data, error, isLoading } = useSWR({QUESTION_API, options}, () => getQuestions(options));
  
  if (error) {
    console.log(error);
    return <div>error!</div>;
  }
  return (
    <div>{data && data.content.map((q) => <div key={q.id}>{JSON.stringify(q)}</div>)}</div>
  );
}
