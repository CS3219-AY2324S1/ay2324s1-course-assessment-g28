import { PairingRequest } from "@/api/pairing/types";

const DEFAULT_PAIRING_DURATION = 30000;

export const MAX_PAIRING_DURATION =
  process.env.MAX_PAIRING_DURATION === undefined
    ? DEFAULT_PAIRING_DURATION
    : parseInt(process.env.MAX_PAIRING_DURATION);

export function getPairingServiceUri(pairingRequest: PairingRequest) {
  if (typeof pairingRequest.complexity !== "undefined") {
    return `${process.env.NEXT_PUBLIC_PAIRING_API}/pairing?user=${
      pairingRequest.userId
    }&complexity=${pairingRequest.complexity.toString()}`;
  } else if (typeof pairingRequest.question !== "undefined") {
    return `${process.env.NEXT_PUBLIC_PAIRING_API}/pairing?user=${
      pairingRequest.userId
    }&question=${pairingRequest.question.toString()}`;
  } else {
    throw new Error(
      "PAIRING REQUEST ERROR: Neither complexity or question provided in pairing request.",
    );
  }
}
