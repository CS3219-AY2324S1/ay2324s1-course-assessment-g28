import darkImage from "./question-dark.jpg";
import lightImage from "./question-light.jpg";
import TemplateCard, { ContentPosition } from "../TemplateCard";
import { Button } from "@nextui-org/react";
import { scrollTillCallToAction } from "../../utils";

const Card2 = () => {
  return (
    <TemplateCard
      contentPosition={ContentPosition.RIGHT}
      content={
        <div>
          <div>Attempt the latest LeetCode questions</div>
          <div className="flex justify-end w-full mt-5">
            <Button
              color="secondary"
              variant="bordered"
              onClick={scrollTillCallToAction}
            >
              Begin now!
            </Button>
          </div>
        </div>
      }
      contentClassName="mt-[45px]"
      imageProps={{ darkImage, lightImage, alt: "login-card-2" }}
    />
  );
};

export default Card2;
