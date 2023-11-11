import darkImage from "./tracking-dark.jpg";
import lightImage from "./tracking-light.jpg";
import TemplateCard, { ContentPosition } from "../TemplateCard";
import { Button } from "@nextui-org/react";
import { scrollTillCallToAction } from "../utils";

const Card4 = () => {
  return (
    <TemplateCard
      contentPosition={ContentPosition.RIGHT}
      content={
        <div>
          <div>Track your learning progress</div>
          <div className="flex justify-end w-full mt-5">
            <Button
              color="secondary"
              variant="bordered"
              onClick={scrollTillCallToAction}
            >
              Show me!
            </Button>
          </div>
        </div>
      }
      contentClassName="mt-[45px]"
      imageProps={{ darkImage, lightImage, alt: "login-card-4" }}
    />
  );
};

export default Card4;
