import { getIsUsernameExists } from "@/api/user";
import { Spinner } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { AiFillCheckCircle } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";

export enum UsernameStatus {
  INIT,
  LOADING,
  AVAILABLE,
  TAKEN,
  TOO_SHORT,
}

const MINIMUM_USERNAME_LENGTH = 3;

const getEndContent = (usernameStatus: UsernameStatus) => {
  switch (usernameStatus) {
    case UsernameStatus.INIT:
      return <></>;
    case UsernameStatus.AVAILABLE:
      return <AiFillCheckCircle className="fill-green-600" />;

    default:
      return <RxCrossCircled className="text-rose-600" />;
  }
};

const getTip = (usernameStatus: UsernameStatus) => {
  switch (usernameStatus) {
    case UsernameStatus.INIT:
      return <div className="h-[24px] flex" />;
    case UsernameStatus.AVAILABLE:
      return (
        <div
          className="text-green-600 font-extralight
                text-[11px] h-[24px] flex items-center justify-center"
        >
          Username is available.
        </div>
      );
    case UsernameStatus.TAKEN:
      return (
        <div
          className="text-rose-600 font-extralight
                text-[11px] h-[24px] flex items-center justify-center"
        >
          Username is already taken! Please try a different username.
        </div>
      );
    case UsernameStatus.TOO_SHORT:
      return (
        <div
          className="text-rose-600 font-extralight
                text-[11px] h-[24px] flex items-center justify-center"
        >
          Username is too short!
        </div>
      );
    default:
      return (
        <div
          className="font-extralight text-[11px] w-full
            flex justify-center gap-2 items-center "
        >
          <span>Checking...</span>
          <Spinner size="sm" color="secondary" className="scale-50 pb-1" />
        </div>
      );
  }
};

const useIsUsernameValid = (username: string) => {
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const { data, isLoading } = useSWR(
    [username],
    () => {
      if (username.length < MINIMUM_USERNAME_LENGTH) {
        return;
      }
      return getIsUsernameExists(username);
    },
    {
      focusThrottleInterval: 5000,
    },
  );
  const isUsernameTaken = !isFirstLoad && !isLoading && data?.exists;
  const isUsernameAvailable = !isFirstLoad && !isLoading && !data?.exists;

  useEffect(() => {
    if (username.length > 0) setIsFirstLoad(false);
  }, [username]);

  const usernameStatus = useMemo(() => {
    if (isFirstLoad) {
      return UsernameStatus.INIT;
    } else if (isLoading) {
      return UsernameStatus.LOADING;
    } else if (username.length < MINIMUM_USERNAME_LENGTH) {
      return UsernameStatus.TOO_SHORT;
    } else if (isUsernameTaken) {
      return UsernameStatus.TAKEN;
    } else if (isUsernameAvailable) {
      return UsernameStatus.AVAILABLE;
    }
    return UsernameStatus.LOADING;
  }, [
    isFirstLoad,
    isLoading,
    username.length,
    isUsernameTaken,
    isUsernameAvailable,
  ]);

  const EndContent = getEndContent(usernameStatus);
  const Tip = getTip(usernameStatus);

  return { usernameStatus, EndContent, Tip };
};

export default useIsUsernameValid;
