import { getIsUsernameExists } from "@/api/user";
import { Spinner } from "@nextui-org/react";
import { useMemo } from "react";
import useSWR from "swr";

export enum UsernameStatus {
  LOADING,
  AVAILABLE,
  TAKEN,
  TOO_SHORT,
}

const MINIMUM_USERNAME_LENGTH = 3;

const getTip = (usernameStatus: UsernameStatus) => {
  switch (usernameStatus) {
    case UsernameStatus.AVAILABLE:
      return (
        <div
          className="text-green-600	font-extralight
                text-[11px] h-[24px] flex items-center justify-center"
        >
          Username is available.
        </div>
      );
    case UsernameStatus.TAKEN:
      return (
        <div
          className="text-rose-600	font-extralight
                text-[11px] h-[24px] flex items-center justify-center"
        >
          Username is already taken! Please try a different username.
        </div>
      );
    case UsernameStatus.TOO_SHORT:
      return (
        <div
          className="text-rose-600	font-extralight
                text-[11px] h-[24px] flex items-center justify-center"
        >
          Username is too short!
        </div>
      );
    default:
      return (
        <div
          className="font-extralight text-[11px] w-full
            flex justify-center gap-2 items-baseline "
        >
          <span>Checking...</span>
          <Spinner size="sm" color="secondary" className="scale-50 pb-1" />
        </div>
      );
  }
};

const useIsUsernameValid = (username: string) => {
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
  const isUsernameTaken = !isLoading && data?.exists;
  const isUsernameAvailable = !isLoading && !data?.exists;

  const usernameStatus = useMemo(() => {
    if (isLoading) {
      return UsernameStatus.LOADING;
    } else if (username.length < MINIMUM_USERNAME_LENGTH) {
      return UsernameStatus.TOO_SHORT;
    } else if (isUsernameTaken) {
      return UsernameStatus.TAKEN;
    } else if (isUsernameAvailable) {
      return UsernameStatus.AVAILABLE;
    }
    return UsernameStatus.LOADING;
  }, [username, isLoading, isUsernameTaken, isUsernameAvailable]);

  const Tip = getTip(usernameStatus);

  return { usernameStatus, Tip };
};

export default useIsUsernameValid;
