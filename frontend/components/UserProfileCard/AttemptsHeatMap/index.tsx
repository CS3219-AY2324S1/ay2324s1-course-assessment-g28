import { User } from "@/api/user/types";
import { Tooltip } from "@nextui-org/react";
import HeatMap from "@uiw/react-heat-map";
import { useMemo } from "react";
import dayjs from "dayjs";
import Card from "@/components/Card";
import { BE_DATE_FORMAT, CHART_DATE_FORMAT } from "../config";
import { useForceRerender } from "./useForceRerender";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const AttemptsHeatMap = ({ data }: { data?: User }) => {
  const { attemptedQuestions } = data ?? {};
  const attemptCount = attemptedQuestions?.length ?? 0;

  const processedData = useMemo(() => {
    const dayMap: Record<string, number> = {};
    for (const attempt of attemptedQuestions ?? []) {
      const { attemptDate } = attempt;
      dayMap[attemptDate] = (dayMap?.[attemptDate] ?? 0) + 1;
    }
    return Object.entries(dayMap).map(([key, value]) => ({
      date: dayjs(key, BE_DATE_FORMAT).format(CHART_DATE_FORMAT),
      count: value,
    }));
  }, [attemptedQuestions]);

  return (
    <Card className="w-full">
      <>
        <span className="font-bold text-xl cursor-default">{attemptCount}</span>
        <span className="cursor-default">{` attempt${
          attemptCount !== 1 ? "s" : ""
        } in the last year`}</span>
      </>
      <div
        className="w-full flex justify-center
          md:scale-80 scale-70 md:min-w-[730px]"
      >
        <HeatMap
          key={useForceRerender()}
          value={processedData}
          startDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
          endDate={new Date()}
          width={730}
          viewBox="0 0 730 150"
          rectProps={{
            rx: 2.5,
          }}
          rectRender={(props, data) => {
            const { count, date } = data;
            return (
              <Tooltip
                className="rounded-[2px]"
                placement="top"
                content={
                  <div className="text-[18px] text-zinc-600 cursor-default">
                    <span className="font-semibold">{count ?? 0}</span>
                    <span>{` attempt${
                      count !== 1 ? "s" : ""
                    } on ${date}`}</span>
                  </div>
                }
              >
                <rect {...props} />
              </Tooltip>
            );
          }}
          legendRender={(props) => <rect {...props} rx={2.5} />}
        />
      </div>
    </Card>
  );
};

export default AttemptsHeatMap;
