import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { Badge } from "@nextui-org/react";
import { useRouter } from "next/router";

export type SessionItemType = {
  // TODO: finalise typing
  otherUserImage: string;
  otherUsername: string;
  questionTitle: string;
  questionId: number;
  sessionUrl: string;
};

// TODO: remove after integration
const mockData: Array<SessionItemType> = [
  {
    otherUserImage:
      "https://upload.wikimedia.org/wikipedia/commons/b/bb/Kittyply_edit1.jpg",
    otherUsername: "user 1",
    questionTitle: "question title 1",
    questionId: 1,
    sessionUrl: "someurl1",
  },
  {
    otherUserImage:
      "https://upload.wikimedia.org/wikipedia/commons/b/bb/Kittyply_edit1.jpg",
    otherUsername: "user 2",
    questionTitle: "question title 2 that is very longgggggggggggggggggg",
    questionId: 2,
    sessionUrl: "someurl2",
  },
];

const ActiveSessions = () => {
  const [activeSessions, setActiveSessions] = useState<Array<SessionItemType>>(
    [],
  );
  const [isShowing, setIsShowing] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const hasActiveSessions = useMemo(
    () => activeSessions.length > 0,
    [activeSessions],
  );

  const activeSessionsCount = useMemo(
    () => activeSessions.length,
    [activeSessions],
  );

  const showSessions = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setIsShowing(true);
  };

  const hideSessions = () => {
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(setTimeout(() => setIsShowing(false), 400));
  };

  useEffect(() => {
    //TODO: fetch active sessionsa
    setActiveSessions(mockData);
  }, []);

  return (
    <Dropdown
      placement="top-end"
      onMouseEnter={showSessions}
      onMouseLeave={hideSessions}
      isOpen={isShowing}
    >
      <DropdownTrigger onMouseEnter={showSessions} onMouseLeave={hideSessions}>
        <div className="fixed bottom-10 right-10 z-[10000]">
          <Badge
            content={activeSessionsCount}
            isInvisible={!hasActiveSessions}
            color="danger"
          >
            <div
              className="rounded-full
                      bg-content2 light:bg-foreground p-3 opacity-80"
            >
              <FaUserFriends className="fill-foreground w-4 opacity-100" />
            </div>
          </Badge>
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="active-sessions-list" variant="flat">
        <DropdownSection showDivider>
          <DropdownItem
            isReadOnly
            disableAnimation
            isDisabled
            className="opacity-1"
            classNames={{
              title: "text-m text-violet-600 font-semibold opacity-1",
            }}
          >
            Active sessions:
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          {hasActiveSessions ? (
            activeSessions?.map((session) => {
              const {
                sessionUrl,
                otherUserImage,
                otherUsername,
                questionTitle,
              } = session;
              return (
                <DropdownItem
                  key={sessionUrl}
                  textValue={sessionUrl}
                  onClick={() => router.replace(sessionUrl)}
                  className="h-[50px] w-[225px]"
                >
                  <Tooltip
                    content="Resume session?"
                    className="cursor-pointer"
                    placement="left"
                  >
                    <div className="flex items-center justify-start gap-4">
                      <Avatar
                        isBordered
                        color="secondary"
                        src={otherUserImage}
                        size="sm"
                        className="ml-[4px]"
                      />
                      <div>
                        <div className="text-violet-600">@{otherUsername}</div>
                        <div className="w-[150px] truncate">
                          {questionTitle}
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </DropdownItem>
              );
            })
          ) : (
            <DropdownItem
              disableAnimation
              isReadOnly
              isDisabled
              className="w-[225px]"
            >
              You have no active sessions
            </DropdownItem>
          )}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ActiveSessions;
