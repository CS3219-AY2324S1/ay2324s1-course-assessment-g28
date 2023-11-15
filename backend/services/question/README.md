## Quick Start

1. Run the user service (instructions in `/backend/services/user/README.md`)
1. Create a file called `.env` and follow `.env.example` to populate the fields. For example, PORT=1234 and MONGO_URI=mongodb://mongodb:27017 and USER_API=http://host.docker.internal:1235 (e.g. if user service is running on port 1235)
1. Run `docker-compose up --build`
1. Verify that the server is running by checking `localhost:PORT`

## Populating Sample Questions

1. There is a script that can be run to populate 20 sample questions into the database quickly.
2. Open `scripts/populate_sample_data.js`.
   _if you are running the question mongoDB database at a custom-set specific port (can set in compose file), make sure to set the `MONGO_URI` variable to the URI of your local questions mongodb, if not just leave it as the default. This is the same as configured in the local docker-compose file._
3. Run `node scripts/populate_sample_data.js` which will add the questions into the database.

## Information

- The schema can be found in `./src/models/question.ts::questionSchema`.
- The API endpoints can be found in `./src/index.ts::createEndpoints`.
- The business logic (i.e API handlers) can be found in `./src/controller.ts`.
- Refer to the 3 files above to have an idea of what endpoints are available, and how to structure requests.
