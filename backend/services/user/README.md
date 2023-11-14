## Quick Start

1. Ensure PostgreSQL is running on your local machine, (e.g. `brew services start postgresql`)
2. If this has not been done before, cd into `scripts` and run `node createDatabase.js` to create the database. You can open the file to adjust parameters (e.g. port), but do not alter the DB_NAME.
3. If this has not been done before, cd into `scripts` and run `node createTables.js` to create the necessary tables. You can open the file to adjust parameters as in step 2, but please make sure they are consistent.
4. Create a file called `.env` and follow `.env.example` to populate the fields. For example, PORT=1235, POSTGRES_USER=postgres, POSTGRES_PASSWORD=pass, PG_PORT=5432, POSTGRES_URI=127.0.0.1
5. Use `npm run dev` or `npm run start` to run the server.
6. Verify that the server is running by checking `localhost:PORT/users`

## Information

- The API endpoints can be found in `./src/index.ts::createEndpoints`.
- The business logic (i.e API handlers) can be found in `./src/controller.ts`.
- Refer to the 3 files above to have an idea of what endpoints are available, and how to structure requests.