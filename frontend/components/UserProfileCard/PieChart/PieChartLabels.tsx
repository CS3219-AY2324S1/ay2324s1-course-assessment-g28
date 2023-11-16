import { User } from "@/api/user/types";
import { UNDEFINED_VALUE } from "../config";

const PieChartLabels = ({ data }: { data?: User }) => (
  <div className="flex flex-col gap-3 w-full max-w-[300px]">
    <div className="flex justify-between text-xs">
      <div className="flex gap-2 items-center">
        <div className="w-[8px] h-[8px] rounded-full bg-lime-500" />
        <span>Easy questions completed</span>
      </div>
      <div className="font-semibold">
        {data?.numEasyQuestionsAttempted ?? UNDEFINED_VALUE}
      </div>
    </div>
    <div className="flex justify-between text-xs">
      <div className="flex gap-2 items-center">
        <div className="w-[8px] h-[8px] rounded-full bg-amber-500" />
        <span>Medium questions completed</span>
      </div>
      <div className="font-semibold">
        {data?.numMediumQuestionsAttempted ?? UNDEFINED_VALUE}
      </div>
    </div>
    <div className="flex justify-between text-xs">
      <div className="flex gap-2 items-center">
        <div className="w-[8px] h-[8px] rounded-full bg-red-600" />
        <span>Hard questions completed</span>
      </div>
      <div className="font-semibold">
        {data?.numHardQuestionsAttempted ?? UNDEFINED_VALUE}
      </div>
    </div>
  </div>
);

export default PieChartLabels;
