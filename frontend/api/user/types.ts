import { z } from "zod";

export const UserZod = z.object({
  email: z.string().email(),
  isAdmin: z.boolean(),
});

export type User = z.infer<typeof UserZod>;
