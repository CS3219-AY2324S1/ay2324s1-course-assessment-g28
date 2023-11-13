## Quick Start

1. Ensure mongodb is installed on your local machine, and start it (e.g. on Mac, `brew services start mongodb-community@7.0`)
2. Create a file called `.env` and follow `.env.example` to populate the fields. For example, PORT=1234 and MONGO_URI=mongodb://127.0.0.1:27017
3. Install all required dependencies (e.g. `npm ci`).
4. Run the server using `npm run dev` or `npm run start`.
5. Verify that the server is running by checking `localhost:{PORT}/questions`.
6. The server is now ready to perform basic CRUD. Follow the instructions below to use a script to quickly populate sample questions, or make a POST request to populate your own questions.

## Populating Sample Questions

1. There is a script that can be run to populate 20 sample questions into the database quickly.
2. Open `scripts/populate_sample_data.js`.
3. Run `node scripts/populate_sample_data.js` which will add the questions into the database.

## Information

- The schema can be found in `./src/models/question.ts::questionSchema`.
- The API endpoints can be found in `./src/index.ts::createEndpoints`.
- The business logic (i.e API handlers) can be found in `./src/controller.ts`.
- Refer to the 3 files above to have an idea of what endpoints are available, and how to structure requests.
