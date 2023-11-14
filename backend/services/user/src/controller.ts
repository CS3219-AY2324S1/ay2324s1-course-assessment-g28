import { Request, Response } from "express";
import { config } from "dotenv";
import { Pool } from "pg";
import { UNKNOWN_ERROR_CODE, USERNAME_ALREADY_EXISTS_CODE } from "./errors";

// set up PG connection
config();
const { PG_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_URI } = process.env;
// initialise connection to postgres database
const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_URI,
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

export const getPublicInfoByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const query = `SELECT username,  favourite_programming_language AS "favouriteProgrammingLanguage" FROM Users WHERE email = $1`;
    const userResult = await pool.query(query, [email]);
    if (userResult.rows.length === 0) {
      res.status(404).json({ message: `User with ${email} does not exist.` });
      return;
    }
    res.status(200).json({ ...userResult.rows[0] });
  } catch (error) {
    const errorCode = UNKNOWN_ERROR_CODE;
    res.status(500).json({
      errorCode: errorCode,
      message: `getPublicInfoByEmail failed ${error}`,
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

    res.status(200).json({
      ...userResult.rows[0],
    });
  } catch (error) {
    const errorCode = UNKNOWN_ERROR_CODE;
    res.status(500).json({
      errorCode: errorCode,
      message: `getUserByEmail failed ${error}`,
    });
  }
};

//GET handlers
export const getIsUsernameExists = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const query =
      "SELECT exists (SELECT 1 FROM Users WHERE username = $1 LIMIT 1);";
    const result = await pool.query(query, [username]);
    res.status(200).json(result?.rows?.[0] ?? { exists: "false" });
  } catch (error) {
    const errorCode = UNKNOWN_ERROR_CODE;
    res.status(500).json({
      errorCode: errorCode,
      message: `isUsernameExists failed ${error}`,
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
