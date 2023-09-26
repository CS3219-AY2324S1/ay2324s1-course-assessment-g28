import { z } from "zod";
import { QuestionComplexity } from "../questions/types";

export const PairingRequestZod = z.object({
  complexity: z.nativeEnum(QuestionComplexity),
});

export type PairingRequest = z.infer<typeof PairingRequestZod>;
