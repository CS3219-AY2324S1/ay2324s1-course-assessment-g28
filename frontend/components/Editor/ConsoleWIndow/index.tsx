import { useState } from "react";
import LoadingScreen from "../LoadingScreen";


export default function ConsoleWindow() {

  const [isRunning, setIsRunning] = useState(true);

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-auto rounded-xl relative box-border">
      {(() => {
        if (isRunning) {
          return (
            <LoadingScreen displayText="Waiting for result ..."></LoadingScreen>
          );
        }
      })()}
    </div>
  )
}
