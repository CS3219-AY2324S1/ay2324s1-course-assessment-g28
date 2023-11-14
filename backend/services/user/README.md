## Quick Start

1. Create a file called `.env` and follow `.env.example` to populate the fields. For example, PORT=3000, POSTGRES_USER=XXXX, POSTGRES_PASSWORD=XXXX, PG_PORT=5432, POSTGRES_URI=postgres
2. Run `docker-compose up --build`
3. Verify that the server is running by checking `localhost:PORT`

## Information

- The table schema can be found in `./init.sql`.
- The API endpoints can be found in `./src/index.ts::createEndpoints`.
- The business logic (i.e API handlers) can be found in `./src/controller.ts`.
- Refer to the 3 files above to have an idea of what endpoints are available, and how to structure requests.
