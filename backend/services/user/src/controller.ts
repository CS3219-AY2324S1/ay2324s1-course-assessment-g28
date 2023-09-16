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
  port: Number(PG_PORT || "5432"),
});

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const query = "INSERT INTO Users (email, name) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(query, [email, name]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: `createUser failed ${error}` });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const query = "SELECT * FROM Users";
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: `getAllUsers failed ${error}` });
  }
};

export const updateUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const query = "UPDATE Users SET name = $1 WHERE email = $2 RETURNING *";
    const result = await pool.query(query, [name, email]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: `${email} does not exist.` });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: `updateUserByEmail failed ${error}` });
  }
};

export const deleteUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const query = "DELETE FROM Users WHERE email = $1 RETURNING *";
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: `${email} does not exist.` });
    } else {
      res.status(200).json({ message: `${email} deleted successfully!` });
    }
  } catch (error) {
    res.status(500).json({ error: `createUser failed ${error}` });
  }
};
