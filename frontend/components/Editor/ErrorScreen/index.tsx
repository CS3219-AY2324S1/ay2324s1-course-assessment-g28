import { HOME } from "@/routes";
import { Button } from "@nextui-org/react";
import { HeartCrack } from "lucide-react";
import { useRouter } from "next/router";

interface ErrorScreenProps {
  displayText?: string;
}

export default function ErrorScreen({ displayText }: ErrorScreenProps) {
  const router = useRouter();

  return (
    <div
      className="absolute h-full w-full bg-content1 flex flex-col 
                    z-50 items-center justify-center"
    >
      <div className="flex flex-col items-center gap-5">
        <HeartCrack fill="red" className="h-20 w-20" />
        <div className="text-center whitespace-pre-line">{displayText}</div>
        <Button
          className="m-2"
          color="warning"
          onClick={() => router.push(HOME)}
        >
          Return to Home Page
        </Button>
      </div>
    </div>
  );
}
