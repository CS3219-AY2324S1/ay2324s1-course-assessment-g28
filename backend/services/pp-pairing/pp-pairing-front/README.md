## Connection

To establish a connection, the client should ping the service via the url:

`ws://<pp-pairing-front url>:<port>/pairing/?user=<user id>`

Note that the user is a query string parameter

Currently the websocket runs forever until a match is found. When a match is found,
the websocket replies with payload { url: string }, where url is the websocket
URL that the web client is supposed to connect to on the pp-editor microservice
