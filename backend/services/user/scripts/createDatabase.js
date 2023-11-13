const pgp = require("pg-promise")();

const DB_NAME = "ppusers";

async function createDatabase() {
  try {
    const db = pgp({
      host: "localhost",
      port: 5432,
      database: DB_NAME,
      user: "postgres",
      password: "pass",
    });

    // SQL script
    const initScript = `CREATE DATABASE ${DB_NAME};`;
    await db.none(initScript);
    console.log("Database created successfully");
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch (error) {
    console.error("Error creating database:", error);
  } finally {
    pgp.end();
  }
}

async function main() {
  await createDatabase();
}

main();
