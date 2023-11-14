import { config } from "dotenv";
import express from "express";
import {
  createUser,
  getAllUsers,
  updateUserByEmail,
  deleteUserByEmail,
  getUserByEmail,
  getIsUsernameExists,
  getPublicInfoByEmail,
} from "./controller";

async function createEndpoints(router: express.Router) {
  // POST endpoints
  router.post("/users", createUser);

  // GET endpoints
  router.get("/users", getAllUsers);
  router.get("/users/exists/:username", getIsUsernameExists);
  router.get("/users/:email", getUserByEmail);
  router.get("/users/public/:email", getPublicInfoByEmail);

  // PUT/PATCH endpoints
  router.put("/users/:email", updateUserByEmail);
  router.patch("/users/:email", updateUserByEmail);

  // DELETE endpoints
  router.delete("/users/:email", deleteUserByEmail);
}

async function main() {
  try {
    config();
    const { PORT } = process.env;

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
