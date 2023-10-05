import { User } from "@/api/user/types";
import { BE_DATE_FORMAT, CHART_DATE_FORMAT } from "../config";
import Card from "@/components/Card";
import dayjs from "dayjs";
import { useMemo } from "react";
import cx from "classnames";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const RecentAttempts = ({ data }: { data?: User }) => {
  const processedData = useMemo(() => {
    const { attemptedQuestions } = data ?? {};
    const formattedDateData = attemptedQuestions?.map((qn) => ({
      ...qn,
      attemptDate: dayjs(qn.attemptDate, BE_DATE_FORMAT),
      attemptDateString: dayjs(qn.attemptDate, BE_DATE_FORMAT).format(
        CHART_DATE_FORMAT,
      ),
    }));
    formattedDateData?.sort((a, b) => {
      if (a.attemptDate.isSame(b.attemptDateString)) {
        return 0;
      }
      return a.attemptDate.isAfter(b.attemptDateString) ? -1 : 1;
    });
    return formattedDateData?.slice(0, 10);
  }, [data]);

  const attemptCount = data?.attemptedQuestions?.length ?? 0;

  return (
    <Card className="w-full">
      <div className="cursor-default mb-1">Recent attempts</div>
      {attemptCount > 0 ? (
        processedData?.map((qn, index) => {
          const { questionId, questionTitle, attemptDate, attemptDateString } =
            qn;
          return (
            <div
              key={`${questionId}-${attemptDate}-${index}`}
              className={cx(
                "flex gap-6 justify-between p-2 pl-4 pr-8 rounded-lg",
                index % 2 ? "" : "bg-neutral-200",
              )}
            >
              <div
                className="text-sm truncate
                max-w-[400px] md:max-w-[180px] lg:max-w-[300px]"
              >
                {questionTitle}
              </div>
              <div className="text-sm text-purple-700 shrink-0">
                {attemptDateString}
              </div>
            </div>
          );
        })
      ) : (
        <div className="h-[200px] w-full flex justify-center items-center">
          <span>No attempts yet!</span>
        </div>
      )}
    </Card>
  );
};

export default RecentAttempts;
