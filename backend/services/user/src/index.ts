import { config } from "dotenv";
import express from "express";
import {
  createUser,
  getAllUsers,
  updateUserByEmail,
  deleteUserByEmail,
} from "./controller";

async function createEndpoints(router: express.Router) {
  // POST endpoints
  router.post("/users", createUser);

  // GET endpoints
  router.get("/users", getAllUsers);

  // PUT endpoints
  router.put("/users", updateUserByEmail);

  // DELETE endpoints
  router.delete("/users", deleteUserByEmail);
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
