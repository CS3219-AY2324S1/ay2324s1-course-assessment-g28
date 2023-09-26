import Card from "@/components/Card";
import { useState } from "react";
import PairingForm from "./PairingForm";
import { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { PairingRequest } from "@/api/pairing/types";
import toast from "react-hot-toast";

function get_pairing_service_uri(pairingRequest: PairingRequest) {
  return `ws://localhost:4000/pairing?user=${pairingRequest.userId}`;
}

export const PairingCard = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [pairingRequest, setPairingRequest] = useState<PairingRequest | null>(
    null,
  );
  const [pairingWebsocket, setPairingWebsocket] = useState<WebSocket | null>(
    null,
  );

  const onSubmit: SubmitHandler<PairingRequest> = async (data) => {
    setIsSearching(true);
    setPairingRequest(data);
    toast.success("Matchmaking request sent.");
    searchForMatch(data);
  };

  const searchForMatch = async (pairingRequest: PairingRequest) => {
    const ws = new WebSocket(get_pairing_service_uri(pairingRequest));
    ws.onmessage = (event) => {
      console.log(JSON.parse(event.data));
    };
    setPairingWebsocket(ws);
    setTimeout(() => {
      console.log("2 seconds elapsed");
    }, 2000);
  };

  return (
    <Card classNames="flex-shrink-0 flex-grow">
      {isSearching ? (
        <div>Searching for match...</div>
      ) : (
        <PairingForm onSubmit={onSubmit} />
      )}
    </Card>
  );
};
