import { PairingRequest } from "@/api/pairing/types";

export function getPairingServiceUri(pairingRequest: PairingRequest) {
  return `ws://localhost:4000/pairing?user=${pairingRequest.userId}`;
}

// TODO: remove harcoded values
const PAIRING_SERVICE = "ws://localhost:4000/pairing";

export function getRequestEndpoint(pairingRequest: PairingRequest): string {
  return `${PAIRING_SERVICE}?user=${pairingRequest}`;
}