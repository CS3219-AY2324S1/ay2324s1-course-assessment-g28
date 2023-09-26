import Card from "@/components/Card";
import { useState } from "react";
import PairingForm from "./PairingForm";

const PairingCard = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [pairingRequest, setPairingRequest] = useState<object | null>(null);

  function handlePairingSubmit(form: object) {
    setPairingRequest(form);
    setIsSearching(true);
  }

  return (
    <Card classNames="flex-shrink-0 flex-grow">
      (isSearching) ?<div>Searching...</div>
      : <PairingForm onSubmit={handlePairingSubmit} />
    </Card>
  );
};
