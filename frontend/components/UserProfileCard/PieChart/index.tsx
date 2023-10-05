import Card from "@/components/Card";
import { Pie } from "@nivo/pie";
import { useMemo } from "react";
import { USER_ATTEMPTS_CONFIGS } from "../config";
import { User } from "@/api/user/types";
import PieChartLabels from "./PieChartLabels";

const PieChart = ({ data }: { data?: User }) => {
  const processedPieData = useMemo(() => {
    return USER_ATTEMPTS_CONFIGS.map((attemptConfig) => ({
      ...attemptConfig,
      value: attemptConfig?.render(data),
    }));
  }, [data]);

  const attemptCount = data?.attemptedQuestions?.length ?? 0;
  return (
    <Card
      className="md:min-w-[310px] shrink-0 flex flex-col items-center
        max-h-[486px]"
    >
      <div className="cursor-default w-full text-left">
        Question complexity breakdown
      </div>
      {attemptCount > 0 ? (
        <>
          <Pie
            data={processedPieData}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            enableArcLinkLabels={false}
            width={200}
            height={200}
            margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
            colors={(datum) => datum.data.color}
            arcLabel={(datum) =>
              (datum?.value ?? 0) > 0 ? datum.value.toString() : ""
            }
            arcLabelsTextColor="rgb(63, 63, 70)"
          />
          <PieChartLabels data={data} />
        </>
      ) : (
        <div className="h-[200px] w-full flex justify-center items-center">
          <span>No attempts yet!</span>
        </div>
      )}
    </Card>
  );
};

export default PieChart;
