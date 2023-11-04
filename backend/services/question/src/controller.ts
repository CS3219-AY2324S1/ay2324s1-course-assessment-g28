import { Request, Response } from "express";
import {
  QuestionError,
  QUESTION_NOT_FOUND_ERROR_CODE,
  QUESTION_TITLE_EXISTS_ERROR_CODE,
  UNKNOWN_ERROR_CODE,
} from "./errors";

import { Question } from "./models/question";

import { config } from "dotenv";

config();

// Create Question Business Logic
export const createQuestion = async (req: Request, res: Response) => {
  try {
    // check if the question with this title already exists, if it does, throw an error
    const count = await Question.countDocuments({ title: req.body.title });

    if (count !== 0) {
      throw new QuestionError(
        `question with title ${req.body.title} already exists`,
        QUESTION_TITLE_EXISTS_ERROR_CODE
      );
    }

    if (!req.body.description) {
      req.body.description = {};
    }

    const question = new Question(req.body);
    await question.save();
    res.status(201).json(`${question.title} successfully added!`);
  } catch (error) {
    if (error instanceof QuestionError) {
      res
        .status(500)
        .json({ errorCode: error.errorCode, message: error.message });
    } else if (error instanceof Error) {
      res
        .status(500)
        .json({ errorCode: UNKNOWN_ERROR_CODE, message: error.message });
    }
  }
};

// Read (or get) Question Business Logic
export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findOne({ id: questionId });
    if (!question) {
      // if the question does not exist, throw an error
      throw new QuestionError(
        `question with id: ${req.params.id} does not exist`,
        QUESTION_NOT_FOUND_ERROR_CODE
      );
    }
    res.status(200).json(question);
  } catch (error) {
    if (error instanceof QuestionError) {
      res
        .status(500)
        .json({ errorCode: error.errorCode, message: error.message });
    } else if (error instanceof Error) {
      res
        .status(500)
        .json({ errorCode: UNKNOWN_ERROR_CODE, message: error.message });
    }
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const size = parseInt(String(req.query.size)) || 100000;
    const offset = parseInt(String(req.query.offset)) || 0;

    const filter: { [key: string]: any } = {};

    if (req.query.keyword) {
      filter.title = {
        $regex: new RegExp(`^${String(req.query.keyword)}`, "i"),
      };
    }

    if (req.query.complexity) {
      filter.complexity = req.query.complexity;
    }

    const total = await Question.countDocuments(filter);

    const questions = await Question.find(filter)
      .skip(offset * size) // skip the first offset * size elements
      .limit(size); // take the first (size) elements

    if (req.query.onlyUnattempted && req.query.user) {
      const onlyUnattempted = req.query.onlyUnattempted === "true";
      const resp = await fetch(
        `${process.env.USER_API}/users/${req.query.user}/question-attempt`
      );
      const attemptedQuestionIds = new Set<Number>(await resp.json());

      const modifiedQuestions = [];

      for (const question of questions) {
        const questionObject = question.toObject();
        const wasAttempted = attemptedQuestionIds.has(questionObject.id);

        if ((onlyUnattempted && !wasAttempted) || !onlyUnattempted) {
          modifiedQuestions.push({
            ...questionObject,
            wasAttempted: wasAttempted,
          });
        }
      }
      res
        .status(200)
        .json({ content: modifiedQuestions, total: modifiedQuestions.length });
    } else {
      res.status(200).json({ content: questions, total: total });
    }
  } catch (error) {
    if (error instanceof QuestionError) {
      res
        .status(500)
        .json({ errorCode: error.errorCode, message: error.message });
    } else if (error instanceof Error) {
      res
        .status(500)
        .json({ errorCode: UNKNOWN_ERROR_CODE, message: error.message });
    }
  }
};

export const getRandomQuestionId = async (req: Request, res: Response) => {
  try {
    const { user1, user2, complexity } = req.query;

    const questions = await Question.find({
      complexity: complexity,
    });

    const questionIds = new Set<Number>(
      questions.map((question) => question.toObject().id)
    );

    const user1Resp = await fetch(
      `${process.env.USER_API}/users/${user1}/question-attempt`
    );
    const user1AttemptedIds = new Set<Number>(await user1Resp.json());

    const user2Resp = await fetch(
      `${process.env.USER_API}/users/${user2}/question-attempt`
    );
    const user2AttemptedIds = new Set<Number>(await user2Resp.json());

    for (const id of user1AttemptedIds) {
      questionIds.delete(id);
    }

    for (const id of user2AttemptedIds) {
      questionIds.delete(id);
    }

    const questionIdArray = Array.from(questionIds);

    res.status(200).json({
      questionId:
        questionIdArray[Math.floor(Math.random() * questionIdArray.length)],
    });
  } catch (error) {
    if (error instanceof QuestionError) {
      res
        .status(500)
        .json({ errorCode: error.errorCode, message: error.message });
    } else if (error instanceof Error) {
      res
        .status(500)
        .json({ errorCode: UNKNOWN_ERROR_CODE, message: error.message });
    }
  }
};

// Update Question Business Logic
export const updateQuestionById = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findOneAndUpdate(
      { id: questionId },
      req.body
    );

    res.status(204).json(`Successfully updated question ${questionId}!`);
  } catch (error) {
    if (error instanceof QuestionError) {
      res
        .status(500)
        .json({ errorCode: error.errorCode, message: error.message });
    } else if (error instanceof Error) {
      res
        .status(500)
        .json({ errorCode: UNKNOWN_ERROR_CODE, message: error.message });
    }
  }
};

// Delete Question Business Logic
export const deleteQuestionById = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;
    await Question.findOneAndDelete({ id: questionId });

    res.status(204).json(`Successfully deleted question ${questionId}!`);
  } catch (error) {
    if (error instanceof QuestionError) {
      res
        .status(500)
        .json({ errorCode: error.errorCode, message: error.message });
    } else if (error instanceof Error) {
      res
        .status(500)
        .json({ errorCode: UNKNOWN_ERROR_CODE, message: error.message });
    }
  }
};
