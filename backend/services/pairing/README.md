## Usage

### Sending a request

To start a pairing request, the client should connect to the service via a websocket, using the URL:

`ws://<pairing-front url>:<port>/pairing/?user=<user id>&complexity=<complexity`

An example query would be:

`ws://pairing-front:4000/pairing?user=lee215@gmail.com&complexity=2`

- Note that the user and complexity is a query string parameter

After establishing a websocket, pairing-front will immediately reply with

```json
{
  "status": 200,
  "data": {
    "message": "Queuing for match..."
  }
}
```

Otherwise, the websocket responds with a bad request and closes

```json
{
  "status": 400,
  "data": {
    "message": "Bad Request"
  }
}
```

### Receiving a match

Currently the websocket runs forever until a match is found. When a match is found,
the websocket replies with

```json
{
  "status": 200,
  "data": {
    "url": "ws://editor-service-url:12345/some-long-uuid-1234-5678",
    "otherUser": "vee489@hotmail.com",
    "questionId": 23
  }
}
```

after which the websocket will be closed by pairing-front

### Cancelling a match

To cancel a request, simply close the websocket

## Structure

Pairing service is divided up into 2 microservices (pairing-front, pairing-back) and one RabbitMQ service. The web client should only interact with pairing-front. The pairing back is purely for interacting with other backend microservices.
