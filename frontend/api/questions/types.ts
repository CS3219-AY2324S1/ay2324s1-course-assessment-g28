/**
 * Definition of type to be received from questions API
 */

import { PagedResponse } from "@/api/constants";
import { z } from "zod";

export enum QuestionComplexity {
  EASY = 0,
  MEDIUM = 1,
  HARD = 2,
}

const QuestionDescriptionZod =z.object({
  type: z.literal("doc"),
  content: z.any().array()
})

// For displaying in list of questions, basic identifying information
export const QuestionBaseZod = z.object({
  id: z.number().int().min(0),
  title: z.string().min(1),
  category: z.string().array(),
  complexity: z.nativeEnum(QuestionComplexity),
});

export const QuestionCreationZod = z.object({
  title: z.string().min(1),
  category: z.string().array(),
  complexity: z.nativeEnum(QuestionComplexity),
  description: QuestionDescriptionZod // a EditorContentState
})

export type QuestionCreation = z.infer<typeof QuestionCreationZod>;

export const PageOfQuestionsZod = z.object;

export type QuestionBase = z.infer<typeof QuestionBaseZod>;

export const QuestionZod = QuestionBaseZod.extend({
  description: QuestionDescriptionZod
});

export type Question = z.infer<typeof QuestionZod>;

export interface GetQuestionRequest {
  size: number;
  offset: number;
  keyword?: string;
  complexity?: QuestionComplexity;
}

export const GetQuestionResponseBodyZod = PagedResponse.extend({
  content: QuestionBaseZod.array(),
});

export type GetQuestionResponseBody = z.infer<
  typeof GetQuestionResponseBodyZod
>;

