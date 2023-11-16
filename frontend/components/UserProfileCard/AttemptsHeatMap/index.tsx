import { User } from "@/api/user/types";
import { Tooltip } from "@nextui-org/react";
import HeatMap from "@uiw/react-heat-map";
import { CSSProperties, useMemo } from "react";
import dayjs from "dayjs";
import Card from "@/components/Card";
import { CHART_DATE_FORMAT } from "../config";
import { useForceRerender } from "./useForceRerender";
import { useTheme } from "next-themes";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const AttemptsHeatMap = ({ data }: { data?: User }) => {
  const { attemptedQuestions } = data ?? {};
  const { theme } = useTheme();

  const oneYearAgo = useMemo(
    () => new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    [],
  );

  const { attemptCount, processedDataArray } = useMemo(() => {
    const dataWithDayjs = attemptedQuestions
      // change date into suitable format
      ?.map((qn) => {
        return {
          ...qn,
          date: dayjs(qn.attemptDate).format(CHART_DATE_FORMAT),
          day: dayjs(qn.attemptDate),
        };
      })
      // filter out dates > 1 year ago
      .filter((qn) => qn.day.isAfter(oneYearAgo.toDateString()));

    // group by attempt date
    const dayMap: Record<string, number> = {};
    for (const attempt of dataWithDayjs ?? []) {
      const { date } = attempt;
      dayMap[date] = (dayMap?.[date] ?? 0) + 1;
    }

    // change data into suitable format for heatmap
    const processedDataArray = Object.entries(dayMap).map(([key, value]) => ({
      date: key,
      count: value,
    }));
    return {
      attemptCount: dataWithDayjs?.length,
      processedDataArray,
    };
  }, [attemptedQuestions, oneYearAgo]);

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
          scale-80 lg:scale-100 md:min-w-[730px]"
      >
        {/* wrap heatmap in scrolling box for small widths */}
        <div
          className="w-[730px] m-auto
          overflow-x-scroll md:w-full grid place-items-center text-white"
        >
          <HeatMap
            key={useForceRerender()}
            value={processedDataArray}
            startDate={oneYearAgo}
            endDate={new Date()}
            width={730}
            viewBox="0 0 730 130"
            rectProps={{
              rx: 2.5,
            }}
            style={
              {
                color: theme === "dark" ? "#D9D9D9" : "#4a148c",
                "--rhm-rect": theme === "dark" ? "#424242" : "#bdbdbd",
              } as CSSProperties
            }
            rectRender={(props, data) => {
              const { count, date } = data;
              return (
                <Tooltip
                  className="rounded-[2px]"
                  placement="top"
                  content={
                    <div
                      className="text-foreground
                      cursor-default"
                    >
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
      </div>
      <div className="md:hidden text-xs text-right text-purple-700">
        {"Scroll to see more >"}
      </div>
    </Card>
  );
};

export default AttemptsHeatMap;
