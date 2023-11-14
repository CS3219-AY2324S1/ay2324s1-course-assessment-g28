import { z } from "zod";

export const UserZod = z.object({
  username: z.string(),
  favouriteProgrammingLanguage: z.string().optional(),
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

export type User = z.infer<typeof UserZod>;

export type UserPublic = z.infer<typeof UserPublicZod>;

export type UserExists = z.infer<typeof UserExistsZod>;

export type CreateUserRequestBody = z.infer<typeof CreateUserRequestBodyZod>;
