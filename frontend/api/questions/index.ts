import { HttpMethod, HttpStatus } from "@/api/constants";
import { RequestError } from "@/api/errors";
import {
  GetQuestionRequest,
  GetQuestionResponseBody,
  GetQuestionResponseBodyZod,
  Question,
  QuestionZod,
} from "@/api/questions/types";
import { QUESTION_API, getQuestionByIdPath } from "@/api/routes";

export async function getQuestions({
  size,
  offset,
  keyword,
  complexity,
}: GetQuestionRequest) {
  const params = new URLSearchParams({
    size: size.toString(),
    offset: offset.toString()
  })
  if (keyword) {
    params.append("keyword", keyword);
  }
  if (complexity) {
    params.append("complexity", complexity.toString());
  }
  const res = await fetch(QUESTION_API + "?" + params.toString(), {
    method: HttpMethod.GET,
  });
  if (res.status !== HttpStatus.OK) {
    throw new RequestError(res);
  }
  const body = await res.json();
  GetQuestionResponseBodyZod.parse(body);
  return body as GetQuestionResponseBody;
}

export async function getQuestion(id: number) {
  const url = getQuestionByIdPath(id);
  const res = await fetch(url, {
    method: HttpMethod.GET,
  });
  if (res.status !== HttpStatus.OK) {
    throw new RequestError(res);
  }
  const body = await res.json();
  QuestionZod.parse(body);
  return body as Question;
}

export async function postQuestion(question: Question) {
  const res = await fetch(QUESTION_API, {
    method: HttpMethod.POST,
    body: JSON.stringify(question),
  });
  if (res.status !== HttpStatus.RESOURCE_CREATED) {
    throw new RequestError(res);
  }
}

/**
 * For updating sepcific fields of a question.
 */
export async function patchQuestion(
  id: number,
  questionFieldsToUpdate: Partial<Question>,
) {
  const url = getQuestionByIdPath(id);
  const res = await fetch(url, {
    method: HttpMethod.PATCH,
    body: JSON.stringify(questionFieldsToUpdate),
  });
  if (res.status !== HttpStatus.OK_NO_CONTENT) {
    throw new RequestError(res);
  }
}

export async function deleteQuestion(id: number) {
  const url = getQuestionByIdPath(id);
  const res = await fetch(url, {
    method: HttpMethod.DELETE,
  });
  if (res.status !== HttpStatus.OK_NO_CONTENT) {
    throw new RequestError(res);
  }
}