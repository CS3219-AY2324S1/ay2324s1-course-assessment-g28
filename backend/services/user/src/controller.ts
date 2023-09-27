import { Request, Response } from "express";
import { config } from "dotenv";
import { Pool } from "pg";

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
    const { email, username } = req.body;
    const query =
      "INSERT INTO Users (email, username) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(query, [email, username]);
    res.status(204).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: `createUser failed ${error}` });
  }
};

export const createAttempt = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { questionId, questionTitle, attemptDetails, attemptDate } = req.body;

    let query, queryArgs;

    if (attemptDate) {
      query = `INSERT INTO Attempts (email, question_id, question_title, attempt_date, attempt_details) VALUES ($1, $2, $3, $4, $5) RETURNING * `;
      queryArgs = [
        email,
        questionId,
        questionTitle,
        attemptDate,
        attemptDetails,
      ];
    } else {
      query = `INSERT INTO Attempts (email, question_id, question_title, attempt_details) VALUES ($1, $2, $3, $4) RETURNING * `;
      queryArgs = [email, questionId, questionTitle, attemptDetails];
    }

    const result = await pool.query(query, queryArgs);
    res.status(204).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: `createAttempt failed ${error}` });
  }
};

//GET handlers
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const query = "SELECT * FROM Users";
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: `getAllUsers failed ${error}` });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const userQuery = "SELECT username, is_admin FROM Users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      res.status(404).json({ message: `User with ${email} does not exist.` });
      return;
    }

    const attemptQuery =
      "SELECT id AS attempt_id, question_id, question_title, attempt_date FROM Attempts WHERE email = $1";
    const attemptResult = await pool.query(attemptQuery, [email]);
    res.status(200).json({
      ...userResult.rows[0],
      attemptedQuestions: attemptResult.rows,
    });
  } catch (error) {
    res.status(500).json({ error: `getUserByEmail failed ${error}` });
  }
};

export const getAttemptById = async (req: Request, res: Response) => {
  try {
    const { email, attemptId } = req.params;
    const query =
      "SELECT id AS attempt_id, question_id, question_title, attempt_date, attempt_details FROM Attempts WHERE email = $1 and id = $2";
    const result = await pool.query(query, [email, attemptId]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: `getAttemptById failed ${error}` });
  }
};

//PUT/PATCH handlers
export const updateUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email, username } = req.body;
    const query = "UPDATE Users SET username = $1 WHERE email = $2 RETURNING *";
    const result = await pool.query(query, [username, email]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: `User with ${email} does not exist.` });
      return;
    } else {
      res.status(204).json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: `updateUserByEmail failed ${error}` });
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
    res.status(500).json({ error: `deleteUserByEmail failed ${error}` });
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
  } catch (error) {
    res.status(500).json({ error: `deleteAttemptById failed ${error}` });
  }
};
