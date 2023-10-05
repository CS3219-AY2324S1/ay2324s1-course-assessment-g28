# Local Development

## Docker compose up

Use the following command from the project root directory to build and run all images

```bash
docker compose -f ".deployment/local-docker/compose.yaml" --profile frontend up -d --build
```

_The "--profile frontend" argument is to run the frontend with the other containers. If not provided, the frontend container will not be started. This is to allow frontend to be worked on during development separately with regular hot reloading (non containerized)_

Options explanation

- `-f`: filepath to compose file
- `-d`: run in detached mode (do not display in a terminal)
- `--build`: Build all images first

## Configuring new services

New services should follow the example below:

```yaml
version: "3.8"
services:
  # Question service
  pp-question:
    image: peerprep/question # Should put "peerprep/" prefix for clarity
    build:
      context: ../../backend/services/question # Relative path to service folder
      dockerfile: Dockerfile # name of Dockerfile in the context folder
    environment: # Declare all necessary environment variables here
      - PORT=1234
      - MONGO_URI=mongodb://my-mongodb:27017 # domain name should match service tag
    expose: # Allows the service to be discovered via domain name=service tag
      - 1234
    ports: # Exposes the service on the localhost
      - 1234:1234 # <container_port>:<localhost_port>

  my-mongodb: # service tag here must be unique
    image: mongo
    environment:
      MONGO_INITDB_DATABASE: questions
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root
    expose:
      - 27017
    ports:
      - 27017:27017
    volumes:
      - dev-mongodb:/data/db # Remember to persist volumes if necessary

volumes:
  dev-mongodb: # Named persistent volume here
```
