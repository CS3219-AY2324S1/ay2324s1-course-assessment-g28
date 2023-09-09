import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import {
  createQuestion,
  deleteQuestionByTitle,
  getAllQuestions,
  updateQuestionByTitle,
} from "./controller";

async function initConnection(MONGO_URI: string) {
  await mongoose.connect(MONGO_URI);
}

async function createEndpoints(router: express.Router) {
  // POST endpoints
  router.post("/questions", createQuestion);

  // GET endpoints
  router.get("/", (req: Request, res: Response) => {
    res.send("Question Service");
  });
  router.get("/questions", getAllQuestions);

  // PUT endpoints
  router.put("/questions", updateQuestionByTitle);

  // DELETE endpoints
  router.delete("/questions", deleteQuestionByTitle);
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
