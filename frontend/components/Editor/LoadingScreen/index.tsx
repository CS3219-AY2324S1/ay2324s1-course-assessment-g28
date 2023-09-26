import loading from "@/assets/images/loading.gif";

interface LoadingScreenProps {
  displayText?: string,
}

export default function LoadingScreen(props: LoadingScreenProps) {
  return (
    <div className="absolute h-full w-full bg-white flex flex-col z-50 items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <img src={loading.src} alt="loading..." className="h-10 w-10" />
        <div>
          {props.displayText}
        </div>
      </div>
    </div>
  )
}
