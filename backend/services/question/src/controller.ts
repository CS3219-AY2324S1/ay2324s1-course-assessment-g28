import { Request, Response } from "express";
import { Question } from "./models/question";

// Create Question Business Logic
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(`${question.title} successfully added!`);
  } catch (error) {
    res.status(500).json({
      error: `Could not create question due to ${error}, request: ${req.body.toString()}`,
    });
  }
};

// Read (or get) Question Business Logic
export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findOne({ id: questionId });
    if (!question) {
      res.status(404).json(`${questionId} not found!`);
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({
      error: `Could not get question by id due to ${error}, request: ${req.body.toString()}`,
    });
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
    res.status(500).json({
      error: `Could not get question due to error ${error}, request: ${req.body.toString()}`,
    });
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
    res.status(500).json({
      error: `Could not update question due to ${error}, request: ${req.body.toString()}`,
    });
  }
};

// Delete Question Business Logic
export const deleteQuestionById = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id;
    await Question.findOneAndDelete({ id: questionId });
    res.status(204).json(`Successfully deleted question ${questionId}!`);
  } catch (error) {
    res.status(500).json({
      error: `Could not delete question due to error ${error}, request: ${req.body.toString()}`,
    });
  }
};
