import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import {
  createQuestion,
  deleteQuestionById,
  getQuestions,
  getQuestionById,
  updateQuestionById,
  getRandomQuestionId,
} from "./controller";

async function initConnection(MONGO_URI: string) {
  await mongoose.connect(MONGO_URI);
}

async function createEndpoints(router: express.Router) {
  // POST endpoints
  router.post("/questions", createQuestion);

  // GET endpoints
  router.get("/questions/:id", getQuestionById);
  router.get("/questions", getQuestions);
  router.get("/question/unattemptedUsersMatch", getRandomQuestionId);

  // PUT/PATCH endpoints
  router.put("/questions/:id", updateQuestionById); // we can use this for both put/patch because mongo supports takes Partial<Question> as json for update
  router.patch("/questions/:id", updateQuestionById);

  // DELETE endpoints
  router.delete("/questions/:id", deleteQuestionById);
}

async function main() {
  try {
    // setup env
    config();
    const { PORT, MONGO_URI } = process.env;
    if (!PORT || !MONGO_URI) {
      throw Error("env variables missing.");
    }

    // initialise connection to mongodb database
    await initConnection(MONGO_URI);

    // setup express and create api endpoints
    const app = express();
    const router = express.Router();
    await createEndpoints(router);
    app.use(express.json());
    app.use("/", router);

    // start the server on the port specified in .env
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(`Server failed to start: error ${error}`);
  }
}

main();

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const size = parseInt(String(req.query.size)) || 100000;
    const offset = parseInt(String(req.query.offset)) || 0;

    const filter: { [key: string]: any } = {};

    // return everything that has (even a partial match) in the keyword
    if (req.query.keyword) {
      filter.$or = [
        { title: { $regex: new RegExp(String(req.query.keyword), "i") } },
        {
          category: {
            $elemMatch: { $regex: new RegExp(String(req.query.keyword), "i") },
          },
        },
      ];
    }

    if (req.query.complexity) {
      filter.complexity = req.query.complexity;
    }

    const total = await Question.countDocuments(filter);

    const questions = await Question.find(filter);

    res.status(200).json({
      content: questions.slice(offset * size, offset * size + size),
      total: total,
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
