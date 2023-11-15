import loading from "@/assets/images/loading.gif";

interface LoadingScreenProps {
  displayText?: string;
}

export default function LoadingScreen({ displayText }: LoadingScreenProps) {
  return (
    <div
      className="absolute h-full w-full bg-content1 flex flex-col
                    z-50 items-center justify-center"
    >
      <div className="flex flex-col items-center gap-5">
        <img src={loading.src} alt="loading..." className="h-10 w-10" />
        <div className="text-center whitespace-pre-line">{displayText}</div>
      </div>
    </div>
  );
}
