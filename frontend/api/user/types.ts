import { z } from "zod";

export const AttemptedQuestionRecordZod = z.object({
  attemptId: z.number().int().nonnegative(),
  questionId: z.number().int().nonnegative(),
  questionTitle: z.string(),
  attemptDate: z.string().datetime()
});

export const AttemptedQuestionDetailsZod = z.object({
  attemptId: z.number().int().nonnegative(),
  questionId: z.number().int().nonnegative(),
  questionTitle: z.string(),
  attemptDate: z.string().datetime(),
  attemptDetails: z.string(),
});

export const UserZod = z.object({
  isAdmin: z.boolean(),
  username: z.string(),
  favouriteProgrammingLanguage: z.string().optional(),
  numEasyQuestionsAttempted: z.number().nonnegative(),
  numMediumQuestionsAttempted: z.number().nonnegative(),
  numHardQuestionsAttempted: z.number().nonnegative(), 
  attemptedQuestions: AttemptedQuestionRecordZod.array(),
});


export const CreateUserRequestBodyZod = z.object({
  username: z.string().min(1, "Username must be provided"),
  favouriteProgrammingLanguage: z.string().optional(),
})

export type AttemptedQuestionRecord = z.infer<
  typeof AttemptedQuestionRecordZod
>;

export type AttemptedQuestionDetails = z.infer<
  typeof AttemptedQuestionDetailsZod
>;

export type User = z.infer<typeof UserZod>;

export type CreateUserRequestBody = z.infer<typeof CreateUserRequestBodyZod>