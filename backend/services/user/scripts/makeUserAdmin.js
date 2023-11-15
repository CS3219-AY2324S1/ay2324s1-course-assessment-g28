const pgp = require("pg-promise")();
require("dotenv").config({ path: __dirname + "/../.env" });

const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const PG_PORT = process.env.PG_PORT;
const POSTGRES_URI = process.env.POSTGRES_URI;

const db = pgp(
  `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_URI}:${PG_PORT}/user`
);

if (process.argv.length < 3) {
  console.log("Please provide the email of the user to make an administrator.");
  return;
}

const emailToAdd = process.argv[2];

db.none(`UPDATE Users SET is_admin = true WHERE email = '${emailToAdd}'`)
  .then(() => {
    console.log(`${emailToAdd} has been made an administrator.`);
  })
  .catch((error) => {
    console.error("Error updating database:", error);
  });
