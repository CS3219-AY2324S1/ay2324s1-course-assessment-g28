import { Request, Response } from "express";
import { Question } from "./models/question.model";

// Create Question Business Logic
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(200).json(`${question.title} successfully added!`);
  } catch (error) {
    res.status(500).json({
      error: `Could not create question due to ${error}, request: ${req.body.toString()}`,
    });
  }
};

// Read (or get) Question Business Logic
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
export const updateQuestionByTitle = async (req: Request, res: Response) => {
  try {
    if (req.body.title != req.body.question.title) {
      throw Error(
        `Unable to change title of existing question ${req.body.title}, please create a new question or remove the question`
      );
    }

    const question = await Question.findOneAndUpdate(
      { title: req.body.title },
      req.body.question
    );
    res.status(200).json(`Successfully updated question ${req.body.title}!`);
  } catch (error) {
    res.status(500).json({
      error: `Could not update question due to ${error}, request: ${req.body.toString()}`,
    });
  }
};

// Delete Question Business Logic
export const deleteQuestionByTitle = async (req: Request, res: Response) => {
  try {
    await Question.findOneAndDelete({ title: req.body.title });
    res.status(200).json(`Successfully deleted question ${req.body.title}!`);
  } catch (error) {
    res.status(500).json({
      error: `Could not delete question due to error ${error}, request: ${req.body.toString()}`,
    });
  }
};
