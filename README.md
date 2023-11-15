[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

# Peerprep by G28

## Instructions to running the Dockerized Peerprep application in your local environment

1. Copy all the secret environment variables in the `project-environmentVariables.txt` file (submitted on canvas) into a `.env` file to be saved in the `.deployment/local-docker` directory.
2. To start up all containerized services in the local environment, simply run
   ```
   docker compose -f ".deployment/local-docker/compose.yaml" --profile frontend up -d --build
   ```

You may now access the Peerprep webpage at http://localhost:3000

Initially when started up, Peerprep has no initial user or question data. Thus, follow the instructions in the next 2 sections in order to populate the database with questions or make user accounts administrators by using our scripts.

### Populating local questions database with all 20 sample questions from the "CS3219Assignments.pdf" specification document

Here are the instructions to load all of the 20 sample questions from the assignments document into the database

1. Ensure that no other MongoDB instances are running on port 27018.
2. `cd` into the [question service directory](backend/services/question) e.g. `cd backend/services/question`
3. Run `npm ci` to install dependencies that are needed for the script.
4. Run `node scripts/populate_sample_data.js`
   _If you are running the question mongoDB database at a custom-set specific port (you have changed the port for pp-question-mongodb), make sure to set the MONGO_URI variable in the `scripts/populate_sample_data.js` file to the URI of your local questions mongodb, if not just leave it as the default._

The sample questions will be loaded into your local questions database instance (refer to terminal output to check for successful addition). You should now be able to see the questions in the Peerprep webpage.

### Making an existing user an administrator on locally deployed dockerized PeerPrep

Before you follow these instructions, please make sure that you have logged in to Peerprep with your Google account, and followed the prompt to create your user account on Peerprep. (the screen that you will be redirected to after logging in with your Google account for the first time).

1. Ensure that no other PostgreSQL instances are running on port 5432.
2. `cd` into the [user service directory](backend/services/user). e.g. `cd backend/services/user`
3. Run `npm ci` to install dependencies that are needed for the script.
4. Run `node scripts/makeUserAdmin.js <email of user to make admin>`
   _If you have changed the POSTGRES_USER, POSTGRES_PASSWORD and/or PG_PORT environment variables used for the postgres docker container in `.deployment/local-docker/compose.yaml` , make sure to change their corresponding variable values in the scripts/makeUserAdmin.js file, if not their defaults will work as is._

You should see the output "\<email you passed as argument\> has been made an administrator", indicating that the user with the given email been successfully made an admin.

#### Making an existing user an administrator on the Google Cloud Platform (GCP) PeerPrep

PeerPrep is deployed on GCP at http://34.143.142.116:3000
**These instructions are to make an existing user on that platform an admin.**
You will need the password for the PostgreSQL database hosted on GCP. Please retrieve it from the "project-gcp-postgresPassword.txt" file submitted on Canvas.

1. Ensure that `psql` is installed on your terminal
2. Run the script with an email argument: `scripts/pp-admin.sh <email of the user to make admin> <PostgresSQL password>`

- Note that you many need to escape the postgres password with double quotes `"` if the password contains single quotes `'`

## Instructions to run Kubernetes Locally

1. Ensure that Docker and kubectl command is installed locally
2. Ensure that kubectl is configured to connect to a cluster. This can be checked by runnning `kubectl cluster-info` in the command line
3. Create a `.env` file in `.deployment/local-k8s/` to match the example below
4. Run `.deployment/local-k8s/build.sh` to build all docker images
5. Run `.deployment/local-k8s/start.sh` to start the local Kubernetes cluster
6. The frontend should be accessible from `http://localhost:3000`

```bash
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MONGO_URI=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_URI=
RABBITMQ_URL=
REDIS_HOST=
REDIS_PASSWORD=
REDIS_PORT=

```
