const pgp = require("pg-promise")();

require("dotenv").config({ path: __dirname + "/../.env" });

const db = pgp(
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/user`
);

emailsToMakeAdmin = ["abc@gmail.com"];

for (let email of emailsToMakeAdmin) {
  db.none(`UPDATE Users SET is_admin = true WHERE email = '${email}'`)
    .then(() => {
      console.log("Update successful");
    })
    .catch((error) => {
      console.error("Error updating database:", error);
    });
}
