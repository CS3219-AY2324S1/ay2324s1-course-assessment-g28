import express, { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { Pair } from '../schemas/pair';
import dotenv from 'dotenv';
const router = express.Router();


/**
 * Query String: ?user1=<user1id>&user2=<user2id>
 */
router.get('/getWebsocketUrl', (req: Request, res: Response) => {
  console.log(req.query.user1, req.query.user2);

  const user1 = req.query.user1;
  const user2 = req.query.user2;

  if (user1 === undefined || user2 === undefined) {
    return res.status(400).send({
      message: "Please specify the ids of user1 and user2 in the query ?user1=<user1id>&user2=<user2id>"
    });
  }

  const pairId = uuidv4();

  Pair.create({ 
    id: pairId,
    user1: user1,
    user2: user2
  });

  const websocketUrl = process.env.WEBSOCKET_URL + ":" + process.env.WEBSOCKET_PORT + "/editor?" + pairId;

  res.status(200).json({ websocketUrl: websocketUrl }); 
});

module.exports = router;