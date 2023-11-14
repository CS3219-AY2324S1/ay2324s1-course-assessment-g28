[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)
# Peerprep by G28

## Instructions to running the Dockerized Peerprep application in your local environment

1. Copy all the environment variables in the project-submission-env.txt file (submitted on canvas) into a ".env" file to be saved in the ".deployment/local-docker" directory. 
2. To start up all containerized services in the local environment, simply run  
   ```
   docker compose -f ".deployment/local-docker/compose.yaml" --profile frontend up -d --build
   ```  

You may now access the Peerprep webpage at http://localhost:3000

Initially when started up, Peerprep has no initial user or question data. Thus, follow the instructions in the next 2 sections in order to populate the database with questions or make user accounts administrators by using our scripts.

### Populating local questions database with all 20 sample questions from the "CS3219Assignments.pdf" specification document

Here are the instructions to load all of the 20 sample questions from the assignments document into the database

1. Run `node backend/services/question/scripts/populate_sample_data.js`
  *If you are running the question mongoDB database at a custom-set specific port (you have changed the port for pp-question-mongodb), make sure to set the `MONGO_URI` variable in the backend/services/question/scripts/populate_sample_data.js file to the URI of your local questions mongodb, if not just leave it as the default.*

The sample questions will be loaded into your local questions database instance (refer to terminal output to check for successful addition). You should now be able to see the questions in the Peerprep webpage.

### Making an existing user an administrator

Before you follow these instructions, please make sure that you have logged in to Peerprep with your Google account, and followed the prompt to create your user account on Peerprep. (the screen that you will be redirected to after logging in with your Google account for the first time).

1. Run `node backend/services/user/scripts/makeUserAdmin.js <email of user to make admin>`
  *If you have changed the POSTGRES_USER, POSTGRES_PASSWORD and/or PG_PORT environment variables used for the postgres docker container in .deployment/local-docker/compose.yaml , make sure to change their corresponding variable values in the backend/services/user/scripts/makeUserAdmin.js file, if not their defaults will work as is.*

2. You should see the output "\<email you passed as argument\> has been made an administrator", indicating that the user with the given email been successfully made an admin.
