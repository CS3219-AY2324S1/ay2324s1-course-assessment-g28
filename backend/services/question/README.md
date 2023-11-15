## Quick Start

1. Follow the instructions in the `backend/services/user` folder to run the User service. This is required as the `USER_API` must be set as an env in the next step
2. Create a file called `.env` and follow `.env.example` to populate the fields. For example, PORT=3000 and MONGO_URI=mongodb://mongodb:27017/questions and USER_API=http://host.docker.internal:1235 (assuming User service is running on port 1235)
3. Run `docker-compose up --build`
4. Verify that the server is running by checking `localhost:PORT`

## Populating Sample Questions

1. There is a script that can be run to populate 20 sample questions into the database quickly.
2. Open `scripts/populate_sample_data.js`.
   _if you are running the question mongoDB database at a custom-set specific port (set in docker-compose file), make sure to set the `MONGO_URI` variable to the URI of your local questions mongodb (e.g. mongodb://localhost:27017/questions), if not just leave it as the default. This is the same as configured in the local docker-compose file._
3. Run `node scripts/populate_sample_data.js` which will add the questions into the database.

## Information

- The schema can be found in `./src/models/question.ts::questionSchema`.
- The API endpoints can be found in `./src/index.ts::createEndpoints`.
- The business logic (i.e API handlers) can be found in `./src/controller.ts`.
- Refer to the 3 files above to have an idea of what endpoints are available, and how to structure requests.
