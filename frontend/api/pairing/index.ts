import { PairingRequest } from "@/api/pairing/types";

export function getPairingServiceUri(pairingRequest: PairingRequest) {
  //TODO: check that we can get NEXT_PUBLIC_PAIRING_API correctly for non-local setups, as client needs direct access to pairing front
  return `${process.env.NEXT_PUBLIC_PAIRING_API}/pairing?user=${pairingRequest.userId}`;
}