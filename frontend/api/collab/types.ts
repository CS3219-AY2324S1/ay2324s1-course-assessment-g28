export interface GetActiveSessionsResponse {
  activeSessions: {
    otherUser: string;
    wsUrl: string;
    questionId: number;
  }[];
}
