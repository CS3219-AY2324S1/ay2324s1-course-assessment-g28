
# collab-service

Provides the following functionality:

* **Obtain WebSocket URL for peer-to-peer connection**
* **WebSocket Server which pairs can connect to using the URL and send the following updates:**
    * Change language
    * Run code
    * Exit editor
    * Message
    * Code changes
* **Central authority for collaborative editing which builds up a history of changes for each pair and each available language**
    * Merges new changes without conflicts
    * Allows undo and redo
* **Code execution sandbox**
    * Currently using shell script execution which only seems to work for Python
    * **Will change to using Judge0 API**

## Quick Start

### Load environment variables
An example file `.env.example` is provided and the values can be directly copied into `.env` for testing on the locally run Docker container.

### Docker

`docker-compose up --build`

### API

#### Get WebSocket URL for a pair
GET Request URL:
`http://localhost:8000/pairing/getWebSocketUrl?user1=<userId1>&user2=<userId2>`

_**Note that the userIds can be anything that UNIQUELY identifies each user (e.g. UUID, email, etc). The service only needs to differentiate the users, but does not need to know exactly who each user is._

Response:
```json
{
    "user1": "WS URL for user1",
    "user2": "WS URL for user2"
}
```

## Frontend Editor Page

### Install required packages
```npm i @codemirror/collab @uiw/codemirror-extensions-langs @uiw/react-codemirror codemirror react-resizable-panels react-use-websocket uuidv4```

### Editor Page URL
```http://localhost:3000/editor?wsUrl=<Obtained WebSocket URL>```