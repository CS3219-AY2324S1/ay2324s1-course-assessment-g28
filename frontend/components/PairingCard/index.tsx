import Card from "@/components/Card";
import { useState } from "react";
import PairingForm from "./PairingForm";
import { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { PairingRequest } from "@/api/pairing/types";
import toast from "react-hot-toast";

export const PairingCard = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [pairingRequest, setPairingRequest] = useState<PairingRequest | null>(
    null,
  );

  const onSubmit: SubmitHandler<PairingRequest> = async (data) => {
    setIsSearching(true);
    setPairingRequest(data);
    toast.success("Matchmaking request sent.");
    searchForMatch();
  };

  const searchForMatch = async () => {
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
