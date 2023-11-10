import { QuestionComplexity } from "../questions/types";

export interface GetActiveSessionsResponse {
  activeSessions: {
    otherUser: string;
    wsUrl: string;
    questionId: number;
    questionComplexity: QuestionComplexity;
  }[];
}
