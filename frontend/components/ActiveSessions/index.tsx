import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { Badge } from "@nextui-org/react";
import { useRouter } from "next/router";
import { UserPublic } from "@/api/user/types";
import { Question, QuestionComplexity } from "@/api/questions/types";
import { getActiveSessions } from "@/api/collab";
import useUserInfo from "@/hooks/useUserInfo";
import useSWR from "swr";
import { getQuestion } from "@/api/questions";
import { getPublicUserInfo } from "@/api/user";
import { getEditorPath } from "@/routes";

export type EditingSessionDetails = {
  otherUser: UserPublic;
  email: string;
  question: Question;
  websocketUrl: string; // add later
  questionComplexity: QuestionComplexity;
};

const ActiveSessions = () => {
  const [isShowing, setIsShowing] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const user = useUserInfo();

  const { data: activeEditingSessions } = useSWR(
    [getActiveSessions, user.email],
    async () => {
      if (user.email) {
        const activeSessions = (await getActiveSessions(user.email!))
          .activeSessions;

        console.log(activeSessions);
        console.log(activeSessions.length);

        // fetch all question data
        const questionDetails: Record<number, Question> = {};
        const questionIds: Set<number> = new Set();
        activeSessions.forEach((s) => questionIds.add(s.questionId));
        // fetch question deteails for all different questions
        const questionDetailFetches = Promise.all(
          Array.from(questionIds).map((qnId) =>
            getQuestion(qnId, false).then((qn) => (questionDetails[qnId] = qn)),
          ),
        );

        // fetch all user data
        const userDetails: Record<string, UserPublic> = {};
        const userEmails: Set<string> = new Set();
        activeSessions.forEach((s) => userEmails.add(s.otherUser));

        const userDetailFetches = Promise.all(
          Array.from(userEmails).map((email) =>
            getPublicUserInfo(email).then(
              (user) => (userDetails[email] = user),
            ),
          ),
        );
        console.log("Initializing active session details");
        await questionDetailFetches;
        console.log("Fetched question details");
        await userDetailFetches;
        console.log("Fetched user details");
        // compose all the data together
        const data = activeSessions.map((s) => ({
          otherUser: userDetails[s.otherUser],
          question: questionDetails[s.questionId],
          sessionUrl: getEditorPath(s.questionId, s.wsUrl),
        }));
        return data;
      }

      return [];
    },
  );

  const activeSessionsCount = useMemo(
    () => (activeEditingSessions ? activeEditingSessions.length : 0),
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
            isInvisible={
              !activeEditingSessions || activeEditingSessions.length === 0
            }
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
          {activeEditingSessions ? (
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

// import {
//   Avatar,
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownSection,
//   DropdownTrigger,
//   Tooltip,
// } from "@nextui-org/react";
// import { useMemo, useState } from "react";
// import { FaUserFriends } from "react-icons/fa";
// import { Badge } from "@nextui-org/react";
// import { useRouter } from "next/router";
// import { UserPublic } from "@/api/user/types";
// import { Question, QuestionComplexity } from "@/api/questions/types";
// import { getActiveSessions } from "@/api/collab";
// import useUserInfo from "@/hooks/useUserInfo";
// import useSWR from "swr";
// import { getQuestion } from "@/api/questions";
// import { getPublicUserInfo } from "@/api/user";
// import { getEditorPath } from "@/routes";

// export type EditingSessionDetails = {
//   otherUser: UserPublic;
//   email: string;
//   question: Question;
//   websocketUrl: string; // add later
//   questionComplexity: QuestionComplexity;
// };

// const ActiveSessions = () => {
//   const [isShowing, setIsShowing] = useState(false);
//   const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
//   const router = useRouter();

//   const user = useUserInfo();
//   const { data: activeEditingSessions } = useSWR(
//     [getActiveSessions, user.email],
//     async () => {
//       if (user.email) {
//         const activeSessions = (await getActiveSessions(user.email!))
//           .activeSessions;

//         // fetch all question data
//         const questionDetails: Record<number, Question> = {};
//         const questionIds: Set<number> = new Set();
//         activeSessions.forEach((s) => questionIds.add(s.questionId));
//         // fetch question deteails for all different questions
//         const questionDetailFetches = Promise.all(
//           Array.from(questionIds).map((qnId) =>
//             getQuestion(qnId, false).then((qn) => (questionDetails[qnId] = qn)),
//           ),
//         );

//         // fetch all user data
//         const userDetails: Record<string, UserPublic> = {};
//         const userEmails: Set<string> = new Set();
//         activeSessions.forEach((s) => userEmails.add(s.otherUser));

//         const userDetailFetches = Promise.all(
//           Array.from(userEmails).map((email) =>
//             getPublicUserInfo(email).then(
//               (user) => (userDetails[email] = user),
//             ),
//           ),
//         );
//         await questionDetailFetches;
//         await userDetailFetches;
//         // compose all the data together
//         const data = activeSessions.map((s) => ({
//           otherUser: userDetails[s.otherUser],
//           question: questionDetails[s.questionId],
//           websocketUrl: s.wsUrl,
//           questionComplexity: s.questionComplexity,
//           sessionUrl: getEditorPath(
//             s.questionId,
//             s.wsUrl
//           ),
//         }));
//         return data;
//       }

//       return [];
//     },
//   );

//   const activeSessionsCount = useMemo(
//     () => (activeEditingSessions ? activeEditingSessions.length : 0),
//     [activeEditingSessions],
//   );

//   const showSessions = () => {
//     if (timer) {
//       clearTimeout(timer);
//       setTimer(null);
//     }
//     setIsShowing(true);
//   };

//   const hideSessions = () => {
//     if (timer) {
//       clearTimeout(timer);
//     }
//     setTimer(setTimeout(() => setIsShowing(false), 400));
//   };

//   return (
//     <Dropdown
//       placement="top-end"
//       onMouseEnter={showSessions}
//       onMouseLeave={hideSessions}
//       isOpen={isShowing}
//     >
//       <DropdownTrigger onMouseEnter={showSessions} onMouseLeave={hideSessions}>
//         <div className="fixed bottom-10 right-10 z-[10000]">
//           <Badge
//             content={activeSessionsCount}
//             isInvisible={
//               !activeEditingSessions || activeEditingSessions.length === 0
//             }
//             color="danger"
//           >
//             <div
//               className="rounded-full
//                       bg-content2 light:bg-foreground p-3 opacity-80"
//             >
//               <FaUserFriends className="fill-foreground w-4 opacity-100" />
//             </div>
//           </Badge>
//         </div>
//       </DropdownTrigger>
//       <DropdownMenu
//         aria-label="active-sessions-list"
//         variant="flat"
//         onAction={(websocketUrl) => router.push(websocketUrl as string)}
//       >
//         <DropdownSection showDivider>
//           <DropdownItem
//             isReadOnly
//             disableAnimation
//             isDisabled
//             className="opacity-1"
//             classNames={{
//               title: "text-m text-violet-600 font-semibold opacity-1",
//             }}
//           >
//             Active sessions:
//           </DropdownItem>
//         </DropdownSection>
//         <DropdownSection>
//           {activeEditingSessions ? (
//             activeEditingSessions?.map((session) => {
//               // TODO: Need to create the full url here
//               const { websocketUrl, otherUser, question } = session;
//               return (
//                 <DropdownItem
//                   key={websocketUrl}
//                   textValue={websocketUrl}
//                   className="h-[50px] w-[225px]"
//                 >
//                   <Tooltip
//                     content="Resume session?"
//                     className="cursor-pointer"
//                     placement="left"
//                   >
//                     <div className="flex items-center justify-start gap-4">
//                       <Avatar
//                         isBordered
//                         color="secondary"
//                         showFallback
//                         size="sm"
//                         className="ml-[4px]"
//                       />
//                       <div>
//                         <div className="text-violet-600">
//                           @{otherUser.username}
//                         </div>
//                         <div className="w-[150px] truncate">
//                           {question.title}
//                         </div>
//                       </div>
//                     </div>
//                   </Tooltip>
//                 </DropdownItem>
//               );
//             })
//           ) : (
//             <DropdownItem
//               disableAnimation
//               isReadOnly
//               isDisabled
//               className="w-[225px]"
//             >
//               You have no active sessions
//             </DropdownItem>
//           )}
//         </DropdownSection>
//       </DropdownMenu>
//     </Dropdown>
//   );
// };

// export default ActiveSessions;
