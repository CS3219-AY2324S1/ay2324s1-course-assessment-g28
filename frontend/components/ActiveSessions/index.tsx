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
import { useActiveEditingSessionContext } from "@/components/ActiveSessions/ActiveEditingSessionContext";
import { UserPublic } from "@/api/user/types";
import { Question } from "@/api/questions/types";
import { getActiveSessions } from "@/api/collab";
import useUserInfo from "@/hooks/useUserInfo";

export type EditingSessionDetails = {
  otherUser: UserPublic;
  question: Question;
  sessionUrl: string; // add later
};

const ActiveSessions = () => {
  const { activeEditingSessions, addEditingSession } = useActiveEditingSessionContext();
  const [isShowing, setIsShowing] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const user = useUserInfo();

  const hasActiveSessions = useMemo(
    () => activeEditingSessions.length > 0,
    [activeEditingSessions],
  );

  const activeSessionsCount = useMemo(
    () => activeEditingSessions.length,
    [activeEditingSessions],
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
    getActiveSessions(user.email!).then((result) => {
      for (const activeSession of result.activeSessions) {
        addEditingSession({
          email: activeSession.otherUser,
          questionId: activeSession.questionId,
          sessionUrl: activeSession.wsUrl
        });
      }
    });

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
      <DropdownMenu
        aria-label="active-sessions-list"
        variant="flat"
        onAction={(sessionUrl) => router.push(sessionUrl as string)}
      >
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
            activeEditingSessions?.map((session) => {
              const { sessionUrl, otherUser, question } = session;
              return (
                <DropdownItem
                  key={sessionUrl}
                  textValue={sessionUrl}
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
                        showFallback
                        size="sm"
                        className="ml-[4px]"
                      />
                      <div>
                        <div className="text-violet-600">
                          @{otherUser.username}
                        </div>
                        <div className="w-[150px] truncate">
                          {question.title}
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
