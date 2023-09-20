/**
 * Definition of type to be received from questions API
 */

import { PagedResponse } from "@/api/constants";
import { z } from "zod";

export enum QuestionComplexity {
  easy = 0,
  medium = 1,
  hard = 2,
}

// For displaying in list of questions, basic identifying information
export const QuestionBaseZod = z.object({
  id: z.number().int().min(0),
  title: z.string(),
  category: z.string().array(),
  complexity: z.nativeEnum(QuestionComplexity),
});

export const PageOfQuestionsZod = z.object;

export type QuestionBase = z.infer<typeof QuestionBaseZod>;

export const QuestionZod = QuestionBaseZod.extend({
  description: z.string(),
});

export type Question = z.infer<typeof QuestionZod>;

export interface GetQuestionRequest {
  size: number;
  offset: number;
  keyword?: string;
  complexity: QuestionComplexity;
}

export const GetQuestionResponseBodyZod = PagedResponse.extend({
  content: QuestionBaseZod.array(),
});

export type GetQuestionResponseBody = z.infer<
  typeof GetQuestionResponseBodyZod
>;
