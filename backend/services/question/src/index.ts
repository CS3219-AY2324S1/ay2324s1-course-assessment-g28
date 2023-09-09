import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import { Question } from "./models/question.model";

async function initConnection(MONGO_URI: string) {
  await mongoose.connect(MONGO_URI);
}

async function main() {
  try {
    config();
    const { PORT, MONGO_URI } = process.env;

    if (!PORT || !MONGO_URI) {
      throw Error("env variables missing.");
    }
    const app = express();

    await initConnection(MONGO_URI);

    app.use(express.json());

    // Define a sample route
    app.get("/", (req: Request, res: Response) => {
      res.send("Hello World!!!");
    });

    // GET routes
    app.get("/questions", async (req, res) => {
      try {
        const questions = await Question.find();
        res.status(200).json(questions);
      } catch (error) {
        res
          .status(500)
          .json({ error: `Could not fetch todos due to error ${error}` });
      }
    });

    // POST routes
    app.post("/questions", async (req, res) => {
      try {
        const question = new Question(req.body);
        await question.save();
        res.status(200).json(`${question.title} successfully added!`);
      } catch (error) {
        res.status(500).json({
          error: `Could not add question ${req.body} due to ${error}`,
        });
      }
    });

    // PUT routes
    app.put("/questions", async (req, res) => {
      try {
        if (req.body.title != req.body.question.title) {
          throw Error(
            "unable to change title of existing question, please create a new question or remove!"
          );
        }

        const question = await Question.findOneAndUpdate(
          { title: req.body.title },
          req.body.question
        );
        res.status(200).json(question);
      } catch (error) {
        res.status(500).json({
          error: `Could not update question ${req.body} due to ${error}`,
        });
      }
    });

    // DELETE routes
    app.delete("/questions", async (req, res) => {
      try {
        await Question.findOneAndDelete({ title: req.body.title });
      } catch (error) {
        res.status(500).json({
          error: `Could not delete question ${req.body.title} due to error ${error}`,
        });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(`Server failed to start: error ${error}`);
  }
}

main();
