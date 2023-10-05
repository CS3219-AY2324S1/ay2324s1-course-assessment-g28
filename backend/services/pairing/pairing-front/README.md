## Connection

To establish a connection, the client should ping the service via the url:

`ws://<pp-pairing-front url>:<port>/pairing/?user=<user id>`

Note that the user is a query string parameter

Currently the websocket runs forever until a match is found. When a match is found,
the websocket replies with payload { url: string }, where url is the websocket
URL that the web client is supposed to connect to on the pp-editor microservice

The client should first receive a message from the websocket with the following format:

```json
{
    status: 200
    data: {
        message: 'Queueing for match...'
    }
}
```

If a match has been found, the websocket will receive the following message and will close immediately after:

````json
{
    status: 200
    data: {
        url: 'ws://example-domain:8080/23b26b37-3590-406c-8f38-cb10008b08a2'
    }
}```
````
