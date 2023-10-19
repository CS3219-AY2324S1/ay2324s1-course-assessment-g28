import {ChangeSet, Text} from "@codemirror/state"
import {Update, rebaseUpdates} from "@codemirror/collab"
import { WS_METHODS } from "../constants"

// The updates received so far (updates.length gives the current
// version)
let updates: Update[] = []
// The current document
let doc = Text.of(["Start document"])


let pending: ((connection: WebSocket, requestId: string, value: any) => void)[] = []

function resp(connection: WebSocket, requestId: string, value: any) {
  const json = {
    data: value,
    method: WS_METHODS.OP,
    requestId: requestId
  };

  const message = JSON.stringify(json);
  connection.send(message);
}

export function handleOperation(connection: WebSocket, requestId: string, data) {
  if (data.type == "pullUpdates") {
    console.log("PULLING UPDATES");
    if (data.version < updates.length)
      resp(connection, requestId, updates.slice(data.version))
    else
      pending.push(resp)
  } else if (data.type == "pushUpdates") {
    // Convert the JSON representation to an actual ChangeSet
    // instance
    let received = data.updates.map(json => ({
      clientID: json.clientID,
      changes: ChangeSet.fromJSON(json.changes)
    }))
    if (data.version != updates.length)
      received = rebaseUpdates(received, updates.slice(data.version))
    for (let update of received) {
      updates.push(update)
      doc = update.changes.apply(doc)
    }
    resp(connection, requestId, true)
    if (received.length) {
      // Notify pending requests
      let json = received.map(update => ({
        clientID: update.clientID,
        changes: update.changes.toJSON()
      }))
      while (pending.length) pending.pop()!(connection, requestId, json)
    }
  } else if (data.type == "getDocument") {
    resp(connection, requestId, {version: updates.length, doc: doc.toString()})
  }
}