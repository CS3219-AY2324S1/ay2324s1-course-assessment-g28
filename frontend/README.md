# PeerPrep Frontend

## Instructions

Create an .env file that contains the fields in [.env.example](.env.example) file.
The environment variable QUESTIONS_API should be set to the url of your questions service. Leave it as the value provided in the .env.example file if you started the question service locally with the PORT=1234.

### Development

Run `yarn dev` from this directory. The webpage will be accessible at localhost:3000

### Production Build & Start

- Run `yarn build` from this directory. This will create the production build.
- Run `yarn start` to start the frontend application. The webpage will be accessible at localhost:3000
