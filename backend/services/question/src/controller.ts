import { config } from "dotenv";
import { Request, Response } from "express";
import { Pool } from "pg";
import {
  QuestionError,
  QUESTION_NOT_FOUND_ERROR_CODE,
  QUESTION_TITLE_EXISTS_ERROR_CODE,
  UNKNOWN_ERROR_CODE,
} from "./errors";

import { Question } from "./models/question";

// set up PG connection
config();
const { PG_PORT, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;
// initialise connection to images database
const pool = new Pool({
  user: POSTGRES_USER,
  host: "postgres",
  database: "images",
  password: POSTGRES_PASSWORD,
  port: Number(PG_PORT) || 5432,
});

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

export const createImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { imageData } = req.body;

    const query =
      "INSERT INTO Images (question_id, image_data) VALUES ($1, $2) RETURNING id";

    const queryResult = await pool.query(query, [id, imageData]);
    res.status(201).json(queryResult.rows[0].id);
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

    res.status(200).json({ content: questions, total: total });
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

export const getImageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM Images WHERE text(id) = $1";

    const queryResult = await pool.query(query, [id]);
    res.status(200).json(queryResult.rows[0]);
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

    const query = "DELETE FROM Images WHERE question_id=$1";
    await pool.query(query, [questionId]);

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
