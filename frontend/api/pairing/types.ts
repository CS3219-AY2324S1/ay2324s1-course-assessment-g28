import { z } from "zod";
import { QuestionComplexity } from "../questions/types";

export const PairingRequestZod = z.object({
  userId: z.string(),
  complexity: z.nativeEnum(QuestionComplexity).optional(),
  question: z.number().nonnegative().int().optional(), // specific question to match on
});

export type PairingRequest = z.infer<typeof PairingRequestZod>;
