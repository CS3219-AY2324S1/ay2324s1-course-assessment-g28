const pgp = require("pg-promise")();

const DB_NAME = "ppusers";

// Function to create the tables
async function createTables() {
  try {
    const db = pgp({
      host: "localhost",
      port: 5432,
      database: DB_NAME,
      user: "postgres",
      password: "pass",
    });

    // SQL script
    const initScript = `  
  CREATE TABLE IF NOT EXISTS Users (
    email TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    favourite_programming_language TEXT,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
  );

`;
    await db.none(initScript);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    pgp.end();
  }
}

// Call the function to create tables
async function main() {
  await createTables();
}

main();
