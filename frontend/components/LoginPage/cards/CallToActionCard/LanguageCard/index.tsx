import { SiPython, SiJavascript } from "react-icons/si";
import { LiaJava } from "react-icons/lia";
import { Card } from "@nextui-org/react";
import cx from "classnames";

const LanguageCard = () => {
  return (
    <Card
      className={cx(
        "w-fit flex flex-col gap-3 bg-content2",
        "dark:bg-[#212121] mt-2 mb-7 mx-auto",
      )}
      shadow="lg"
    >
      <div className="m-[36px]">
        <div>
          <div className="cursor-default">
            {"Our platform supports Python, Java, and JavaScript"}
          </div>
          <div className="flex justify-center h-[50px] gap-5 my-5">
            <SiPython
              className="h-[50px] w-[50px] flex-shrink-0
                         hover:scale-150 transition-all"
            />
            <LiaJava
              className="h-[50px] w-[50px] flex-shrink-0
                         hover:scale-150 transition-all"
            />
            <SiJavascript
              className="h-[50px] w-[50px] flex-shrink-0
                         hover:scale-150 transition-all"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LanguageCard;
