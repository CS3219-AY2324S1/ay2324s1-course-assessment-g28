import { z } from "zod";

export const AttemptedQuestionRecordZod = z.object({
  attemptId: z.number().int().nonnegative(),
  questionId: z.number().int().nonnegative(),
  questionTitle: z.string(),
  questionDifficulty: z.number().int().min(0).max(2),
  attemptDate: z.string().datetime(),
  attemptLanguage: z.string(),
  otherUser: z.string().email().optional().nullable(),
});

export const AttemptedQuestionDetailsZod = z.object({
  attemptId: z.number().int().nonnegative(),
  questionId: z.number().int().nonnegative(),
  questionTitle: z.string(),
  questionDifficulty: z.number().int().min(0).max(2),
  attemptDate: z.string().datetime(),
  attemptDetails: z.string(),
  attemptLanguage: z.string(),
  otherUser: z.string().email().optional().nullable(),
});

export const CreateQuestionAttemptRequestBodyZod = z.object({
  questionId: z.number().int().nonnegative(),
  questionTitle: z.string(),
  questionDifficulty: z.number().min(0).max(2),
  attemptDate: z.string().datetime(),
  attemptDetails: z.string(),
  attemptLanguage: z.string(),
  otherUser: z.string().email().optional().nullable(),
});

export type CreateQuestionAttemptRequestBody = z.infer<
  typeof CreateQuestionAttemptRequestBodyZod
>;

export const UserZod = z.object({
  isAdmin: z.boolean(),
  username: z.string(),
  favouriteProgrammingLanguage: z.string().optional(),
  numEasyQuestionsAttempted: z.number().nonnegative(),
  numMediumQuestionsAttempted: z.number().nonnegative(),
  numHardQuestionsAttempted: z.number().nonnegative(),
  attemptedQuestions: AttemptedQuestionRecordZod.array(),
});

export const UserPublicZod = z.object({
  username: z.string(),
  favouriteProgrammingLanguage: z.string().optional(),
});

export const CreateUserRequestBodyZod = z.object({
  username: z.string().min(1, "Username must be provided"),
  favouriteProgrammingLanguage: z.string().optional(),
});

export const UserExistsZod = z.object({
  exists: z.boolean(),
});

export type AttemptedQuestionRecord = z.infer<
  typeof AttemptedQuestionRecordZod
>;

export type AttemptedQuestionDetails = z.infer<
  typeof AttemptedQuestionDetailsZod
>;

export type User = z.infer<typeof UserZod>;

export type UserPublic = z.infer<typeof UserPublicZod>;

export type UserExists = z.infer<typeof UserExistsZod>;

export type CreateUserRequestBody = z.infer<typeof CreateUserRequestBodyZod>;
