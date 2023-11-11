import darkImage from "./matching-dark.jpg";
import lightImage from "./matching-light.jpg";
import TemplateCard, { ContentPosition } from "../TemplateCard";
import { Button } from "@nextui-org/react";
import { scrollTillCallToAction } from "../../utils";

const Card3 = () => {
  return (
    <TemplateCard
      contentPosition={ContentPosition.LEFT}
      content={
        <div>
          <div className="cursor-default">Collaborate with peers</div>
          <div className="flex justify-end w-full mt-5">
            <Button
              color="secondary"
              variant="bordered"
              onClick={scrollTillCallToAction}
            >
              Find a peer!
            </Button>
          </div>
        </div>
      }
      contentClassName="mt-[15px]"
      imageProps={{ darkImage, lightImage, alt: "login-card-3" }}
    />
  );
};

export default Card3;
