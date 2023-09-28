import { Request, Response } from "express";
import { config } from "dotenv";
import { Pool } from "pg";
import { UNKNOWN_ERROR_CODE, USERNAME_ALREADY_EXISTS_CODE } from "./errors";

// set up PG connection
config();
const { PG_PORT, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;
// initialise connection to postgres database
const pool = new Pool({
  user: POSTGRES_USER,
  host: "postgres",
  database: "user",
  password: POSTGRES_PASSWORD,
  port: 5432,
});

//POST handlers
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, username, favouriteProgrammingLanguage } = req.body;
    const query =
      "INSERT INTO Users (email, username, favourite_programming_language) VALUES ($1, $2, $3) RETURNING *";
    await pool.query(query, [
      email,
      username,
      favouriteProgrammingLanguage || "",
    ]);
    res.status(204).json();
  } catch (error) {
    const errorCode = UNKNOWN_ERROR_CODE;
    res.status(500).json({
      errorCode: errorCode,
      message: `createUser failed ${error}`,
    });
  }
};

export const createAttempt = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const {
      questionId,
      questionTitle,
      questionDifficulty,
      attemptDetails,
      attemptDate,
    } = req.body;

    let query, queryArgs;

    if (attemptDate) {
      query = `INSERT INTO Attempts (email, question_id, question_title, question_difficulty, attempt_date, attempt_details) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * `;
      queryArgs = [
        email,
        questionId,
        questionTitle,
        questionDifficulty,
        attemptDate,
        attemptDetails,
      ];
    } else {
      query = `INSERT INTO Attempts (email, question_id, question_title, question_difficulty, attempt_details) VALUES ($1, $2, $3, $4, $5) RETURNING * `;
      queryArgs = [
        email,
        questionId,
        questionTitle,
        questionDifficulty,
        attemptDetails,
      ];
    }

    await pool.query(query, queryArgs);
    res.status(204).json();
  } catch (error) {
    const errorCode = UNKNOWN_ERROR_CODE;
    res.status(500).json({
      errorCode: errorCode,
      message: `createAttempt failed ${error}`,
    });
  }
};

//GET handlers
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const query = "SELECT * FROM Users";
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    const errorCode = UNKNOWN_ERROR_CODE;
    res.status(500).json({
      errorCode: errorCode,
      message: `getAllUsers failed ${error}`,
    });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    // query to obtain details from user table
    const userQuery = `SELECT username, is_admin AS "isAdmin", favourite_programming_language AS "favouriteProgrammingLanguage" FROM Users WHERE email = $1`;
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      res.status(404).json({ message: `User with ${email} does not exist.` });
      return;
    }

    // query to obtain details from attempts table
    const attemptQuery = `SELECT id AS "attemptId", question_id AS "questionId", question_title AS "questionTitle", question_difficulty AS "questionDifficulty", attempt_date AS "attemptDate" FROM Attempts WHERE email = $1`;
    const attemptResult = await pool.query(attemptQuery, [email]);

    // query to obtain details on unique questionids attempted, to get difficulty counts below
    const numAttemptedQuery = `SELECT question_difficulty, count(*) FROM (SELECT DISTINCT question_id, question_difficulty FROM Attempts WHERE email = $1) AS uniqueAttempts GROUP BY question_difficulty`;
    const numAttemptedResult = await pool.query(numAttemptedQuery, [email]);

    let numEasyQuestionsAttempted = 0;
    let numMediumQuestionsAttempted = 0;
    let numHardQuestionsAttempted = 0;

    for (let row of numAttemptedResult.rows) {
      const { question_difficulty, count } = row;

      if (question_difficulty === 0) {
        numEasyQuestionsAttempted += Number(count);
      } else if (question_difficulty === 1) {
        numMediumQuestionsAttempted += Number(count);
      } else if (question_difficulty === 2) {
        numHardQuestionsAttempted += Number(count);
      }
    }

    res.status(200).json({
      ...userResult.rows[0],
      numEasyQuestionsAttempted: numEasyQuestionsAttempted,
      numMediumQuestionsAttempted: numMediumQuestionsAttempted,
      numHardQuestionsAttempted: numHardQuestionsAttempted,
      attemptedQuestions: attemptResult.rows,
    });
  } catch (error) {
    const errorCode = UNKNOWN_ERROR_CODE;
    res.status(500).json({
      errorCode: errorCode,
      message: `getUserByEmail failed ${error}`,
    });
  }
};

export const getAttemptById = async (req: Request, res: Response) => {
  try {
    const { email, attemptId } = req.params;
    const query = `SELECT id AS "attemptId", question_id AS "questionId", question_title AS "questionTitle", question_difficulty AS "questionDifficulty", attempt_date AS "attemptDate", attempt_details AS "attemptDetails" FROM Attempts WHERE email = $1 and id = $2`;
    const result = await pool.query(query, [email, attemptId]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    const errorCode = UNKNOWN_ERROR_CODE;
    res.status(500).json({
      errorCode: errorCode,
      message: `getAttemptById failed ${error}`,
    });
  }
};

//PUT/PATCH handlers
export const updateUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { username, favouriteProgrammingLanguage } = req.body;
    const query =
      "UPDATE Users SET username = COALESCE($1, username), favourite_programming_language = COALESCE($2, favourite_programming_language) WHERE email = $3 RETURNING *";
    const result = await pool.query(query, [
      username,
      favouriteProgrammingLanguage,
      email,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: `User with ${email} does not exist.` });
      return;
    } else {
      res.status(204).json();
    }
  } catch (error) {
    const errorCode = UNKNOWN_ERROR_CODE;
    res.status(500).json({
      errorCode: errorCode,
      message: `updateUserByEmail failed ${error}`,
    });
  }
};

// DELETE handlers
export const deleteUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    await pool.query("BEGIN");
    await pool.query("DELETE FROM Attempts WHERE email = $1 RETURNING *", [
      email,
    ]);
    await pool.query("DELETE FROM Users WHERE email = $1 RETURNING *", [email]);
    await pool.query("COMMIT");

    res.status(204).json({ message: `${email} deleted successfully!` });
  } catch (error) {
    await pool.query("ROLLBACK");
    const errorCode = UNKNOWN_ERROR_CODE;
    res.status(500).json({
      errorCode: errorCode,
      message: `deleteUserByEmail failed ${error}`,
    });
  }
};

export const deleteAttemptById = async (req: Request, res: Response) => {
  try {
    const { email, attemptId } = req.params;
    await pool.query("DELETE FROM Attempts WHERE email=$1 AND id=$2", [
      email,
      attemptId,
    ]);
    res.status(204).json();
  } catch (error: any) {
    const errorCode =
      error.code === "23505" && error.constraint === "users_username_key"
        ? USERNAME_ALREADY_EXISTS_CODE
        : UNKNOWN_ERROR_CODE;

    res.status(500).json({
      errorCode: errorCode,
      message: `deleteAttemptById failed ${error}`,
    });
  }
};
