import { Request, Response } from "express";
import {
  QuestionError,
  QUESTION_NOT_FOUND_ERROR_CODE,
  QUESTION_TITLE_EXISTS_ERROR_CODE,
  UNKNOWN_ERROR_CODE,
} from "./errors";

import { Question } from "./models/question";

import { config } from "dotenv";
import fuse from "fuse.js";

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
      req.body.description = { type: "doc", content: [{ type: "paragraph" }] };
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
    const filter: { [key: string]: any } = {};

    const questions = await Question.find(filter);

    res.status(200).json({
      content: questions,
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
