## Quick Start

1. Create a file called `.env` and follow `.env.example` to populate the fields. For example, PORT=3000 and MONGO_URI=mongodb://mongodb:27017/questions (from `docker-compose.yml`)
2. Run `docker-compose up --build`
3. Verify that the server is running by checking `localhost:PORT`

## Populating Sample Questions

1. There is a script that can be run to populate 20 sample questions into the database quickly.
2. Open `scripts/populate_sample_data.js` and make sure to set the `MONGO_URI` to the URI of your local questions mongodb.
3. Run `node scripts/populate_sample_data.js` which will add the questions into the database.

## Information

- The schema can be found in `./src/models/question.ts::questionSchema`.
- The API endpoints can be found in `./src/index.ts::createEndpoints`.
- The business logic (i.e API handlers) can be found in `./src/controller.ts`.
- Refer to the 3 files above to have an idea of what endpoints are available, and how to structure requests.
