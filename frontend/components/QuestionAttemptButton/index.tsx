import { getPairingServiceUri } from "@/api/pairing";
import { Question, QuestionBase } from "@/api/questions/types";
import { useActiveEditingSessionContext } from "@/components/ActiveSessions/ActiveEditingSessionContext";
import useUserInfo from "@/hooks/useUserInfo";
import { getEditorPath, getSingleEditorPath } from "@/routes";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";

const DEFAULT_PAIRING_DURATION = 30000;

export const MAX_PAIRING_DURATION =
  process.env.MAX_PAIRING_DURATION === undefined
    ? DEFAULT_PAIRING_DURATION
    : parseInt(process.env.MAX_PAIRING_DURATION);

enum MatchState {
  NO_ATTEMPT,
  IN_PROGRESS,
  FAILURE,
  SUCCESS,
  ERROR,
}

interface QuestionAttemptButtonProps {
  question: Question | QuestionBase;
  size?: "sm" | "md" | "lg";
  variant?: "flat" | "solid";
}
export default function QuestionAttemptButton({
  question,
  size,
  variant,
}: QuestionAttemptButtonProps) {
  const { email } = useUserInfo();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [matchState, setMatchState] = useState<MatchState>(
    MatchState.NO_ATTEMPT,
  );
  const router = useRouter();
  const { addEditingSession } = useActiveEditingSessionContext();
  const pairingWebsocket = useRef<WebSocket | null>(null);
  const pairingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const editorPathRef = useRef<string>();

  const startMatching = useCallback(async () => {
    setMatchState(MatchState.IN_PROGRESS);
    const ws = new WebSocket(
      getPairingServiceUri({
        userId: email!,
        question: question.id,
      }),
    );

    pairingTimerRef.current = setTimeout(() => {
      ws.close();
      setMatchState(MatchState.FAILURE);
      pairingWebsocket.current = null;
      pairingTimerRef.current = null;
    }, MAX_PAIRING_DURATION);

    ws.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(msg.data);
        if (parsed.status === 200) {
          if (parsed.data.url) {
            setMatchState(MatchState.SUCCESS);
            editorPathRef.current = getEditorPath(
              parseInt(parsed.data.questionId as string),
              parsed.data.url as string,
            );
            addEditingSession({
              sessionUrl: getEditorPath(
                parseInt(parsed.data.questionId as string),
                parsed.data.url as string,
              ),
              questionId: parseInt(parsed.data.questionId as string),
              email: parsed.data.otherUser as string,
            });
            ws.close();
          }
        } else {
          setMatchState(MatchState.ERROR);
          ws.close();
          clearTimeout(pairingTimerRef.current!);
        }
      } catch (e) {
        setMatchState(MatchState.ERROR);
        ws.close();
        console.error(e);
        clearTimeout(pairingTimerRef.current!);
      }
    };
    pairingWebsocket.current = ws;
  }, [setMatchState, email, question]);

  const getModalContent = useCallback(
    (onClose: () => void) => {
      switch (matchState) {
        case MatchState.NO_ATTEMPT:
          return (
            <>
              <ModalHeader>Choose editor session</ModalHeader>
              <ModalBody>
                <div className="flex flex-row gap-x-2">
                  <div
                    className="flex-1 p-4 cursor-pointer rounded-md bg-black bg-opacity-0 hover:bg-opacity-5"
                    onClick={() =>
                      router.push(getSingleEditorPath(question.id))
                    }
                  >
                    <h3 className="text-lg font-bold">Single</h3>
                    <p>Start a single person code editor session.</p>
                  </div>
                  <div className="w-[2px] bg-brand-white "></div>
                  <div
                    className="flex-1 p-4 cursor-pointer rounded-md bg-black bg-opacity-0 hover:bg-opacity-5"
                    onClick={startMatching}
                  >
                    <h3 className="text-lg font-bold">Double</h3>
                    <p>
                      Start a collaborative code editor session with another
                      person.
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancel</Button>
              </ModalFooter>
            </>
          );
        case MatchState.IN_PROGRESS:
          return (
            <>
              <ModalHeader>Finding a matching peer...</ModalHeader>
              <ModalBody>
                <Spinner size="lg" />
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => {
                    pairingWebsocket.current?.close();
                    pairingWebsocket.current = null;
                    clearTimeout(pairingTimerRef.current!);
                    pairingTimerRef.current = null;
                    setMatchState(MatchState.NO_ATTEMPT);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          );
        case MatchState.SUCCESS:
          setTimeout(() => router.push(editorPathRef.current!), 3000);
          return (
            <>
              <ModalHeader>Matching peer found!</ModalHeader>
              <ModalBody>
                <div>Redirecting you to the collaborative editor page...</div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => {
                    pairingWebsocket.current?.close();
                    pairingWebsocket.current = null;
                    clearTimeout(pairingTimerRef.current!);
                    pairingTimerRef.current = null;
                    setMatchState(MatchState.NO_ATTEMPT);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          );
        case MatchState.ERROR:
        case MatchState.FAILURE:
          return (
            <>
              <ModalHeader>Match Failure</ModalHeader>
              <ModalBody>
                <div>
                  {matchState === MatchState.ERROR
                    ? "An unknown error occured."
                    : "No matching peers available at the moment."}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onPress={startMatching}>
                  Retry
                </Button>
                <Button onPress={onClose}>Cancel</Button>
              </ModalFooter>
            </>
          );
      }
    },
    [router, matchState, question, startMatching],
  );

  return (
    <>
      <Button
        size={size}
        variant={variant}
        color="secondary"
        title="Start a collaborative editor session with another person"
        onPress={onOpen}
      >
        Attempt
      </Button>
      <Modal
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="text-brand-white bg-gradient-to-br
        from-violet-500 to-fuchsia-500 flex flex-col items-center"
      >
        <ModalContent className="p-2">{getModalContent}</ModalContent>
      </Modal>
    </>
  );
}
