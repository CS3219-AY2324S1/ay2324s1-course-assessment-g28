## Quick Start

1. Create a file called `.env` and follow `.env.example` to populate the fields. For example, PORT=3000 and MONGO_URI=mongodb://mongodb:27017/questions (from `docker-compose.yml`)
2. Run `docker-compose up --build`
3. Verify that the server is running by checking `localhost:PORT`
4. (Optional) Run `node scripts/populate_sample_data.ts` to populate 20 sample questions into the db, and simultaneously test `POST /questions`.

## Information

- The schema can be found in `./src/models/question.ts::questionSchema`.
- The API endpoints can be found in `./src/index.ts::createEndpoints`.
- The business logic (i.e API handlers) can be found in `./src/controller.ts`.
- Refer to the 3 files above to have an idea of what endpoints are available, and how to structure requests.
