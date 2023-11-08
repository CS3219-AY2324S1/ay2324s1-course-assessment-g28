import express, { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { Pair } from '../schemas/pair';
import dotenv from 'dotenv';
const router = express.Router();


/**
 * Query String: ?user1=<user1id>&user2=<user2id>
 */
router.get('/getWebsocketUrl', (req: Request, res: Response) => {

  const user1 = req.query.user1;
  const user2 = req.query.user2;

  if (user1 === undefined || user2 === undefined) {
    return res.status(400).send({
      message: "Please specify the ids of user1 and user2 in the query ?user1=<user1id>&user2=<user2id>"
    });
  }

  const pairId = uuidv4();

  const websocketUrl1 = encodeURIComponent(process.env.WEBSOCKET_URL + ":" + process.env.WEBSOCKET_PORT + "?pairId=" + pairId + "&userId=" + user1);
  const websocketUrl2 = encodeURIComponent(process.env.WEBSOCKET_URL + ":" + process.env.WEBSOCKET_PORT + "?pairId=" + pairId + "&userId=" + user2);

  Pair.create({ 
    id: pairId,
    user1: user1,
    user2: user2,
    currTurn: user1,
    wsUrl1: websocketUrl1,
    wsUrl2: websocketUrl2
  });

  res.status(200).json({ 
    user1: websocketUrl1, 
    user2: websocketUrl2
  });
});

/**
 * Query String: ?userId=<userId>
 */
router.get('/getActiveSessions', async (req: Request, res: Response) => {
  const userId = req.query.userId;
  const pairDetails1 = await Pair.find({ user1: userId }, { user2: 1, wsUrl1: 1, questionId: 1 }).exec();
  const pairDetails2 = await Pair.find({ user2: userId }, { user1: 1, wsUrl2: 1, questionId: 1 }).exec();

  const activeSessions: { wsUrl: string, otherUser: string, questionId: number }[] = [];

  pairDetails1.forEach(pair => {
    activeSessions.push({ wsUrl: pair.wsUrl1!, otherUser: pair.user2!, questionId: pair.questionId! });
  });
  pairDetails2.forEach(pair => {
    activeSessions.push({ wsUrl: pair.wsUrl2!, otherUser: pair.user1!, questionId: pair.questionId! });
  });

  res.status(200).json({
    activeSessions: activeSessions
  });
});

module.exports = router;