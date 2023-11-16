import { Question } from "./question";
import { User } from "./user";

export default class Match {
  constructor(
    public user1: User,
    public user2: User,
    public question: Question
  ) {}
}
