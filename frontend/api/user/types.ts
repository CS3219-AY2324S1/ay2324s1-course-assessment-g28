import { z } from "zod";

export const AttemptedQuestionRecordZod = z.object({
  attemptId: z.number().int().nonnegative(),
  questionId: z.number().int().nonnegative(),
  questionTitle: z.string(),
  attemptDate: z.number().int().nonnegative(),
});

export const AttemptedQuestionDetailsZod = z.object({
  attemptId: z.number().int().nonnegative(),
  questionId: z.number().int().nonnegative(),
  questionTitle: z.string(),
  attemptDate: z.number().int().nonnegative(),
  attemptDetails: z.string(),
});

export const UserZod = z.object({
  isAdmin: z.boolean(),
  username: z.string(),
  attemptedQuestions: AttemptedQuestionRecordZod.array(),
});

export const CreateUserRequestBodyZod = z.object({
  username: z.string()
})

export type AttemptedQuestionRecord = z.infer<
  typeof AttemptedQuestionRecordZod
>;

export type AttemptedQuestionDetails = z.infer<
  typeof AttemptedQuestionDetailsZod
>;

export type User = z.infer<typeof UserZod>;

export type CreateUserRequestBody = z.infer<typeof CreateUserRequestBodyZod>