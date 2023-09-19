import { Request, Response } from "express";
import { Question } from "./models/question";

// Create Question Business Logic
export const createQuestion = async (req: Request, res: Response) => {
  console.log(req);
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

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
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
    res.status(200).json(`Successfully deleted question ${questionId}!`);
  } catch (error) {
    res.status(500).json({
      error: `Could not delete question due to error ${error}, request: ${req.body.toString()}`,
    });
  }
};
