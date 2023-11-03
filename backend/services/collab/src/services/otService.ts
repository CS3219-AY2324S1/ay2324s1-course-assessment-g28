import {ChangeSet, Text} from "@codemirror/state"
import {Update, rebaseUpdates} from "@codemirror/collab"
import { WS_METHODS, initialDocuments } from "../constants"

// The updates received so far (updates[pairId].length gives the current version)
let updates: { [pairId: string]: { [lang: string]: Update[] } } = {};
// The current document
let doc: { [pairId: string]: { [lang: string]: Text }} = {};


let pending: { [pairId: string]: { [lang: string]: [connection: WebSocket, requestId: string][] }} = {};

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
    updates[pairId] = {
      Java: [],
      JavaScript: [],
      Python: []
    };
  }
  if (!(pairId in doc)) {
    doc[pairId] = {
      Java: Text.of([initialDocuments.java]),
      JavaScript: Text.of([initialDocuments.javascript]),
      Python: Text.of([initialDocuments.python])
    };
  }
  if (!(pairId in pending)) {
    pending[pairId] = {
      Java: [],
      JavaScript: [],
      Python: []
    };
  } 
  console.log(updates, doc, pending);
}

export function removePair(pairId: string) {
  if (pairId in updates) {
    delete updates[pairId];
  }
  if (pairId in doc) {
    delete doc[pairId];
  }
  if (pairId in pending) {
    delete pending[pairId];
  }
}

export function handleOperation(connection: WebSocket, pairId: string, requestId: string, lang: string, data: any) {
  // const pairUpdates = updates[pairId];
  // const pairDoc = doc[pairId];

  console.log("handleOp::: pairID:", pairId, "lang:", lang);

  if (data.type == "pullUpdates") {
    if (data.version < updates[pairId][lang].length) {
      resp(connection, requestId, updates[pairId][lang].slice(data.version))
    }
    else {
      pending[pairId][lang].push([connection, requestId]);
    }
  } else if (data.type == "pushUpdates") {
    // Convert the JSON representation to an actual ChangeSet
    // instance
    let received = data.updates.map((json: any) => ({
      clientID: json.clientID,
      changes: ChangeSet.fromJSON(json.changes)
    }))
    if (data.version != updates[pairId][lang].length)
      received = rebaseUpdates(received, updates[pairId][lang].slice(data.version))
    for (let update of received) {
      updates[pairId][lang].push(update)
      doc[pairId][lang] = update.changes.apply(doc[pairId][lang])
    }
    resp(connection, requestId, true)
    if (received.length) {
      // Notify pending requests
      let json = received.map((update: any) => ({
        clientID: update.clientID,
        changes: update.changes.toJSON()
      }))
      while (pending[pairId][lang].length) {
        const respDetails = pending[pairId][lang].pop() ?? null;
        if (respDetails) {
          resp(respDetails[0], respDetails[1], json)
        }
      }
    }
  } else if (data.type == "getDocument") {
    resp(connection, requestId, {version: updates[pairId][lang].length, doc: doc[pairId][lang].toString()})
  }
}