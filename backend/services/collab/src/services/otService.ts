import {ChangeSet, Text} from "@codemirror/state"
import {Update, rebaseUpdates} from "@codemirror/collab"
import { WS_METHODS } from "../constants"

// The updates received so far (updates[pairId].length gives the current version)
let updates: { [pairId: string]: Update[] } = {}
// The current document
let doc: { [pairId: string]: Text} = {};


let pending: [connection: WebSocket, requestId: string][] = []

function resp(connection: WebSocket, requestId: string, value: any) {
  const json = {
    data: value,
    method: WS_METHODS.OP,
    requestId: requestId
  };

  const message = JSON.stringify(json);
  connection.send(message);
}

export function addPair(pairId: string) {
  console.log("ADDING PAIR")
  if (!(pairId in updates)) {
    updates[pairId] = [];
  }
  if (!(pairId in doc)) {
    doc[pairId] = Text.of(["Start document"]);
  }
  console.log(updates, doc);
}

export function removePair(pairId: string) {
  if (pairId in updates) {
    delete updates[pairId];
  }
  if (pairId in doc) {
    delete doc[pairId];
  }
}

export function handleOperation(connection: WebSocket, pairId: string, requestId: string, data) {
  // const pairUpdates = updates[pairId];
  // const pairDoc = doc[pairId];

  console.log(pairId, updates[pairId], doc[pairId]);

  if (data.type == "pullUpdates") {
    if (data.version < updates[pairId].length) {
      resp(connection, requestId, updates[pairId].slice(data.version))
    }
    else {
      pending.push([connection, requestId]);
    }
  } else if (data.type == "pushUpdates") {
    // Convert the JSON representation to an actual ChangeSet
    // instance
    let received = data.updates.map(json => ({
      clientID: json.clientID,
      changes: ChangeSet.fromJSON(json.changes)
    }))
    if (data.version != updates[pairId].length)
      received = rebaseUpdates(received, updates[pairId].slice(data.version))
    for (let update of received) {
      updates[pairId].push(update)
      doc[pairId] = update.changes.apply(doc[pairId])
    }
    resp(connection, requestId, true)
    if (received.length) {
      // Notify pending requests
      let json = received.map(update => ({
        clientID: update.clientID,
        changes: update.changes.toJSON()
      }))
      while (pending.length) {
        const respDetails = pending.pop() ?? null;
        if (respDetails) {
          resp(respDetails[0], respDetails[1], json)
        }
      }
    }
  } else if (data.type == "getDocument") {
    resp(connection, requestId, {version: updates[pairId].length, doc: doc[pairId].toString()})
  }
}