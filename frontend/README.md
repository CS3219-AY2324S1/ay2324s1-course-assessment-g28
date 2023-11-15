# PeerPrep Frontend

## Instructions

Create an `.env` file that contains the fields in [.env.example](.env.example) file.
You may leave the fields as their default values (recommended), or if you have modified the environment variables of the question and/or user service, then modify the corresponding fields accordingly. For the following variables:

```
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

You must copy the values of these variables found in the "Assignment4-environmentVariables.txt" file submitted on Canvas into the `.env` file.

To start the frontend service in docker container, run `docker compose up --build` from this directory.