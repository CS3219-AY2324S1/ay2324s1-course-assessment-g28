import { z } from "zod";
import { QuestionComplexity } from "../questions/types";

export const PairingRequestZod = z.object({
  userId: z.string(),
  complexity: z.nativeEnum(QuestionComplexity),
});

export type PairingRequest = z.infer<typeof PairingRequestZod>;

const PAIRING_SERVICE = "ws://localhost:4000/pairing";

function get_request_endpoint(pairingRequest: PairingRequest): string {
  return `${PAIRING_SERVICE}?user=${pairingRequest}`;
}
