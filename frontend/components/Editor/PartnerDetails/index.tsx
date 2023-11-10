import { Heart, Mail, UserIcon, Users } from "lucide-react";
import { PartnerDetailsType } from "../constants";
import { useState } from "react";
import { useSubmissionContext } from "../Submission/SubmissionContext";

interface PartnerDetailsProps {
  partnerDetails: PartnerDetailsType;
}

export default function PartnerDetails({
  partnerDetails,
}: PartnerDetailsProps) {
  const { isPeerStillHere } = useSubmissionContext();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div className="fixed top-0 left-0 w-full flex flex-col items-center z-50">
      {isPeerStillHere && partnerDetails.email !== "" ? (
        <div
          className="w-fit h-fit flex flex-col bg-green-600 px-4 py-1 rounded-b"
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
        >
          <div className="flex flex-row items-center gap-3">
            <Users className="h-4 w-4" />
            <div className="">{`${partnerDetails.username} is connected`}</div>
          </div>

          <div
            className={`flex flex-row items-center gap-3 ${
              isHovered ? "visible" : "hidden"
            }`}
          >
            <Mail className="h-4 w-4" />
            <div className="">{partnerDetails.email}</div>
          </div>

          <div
            className={`flex flex-row items-center gap-3 ${
              isHovered ? "visible" : "hidden"
            }`}
          >
            <Heart className="h-4 w-4" />
            <div className="">
              {partnerDetails.favouriteProgrammingLanguage}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-fit h-fit flex-col bg-red-500 px-4 py-1 rounded-b">
          <div className="flex flex-row items-center gap-3">
            <UserIcon className="h-4 w-4" />
            <div className="">Partner not connected</div>
          </div>
        </div>
      )}
    </div>
  );
}
