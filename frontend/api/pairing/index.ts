import { PairingRequest } from "@/api/pairing/types";

const DEFAULT_PAIRING_DURATION = 30000;

export const MAX_PAIRING_DURATION =
  process.env.MAX_PAIRING_DURATION === undefined
    ? DEFAULT_PAIRING_DURATION
    : parseInt(process.env.MAX_PAIRING_DURATION);

export function getPairingServiceUri(pairingRequest: PairingRequest) {
  //TODO: check that we can get NEXT_PUBLIC_PAIRING_API correctly for non-local setups, as client needs direct access to pairing front
  return `${process.env.NEXT_PUBLIC_PAIRING_API}/pairing?user=${
    pairingRequest.userId
  }&complexity=${pairingRequest.complexity.toString()}`;
}
