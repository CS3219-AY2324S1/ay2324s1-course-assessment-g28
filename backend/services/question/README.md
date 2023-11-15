## Quick Start

## Docker Container Startup

The instructions here are for running the user service in a docker container.

1. Ensure port 27018 on your machine is unoccupied (recommended)
1. Create a file called `.env` and follow `.env.example` to populate the fields. You may use the default values from .env.example (recommended)
1. Run `docker-compose up --build`
1. Verify that the server is running by checking `localhost:PORT`

## Populating Sample Questions

There is a script that can be run to populate 20 sample questions into the database quickly.

1. Ensure that no other instances of MongoDB are running at port 27018
2. Install all required dependencies (e.g. `npm ci`).
3. If you are running the question mongoDB database at a custom-set specific port, open `scripts/populate_sample_data.js` and make sure to set the `MONGO_URI` variable to the URI of your local questions mongodb, if not just leave it as the default. This is the same as configured in the local docker-compose file.
4. Run `node scripts/populate_sample_data.js` which will add the questions into the database.

## Information

- The schema can be found in `./src/models/question.ts::questionSchema`.
- The API endpoints can be found in `./src/index.ts::createEndpoints`.
- The business logic (i.e API handlers) can be found in `./src/controller.ts`.
- Refer to the 3 files above to have an idea of what endpoints are available, and how to structure requests.
