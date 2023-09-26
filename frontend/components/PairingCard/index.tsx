import Card from "@/components/Card";
import { useState } from "react";
import PairingForm from "./PairingForm";
import { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { PairingRequest } from "@/api/pairing/types";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/react";

function get_pairing_service_uri(pairingRequest: PairingRequest) {
  return `ws://localhost:4000/pairing?user=${pairingRequest.userId}`;
}

export const PairingCard = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [pairingWebsocket, setPairingWebsocket] = useState<WebSocket | null>(
    null,
  );
  const [editorUri, setEditorUri] = useState<string | null>(null);

  const onSubmit: SubmitHandler<PairingRequest> = async (data) => {
    setIsSearching(true);
    toast.success("Matchmaking request sent.");
    searchForMatch(data);
  };

  const onCancel = async () => {
    pairingWebsocket?.close();
    toast.success("Matchmaking cancelled.");
    setIsSearching(false);
  };

  const searchForMatch = async (pairingRequest: PairingRequest) => {
    const ws = new WebSocket(get_pairing_service_uri(pairingRequest));
    ws.onmessage = (msg) => {
      try {
        let parsed = JSON.parse(msg.data);
        if (parsed.data.url) {
          setEditorUri(parsed.data.url);
          setIsSearching(false);
          ws.close();
        } else {
          console.log(parsed);
        }
      } catch (e) {
        console.error(e);
        toast.error("Internal error: Failed to parse matchmaking response.");
      }
    };
    setPairingWebsocket(ws);
  };

  return (
    <Card classNames="flex-shrink-0 flex-grow">
      {editorUri ? (
        <div>Found a match. Editor URI: {editorUri}</div>
      ) : isSearching ? (
        <div>
          <div>Searching for match...</div>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
        </div>
      ) : (
        <PairingForm onSubmit={onSubmit} />
      )}
    </Card>
  );
};
