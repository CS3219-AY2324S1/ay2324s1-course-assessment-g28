const pgp = require("pg-promise")();

const POSTGRES_USER = "dev";
const POSTGRES_PASSWORD = "dev";
const PG_PORT = "5432";

const db = pgp(
  `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${PG_PORT}/user`
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
