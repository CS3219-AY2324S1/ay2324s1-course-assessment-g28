import { Complexity, Question } from "../../models/question";

interface QuestionService {
  getRandomQuestion(complexity?: Complexity): Promise<Question | null>;
}
