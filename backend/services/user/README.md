## Quick Start

## Docker Container Startup

The instructions here are for running the user service in a docker container.

1. Ensure port 5432 on your machine is unoccupied (recommended)
2. Create a file called `.env` and follow `.env.example` to populate the fields. You may use the default values from .env.example (recommended)
3. Run `docker compose up --build` to start the user service using the docker-compose in this directory.

## Local Environment Startup

The instructions here are for running the user service directly on your system.

1. Ensure PostgreSQL is running on your local machine, (e.g. on mac `brew services start postgresql`)
2. If this has not been done before, cd into `scripts` and run `node createDatabase.js` to create the database. You can open the file to adjust parameters (e.g. port), but do not alter the DB_NAME.
3. If this has not been done before, cd into `scripts` and run `node createTables.js` to create the necessary tables. You can open the file to adjust parameters as in step 2, but please make sure they are consistent.
4. Create a file called `.env` and follow `.env.example` to populate the fields. You may use the default values from .env.example (recommended)
5. Use `npm run dev` or `npm run start` to run the server.
6. Verify that the server is running by checking `localhost:PORT/users`

## Information

- The API endpoints can be found in `./src/index.ts::createEndpoints`.
- The business logic (i.e API handlers) can be found in `./src/controller.ts`.
- Refer to the 3 files above to have an idea of what endpoints are available, and how to structure requests.

### How to make a user an administrator

We have written a simple script that can be used to make a user account with given email an administrator, by connecting with the PostgreSQL database directly with the username and password defined in the .env file. Here are the steps to use it:

1. Install all required dependencies (e.g. `npm ci`).
2. From this directory, run `node scripts/makeUserAdmin.js <email of user to make admin>`
3. You should see the output "\<email you passed as argument\> has been made an administrator", indicating that the user with the given email been successfully made an admin.
