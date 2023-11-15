# PeerPrep Frontend

## Instructions

Create an `.env` file that contains the fields in [.env.example](.env.example) file.
You may leave the fields as their default values (recommended), or if you have modified the environment variables of the question and/or user service, then modify the corresponding fields accordingly. For the following variables:

```
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

You must copy the values of these variables found in the "Assignment3-environmentVariables.txt" file submitted on Canvas into the `.env` file.

Run `yarn install` to install dependencies.

### Development

Run `yarn dev` from this directory. The webpage will be accessible at localhost:3000

### Production Build & Start

- Run `yarn build` from this directory. This will create the production build.
- Run `yarn start` to start the frontend application. The webpage will be accessible at localhost:3000
